let circularProgress = document.querySelector(".energy-progress");
let progressValue = document.querySelector(".energy-value");
let progressStartValue = 0;
let progressEndValue = Math.round(data.totaldd*3*0.15*0.65/12);
const electrichighest = 8835*3*0.15*0.65/12;
let speed = 0;
showResult();
console.log(progressEndValue);
let progress = setInterval(() => {
  progressStartValue++;
  progressValue.textContent = `${progressStartValue}`;
//          progressValue.textContent = `${progressEndValue}`;
  if (progressStartValue === progressEndValue) {
    clearInterval(progress);
  }
  if (progressEndValue <= electrichighest/2) {
    circularProgress.style.background = `conic-gradient(#2EB62C ${progressEndValue*100*3.6/electrichighest}deg,#e3e3e3 0deg)`;
  } else if (progressEndValue > electrichighest/2 && progressEndValue <= 3*electrichighest/4) {
    circularProgress.style.background = `conic-gradient(#FDFD96 ${progressEndValue*100*3.6/electrichighest}deg,#e3e3e3 0deg)`;
  } else {
    circularProgress.style.background = `conic-gradient(#FF0000 ${progressEndValue*100*3.6/electrichighest}deg,#e3e3e3 0deg)`;
  } 
}, speed);