# NoteFlow

A full-stack single-page Note-taking Web Application.

## Tech Stack

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript
- REST API
- Fetch API
- JSON file storage

## Features

- Create notes
- Display notes
- Delete notes
- Asynchronous API requests
- Local JSON database
- Responsive design
- Single-page frontend

## REST API

### Get Notes

GET /notes

### Create Note

POST /notes

Request body:

{
  "title": "My Note",
  "content": "This is my note."
}

### Delete Note

DELETE /notes/:id

## Installation

Install dependencies:

npm install

Start application:

npm start

Open:

http://localhost:3000