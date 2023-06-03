import './style.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider({
  params: {
    email: 'goutam.iitbbs@gmail.com',
    searchText: 'nominatim',
    delay: 500, // Delay in milliseconds between consecutive API calls
  },
});

let debounceTimeout;

const searchInput = document.getElementById('address-input');
searchInput.addEventListener('input', handleAddressInput);

const suggestionsContainer = document.getElementById('address-suggestions');
const resultContainer = document.getElementById('result-container');
const latitudeElement = document.getElementById('latitude');
const longitudeElement = document.getElementById('longitude');
function handleAddressInput(event) {
  clearTimeout(debounceTimeout);

  const query = event.target.value.trim();

  if (query === '') {
    hideAddressSuggestions();
    clearAddressSuggestions();
    hideResult();
    return;
  }

  debounceTimeout = setTimeout(() => {
  provider.search({ query })
    .then((results) => {
      // Clear previous suggestions
      clearAddressSuggestions();

      if (results.length === 0) {
        hideAddressSuggestions();
        hideResult();

        return;
      }

          // Display new suggestions
          results.forEach((result) => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('address-suggestion');
            suggestion.textContent = result.label;
            suggestion.addEventListener('click', () => handleAddressSelection(result));

            suggestionsContainer.appendChild(suggestion);
          });

          showAddressSuggestions();

        })
        .catch((error) => {
          console.error('Error retrieving address suggestions:', error);
        });
    }, 300);
  }

    function handleAddressSelection(result) {
      const selectedAddress = result.label;
      const lat = result.y;
      const lng = result.x;

      searchInput.value = selectedAddress;
      hideAddressSuggestions();
      clearAddressSuggestions();
      showResult(lat, lng);


      console.log('Latitude:', lat);
      console.log('Longitude:', lng);
    }

    function showAddressSuggestions() {
      suggestionsContainer.style.display = 'block';
    }

    function hideAddressSuggestions() {
      suggestionsContainer.style.display = 'none';
    }

    function clearAddressSuggestions() {
      while (suggestionsContainer.firstChild) {
        suggestionsContainer.removeChild(suggestionsContainer.firstChild);
      }
    }
    function showResult(lat, lng) {
      latitudeElement.textContent = `Latitude: ${lat}`;
      longitudeElement.textContent = `Longitude: ${lng}`;
      resultContainer.style.display = 'block';
    }

    function hideResult() {
      resultContainer.style.display = 'none';
    }
    if (searchInput.value.trim() === '') {
      hideAddressSuggestions();
    }