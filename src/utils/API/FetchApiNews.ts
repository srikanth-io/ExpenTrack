import axios, { AxiosResponse, AxiosError } from "axios";

export default async function FetchApiNews(): Promise<any> {
  const options = {
    method: 'GET',
    url: 'https://data.alpaca.markets/v1beta1/news?sort=desc&limit=50&include_content=true&exclude_contentless=false&start=2022-01-03T00%3A00%3A00Z',
    headers: {
      accept: 'application/json',
      'APCA-API-KEY-ID': 'PKGDG1DGXJP1TSNFSFUY',
      'APCA-API-SECRET-KEY': '9CGaM6pRHCFHwQxUOeqZIPzdaUlukJbE0kuRYezv'
    }
  };

  try {
    const response: AxiosResponse = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Error fetching news');
  }
}
