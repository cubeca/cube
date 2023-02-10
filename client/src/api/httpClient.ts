import axios from 'axios';

import { API_URL } from './constants';

const httpClient = axios.create({
  baseURL: API_URL
});

export default httpClient;
