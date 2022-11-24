import axios from 'axios';

export class PixabayApi {
  #API_KEY = '12634529-23114643ce7689acc141071f8';
  #API_URL = `https://pixabay.com/api/`;

  constructor() {
    this.query = null;
  }

  fetchPhotos() {
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: 1,
      per_page: 10,
    });

    return axios.get(`${this.#API_URL}?${searchParams}`);
  }
}
