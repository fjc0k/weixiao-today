import axios from 'axios';

const http = axios.create({
  timeout: 10000
});

const token = window.TODAY_CONFIG.token;

export const getConfig = async () => {
  return (
    await http.post('/api/getConfig', { token })
  ).data;
};

export const saveConfig = async config => {
  return (
    await http.post('/api/saveConfig', { token, config })
  ).data;
};
