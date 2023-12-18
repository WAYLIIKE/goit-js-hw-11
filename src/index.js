import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { serviceGallery } from './gallery';

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

async function onLoadMore() {
  page++;
  console.log(page);
  try {
    const data = await serviceGallery(page, search);
    const lastPage = Math.ceil(data.totalHits / perPage);
    if (page + 1 === lastPage) {
      selectors.loadMore.style.display = 'none';
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (page < lastPage) {
      selectors.list.insertAdjacentHTML('beforeend', createMarkup(data.hits));
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
      selectors.list.innerHTML = createMarkup(data.hits);
      selectors.loadMore.style.display = '';
    } else {
      selectors.list.innerHTML = createMarkup(data.hits);
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="100%" height="340"/>
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
