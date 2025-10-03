const bookData = require('./data/books.json');

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

// Get Query Helper Function
const getBooksByQuery = (request, response, query, queryString) => {
  if (!query) {
    return respondJSON(request, response, 400, {
      id: 'noQueryProvided',
      message: 'No title to query was provided.',
    });
  }

  let booksByQuery = [];

  if (queryString === 'title') {
    booksByQuery = bookData.filter((element) => element.title === query);
  } else if (queryString === 'author') {
    booksByQuery = bookData.filter((element) => element.author === query);
  } else if (queryString === 'year') {
    booksByQuery = bookData.filter((element) => element.year.toString() === query);
  }

  if (booksByQuery.length <= 0) {
    return respondJSON(request, response, 400, {
      id: 'noResults',
      message: `No books published under ${queryString} provided.`,
    });
  }

  const responseJSON = {
    booksByQuery,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Get books by title handler
const getBooksByTitle = (request, response) => getBooksByQuery(request, response, request.query.title, 'title');

// Get books by author handler
const getBooksByAuthor = (request, response) => getBooksByQuery(request, response, request.query.author, 'author');

// Get books by year handler
const getBooksByYear = (request, response) => getBooksByQuery(request, response, request.query.year, 'year');

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

  const {
    author, country, language, link, pages, title, year, genres,
  } = request.body;

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
  };

  if (genres) {
    newBook.genres = genres.split(',');
  }

  // console.log(newBook);

  // let responseCode = 201;

  let updated = false;

  bookData.map((element, index) => {
    if (element.title === newBook.title) {
      bookData[index] = newBook;

      updated = true;
      respondJSON(request, response, 204, {});
    }
    return 0;
  });

  if (updated) {
    return 0;
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
  return respondJSON(request, response, 201, 'Created Successfully');
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

  let selectedBook = {};
  bookData.map((element) => {
    if (element.title === title) {
      selectedBook = element;
    }

    return 0;
  });

  if (!selectedBook) {
    return respondJSON(request, response, 404, 'Book not Found.');
  }
  if (selectedBook.genres) {
    if (selectedBook.genres.includes(genre)) {
      return respondJSON(request, response, 404, 'Genre already added.');
    }
    selectedBook.genres.push(genre);
  } else {
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
  getBooksByTitle,
  getBooksByAuthor,
  getBooksByYear,
  addBook,
  addGenre,
};
