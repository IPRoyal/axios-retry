const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Configure axios-retry
axiosRetry(axios, {
  retries: 3, // Number of retries
  retryCondition: axiosRetry.isRetryableError, // Retry on network errors and 5xx responses
});

axios.get('https://quotes.toscrape.com')
  .then(response => console.log(response.data))
  .catch(error => console.error('Failed after retries:', error));
