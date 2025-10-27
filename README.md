# Mastering Axios Retry Plugin: Handling Failed Requests with Examples
<a href="https://iproyal.com/proxies/">
  <img width="2180" height="550" alt="GitHub Banner"
       src="https://github.com/user-attachments/assets/c857fdbc-882d-4089-af87-cfa93408311d"></img>
</a>

Axios Retry is a plugin that intercepts failed HTTP requests and retries them based on your configuration. 
It’s widely used in web development and data scraping applications where failed HTTP requests are quite common.

## What Are The Main Features of Axios?
Axios doesn’t handle failed requests by default - it throws a network exception when an error occurs. 
While you can use `try...catch` to manage these exceptions, implementing custom retry logic manually is tedious. 
The Axios Retry library simplifies this process by providing configurable options for automatic retries based on error codes, retry limits, and backoff delays. 


This is especially useful for automation tasks like web scraping, where frequent network errors can occur, ensuring failed requests are retried efficiently instead of being lost.


## Setup

First, make sure you have Node.js installed on your device. 
If you don’t, you can use the [official instructions](https://nodejs.org/en/download/) to download and install it.

ℹ️ If you already have [NVM](https://github.com/nvm-sh/nvm) installed, 
you can just install the latest nodejs version 
```bash
nvm install 22.20 
```

Then, create a new folder called axios_retry and move inside that folder.
Run the npm init command to create a new Node.js project. 
Finally, create a file called index.js and open it in your favorite code editor.
```bash
mkdir axios_retry
cd axios_retry
npm init
touch index.js
```

After that, install Axios and Axios-Retry plugin with the following terminal command. 
Axios will be used for making web requests, while Axios-Retry will be used to help you with automatic retries on network failure.

```bash
npm i axios axios-retry --save
```

You can find an example package.json file [here](axios_retry/package.json)

## Basic retry example

We can then set up an extremely basic retry system

```js
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
```

A working example can be found [here](axios_retry/basic-retry-example.js).

The `axiosRetry` function creates an Axios instance with retry configurations defined in an object using key–value pairs.

The `retries` property sets the number of retry attempts, and `retryCondition` determines when to retry based on network errors or **5xx** responses. 

If a network error occurs, Axios will retry the request up to three times before failing. 
The `axios.get` method sends a GET request, logging the response if successful or an error message if all retries fail. 
**Request Aborted** errors, caused by user cancellations, are intentionally excluded from retries.

## Axios Requests Retry with Backoff

We can also include an exponential backoff strategy. 
Exponential backoff continually increases the delay before sending the next retry. 
These strategies are useful if a server is temporarily overloaded.


```js
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Configure axios-retry with exponential backoff
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off
  retryCondition: axiosRetry.isRetryableError,
});

axios.get('https://quotes.toscrape.com')
  .then(response => console.log(response.data))
  .catch(error => console.error('Failed after retries with exponential backoff:', error));
```

A working example can be found [here](axios_retry/retry-with-backoff.js).

We only adjusted our `axiosRetry` object to include a new property `retryDelay`. 
We’re using the default Axios requests retry backoff delay, which is **2n * 100 ms**, where `n` is the number of retries initiated.

If you need a custom backoff strategy, the value `axiosRetry.exponentialDelay` can be modified to refer to a custom function

```js
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
```

A working example can be found [here](axios_retry/retry-with-custom-backoff.js).

## Customizing Retry Conditions

Axios Retry also provides numerous ways to modify the retry conditions. 
We can modify the logic to only retry on specific error codes

```js
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
```

A working example can be found [here](axios_retry/customize-retry-conditions.js).

In the above example we check if the status code of an error is equal to `503` (Temporarily Unavailable).
If it is, we will continue retrying.

We can also modify the logic to only retry on specific HTTP methods

```js
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

```
A working example can be found [here](axios_retry/customize-retry-on-post.js).

## Conclusion

Axios Retry is a great plugin if you need a simple, intuitive, and high performance package to retry failed requests on. It also receives major community support and has a lot of discussions online, so finding working code examples or asking questions is a lot easier than for some of the more obscure libraries.
