import axios from 'axios';
import {apiUrl} from './config';

export const getUserLists = async userId => {
  const url = apiUrl + '/lists';
  let resp;
  try {
    resp = await axios.get(url);
  } catch (e) {
    return null;
  }

  return resp.data.lists;
}
