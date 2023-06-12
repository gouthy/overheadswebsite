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
      console.log(result);
      searchInput.value = selectedAddress;
      clearAddressSuggestions(suggestionsContainer);
      hideAddressSuggestions();
      const apiUrl = `https://1ffxw9qp7k.execute-api.us-east-1.amazonaws.com/api/v1/${lat}&${lng}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const resultContainer = document.getElementById('result-container');
          let circularProgress = document.querySelector(".water-progress");
          let progressValue = document.querySelector(".water-value");
          let progressStartValue = 0;
          let progressEndValue = Math.round(data.totaldd*0.1585*127.3*24/1000);
          const electrichighest = 8834*0.1585*127.3*24/1000;
          let speed = 0;
          showResult();
          console.log(progressEndValue);
          let progress = setInterval(() => {
            progressStartValue++;
            progressValue.textContent = `${progressStartValue}`;
            if (progressStartValue === progressEndValue) {
           
              clearInterval(progress);
            }
            circularProgress.style.background = `conic-gradient(#2EB62C ${progressStartValue*100*3.6/electrichighest}deg,#e3e3e3 0deg)`;
          }, speed);
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

