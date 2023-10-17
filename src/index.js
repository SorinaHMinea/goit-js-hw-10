import { Buffer } from 'buffer';
global.Buffer = Buffer;
global.process = { env: {} };

import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_UzdHcRePlRtRy6sjJ3g82D8ZHbqfshTnCtER6K0VkXIS86cEYFypggoQHsiWwfUH';

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

const displayLoader = () => {
  loader.style.display = 'block';
  catInfo.style.display = 'none';
};

const hideLoader = () => {
  loader.style.display = 'none';
};

const displayError = () => {
  error.classList.remove('hidden');
};

const hideError = () => {
  error.classList.add('hidden');
};

const populateBreeds = async () => {
  hideError(); //
  displayLoader();

  try {
    const breeds = await fetchBreeds();
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    breedSelect.style.display = 'block';
  } catch (e) {
    console.error('Caught Error:', e);
    displayError();
  } finally {
    hideLoader();
  }
};

breedSelect.addEventListener('change', async e => {
  hideError();
  displayLoader();

  try {
    const breedId = e.target.value;
    const cat = await fetchCatByBreed(breedId);
    catInfo.innerHTML = `
            <img src="${cat.url}" alt="${cat.breeds[0].name}">
            <h2>${cat.breeds[0].name}</h2>
            <p>${cat.breeds[0].description}</p>
            <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
        `;
    catInfo.style.display = 'flex';
    catInfo.style.alignItems = 'center';
    catInfo.style.flexDirection = 'column';
  } catch (e) {
    console.error('Caught Error:', e);
    displayError();
  } finally {
    hideLoader();
  }
});

populateBreeds();
