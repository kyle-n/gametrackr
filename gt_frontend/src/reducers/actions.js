import axios from 'axios';
import { ALERT, SET_LOADING, SET_USER_DATA, LOG_OUT } from './definitions';

export function alert(text, status) {
  if (status) return {
    type: ALERT,
    text,
    status
  };
  else return {
    type: ALERT,
    text
  };
}

export function beginSearch(query) {
  return function (dispatch) {
    dispatch(beginSearch());
    return axios.get(`/api/search?searchTerm=${query}`).then(resp => console.log(resp), e => console.log(e, 'promise rejected'));
  }
}

export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading
  };
}

export function signup(email, password) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post('/api/external', { email, password }).then(resp => {
      dispatch(setLoading(false));
      dispatch(setUserData(resp.body.id, email, resp.body.token));
    }, e => console.log(e, 'signuperr'));
  }
}

export function login(email, password) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post('/api/external/login', { email, password }).then(resp => {
      dispatch(setLoading(false));
      dispatch(setUserData(resp.body.id, email, resp.body.token));
    }, e => console.log(e, 'loginerr'));
  }
}

export function logOut() {
  return {
    type: LOG_OUT
  };
}

export function setUserData(id, email, token) {
  return {
    type: SET_USER_DATA,
    id, email, token
  };
}