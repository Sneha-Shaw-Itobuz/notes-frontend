const showFormBtn = document.querySelector(".add-btn");
const formOverlay = document.querySelector(".form-overlay");
const formCloseBtn = document.querySelector(".form-close");
const detailsOverlay = document.querySelector(".details-overlay");
const detailsCloseBtn = document.querySelector(".details-close");
const submitNoteBtn = document.querySelector(".add-note");
const noteContainer = document.querySelector(".notes");
const modifyBtn = document.querySelector(".modify");
const titleDiv = detailsOverlay.querySelector(".title");
const contentDiv = detailsOverlay.querySelector(".content");

const API = "http://localhost:8080/notes";

// toggle hide/show for form
showFormBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});

// close form
formCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formOverlay.classList.toggle("hidden");
});

// post note on submit
submitNoteBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (
    form.title.value.trim().length > 0 &&
    form.content.value.trim().length > 0
  ) {
    await fetch(`${API}/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        title: form.title.value,
        content: form.content.value,
      }),
    })
      .then((res) => {
        console.log("Request complete! response:", res);

        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  } else {
    alert("fields are empty");
  }
});

const getSingleNote = async (id) => {
  const res = await fetch(`${API}/get-single-note/${id}`);
  const data = res.json();
  return data;
};

const deleteNote = async (id) => {
  await fetch(`${API}/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => {
      console.log("Request complete! response:", res);

      window.location.reload();
    })
    .catch((err) => {
      alert(err.message);
    });
};

const editNote = async () => {
  if (titleDiv.getAttribute("contentEditable") === "false") {
    titleDiv.setAttribute("contentEditable", "true");
  } else if (titleDiv.getAttribute("contentEditable") === "true") {
    titleDiv.setAttribute("contentEditable", "false");
  }

  if (contentDiv.getAttribute("contentEditable") === "false") {
    contentDiv.setAttribute("contentEditable", "true");
  } else if (contentDiv.getAttribute("contentEditable") === "true") {
    contentDiv.setAttribute("contentEditable", "false");
  }
  // contentDiv.setAttribute("contentEditable", "true");

  titleDiv.classList.toggle("active");
  contentDiv.classList.toggle("active");

  modifyBtn.classList.toggle("hidden");
};

const displayDetails = async (id) => {
  const note = await getSingleNote(id);

  detailsOverlay.classList.toggle("hidden");

  titleDiv.textContent = note.data.title;
  contentDiv.textContent = note.data.content;

  modifyBtn.setAttribute("onclick", "modifyDetails('" + id + "')");

  detailsOverlay.querySelector(".delete").addEventListener("click", () => {
    deleteNote(id);
  });
  detailsOverlay
    .querySelector(".edit")
    .setAttribute("onclick", "editNote('" + id + "')");
};

const getAllNotes = async () => {
  const res = await fetch(`${API}/get`);
  const data = res.json();
  return data;
};

const renderNotes = async () => {
  const notes = await getAllNotes();

  notes.data.forEach((note) => {
    console.log(note.title.slice(0, 20));
    const noteCard = document.createElement("div");
    noteCard.classList.add("note");
    noteCard.innerHTML = `<h3>${
      note.title.length > 20 ? note.title.slice(0, 30) + "..." : note.title
    }</h3>`;
    noteContainer.appendChild(noteCard);

    noteCardHandler(noteCard, note._id);
  });
};

detailsCloseBtn.addEventListener("click", () => {
  titleDiv.setAttribute("contentEditable", "false");
  contentDiv.setAttribute("contentEditable", "false");
  titleDiv.classList.remove("active");
  contentDiv.classList.remove("active");
  modifyBtn.classList.add("hidden");
  detailsOverlay.classList.toggle("hidden");
});

const noteCardHandler = (noteCard, id) => {
  noteCard.setAttribute("onclick", "displayDetails('" + id + "')");
};

const modifyDetails = async (id) => {
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
  })
    .then((res) => {
      console.log("Request complete! response:", res);

      window.location.reload();
    })
    .catch((err) => {
      alert(err.message);
    });
};

renderNotes();
