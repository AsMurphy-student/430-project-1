let bookData = require('./data/books.json');

// Send JSON response
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

// Get books handler
const getBooks = (request, response) => {
  const responseJSON = {
    bookData,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Add book handler
const addBook = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // Need to have
  // author
  // country
  // language
  // link
  // pages
  // title
  // year
  // genres array

  const { author, country, language, link, pages, title, year, genres } = request.body;

  if (!author || !country || !language || !link || !pages || !title || !year) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const newBook = {
    author,
    country,
    language,
    link,
    pages,
    title,
    year,
  }

  if (genres) {
    newBook.genres = genres.split(',');
  }

  // console.log(newBook);

  // let responseCode = 201;

  let updated = false;

  bookData.map((element, index) => {
    if (element.title === newBook.title) {
      bookData[index] = newBook;

      respondJSON(request, response, 204, {});
      updated = true;
    }
  });

  if (updated) {
    return;
  }

  bookData.push(newBook);

  // if (!bookData[name]) {
  //   responseCode = 201;
  //   users[name] = {
  //     name,
  //   };
  // }

  // users[name].age = age;

  // if (responseCode === 201) {
  // responseJSON.message = 'Created Successfully';
  return respondJSON(request, response, 201, "Created Successfully");
  // }

  // return respondJSON(request, response, responseCode, {});
};

// Add Genre Handler
const addGenre = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // Need to have
  // title
  // genre

  const { title, genre } = request.body;

  if (!title || !genre) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let selectedBook = {}
  bookData.map((element) => {
    if (element.title === title) {
      selectedBook = element;
    }
  });

  if (!selectedBook) {
    return respondJSON(request, response, 404, "Book not Found.");
  }
  else if (selectedBook.genres) {
    if (selectedBook.genres.includes(genre)) {
      return respondJSON(request, response, 404, "Genre already added.");
    }
    selectedBook.genres.push(genre);
  }
  else {
    selectedBook.genres = [genre];
  }

  return respondJSON(request, response, 204, {});

  // users[name].age = age;

  // if (responseCode === 201) {
  // responseJSON.message = 'Created Successfully';
  // return respondJSON(request, response, 201, "Created Successfully");
  // }

  // return respondJSON(request, response, responseCode, {});
};

module.exports = {
  getBooks,
  addBook,
  addGenre,
};
