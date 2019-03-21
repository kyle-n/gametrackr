import axios from 'axios';

// define types
export const ALERT = 'ALERT';
export const ERROR_ALERT = 'ERROR_ALERT';

export const BEGIN_SEARCH = 'BEGIN_SEARCH';
export const PROCESS_SEARCH_RESULTS = 'PROCESS_SEARCH_RESULTS';

export const CREATE_USER = 'CREATE_USER';
export const READ_USER = 'READ_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';

export const LOG_IN = 'LOGIN_USER';
export const LOG_OUT = 'LOG_OUT';

export const CREATE_LIST = 'CREATE_LIST';
export const READ_LIST = 'READ_LIST';

export function alert(text, status) {
  if (status) return {
    type: ALERT,
    text,
    status
  }
  else return {
    type: ALERT,
    text
  }
}

export function beginSearch(query) {
  return function (dispatch) {
    dispatch(beginSearch());
    return axios.get(`/api/search?searchTerm=${query}`).then(resp => console.log(resp), e => console.log(e, 'promise rejected'));
  }
}