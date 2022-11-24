import './scss/index.scss';
import { PixabayApi } from './PixabayApi';
import galleryPhotoTemplate from './galleryPhotoTemplate';
import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

function showResult(response) {
  console.log(response);
  const { data } = response;
  const photos = galleryPhotoTemplate(data);
  galleryEl.innerHTML = photos;

  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

const pixabayApi = new PixabayApi();

function onSearchFormElSubmit(event) {
  event.preventDefault();
  pixabayApi.query = event.target[0].value;

  pixabayApi
    .fetchPhotos()
    .then(response => {
      showResult(response);
    })
    .catch(err => console.log(err));
}

searchFormEl.addEventListener('submit', onSearchFormElSubmit);
