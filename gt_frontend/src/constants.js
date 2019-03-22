const dev = {
  serverUrl: 'http://localhost:8000'
}

const prod = {
  serverUrl: ''
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
