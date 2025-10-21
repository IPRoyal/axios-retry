const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Custom retry condition
axiosRetry(axios, {
  retries: 4,
  retryCondition: (error) => {
    return error.response ? error.response.status === 503 : false;
  },
});

axios.get('https://quotes.toscrape.com')
  .then(response => console.log(response.data))
  .catch(error => console.error('Failed after retries on 503:', error));
