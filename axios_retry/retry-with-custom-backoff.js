const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Custom exponential backoff function
function customExponentialBackoff(retryNumber) {
  // Start with 200ms delay, double each retry
  return 200 * Math.pow(2, retryNumber);
}

// Configure axios-retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: customExponentialBackoff, // Use custom backoff function
  retryCondition: axiosRetry.isRetryableError,
});

// Make a GET request
axios.get('https://quotes.toscrape.com')
  .then(response => console.log(response.data))
  .catch(error => console.error('Failed after retries with custom exponential backoff:', error));
