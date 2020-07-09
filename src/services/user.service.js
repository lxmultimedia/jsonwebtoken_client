import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'public');
  }

  getProtectedContent() {
    return axios.get(API_URL + 'protected', { headers: authHeader() });
  }
}

export default new UserService();