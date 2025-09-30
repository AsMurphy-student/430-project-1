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

  if (!author || !country || !language || !link || !pages || !title || !year || !genres) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const genreArray = genres.split(',');

  const newBook = {
    author,
    country,
    language,
    link,
    pages,
    title,
    year,
    genreArray,
  }

  console.log(newBook);

  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  users[name].age = age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

module.exports = {
  getBooks,
  addBook,
};
