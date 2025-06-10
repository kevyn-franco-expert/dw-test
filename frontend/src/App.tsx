import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  AppBar,
  Toolbar,
  Divider
} from '@mui/material';
import { Add } from '@mui/icons-material';
import HabitCard from './components/HabitCard';
import HabitForm from './components/HabitForm';
import { habitService } from './services/api';
import type { Habit } from './types';

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await habitService.getAll();
      setHabits(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (habitData: Partial<Habit>) => {
    try {
      const newHabit = await habitService.create(habitData);
      setHabits([...habits, newHabit]);
    } catch (err) {
      console.error('Error creating habit:', err);
      setError('Failed to create habit. Please try again.');
    }
  };

  const handleUpdateHabit = async (habitData: Partial<Habit>) => {
    if (!habitData.id) return;
    
    try {
      const updatedHabit = await habitService.update(habitData.id, habitData);
      setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    } catch (err) {
      console.error('Error updating habit:', err);
      setError('Failed to update habit. Please try again.');
    }
  };

  const handleDeleteHabit = async (id: number) => {
    try {
      await habitService.delete(id);
      setHabits(habits.filter(h => h.id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError('Failed to delete habit. Please try again.');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      handleUpdateHabit(habitData);
    } else {
      handleCreateHabit(habitData);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingHabit(undefined);
  };

  // Set document title
  useEffect(() => {
    document.title = "Habit Tracker | Build Better Habits";
  }, []);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}
          >
            Habit Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
            }}
          >
            {error}
          </Alert>
        )}

        <Paper
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              My Habits
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setFormOpen(true)}
              sx={{
                px: 3,
                py: 1.2,
                fontWeight: 500,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Add Habit
            </Button>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress sx={{ color: '#6366F1' }} />
            </Box>
          ) : habits.length === 0 ? (
            <Box
              textAlign="center"
              my={6}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                border: '1px dashed rgba(99, 102, 241, 0.3)'
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                You don't have any habits yet.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}
              >
                Start building better habits by creating your first habit to track.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setFormOpen(true)}
                sx={{
                  mt: 2,
                  px: 3,
                  py: 1.2,
                  fontWeight: 500,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Create Your First Habit
              </Button>
            </Box>
          ) : (
            <Box>
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onDelete={handleDeleteHabit}
                  onEdit={handleEditHabit}
                  onCheckInAdded={fetchHabits}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Container>

      <HabitForm
        open={formOpen}
        onClose={handleCloseForm}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />
    </Box>
  );
}

export default App;
