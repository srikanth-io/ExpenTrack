import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://real-time-finance-data.p.rapidapi.com/currency-news',
  params: {
    from_symbol: 'USD',
    language: 'en',
    to_symbol: 'EUR'
  },
  headers: {
    'x-rapidapi-key': 'd5acbaf837msh64e5bc23ba0c1afp1f9fcejsnf4ab6f44848e',
    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
  }
};

axios.request(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching currency news:', error);
  });
