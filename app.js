const express = require("express");
const rateLimit = require("express-rate-limit");
const XataClient = require("./src/xata").XataClient;
var parse = require("url-parse");
require("dotenv").config();
const xata = new XataClient({ apiKey: process.env.XATA_API_KEY });
const app = express();
const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests.",
      reason: `You have exceeded the request limit. For security reasons, you can only make 10 requests per minute.`,
      success: false,
      status_code: 429,
      hint: "Please wait for a few moments before making another request.",
    });
  },
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  },
});
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/v1/info") {
    next();
  } else {
    limiter(req, res, next);
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/v1/info", async (req, res) => {
  res.status(200).json({
    success: true,
    status_code: 200,
    info: {
      name: "api.ishn.xyz",
      description: "A URL shortener API built on top of ishn.xyz",
      version: "1.0.0",
      v1: {
        description: "The first version of the API.",
        endpoints: {
          "/v1": {
            description: "Creates a new URL shortener.",
            method: "GET",
            query_parameters: {
              url: {
                description: "The URL to shorten.",
                type: "string",
                required: true,
              },
            },
            response: {
              success: {
                description: "Whether the request was successful or not.",
                type: "boolean",
              },
              slug: {
                description: "The slug of the shortened URL.",
                type: "string",
              },
              url: {
                description: "The shortened URL.",
                type: "string",
              },
              original_url: {
                description: "The original URL.",
                type: "string",
              },
              status_code: {
                description: "The status code of the response.",
                type: "number",
              },
            },
          },
          "/v1/info": {
            description: "Returns information about the API.",
            method: "GET",
            response: {
              success: {
                description: "Whether the request was successful or not.",
                type: "boolean",
              },
              status_code: {
                description: "The status code of the response.",
                type: "number",
              },
              info: {
                description: "Information about the API.",
                type: "object",
              },
            },
          },
        },
      },
      about: {
        author: "Ishaan Bedi",
        author_url: "https://www.ishaanbedi.in",
        github_url: "https://www.github.com/ishaanbedi/api.ishn.xyz",
        docs_url: "https://api.ishn.xyz",
        api_url: "https://api.ishn.xyz/v1",
        support_email: "hi@ishaanbedi.in",
        twitter_url: "https://www.twitter.com/ishnbedi",
        note: "This API is offered as-is. Though I will try my best to keep it up and running, I cannot guarantee that it will be up 24/7. If you have any questions, feel free to contact me at hi@ishaanbedi.in or open an issue on GitHub.",
        issues:
          "If you find any issues with the API, please open an issue on GitHub.",
        privacy_policy:
          "This API does not collect any personal/sensitive data. All data is stored as per the architecture of ishn.xyz using Xata as the database. For more information, please read the privacy policy on ishn.xyz.",
        license: "This API is licensed under the MIT License.",
        developer_security_note:
          "Please do not use this API for any malicious purposes. I will not be held responsible for any misuse of this API. If you find any security vulnerabilities, please let me know ASAP.",
      },
    },
  });
});

app.get("/v1", async (req, res) => {
  var { url: queryUrl } = req.query;
  if (!queryUrl) {
    res.status(400).json({
      error: "Missing URL.",
      reason: "Missing URL as the query parameter.",
      success: false,
      status_code: 400,
      hint: "Please pass the URL as a query parameter. Ex. https://api.ishn.xyz/v1?url=https://www.github.com",
      more_info: "https://api.ishn.xyz/v1/info",
    });
    return;
  }
  var parsedUrl = parse(queryUrl);
  if (!parsedUrl.protocol) {
    res.status(400).json({
      error: "Invalid URL.",
      reason:
        "The URL you passed is invalid as it does not have a protocol. At present, we support creating URLs for only those websites that have a protocol, such as https:// or http://",
      success: false,
      status_code: 400,
      hint: "Please pass a valid URL as a query parameter. Ex. https://api.ishn.xyz/v1?url=https://www.github.com",
    });
    return;
  }

  var generateRandomSlug = () => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
  var slug = generateRandomSlug();
  await xata.db.global_data.create({
    slug: slug,
    url: queryUrl,
  });
  res.status(201).json({
    success: true,
    slug: slug,
    url: `https://www.ishn.xyz/${slug}`,
    original_url: queryUrl,
    status_code: 201,
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
