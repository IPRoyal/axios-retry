const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Configure axios-retry with exponential backoff
axiosRetry(axios, {
  retries: 10,
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off
  retryCondition: axiosRetry.isRetryableError,
});

axios.get('https://quotes.toscrape.com')
  .then(response => console.log(response.data))
  .catch(error => console.error('Failed after retries with exponential backoff:', error));
