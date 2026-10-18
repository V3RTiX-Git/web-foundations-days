# Library Books REST API

## Overview

This API manages books in a library. Each book has an ID, title, author, publication year and availability status.

Example book:

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958,
  "available": true
}
```

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Success status:** `200 OK`

Example response:

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958,
    "available": true
  }
]
```

### 2. Get one book

- **Method:** GET
- **Path:** `/books/:id`
- **Description:** Returns the book with the specified ID.
- **Success status:** `200 OK`

Example request:

`GET /books/1`

### 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book.
- **Example request body:**

```json
{
  "title": "The River Between",
  "author": "Ngugi wa Thiong'o",
  "year": 1965,
  "available": true
}
```

- **Success status:** `201 Created`

### 4. Update a book

- **Method:** PUT
- **Path:** `/books/:id`
- **Description:** Updates an existing book.
- **Example request body:**

```json
{
  "title": "The River Between",
  "author": "Ngugi wa Thiong'o",
  "year": 1965,
  "available": false
}
```

- **Success status:** `200 OK`

### 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/:id`
- **Description:** Deletes the book with the specified ID.
- **Success status:** `204 No Content`

Example request:

`DELETE /books/1`

### 6. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author.
- **Success status:** `200 OK`

The author is supplied as a query parameter, so the API can filter the books by author without requiring a separate endpoint for each author.

## Error responses

### 400 Bad Request

- **Description:** The request contains invalid data.
- **Example:** A client attempts to create a book without a title or supplies an invalid publication year.

### 404 Not Found

- **Description:** The requested resource does not exist.
- **Example:** A client requests `GET /books/999` but no book with ID `999` exists.

## Summary

The API uses GET to retrieve books, POST to create a book, PUT to update a book and DELETE to remove a book. It uses query parameters to filter books by author and returns appropriate HTTP status codes for successful requests and errors.
