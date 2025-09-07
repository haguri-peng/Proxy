# Proxy

Node.js Proxy Server for Portal API
This is a simple Node.js proxy server to bypass CORS issues when fetching data from a portal API (e.g., https://portal.com/data) for use in a blog or web editor like JSFiddle. The server fetches HTML data, optionally cleans it using , and returns it as JSON.

## Features

- Bypasses CORS by proxying requests to the portal API.
- Cleans HTML responses to remove unnecessary whitespace and line breaks.
- Restricts access to specific origins (e.g., JSFiddle, your blog).
- Configurable via environment variables.

## Prerequisites

- Node.js (v14 or higher)
- npm
- A router with port forwarding configured (if hosting locally)
- Optional: HTML Minifier for HTML cleaning

## Installation

Clone the repository:

```sh
git clone https://github.com/haguri-peng/Proxy.git
cd your-repo
```

Install dependencies:

```sh
npm install express axios html-minifier dotenv
```

Create a .env file in the project root:

```txt
PORT=Your_Port
```

## Structure

```sh
.
├── .env # Environment variables (e.g., PORT)
├── .eslintrc
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json # Project dependencies and scripts
├── README.md
└── server.js # Main proxy server code
```

## Usage

Run the server locally:

```sh
node server.js
```

The server will start on the port defined in .env (default: 3000).

Test with Postman or JSFiddle:

```js
// Example
// URL: http://your-public-ip:8080/proxy?url=<encoded-portal-url>
const portalUrl = 'https://portal.com/data?key=value&other=123';
fetch(`http://your-public-ip:8080/proxy?url=${encodeURIComponent(portalUrl)}`)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

## Server Configuration

The server is configured to:

- Allow requests from specific origins (e.g., https://jsfiddle.net, your blog domain).
- Clean HTML responses using HTML Minifier to remove \r\n, extra spaces, etc.
- Validate URLs to prevent malicious requests.

## Environment Variables

Define these in the .env file:

- PORT: The port the server listens on (e.g., 3000).

Example .env:

```sh
PORT=3000
```

## Port Forwarding

To access the server externally:

1. Log in to your router (e.g., 192.168.0.1).
2. Go to "Port Forwarding" or "Virtual Server".
3. Add a rule:

- External Port: 8080 (or your choice)
- Internal IP: Your server's local IP (e.g., 192.168.0.100)
- Internal Port: 3000 (or the PORT in .env)

4. Protocol: TCP

Test externally: http://your-public-ip:8080/proxy?url=...

## Troubleshooting

- CORS Errors: Check the allowedOrigins array in server.js. Log req.headers.origin to debug.
- Invalid JSON: The server checks if the response is JSON or HTML and handles accordingly.
- Port Conflicts: Ensure no other service (e.g., Flask on 5555) uses the same port.

## License

MIT License
