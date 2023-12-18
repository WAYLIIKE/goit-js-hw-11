import axios from 'axios';
export { serviceGallery };

async function serviceGallery(page, search) {
  const BASE_URL = 'https://pixabay.com/api/';

  const queryParams = new URLSearchParams({
    key: '41313291-32cdbbed0c1b146ceb687e8ad',
    q: search,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });
  try {
    const res = await axios.get(`${BASE_URL}?${queryParams}`);
    return await res.data;
  } catch (error) {
    throw new Error(error);
  }
}
