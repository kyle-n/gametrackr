const dev = {
  serverUrl: 'http://localhost:8000',
  siteTitle: 'GameTrackr'
}

const prod = {
  serverUrl: '',
  siteTitle: 'GameTrackr'
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
