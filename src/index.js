import './scss/index.scss';
import { PixabayApi } from './PixabayApi';
import galleryPhotoTemplate from './galleryPhotoTemplate';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const pixabayApi = new PixabayApi();
const gallery = new SimpleLightbox('.gallery a');

function showResult(response) {
  console.log(response);
  const { data } = response;
  Notiflix.Notify.success(`We found ${data.totalHits} images for you 💚`);
  const photos = galleryPhotoTemplate(data);
  galleryEl.innerHTML = photos;
  loadMoreBtnEl.classList.remove('visually-hidden');
  gallery.refresh();

  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function loadMoreResult(response) {
  const { data } = response;
  const photos = galleryPhotoTemplate(data);
  galleryEl.insertAdjacentHTML('beforeend', photos);
  gallery.refresh();
  if (galleryEl.children.length >= data.totalHits) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreBtnEl.classList.add('visually-hidden');
    return;
  }
}

function onSearchFormElSubmit(event) {
  event.preventDefault();
  pixabayApi.page = 1;
  loadMoreBtnEl.classList.add('visually-hidden');
  pixabayApi.query = event.target[0].value;

  pixabayApi
    .fetchPhotos()
    .then(response => {
      showResult(response);
    })
    .catch(err => console.log(err));
}

function onLoadMoreBtnClick(event) {
  event.preventDefault();
  pixabayApi.page += 1;

  pixabayApi
    .fetchPhotos()
    .then(response => {
      loadMoreResult(response);
    })
    .catch(err => console.log(err));
}

searchFormEl.addEventListener('submit', onSearchFormElSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
