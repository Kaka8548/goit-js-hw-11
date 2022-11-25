import './scss/index.scss';
import { PixabayApi } from './PixabayApi';
import galleryPhotoTemplate from './galleryPhotoTemplate';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
let firstQuery = null;

const pixabayApi = new PixabayApi();
const gallery = new SimpleLightbox('.gallery a');
loadMoreBtnEl.classList.add('visually-hidden');

function scrollSmooth() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showResult(response) {
  const { data } = response;
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notiflix.Notify.success(`We found ${data.totalHits} images for you 💚`);
  const photos = galleryPhotoTemplate(data);
  galleryEl.innerHTML = photos;
  scrollSmooth();
  gallery.refresh();
  window.addEventListener('scroll', onScroll);
}

function loadMoreResult(response) {
  const { data } = response;
  const photos = galleryPhotoTemplate(data);
  galleryEl.insertAdjacentHTML('beforeend', photos);
  scrollSmooth();
  gallery.refresh();
}

async function onSearchFormElSubmit(event) {
  event.preventDefault();
  if (event.target[0].value === firstQuery) {
    Notiflix.Notify.info(
      `There are ${event.target[0].value} images already 💙`
    );
    return;
  }
  if (event.target[0].value === '') {
    Notiflix.Notify.info(`Type something 💙`);
    return;
  }
  firstQuery = event.target[0].value;
  pixabayApi.page = 1;
  pixabayApi.query = event.target[0].value;

  try {
    const response = await pixabayApi.fetchPhotos();
    showResult(response);
  } catch (err) {
    console.log(err);
  }
}

async function fetchMore() {
  pixabayApi.page += 1;

  try {
    const response = await pixabayApi.fetchPhotos();
    if (response.data.hits.length === 0) {
      window.removeEventListener('scroll', onScroll);
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    loadMoreResult(response);
  } catch (err) {
    console.log(err);
    window.removeEventListener('scroll', onScroll);
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function onScroll() {
  if (
    window.scrollY + window.innerHeight + 1 >=
    document.documentElement.scrollHeight
  ) {
    fetchMore();
  }
}

searchFormEl.addEventListener('submit', onSearchFormElSubmit);
