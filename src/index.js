import './scss/index.scss';
import { PixabayApi } from './PixabayApi';

const pixabayApi = new PixabayApi();

pixabayApi.fetchPhotos().then(response => console.log(response));
