const addBtn = document.querySelector(".add-btn");
const formOverlay = document.querySelector(".form-overlay");
const formCloseBtn = document.querySelector(".form-close");
const detailsOverlay = document.querySelector(".details-overlay");
const detailsCloseBtn = document.querySelector(".details-close");
const submitNote = document.querySelector(".add-note");

addBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});

formCloseBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});

detailsCloseBtn.addEventListener("click", () => {
  detailsOverlay.classList.toggle("hidden");
});

submitNote.addEventListener("click", (e) => {
  e.preventDefault();
});
