export default function galleryPhotoTemplate(data) {
  const photos = data.hits
    .map(el => {
      return `<a href="${el.largeImageURL}" class="photo-card">
            <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
            <div class="info">
            <p class="info-item"><b>Likes</b>${el.likes}</p>
            <p class="info-item"><b>Views</b>${el.views}</p>
            <p class="info-item"><b>Comments</b>${el.comments}</p>
            <p class="info-item"><b>Downloads</b>${el.downloads}</p>
            </div>
        </a>`;
    })
    .join('');

  return photos;
}
