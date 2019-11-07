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

export const searchGame = async (query) => {
  const url = apiUrl + '/games/search?q=' + encodeURIComponent(query);
  const searchResults = await axios.get(url);

  return searchResults.data;
};

export const getGame = async (gameId) => {
  const url = apiUrl + '/games/' + gameId;
  const gameResp = await axios.get(url);

  return gameResp.data;
};
