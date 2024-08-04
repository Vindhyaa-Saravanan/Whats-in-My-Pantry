'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

import Image from 'next/image';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #4caf50',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#e8f5e9',
    },
  },
});

// Default HOME function
export default function Home() {
  

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const [modifyOpen, setModifyOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  const [searchQuery, setSearchQuery] = useState('');


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const modifyItemQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await setDoc(docRef, { quantity: parseInt(quantity) });
    await updateInventory();
  };

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{
          backgroundImage: 'url(/background.jpg)', // Add your background image path here
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 2,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
          <Typography variant="h2" color="#ffffff" mt={2}>
            What&apos;s in My Pantry?
          </Typography>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Modal
          open={modifyOpen}
          onClose={() => setModifyOpen(false)}
          aria-labelledby="modify-modal-title"
          aria-describedby="modify-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modify-modal-title" variant="h6" component="h2">
              Modify Item Quantity
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="quantity-input"
                label="New Quantity"
                variant="outlined"
                fullWidth
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                type="number"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  modifyItemQuantity(currentItem, newQuantity);
                  setNewQuantity('');
                  setModifyOpen(false);
                }}
              >
                Modify
              </Button>
            </Stack>
          </Box>
        </Modal>

        <TextField
          id="search-bar"
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, maxWidth: '800px' }}
        />

        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
          Add New Item
        </Button>

        <Box
          border="1px solid #4caf50"
          borderRadius={2}
          width="80%"
          maxWidth="800px"
          bgcolor="white"
          p={2}
          boxShadow={3}
        >
          <Box
            width="100%"
            height="80px"
            bgcolor="#4caf50"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderTopLeftRadius={2}
            borderTopRightRadius={2}
          >
            <Typography variant="h4" color="white" textAlign="center">
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" spacing={2} p={2} overflow="auto">
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#e8f5e9"
                paddingX={3}
                paddingY={2}
                borderRadius={1}
                boxShadow={1}
              >
                <Typography variant="h5" color="#4caf50" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h5" color="#4caf50" textAlign="center">
                  Quantity: {quantity}
                </Typography>
                <Box display="flex" gap={2}>
                  <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setCurrentItem(name);
                      setNewQuantity(quantity);
                      setModifyOpen(true);
                    }}
                  >
                    Modify
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}