const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function readNotes() {
  ensureStore();

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  ensureStore();

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(notes, null, 2),
    "utf8"
  );
}

app.get("/notes", (req, res) => {
  const notes = readNotes();

  res.json(notes);
});

app.post("/notes", (req, res) => {
  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "").trim();

  if (!title || !content) {
    return res.status(400).json({
      error: "Title and content are required."
    });
  }

  const notes = readNotes();

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.unshift(newNote);

  writeNotes(notes);

  res.status(201).json(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const notes = readNotes();

  const filteredNotes = notes.filter(
    note => note.id !== req.params.id
  );

  if (filteredNotes.length === notes.length) {
    return res.status(404).json({
      error: "Note not found."
    });
  }

  writeNotes(filteredNotes);

  res.json({
    message: "Note deleted successfully."
  });
});

app.get("*splat", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

ensureStore();

app.listen(PORT, () => {
  console.log(`NoteFlow running at http://localhost:${PORT}`);
});