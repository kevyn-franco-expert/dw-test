import axios from 'axios';
import type { Habit, CheckIn, Streak } from '../types';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const habitService = {
  getAll: async (): Promise<Habit[]> => {
    const response = await api.get('/habits');
    return response.data;
  },

  getById: async (id: number): Promise<Habit> => {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  create: async (habit: Partial<Habit>): Promise<Habit> => {
    const response = await api.post('/habits', habit);
    return response.data;
  },

  update: async (id: number, habit: Partial<Habit>): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, habit);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },
};

export const checkInService = {
  getByHabit: async (habitId: number): Promise<CheckIn[]> => {
    const response = await api.get(`/habits/${habitId}/check-ins`);
    return response.data;
  },

  create: async (habitId: number, checkIn: Partial<CheckIn>): Promise<CheckIn> => {
    const response = await api.post(`/habits/${habitId}/check-ins`, checkIn);
    return response.data;
  },

  delete: async (habitId: number, checkInId: number): Promise<void> => {
    await api.delete(`/habits/${habitId}/check-ins/${checkInId}`);
  },

  getStreaks: async (habitId: number): Promise<Streak[]> => {
    const response = await api.get(`/habits/${habitId}/streaks`);
    return response.data;
  },
};

export default api;