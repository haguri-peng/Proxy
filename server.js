require('dotenv').config(); // .env 파일 로드

const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const htmlMinifier = require('html-minifier');

const app = express();
const minify = htmlMinifier.minify;

// CORS 허용 (허용한 도메인만 허용 가능, '*'은 모든 도메인)
app.use((req, res, next) => {
  const allowedOrigins = ['https://jsfiddle.net', 'https://fiddle.jshell.net']; // 허용할 도메인 목록
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin); // 요청 Origin 허용
  } else {
    res.header('Access-Control-Allow-Origin', ''); // 허용되지 않은 경우 빈 값
  }

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url; // 쿼리로 포털 URL 전달 (예: /proxy?url=https://portal.com/data)
    const decodedUrl = decodeURIComponent(url); // 디코딩

    console.info(`decodedUrl: ${decodedUrl}`);

    if (!decodedUrl.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const response = await axios.get(decodedUrl);

    try {
      res.json(
        minify(response.data, {
          collapseWhitespace: true,
          removeComments: true,
          removeEmptyAttributes: true,
        }),
      );
    } catch (err) {
      // response가 HTML 형태가 아니라 JSON 형태면 minify 되지 않아 예외가 발생
      res.json(response.data);
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
const httpsOptions = {
  key: fs.readFileSync('path/to/your-dns-key.pem'),
  cert: fs.readFileSync('path/to/your-dns-crt.pem'),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
