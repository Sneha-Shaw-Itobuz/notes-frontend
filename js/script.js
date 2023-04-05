const addBtn = document.querySelector(".add-btn");
const formOverlay = document.querySelector(".form-overlay");
const formCloseBtn = document.querySelector(".form-close");
const detailsOverlay = document.querySelector(".details-overlay");
const detailsCloseBtn = document.querySelector(".details-close");
const submitNote = document.querySelector(".add-note");
const noteContainer = document.querySelector(".notes");
const modifyBtn = document.querySelector(".modify");

addBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});

formCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formOverlay.classList.toggle("hidden");
});

const API = "http://localhost:8080/notes";

submitNote.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(form.isImportant.checked);
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
        isImportant: form.isImportant.checked,
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
};

const deleteNote = async (id) => {
  await fetch(`${API}/delete`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      id: id,
    }),
  }).then((res) => {
    console.log("Request complete! response:", res);

    window.location.reload();
  });
};

const editNote = async (id, titleDiv, contentDiv) => {
  titleDiv.setAttribute("contentEditable", "true");
  contentDiv.setAttribute("contentEditable", "true");

  modifyBtn.classList.toggle("hidden");


  modifyBtn.addEventListener("click", async () => {
  
    await fetch(`${API}/update`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        id: id,
        title: titleDiv.textContent,
        content: contentDiv.textContent,
      }),
    }).then((res) => {
      console.log("Request complete! response:", res);

      window.location.reload();
    });
  });
};

const displayDetails = async (id) => {
  const note = await getSingleNote(id);

  detailsOverlay.classList.toggle("hidden");

  const titleDiv = detailsOverlay.querySelector(".title");
  const contentDiv = detailsOverlay.querySelector(".content");

  titleDiv.textContent = note.note.title;
  contentDiv.textContent = note.note.content;

  detailsOverlay.querySelector(".delete").addEventListener("click", () => {
    deleteNote(id);
  });

  detailsOverlay.querySelector(".edit").addEventListener("click", () => {
    editNote(id, titleDiv, contentDiv);
  });
};

const getAllNotes = async () => {
  const res = await fetch(`${API}/get`);
  const data = await res.json();
  return data;
};

const renderNotes = async () => {
  const notes = await getAllNotes();

  notes.data.forEach((note) => {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note");
    noteCard.innerHTML = `<h3>${note.title}</h3>`;
    noteContainer.appendChild(noteCard);

    noteCard.addEventListener("click", () => {
      displayDetails(note._id);
    });
  });
};

detailsCloseBtn.addEventListener("click", () => {
  detailsOverlay.classList.toggle("hidden");
});

(() => {
  renderNotes();
})();
