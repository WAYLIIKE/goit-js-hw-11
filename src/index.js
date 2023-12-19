import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { serviceGallery } from './gallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

selectors.loadMore.style.display = 'none';
let page = 1;
let perPage = 40;
let search = '';
selectors.form.addEventListener('submit', handleSubmit);

selectors.loadMore.addEventListener('click', onLoadMore);

let lightBox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function onLoadMore() {
  page++;
  console.log(page);
  try {
    const data = await serviceGallery(page, search);
    const lastPage = Math.ceil(data.totalHits / perPage);
    if (page === lastPage) {
      selectors.loadMore.style.display = 'none';
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (page <= lastPage) {
      selectors.list.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      lightBox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

function handleSubmit(event) {
  selectors.loadMore.style.display = 'none';
  event.preventDefault();
  if (event.target.searchQuery.value === '') {
    return Notify.warning('Empty search query. Please try again.');
  }
  search = event.target.searchQuery.value.toLowerCase();
  render(search);
  event.currentTarget.reset();
}

async function render(search) {
  try {
    page = 1;
    const data = await serviceGallery(page, search);
    const lastPage = Math.ceil(data.totalHits / perPage);
    console.log(data);
    if (data.hits.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (page < lastPage) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      selectors.list.innerHTML = createMarkup(data.hits);
      selectors.loadMore.style.display = '';
      lightBox.refresh();
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      selectors.list.innerHTML = createMarkup(data.hits);
      lightBox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="100%" height="340"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}
