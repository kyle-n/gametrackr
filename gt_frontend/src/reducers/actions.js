import axios from 'axios';
import { ALERT, SET_LOADING, SET_USER_DATA, LOG_OUT, SET_REVIEW } from './definitions';

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
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.body.token;
      dispatch(setUserData(resp.body.id, email, resp.body.token));
    }, e => console.log(e, 'signuperr'));
  }
}

export function login(email, password) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post('/api/external/login', { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.body.token;
      dispatch(setUserData(resp.body.id, email, resp.body.token));
    }, e => console.log(e, 'loginerr'));
  }
}

export function updateProfile(id, email, password) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.patch(`/api/users/${id}`, { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.body.token;
      dispatch(setUserData(resp.body.id, resp.body.email, resp.body.token));
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
    return axios.post('/api/reviews', { game_id, stars }).then(resp => {
      dispatch(setReview(resp.body.id, resp.body.game_id, resp.body.stars));
    }, e => console.log(e, 'create review err'));
  }
}

export function updateReview(id, stars) {
  return function (dispatch) {
    return axios.patch(`/api/reviews/${id}`, { stars }).then(resp => {
      dispatch(setReview(resp.body.id, resp.body.game_id, resp.body.stars));
    }, e => console.log(e, 'edit review err'));
  }
}