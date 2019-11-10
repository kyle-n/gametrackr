import axios from 'axios';
import {apiUrl} from './config';

export const createUser = async (userData) => {
  const url = apiUrl + '/users';
  const newUserResponse = await axios.post(url, {
    name: userData.name,
    password: userData.password,
    email: userData.email
  }, {headers: {
    Accept: 'application/json'
  }});

  return newUserResponse.data;
};
