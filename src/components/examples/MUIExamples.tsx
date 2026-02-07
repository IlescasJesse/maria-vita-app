/**
 * Example Material UI Components
 * 
 * This file demonstrates how to use Material UI components in your application.
 * You can import and use these examples in your pages and components.
 */

'use client';

import { 
  Button, 
  TextField, 
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

// Example: Button Component
export function ExampleButtons() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="contained" color="primary">
        Primary Button
      </Button>
      <Button variant="outlined" color="secondary">
        Secondary Button
      </Button>
      <Button variant="text" startIcon={<SaveIcon />}>
        Save
      </Button>
      <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
        Delete
      </Button>
    </div>
  );
}

// Example: Form Input
export function ExampleForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <TextField
        label="Nombre"
        variant="outlined"
        fullWidth
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </form>
  );
}

// Example: Alert/Notification
export function ExampleAlert() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Show Notification
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          ¡Operación exitosa!
        </Alert>
      </Snackbar>
    </>
  );
}

// Example: Dialog/Modal
export function ExampleDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to proceed with this action?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Example: Loading Spinner
export function ExampleLoading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <CircularProgress />
      <CircularProgress color="secondary" />
      <CircularProgress size={24} />
    </div>
  );
}
