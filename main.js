import './style.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const searchInput = document.getElementById('address-input');
searchInput.addEventListener('input', handleAddressInput);

function handleAddressInput(event) {
  const query = event.target.value;

  provider.search({ query })
    .then((results) => {
      // Clear previous suggestions
      clearAddressSuggestions();

      // Display new suggestions
      results.forEach((result) => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('address-suggestion');
        suggestion.textContent = result.label;
        suggestion.addEventListener('click', () => handleAddressSelection(result));

        const suggestionsContainer = document.getElementById('address-suggestions');
        suggestionsContainer.appendChild(suggestion);
      });
    })
    .catch((error) => {
      console.error('Error retrieving address suggestions:', error);
    });
}

function handleAddressSelection(result) {
  const lat = result.y;
  const lng = result.x;

  console.log('Latitude:', lat);
  console.log('Longitude:', lng);
}

function clearAddressSuggestions() {
  const suggestionsContainer = document.getElementById('address-suggestions');
  if (suggestionsContainer) {
    while (suggestionsContainer.firstChild) {
      suggestionsContainer.removeChild(suggestionsContainer.firstChild);
    }
  }
}