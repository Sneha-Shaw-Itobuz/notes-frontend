const showFormBtn = document.querySelector(".add-btn");
const formOverlay = document.querySelector(".form-overlay");
const formCloseBtn = document.querySelector(".form-close");
const submitNoteBtn = document.querySelector(".add-note");

const detailsOverlay = document.querySelector(".details-overlay");
const detailsCloseBtn = document.querySelector(".details-close");

const noteContainer = document.querySelector(".notes");
const modifyBtn = document.querySelector(".modify");
const titleDiv = document.querySelector(".title");
const contentDiv = document.querySelector(".content");

const successBox = document.querySelector(".success");
const successMessage = document.querySelector(".message");
const successBoxCloseBtn = document.querySelector(".popup-close");

const confirmOverlay = document.querySelector(".confirm-overlay");

const API = "http://localhost:8080/notes";

// toggle hide/show for form
showFormBtn.addEventListener("click", () => {
  formOverlay.classList.toggle("hidden");
});

const closeForm = () => {
  form.title.value = "";
  form.content.value = "";
  formOverlay.classList.toggle("hidden");
};

// close form
formCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeForm();
});

successBoxCloseBtn.addEventListener("click", () => {
  successBox.classList.add("hidden");
});

const closeDetails = () => {
  titleDiv.setAttribute("contentEditable", "false");
  contentDiv.setAttribute("contentEditable", "false");
  titleDiv.classList.remove("active");
  contentDiv.classList.remove("active");
  modifyBtn.classList.add("hidden");
  detailsOverlay.classList.add("hidden");
};

detailsCloseBtn.addEventListener("click", () => {
  closeDetails();
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
        return res.json();
      })
      .then((data) => {
        successBox.classList.remove("hidden");
        successMessage.textContent = data.message;
        closeForm();

        noteContainer.innerHTML = "";
        renderNotes();

        setTimeout(() => {
          successBox.classList.add("hidden");
        }, 3000);
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
      return res.json();
    })
    .then((data) => {
      confirmOverlay.classList.add("hidden");
      closeDetails();
      successBox.classList.remove("hidden");

      successMessage.textContent = data.message;

      noteContainer.innerHTML = "";
      renderNotes();

      setTimeout(() => {
        successBox.classList.add("hidden");
      }, 3000);
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

  detailsOverlay.querySelector(".delete-btn").addEventListener("click", () => {
    // deleteNote(id);
    confirmOverlay.classList.remove("hidden");
    confirmOverlay.querySelector(".delete").addEventListener("click", () => {
      deleteNote(id);
    });
    confirmOverlay.querySelector(".cancel").addEventListener("click", () => {
      confirmOverlay.classList.add("hidden");
    });
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

  if (notes.data.length > 0) {
    notes.data.forEach((note) => {
      const noteCard = document.createElement("div");

      noteCard.classList.add("note");

      noteCard.innerHTML = `<h3>${
        note.title.length > 20 ? note.title.slice(0, 30) + "..." : note.title
      }</h3> <p class="date">${note.Date.slice(0, 10)}</p>`;

      noteContainer.appendChild(noteCard);

      noteCardHandler(noteCard, note._id);
    });
  } else {
    noteContainer.innerHTML = `<div class="empty"><i class="fa-solid fa-note-sticky mr-5"></i>Notes you add show here</div>`;
  }
};

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
      return res.json();
    })
    .then((data) => {
      successBox.classList.remove("hidden");
      closeDetails();

      successMessage.textContent = data.message;

      noteContainer.innerHTML = "";
      renderNotes();

      setTimeout(() => {
        successBox.classList.add("hidden");
      }, 3000);
    })
    .catch((err) => {
      alert(err.message);
    });
};

renderNotes();
