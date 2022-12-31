<head>
</head>

# api.ishn.xyz

This API allows users to create short URLs for long URLs, built on top of [ishn.xyz](https://www.ishn.xyz), a fast and minimal link shortener.

## Link

The api is accessible at [api.ishn.xyz](https://api.ishn.xyz)

## Endpoints

Create a short URL:
**_GET /v1?url=<long_url>_**

This endpoint creates a short URL for the specified long URL.

## Parameters

- url: The long URL to be shortened. (required)

## Response

On success, the API returns a JSON object with the following properties:

- success: A boolean indicating whether the request was successful (true in this case)
- slug: The short URL slug, without ishn.xyz.
- url: The complete shortened URL.
- original: The original long URL.
- status_code: The HTTP status code of the response.

On error, the API returns a JSON object with the following properties:
error: An error message.

- success: A boolean indicating whether the request was successful. (false in this case)
- status_code: The HTTP status code of the response.
- hint: A hint on how to fix the error.

## API Limits

To ensure fair usage and to protect our resources, this API has the following limits in place:

- **Rate limits**: 10 requests per minute

Please be mindful of the limits when using our API.

If you exceed a limit, you may receive an error message or your requests may be blocked until the limit resets.

If you need to exceed the API rate limits for a genuine use case, please contact me at [hi@ishaanbedi.in](mailto:hi@ishaanbedi.in) with a brief description of your use case. I might be able to lift the rate limits for you if your use-case does not negatively impact the resources.

Thank you for respecting the API rate limits

## Using the API

There are several ways to use the API, including using a terminal, a browser, or a tool like Postman, Insomnia or Thunder.

### Using in a Terminal

You can use the API using a terminal by using `curl` or `wget`.

#### Example with curl

To test the `GET /v1` endpoint, use the following command:

```
curl https://api.ishn.xyz/v1?url=https://www.github.com
```

This will send a request to the API and return the response.

#### Example with wget

To test the `GET /v1` endpoint, use the following command:

```
wget -qO- https://api.ishn.xyz/v1?url=https://www.github.com
```

This will send a request to the API and print the response to the terminal.

### By using in a Browser

You can also use/test the API using a browser by simply visiting the API endpoint URL in the address bar.

For example, to test the `GET /v1` endpoint, visit the following URL in your browser:

```
https://api.ishn.xyz/v1?url=https://www.github.com
```

This will send a request to the API and display the response in the browser.


**To get more info about this API and understand the complete architecture, please refer to [api.ishn.xyz/v1/info](https://api.ishn.xyz/v1/info).**

## License

This API is licensed under the MIT License. See the LICENSE file for more information.
