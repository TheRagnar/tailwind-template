import Notiflix from 'notiflix';
import Axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY = '30782828-18aebbc8281f2a6373b4ce5f4';
const URL = 'https://pixabay.com/api/';

let page = 1;
let total = 40;

const input = document.querySelector('[name=searchQuery]');
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadmore = document.querySelector('.loadmore');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

loadmore.addEventListener('click', () => {
  loadmore.setAttribute('disabled', true);
  const value = input.value.trim();
  fetchImages(value);
});
form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  gallery.innerHTML = '';
  page = 1;
  loadmore.classList.add('hidden');
  fetchImages(value);
});

async function fetchImages(value) {
  const params = new URLSearchParams({
    key: KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  try {
    const res = await Axios.get(`${URL}?${params}`);
    if (res && res?.data && res?.data?.total > 0) {
      if (page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${res.data.totalHits} images.`
        );
      }
      total = res.data.totalHits;
      if (total > page * 40) {
        loadmore.classList.remove('hidden');
      } else {
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
        loadmore.classList.add('hidden');
      }
      renderImages(res.data.hits);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadmore.removeAttribute('disabled');
    page++;
  }
}

function renderImages(images) {
  const html = images
    .map(item => {
      return `
    <li class="drop-shadow bg-white hover:drop-shadow-xl transition duration-300 ease-in-out">
      <a href="${item.largeImageURL}" class="block">
        <div class="flex h-52 justify-center items-center overflow-hidden">
          <img loading="lazy" src="${item.webformatURL}" alt="${item.tags}">
        </div>
        <div class="flex gap-3 text-center rounded px-3 py-2 flex-wrap justify-between">
          <div>
            <div class="font-bold">Likes</div>
            <div>${item.likes}</div>
          </div>
          <div>
            <div class="font-bold">Views</div>
            <div>${item.views}</div>
          </div>
          <div>
            <div class="font-bold">Comments</div>
            <div>${item.comments}</div>
          </div>
          <div>
            <div class="font-bold">Downloads</div>
            <div>${item.downloads}</div>
          </div>
        </div>
      </a>
    </li>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', html);
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  lightbox.refresh();
}

// document.addEventListener('scroll', () => {
//   const scrollTop = document.body.scrollTop
//   const galleryHeight = gallery.offset().height
//   const offset = 500
//   if(galleryHeight - (scrollTop + offset) < 0) {
//     alert("asdasd")
//     loadmore.click()
//   }
// })
