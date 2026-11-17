'use strict';

const http = require('node:http');

const serviceName = process.env.SERVICE_NAME || 'payments-api';
const port = Number(process.env.PORT || 8080);
const failStartup = process.env.PAYMENTS_FAIL_STARTUP === 'true';

if (failStartup) {
  console.error(`[${serviceName}] startup blocked by PAYMENTS_FAIL_STARTUP=true`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  if (req.url === '/healthz' || req.url === '/readyz') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'ok', service: serviceName }));
  }

  if (req.url === '/') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      service: serviceName,
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.APP_ENV || 'development',
      owner: 'team-payments',
      endpoints: ['/healthz', '/readyz']
    }, null, 2));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not_found', path: req.url }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`${serviceName} listening on ${port}`);
});

process.on('SIGTERM', () => {
  console.log(`${serviceName} received SIGTERM`);
  server.close(() => process.exit(0));
});
