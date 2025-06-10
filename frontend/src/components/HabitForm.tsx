import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import type { Habit } from '../types';

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
  habit?: Habit;
}

const HabitForm = ({ open, onClose, onSave, habit }: HabitFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  // Reset form when opened or habit changes
  useEffect(() => {
    if (open) {
      setName(habit?.name || '');
      setDescription(habit?.description || '');
      setNameError('');
    }
  }, [open, habit]);

  const handleSubmit = () => {
    // Validate form
    if (!name.trim()) {
      setNameError('Habit name is required');
      return;
    }

    // Create habit object
    const habitData: Partial<Habit> = {
      name: name.trim(),
      description: description.trim() || null
    };

    // If editing, include the ID
    if (habit?.id) {
      habitData.id = habit.id;
    }

    onSave(habitData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        fontWeight: 600,
        pt: 3,
        pb: 1
      }}>
        {habit ? 'Edit Habit' : 'Add New Habit'}
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Habit Name"
            fullWidth
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) {
                setNameError('');
              }
            }}
            error={!!nameError}
            helperText={nameError}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: '#6366F1',
                  borderWidth: 2
                }
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: '#6366F1'
              }
            }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: '#6366F1',
                  borderWidth: 2
                }
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: '#6366F1'
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            fontWeight: 500,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            fontWeight: 500,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
            }
          }}
        >
          {habit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HabitForm;