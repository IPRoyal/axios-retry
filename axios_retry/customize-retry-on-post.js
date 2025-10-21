const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Configure axios-retry to apply only to POST requests
axiosRetry(axios, {
  retries: 3,
  shouldRetry: (config) => {
    return config.method === 'post';
  }
});

axios.post('https://quotes.toscrape.com', { data: 'example' })
  .then(response => console.log('Data submitted:', response.data))
  .catch(error => console.error('Failed after retries for POST:', error));
