import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { CheckCircle, Cancel, Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import type { Habit, CheckIn, StreakInfo } from '../types';
import { checkInService } from '../services/api';
import { calculateStreakInfo } from '../utils/streakUtils';

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: number) => void;
  onEdit: (habit: Habit) => void;
  onCheckInAdded: () => void;
}

const HabitCard = ({ habit, onDelete, onEdit, onCheckInAdded }: HabitCardProps) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(habit.check_ins || []);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>(calculateStreakInfo(habit.check_ins || []));
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [note, setNote] = useState('');

  const handleCheckIn = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const newCheckIn = await checkInService.create(habit.id, { date: today });
      
      const updatedCheckIns = [newCheckIn, ...checkIns];
      setCheckIns(updatedCheckIns);
      setStreakInfo(calculateStreakInfo(updatedCheckIns));
      onCheckInAdded();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckInWithNote = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const newCheckIn = await checkInService.create(habit.id, { 
        date: today,
        notes: note 
      });
      
      const updatedCheckIns = [newCheckIn, ...checkIns];
      setCheckIns(updatedCheckIns);
      setStreakInfo(calculateStreakInfo(updatedCheckIns));
      setIsAddingNote(false);
      setNote('');
      onCheckInAdded();
    } catch (error) {
      console.error('Error checking in with note:', error);
    }
  };

  const getStreakDisplay = () => {
    if (streakInfo.isCheckedInToday) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            p: 2,
            borderRadius: 3,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="success" />
            <Typography fontWeight={600} color="success.main">
              Checked in today!
            </Typography>
          </Box>
          <Typography variant="body2" color="success.main" sx={{ pl: 3.5 }}>
            Current streak: {streakInfo.currentStreak} day{streakInfo.currentStreak !== 1 ? 's' : ''}
          </Typography>
        </Box>
      );
    } else if (streakInfo.currentStreak > 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            p: 2,
            borderRadius: 3,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="primary" />
            <Typography fontWeight={600} color="primary.main">
              Active Streak
            </Typography>
          </Box>
          <Typography variant="body2" color="primary.main" sx={{ pl: 3.5 }}>
            {streakInfo.currentStreak} day{streakInfo.currentStreak !== 1 ? 's' : ''} in a row - keep it going!
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            p: 2,
            borderRadius: 3,
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Cancel color="warning" />
            <Typography fontWeight={600} color="warning.main">
              Streak Broken
            </Typography>
          </Box>
          <Typography variant="body2" color="warning.main" sx={{ pl: 3.5 }}>
            {streakInfo.daysSinceLastCheckIn} day{streakInfo.daysSinceLastCheckIn !== 1 ? 's' : ''} since last check-in - time to restart!
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Card sx={{
      mb: 3,
      position: 'relative',
      overflow: 'visible',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div" fontWeight="600">
            {habit.name}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={() => onEdit(habit)}
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                mr: 1,
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
              }}
            >
              <Edit fontSize="small" color="primary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(habit.id)}
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' }
              }}
            >
              <Delete fontSize="small" color="error" />
            </IconButton>
          </Box>
        </Box>
        
        {habit.description && (
          <Typography
            variant="body1"
            color="text.secondary"
            mb={3}
            sx={{
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}
          >
            {habit.description}
          </Typography>
        )}
        
        <Box mb={3}>
          {getStreakDisplay()}
        </Box>
        
        <Box
          display="flex"
          gap={2}
          sx={{
            '& .MuiButton-root': {
              py: 1.2,
              px: 3,
              fontWeight: 500,
              fontSize: '0.95rem'
            }
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckIn}
            disabled={streakInfo.isCheckedInToday}
            startIcon={<CheckCircle />}
            sx={{
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#E0E7FF',
                color: '#6366F1',
                opacity: 0.7,
              }
            }}
          >
            {streakInfo.isCheckedInToday ? 'Already Checked In' : 'Check In'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsAddingNote(true)}
            disabled={streakInfo.isCheckedInToday}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
              '&.Mui-disabled': {
                borderColor: '#E0E7FF',
                color: '#6366F1',
                opacity: 0.7,
              }
            }}
          >
            Check In with Note
          </Button>
        </Box>
      </CardContent>

      <Dialog
        open={isAddingNote}
        onClose={() => setIsAddingNote(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          pt: 3,
          pb: 1
        }}>
          Add a note to your check-in
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: '#6366F1',
                  borderWidth: 2
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={() => setIsAddingNote(false)}
            sx={{
              fontWeight: 500,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckInWithNote}
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
            Check In
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default HabitCard;