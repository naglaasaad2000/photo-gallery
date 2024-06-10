import axios from 'axios';

const PEXELS_API_KEY = 'YaYZMDAmdyezDAn1MtZd21jipwUVHXewH6KbgUHOLLna0PxQ1T8yjAXA';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

// Function to fetch photos from Pexels using Axios
export const fetchPhotos = async (page = 1, perPage = 9) => {
  try {
    const response = await axios.get(`${PEXELS_API_URL}/search?query=nature&per_page=${perPage}&page=${page}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    return response.data.photos;
  } catch (error) {
    console.error('Error fetching photos from Pexels:', error);
    return [];
  }
};

// Function to fetch a single photo by its ID using Axios
export const fetchPhotoById = async (photoId) => {
  try {
    const response = await axios.get(`${PEXELS_API_URL}/photos/${photoId}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    return response.data.photo;
  } catch (error) {
    console.error('Error fetching photo by ID from Pexels:', error);
    return null;
  }
};
