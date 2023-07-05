import './style.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider({
  params: {
    size: 5,
    email: 'goutam.iitbbs@gmail.com',
    searchText: 'nominatim',
    'accept-language': 'en', // render results in English
    countrycodes: 'us', 
    layers: 'address,street',

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
          let energyProgress = document.querySelector(".energy-progress");
          let energyValue = document.querySelector(".energy-value");
          let qualityProgress = document.querySelector(".quality-progress");
          let qualityValue = document.querySelector(".quality-value"); 
          let quantityProgress = document.querySelector(".quantity-progress");   
          let quantityValue = document.querySelector(".quantity-value");         
          let energyprogressEndValue = Math.round(data.ddScore);
          let qualityprogressEndValue = Math.round(data.qScore);
          let quantityprogressEndValue = Math.round(data.droughtScore);
          let droughtquantity = Math.round(data.droughtDuration*data.droughtEvents);
          let droughtmedian = 26.66;
          let droughtmax = 62;
          let waterquality = Math.round(data.quality);
          let waterqualitymedian = 13;
          let waterqualitymax = 2314;
          let HVACquantity = Math.round(data.totaldd);
          let HVACmedian = 4154;
          let HVAChighest = 6805; 

          showResult();
            energyValue.textContent = `${energyprogressEndValue}/100`;
            if (qualityprogressEndValue>=0) {
              qualityValue.textContent = `${qualityprogressEndValue}/100`;
            } else {
              qualityValue.textContent = 'No data';
            }
            
            quantityValue.textContent = `${quantityprogressEndValue}/100`;
//          energyValue.textContent = `${progressEndValue}`;
            if (energyprogressEndValue <= 25 && energyprogressEndValue>=0) {
              energyProgress.style.background = `conic-gradient(#2EB62C ${energyprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (energyprogressEndValue > 25 && energyprogressEndValue <= 50) {
              energyProgress.style.background = `conic-gradient(#FDFD96 ${energyprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (energyprogressEndValue > 50 && energyprogressEndValue <= 75) {
              energyProgress.style.background = `conic-gradient(#FFA500 ${energyprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (energyprogressEndValue > 75 && energyprogressEndValue <= 100){
              energyProgress.style.background = `conic-gradient(#FF0000 ${energyprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else {
              energyProgress.style.background = `conic-gradient(#FF0000 ${0}deg,#e3e3e3 0deg)`;

            }; 


            if (qualityprogressEndValue <= 25 && qualityprogressEndValue>=0) {
              qualityProgress.style.background = `conic-gradient(#2EB62C ${qualityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (qualityprogressEndValue > 25 && qualityprogressEndValue <= 50) {
              qualityProgress.style.background = `conic-gradient(#FDFD96 ${qualityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (qualityprogressEndValue > 50 && qualityprogressEndValue <= 75) {
              qualityProgress.style.background = `conic-gradient(#FFA500 ${qualityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (qualityprogressEndValue > 75 && qualityprogressEndValue <= 100){
              qualityProgress.style.background = `conic-gradient(#FF0000 ${qualityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else {
              qualityProgress.style.background = `conic-gradient(#FF0000 ${0*3.6}deg,#e3e3e3 0deg)`;

            }; 

            if (quantityprogressEndValue <= 25 && quantityprogressEndValue>=0) {
              quantityProgress.style.background = `conic-gradient(#2EB62C ${quantityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (quantityprogressEndValue > 25 && quantityprogressEndValue <= 50) {
              quantityProgress.style.background = `conic-gradient(#FDFD96 ${quantityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (quantityprogressEndValue > 50 && quantityprogressEndValue <= 75) {
              quantityProgress.style.background = `conic-gradient(#FFA500 ${quantityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else if (quantityprogressEndValue > 75 && quantityprogressEndValue <= 100){
              quantityProgress.style.background = `conic-gradient(#FF0000 ${quantityprogressEndValue*3.6}deg,#e3e3e3 0deg)`;
            } else {
              quantityProgress.style.background = `conic-gradient(#FF0000 ${0*3.6}deg,#e3e3e3 0deg)`;    
            }; 
            quantityProgress.addEventListener("mouseover", () => {
              const droughtText = `In 2022, this area experienced drought conditions for ${droughtquantity} weeks. It would take ${droughtquantity*0.62*1*1000} gallons of additional water annually to maintain a 1000 Sq.ft lawn in this location`;
              const tooltip = document.createElement("span");
              tooltip.classList.add("tooltip");
              tooltip.textContent = droughtText;
              quantityProgress.appendChild(tooltip);
            });
            quantityProgress.addEventListener("mouseout", () => {
              const tooltip = document.querySelector(".tooltip");
              if (tooltip) {
                tooltip.remove();
              }
            });
            qualityProgress.addEventListener("mouseover", () => {
              let qualityText;
              if (waterquality>=0){ 
                qualityText = `In 2023 Q1, this area has ${waterquality} water quality violations.`;
            } else {
              qualityText = `In 2023 Q1, there is no information about water quality violations in this location`;
            }
              const tooltip = document.createElement("span");
              tooltip.classList.add("tooltip");
              tooltip.textContent = qualityText;
              qualityProgress.appendChild(tooltip);
            });
            qualityProgress.addEventListener("mouseout", () => {
              const tooltip = document.querySelector(".tooltip");
              if (tooltip) {
                tooltip.remove();
              }
            });
            energyProgress.addEventListener("mouseover", () => {
              const droughtText = `In 2022, this location needed ${HVACquantity*127.3*24*0.6/1000} kWh of electricty to maintain a temperature of 65'F`;
              const tooltip = document.createElement("span");
              tooltip.classList.add("tooltip");
              tooltip.textContent = droughtText;
              energyProgress.appendChild(tooltip);
            });
            energyProgress.addEventListener("mouseout", () => {
              const tooltip = document.querySelector(".tooltip");
              if (tooltip) {
                tooltip.remove();
              }
            });
            
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
      resultContainer.style.display = 'flex';
    }
    function hideResult() {
      resultContainer.style.display = 'none';
    }
    if (searchInput.value.trim() === '') {
      hideAddressSuggestions();
    }


