const form = document.getElementById("noteForm");

const titleInput =
  document.getElementById("title");

const contentInput =
  document.getElementById("content");

const notesGrid =
  document.getElementById("notesGrid");

const emptyState =
  document.getElementById("emptyState");

const noteCount =
  document.getElementById("noteCount");

const status =
  document.getElementById("status");

const refreshBtn =
  document.getElementById("refreshBtn");


async function loadNotes() {

  try {

    const response =
      await fetch("/notes");

    if (!response.ok) {
      throw new Error(
        "Unable to load notes."
      );
    }

    const notes =
      await response.json();

    renderNotes(notes);

  } catch (error) {

    status.textContent =
      error.message;
  }
}


function renderNotes(notes) {

  notesGrid.innerHTML = "";

  noteCount.textContent =
    `${notes.length} ${
      notes.length === 1
        ? "note"
        : "notes"
    }`;

  emptyState.style.display =
    notes.length
      ? "none"
      : "block";


  notes.forEach(note => {

    const article =
      document.createElement("article");

    article.className = "note";


    const title =
      document.createElement("h3");

    title.textContent =
      note.title;


    const content =
      document.createElement("p");

    content.textContent =
      note.content;


    const date =
      document.createElement("small");

    date.textContent =
      new Date(
        note.createdAt
      ).toLocaleString();


    const deleteButton =
      document.createElement("button");

    deleteButton.className =
      "delete-btn";

    deleteButton.textContent =
      "Delete";


    deleteButton.addEventListener(
      "click",
      () => deleteNote(note.id)
    );


    article.append(
      title,
      content,
      date,
      deleteButton
    );

    notesGrid.appendChild(article);

  });
}


async function createNote(event) {

  event.preventDefault();


  const title =
    titleInput.value.trim();

  const content =
    contentInput.value.trim();


  if (!title || !content) {
    return;
  }


  status.textContent =
    "Saving...";


  try {

    const response =
      await fetch("/notes", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          title,
          content
        })

      });


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Unable to create note."
      );

    }


    form.reset();

    status.textContent =
      "Note added successfully.";


    await loadNotes();

    titleInput.focus();

  } catch (error) {

    status.textContent =
      error.message;
  }
}


async function deleteNote(id) {

  if (
    !confirm(
      "Delete this note?"
    )
  ) {
    return;
  }


  try {

    const response =
      await fetch(
        `/notes/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Unable to delete note."
      );

    }


    await loadNotes();

  } catch (error) {

    status.textContent =
      error.message;
  }
}


form.addEventListener(
  "submit",
  createNote
);


refreshBtn.addEventListener(
  "click",
  loadNotes
);


loadNotes();