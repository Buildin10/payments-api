'use strict';

const http = require('node:http');

const service = process.env.SERVICE_NAME || process.env.npm_package_name || 'buildin10-service';
const port = Number(process.env.PORT || 8080);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service }));
    return;
  }

  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      service,
      platform: 'Buildin10',
      status: 'running',
      version: '1.0.0'
    }));
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`${service} listening on port ${port}`);
});
