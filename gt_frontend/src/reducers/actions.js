import axios from 'axios';
import { ALERT, SET_LOADING, SET_USER_DATA, LOG_OUT, SET_REVIEW, PROCESS_SEARCH_RESULTS, ERROR_ALERT, SET_LIST, CREATE_ENTRY, UPDATE_ENTRY, DELETE_ENTRY } from './definitions';
import { config } from '../constants';

const { serverUrl } = config;
const cachedProfile = localStorage.getItem('gt_profile');
if (cachedProfile) axios.defaults.headers.common['authorization'] = 'jwt ' + (JSON.parse(cachedProfile)).token;

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

export function signup(email, password, cb) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post(serverUrl + '/api/external', { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.data.token;
      dispatch(setUserData(resp.data.id, email, resp.data.token));
      console.log('resp process done');
      if (cb) return cb();
    }, e => console.log(e, 'signuperr'));
  }
}

export function logIn(email, password, cb) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post(serverUrl + '/api/external/login', { email, password }).then(resp => {
      dispatch(setLoading(false));
      axios.defaults.headers.common['authorization'] = 'jwt ' + resp.data.token;
      dispatch(setUserData(resp.data.id, email, resp.data.token));
      if (cb) return cb();
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
      dispatch(getAllLists());
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
    }, e => console.log(e));
  }
}
function processSearchResults(results) {
  return {
    type: PROCESS_SEARCH_RESULTS,
    results
  }
}

function setList(id, title, deck) {
  return {
    type: SET_LIST,
    id, title, deck
  };
}

export function createList(title, deck) {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.post(`${serverUrl}/api/lists`, { title, deck }).then(resp => {
      dispatch(setLoading(false));
      if (!resp.data.id) return console.log('could not get list');
      dispatch(setList(resp.data.id, resp.data.title, resp.data.deck));
    }, e => console.log(e));
  };
}

export function getAllLists() {
  return function (dispatch) {
    dispatch(setLoading(true));
    return axios.get(`${serverUrl}/api/lists`).then(resp => {
      dispatch(setLoading(false));
      if (!resp.data.lists) return console.log('could not get lists');
      resp.data.lists.forEach(l => dispatch(setList(l.id, l.title, l.deck)));
    });
  };
}

export function createEntry(list_id, game_id, ranking, text) {
  return function (dispatch) {
    return axios.post(`${serverUrl}/api/lists/${list_id}`, { game_id, ranking, text }).then(resp => {
      if (!resp.data.id) return console.log('bad create!');
      dispatch({ type: CREATE_ENTRY, list_id, entry: { game_id, ranking: resp.data.ranking, text, id: resp.data.id }});
    });
  }
}

export function updateEntry(list_id, entry_id, game_id, ranking, text) {
  return function (dispatch) {
    return axios.patch(`${serverUrl}/api/lists/${list_id}/entries/${entry_id}`, { ranking, text }).then(resp => {
      if (!resp.data.id) return console.log('bad udpate');
      dispatch({ type: UPDATE_ENTRY, list_id, entry: { game_id, ranking: resp.data.ranking, text, id: resp.data.id }});
    });
  }
}

export function deleteEntry(list_id, entry_id) {
  return function (dispatch) {
    return axios.delete(`${serverUrl}/api/lists/${list_id}/entries/${entry_id}`).then(resp => {
      if (!resp.data.entries) return console.log('bad delete');
      dispatch({ type: DELETE_ENTRY, list_id, entry: { id: entry_id } });
    });
  }
}
