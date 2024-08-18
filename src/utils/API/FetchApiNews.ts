import axios from 'axios';

const fetchCurrencyNews = async (fromSymbol: string, toSymbol: string, language: string = 'en') => {
  const options = {
    method: 'GET',
    url: 'https://real-time-finance-data.p.rapidapi.com/currency-news',
    params: {
      from_symbol: fromSymbol,
      to_symbol: toSymbol,
      language: language,
    },
    headers: {
      'x-rapidapi-key': 'd5acbaf837msh64e5bc23ba0c1afp1f9fcejsnf4ab6f44848e',
      'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data; // Return data if needed for further processing
  } catch (error) {
    console.error('Error fetching currency news:', error);
    throw error; // Re-throw the error if you need to handle it further up the call stack
  }
};

// Example usage of the function:
fetchCurrencyNews('USD', 'EUR')
  .then(data => {
    // Process data
  })
  .catch(error => {
    // Handle errors
  });


  export default fetchCurrencyNews;

