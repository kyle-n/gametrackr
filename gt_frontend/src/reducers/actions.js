import axios from 'axios';
import { ALERT, SET_LOADING, SET_USER_DATA, LOG_OUT, SET_REVIEW, PROCESS_SEARCH_RESULTS, ERROR_ALERT, AVAILABLE_EMAIL } from './definitions';
import { config } from '../constants';

const { serverUrl } = config;

export function alert(text, status) {
  if (status) return {
    type: ALERT,
    text,
    status
  };
  else return {
    type: ERROR_ALERT,
    text
  };
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
    return axios.post(serverUrl + '/api/external', { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.data.token;
      dispatch(setUserData(resp.data.id, email, resp.data.token));
      console.log('resp process done');
    }, e => console.log(e, 'signuperr'));
  }
}

export function logIn(email, password) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post(serverUrl + '/api/external/login', { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.data.token;
      dispatch(setUserData(resp.data.id, email, resp.data.token));
    }, e => console.log(e, 'loginerr'));
  }
}

export function updateProfile(id, email, password) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.patch(`${serverUrl}/api/users/${id}`, { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.data.token;
      dispatch(setUserData(resp.data.id, resp.data.email, resp.data.token));
    }, e => console.log(e, 'patch profile err'));
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

export function setReview(id, game_id, stars) {
  return {
    type: SET_REVIEW,
    review: { id, game_id, stars }
  };
}

export function createReview(game_id, stars) {
  return function (dispatch) {
    return axios.post(serverUrl + '/api/reviews', { game_id, stars }).then(resp => {
      dispatch(setReview(resp.data.id, resp.data.game_id, resp.data.stars));
    }, e => console.log(e, 'create review err'));
  }
}

export function updateReview(id, stars) {
  return function (dispatch) {
    return axios.patch(`${serverUrl}/api/reviews/${id}`, { stars }).then(resp => {
      dispatch(setReview(resp.data.id, resp.data.game_id, resp.data.stars));
    }, e => console.log(e, 'edit review err'));
  }
}

export function search(query) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.get(`${serverUrl}/api/search?searchTerm=${query}`).then(resp => {
      dispatch(setLoading(false));
      dispatch(processSearchResults(resp.data.results));
    }, e => dispatch(alert(e.error.text, e.status)));
  }
}
function processSearchResults(results) {
  return {
    type: PROCESS_SEARCH_RESULTS,
    results
  }
}
