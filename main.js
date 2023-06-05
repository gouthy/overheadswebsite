import './style.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider({
  params: {
    email: 'goutam.iitbbs@gmail.com',
    searchText: 'nominatim',
    'accept-language': 'en', // render results in English
    countrycodes: 'us', 
  },
});

let debounceTimeout;

const searchInput = document.getElementById('address-input');
searchInput.addEventListener('input', handleAddressInput);

const suggestionsContainer = document.getElementById('address-suggestions');
const resultContainer = document.getElementById('result-container');
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
    }, 500);
  }

    function handleAddressSelection(result) {
      const selectedAddress = result.label;
      const lat = result.y;
      const lng = result.x;

      searchInput.value = selectedAddress;
      clearAddressSuggestions(suggestionsContainer);

      const apiUrl = `https://1ffxw9qp7k.execute-api.us-east-1.amazonaws.com/api/v1/${lat}&${lng}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const resultContainer = document.getElementById('result-container');
          resultContainer.textContent = JSON.stringify(data);
          showResult();
          console.log(data.Score);
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error);
        });
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
    function showResult() {
      resultContainer.style.display = 'block';
    }
    function hideResult() {
      resultContainer.style.display = 'none';
    }
    if (searchInput.value.trim() === '') {
      hideAddressSuggestions();
    }

