/*
* Collection of utilities for parsing http requests.
*
*/

// TODO: Unit tests.

// External dependancies.
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Parse the url form the incoming request.
const getParsedUrl = req => url.parse(req.url, true);

// Get the pathname given the incoming request.
const getPath = req => getParsedUrl(req).pathname;

// Get the trimmed pathname given the incoming request.
const getTrimmedPath = req => getPath(req).replace(/^\/+|\/+$/g, "");

// Get the method of the incoming requests and capitalize it.
const getMethod = req => req.method.toUpperCase();

// Get the headers attached to the incoming request.
const getHeaders = req => req.headers;

// Get encoded query parameters of the incoming request.
const getQueryParams = req => getParsedUrl(req).query;

// Get the payload of a given request.
const getPayload = req => {
  // Promisify the streamed payload.
  return (
    new Promise((resolve, reject) => {
      const decoder = new StringDecoder("utf-8");
      let buffer = "";
      req.on("data", data => (buffer += decoder.write(data)));
      req.on("end", () => resolve((buffer += decoder.end())));
    })
      // Whenever the promise is resolved and a payload exists, return the parsed payload as an object.
      // Otherwhise return an empty object.
      .then(
        payloadString => (payloadString == "" ? {} : JSON.parse(payloadString))
      )
      // Log any possible error, but prevent the app to crash by returning an empty object.
      .catch(err => {
        console.log(err);
        return {};
      })
  );
};

// Parse the http request in a consumable JSON object
const parseRequest = req =>
  getPayload(req).then(reqPayload => ({
    path: getTrimmedPath(req),
    method: getMethod(req),
    params: getQueryParams(req),
    headers: getHeaders(req),
    reqPayload
  }));

module.exports = {
  getParsedUrl,
  getPath,
  getTrimmedPath,
  getMethod,
  getQueryParams,
  getHeaders,
  getPayload,
  parseRequest
};
