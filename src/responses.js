const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/style.css`);

const xmlParse = (m) => {
  let xmlMessage = '<response>';
  const keys = Object.keys(m);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    xmlMessage = `${xmlMessage} <${key}>${m[key]}</${key}>`;
  }
  xmlMessage = `${xmlMessage} </response>`;
  return xmlMessage;
};

const respond = (request, response, content, type, status) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => respond(request, response, index, 'text/html', 200);

const getStyles = (request, response) => respond(request, response, styles, 'text/css', 200);

const getSuccess = (request, response, acceptedTypes) => {
  const success = {
    message: 'This was a successful message!',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlParse(success);
    return respond(request, response, responseXML, 'text/xml', 200);
  }

  const successString = JSON.stringify(success);
  return respond(request, response, successString, 'application/json', 200);
};

const badRequest = (request, response, acceptedTypes, params) => {
  const responseMessage = {
    message: 'This request has the required parameters',
  };

  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = xmlParse(responseMessage);

    if (!params.valid || params.valid !== 'true') {
      responseMessage.message = 'Missing valid query parameter set to true';
      responseMessage.id = 'badRequest';

      responseXML = xmlParse(responseMessage);
      return respond(request, response, responseXML, 'text/xml', 400);
    }

    return respond(request, response, responseMessage, 'text/xml', 200);
  }

  if (!params.valid || params.valid !== 'true') {
    responseMessage.message = 'Missing valid query parameter set to true';
    responseMessage.id = 'badRequest';

    return respond(request, response, JSON.stringify(responseMessage), 'application/json', 400);
  }

  return respond(request, response, JSON.stringify(responseMessage), 'application/json', 200);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const responseMessage = {
    message: 'loggedIn query parameter set to yes',
  };

  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = xmlParse(responseMessage);

    if (!params.loggedIn || params.loggedIn !== 'yes') {
      responseMessage.message = 'Missing loggedIn query parameter set to yes';
      responseMessage.id = 'unauthorized';

      responseXML = xmlParse(responseMessage);
      return respond(request, response, responseXML, 'text/xml', 401);
    }

    return respond(request, response, responseXML, 'text/xml', 200);
  }

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseMessage.message = 'Missing loggedIn query parameter set to yes';
    responseMessage.id = 'badRequest';

    return respond(request, response, JSON.stringify(responseMessage), 'application/json', 401);
  }

  return respond(request, response, JSON.stringify(responseMessage), 'application/json', 200);
};

const forbidden = (request, response, acceptedTypes) => {
  const responseMessage = {
    id: 'forbidden',
    message: 'You do not have access to this content.',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlParse(responseMessage);

    return respond(request, response, responseXML, 'text/xml', 403);
  }

  return respond(request, response, JSON.stringify(responseMessage), 'application/json', 403);
};

const internal = (request, response, acceptedTypes) => {
  const responseMessage = {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong.',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlParse(responseMessage);

    return respond(request, response, responseXML, 'text/xml', 500);
  }

  return respond(request, response, JSON.stringify(responseMessage), 'application/json', 500);
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseMessage = {
    id: 'notImplemented',
    message: 'This is not implemented yet!',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlParse(responseMessage);

    return respond(request, response, responseXML, 'text/xml', 501);
  }

  return respond(request, response, JSON.stringify(responseMessage), 'application/json', 501);
};

const notFound = (request, response, acceptedTypes) => {
  const responseMessage = {
    id: 'notFound',
    message: 'The page you were looking for was not found',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlParse(responseMessage);

    return respond(request, response, responseXML, 'text/xml', 404);
  }

  return respond(request, response, JSON.stringify(responseMessage), 'application/json', 404);
};

module.exports = {
  getIndex,
  getStyles,
  getSuccess,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
