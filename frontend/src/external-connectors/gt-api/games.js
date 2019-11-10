import axios from 'axios';
import {apiUrl} from './config';

export const searchGame = async (query) => {
  const url = apiUrl + '/games/search?q=' + encodeURIComponent(query);
  const searchResults = await axios.get(url);

  return searchResults.data;
};

export const getGame = async (gameId) => {
  const url = apiUrl + '/games/' + gameId;

  let gameResp;
  try {
    gameResp = await axios.get(url);
  } catch (e) {
    return null;
  }

  return gameResp.data;
};
