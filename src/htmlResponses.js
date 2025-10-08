const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const css = fs.readFileSync(`${__dirname}/../client/assets/index.css`);
const js = fs.readFileSync(`${__dirname}/../client/assets/index.js`);
const font = fs.readFileSync(`${__dirname}/../client/assets/MartianMono-Regular.ttf`);

// Send Response
const respond = (request, response, code, content, type) => {
  response.writeHead(code, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

// Handle what response to send
// (has old architecture to send xml from first assignment)
const handleResponse = (request, response, code, message, id = undefined) => {
  if (request.acceptedTypes[0] === 'text/xml') {
    const responseXML = id
      ? `<response><message>${message}</message><id>${id}</id></response>`
      : `<response><message>${message}</message></response>`;

    return respond(request, response, code, responseXML, 'text/xml');
  }

  const responseJSON = id ? {
    message,
    id,
  } : {
    message,
  };

  return respond(request, response, code, JSON.stringify(responseJSON), 'application/json');
};

// Request Handlers
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getJs = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(js);
  response.end();
};

const getFont = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'font/ttf' });
  response.write(font);
  response.end();
};

const get404 = (request, response) => {
  handleResponse(request, response, 404, 'The page you are looking for was not found.', 'notFound');
};

module.exports = {
  getIndex,
  getCss,
  getJs,
  getFont,
  get404,
};
