FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production PORT=8080

COPY --chown=node:node package.json server.js ./

USER node
EXPOSE 8080

LABEL org.opencontainers.image.source="https://github.com/buildin10/payments-api"
LABEL org.opencontainers.image.description="Payment authorization and payment status API for Buildin10."

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
