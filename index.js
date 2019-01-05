/*
* API entry point
*
*
*/

// External dependancies.
const http = require("http");

// Internal dependancies.
const { parseRequest } = require("./util/parse-request");

// Environmental varaibles.
const PORT = 3000;

// Server instance.
const server = http.createServer((req, res) => {
  parseRequest(req) // Pares the request body
    .then(routeRequest) // Route the request to the dedicated handler
    .then(({ statusCode, data }) => {
      // Prepare and send the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(JSON.stringify(data));

      console.log("Marvin responded with status " + statusCode);
    });
});

// Run the server.
server.listen(PORT, () =>
  console.log(`Marvin is sadly listening to port ${PORT}`)
);

// Route the request to the dedicated handler.
const routeRequest = data => {
  if (data.path == "" && data.method == "GET") {
    return statusCheck();
  }
  if (data.path == "hello" && data.method == "POST") {
    // When someone posts anything to the route /hello,
    // the API returns a welcome message.
    return handleHello();
  } else {
    return handleNotFound();
  }
};

// Status check
const statusCheck = () => {
  return {
    statusCode: 200,
    data: {
      message: "Yes, I'm still here, unfortunately."
    }
  };
};

// Marvin responds.
const handleHello = () => {
  return {
    statusCode: 200,
    data: {
      message: "Oh no, again.. Hi."
    }
  };
};

// Handle undefined requests.
const handleNotFound = () => {
  return {
    statusCode: 404,
    data: {
      message: "Fine. Waste my time"
    }
  };
};
