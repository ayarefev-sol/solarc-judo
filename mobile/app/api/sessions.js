import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.0.15:3000',
});

export const getSessions = async () => {
  const res = await API.get('/sessions');
  return res.data;
};

export const createSession = async () => {
  const res = await API.post('/sessions', {
    date: new Date().toISOString(),
  });
  return res.data;
};