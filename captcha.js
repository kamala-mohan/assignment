const axios = require('axios');

// Replace this with your own API key
const API_KEY = 'your_2captcha_api_key';

// The URL of the captcha image
const captchaUrl = 'https://example.com/captcha.png';

// Make a GET request to download the captcha image
axios.get(captchaUrl, { responseType: 'arraybuffer' })
  .then(response => {
    // Convert the image to a base64-encoded string
    const base64Img = Buffer.from(response.data, 'binary').toString('base64');

    // Submit the captcha image to 2Captcha's API
    axios.post('http://2captcha.com/in.php', {
      key: API_KEY,
      method: 'base64',
      body: base64Img,
      json: 1
    })
      .then(response => {
        // Wait for the captcha to be solved
        const captchaId = response.data.request;
        let intervalId = setInterval(() => {
          axios.get('http://2captcha.com/res.php', {
            params: {
              key: API_KEY,
              action: 'get',
              id: captchaId,
              json: 1
            }
          })
            .then(response => {
              if (response.data.status === 1) {
                // The captcha has been solved!
                const solvedCaptcha = response.data.request;
                console.log('Solved captcha:', solvedCaptcha);

                // Stop checking the status of the captcha
                clearInterval(intervalId);
              }
            })
            .catch(error => {
              console.error(error);
            });
        }, 5000); // Check every 5 seconds
      })
      .catch(error => {
        console.error(error);
      });
  })
  .catch(error => {
    console.error(error);
  });
