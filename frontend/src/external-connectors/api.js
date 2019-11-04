import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';

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
