const axios = require('axios');

sendSMS =()=>{
  return axios.get('https://2factor.in/API/V1/574b263b-e5d1-11ea-9fa5-0200cd936042/SMS/9573603051/4545')
}

module.exports = sendSMS;
