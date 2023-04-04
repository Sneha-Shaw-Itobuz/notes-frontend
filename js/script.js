const addBtn = document.querySelector(".add-btn");
const formOverlay = document.querySelector(".form-overlay");
const formCloseBtn = document.querySelector(".form-close");
const detailsOverlay = document.querySelector(".details-overlay");
const detailsCloseBtn = document.querySelector(".details-close");
const submitNote = document.querySelector(".add-note");
const noteContainer = document.querySelector(".notes");

addBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});

formCloseBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});



const API = "http://localhost:8080/notes";

submitNote.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    form.title.value.trim().length > 0 &&
    form.content.value.trim().length > 0
  ) {
    fetch(`${API}/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        title: form.title.value,
        content: form.content.value,
      }),
    }).then((res) => {
      console.log("Request complete! response:", res);

      window.location.reload();
    });
  } else {
    alert("fields are empty");
  }
});

const getSingleNote = async (id) => {
  const res = await fetch(`${API}/get-single-note/${id}`);
  const data = await res.json();
  return data;
}

const displayDetails = async (id) => {
  const note = await getSingleNote(id);
  detailsOverlay.classList.toggle("hidden");
  detailsOverlay.querySelector(".title").textContent= note.note.title
  detailsOverlay.querySelector(".content").textContent= note.note.content
}

const getAllNotes = async () => {
  const res = await fetch(`${API}/get`);
  const data = await res.json();
  return data;
};

const renderNotes = async () => {
  const notes = await getAllNotes();
  // console.log(notes);
  notes.notes.forEach((note) => {
    // console.log(note);
    const noteCard = document.createElement("div");
    noteCard.classList.add("note");
    noteCard.innerHTML = `<h3>${note.title}</h3>`;
    noteContainer.appendChild(noteCard);

    noteCard.addEventListener("click", () => {

      displayDetails(note._id)
    }
    );
  });
};

detailsCloseBtn.addEventListener("click", () => {
  console.log("hi");
  detailsOverlay.classList.toggle("hidden");
});

renderNotes();
