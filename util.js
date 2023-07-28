function getElement(selector) {
  return document.querySelector(selector);
}
function setElementText(element, text) {
  element.innerHTML = text;
}
function setElementTextColor(element, color) {
  element.style.color = color;
}
function hideElement(element) {
  element.style.display = "none";
}
function showElement(element) {
  element.style.display = "flex";
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function fadeIn(element) {
  element.style.display = "flex";
  element.style.opacity = 1;
}
function fadeOut(element) {
  element.style.display = "none";
  element.style.opacity = 0;
}
