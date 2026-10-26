
# Backend - Node.js / Express API

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# CI target: syntax-check every source file (docker build --target test ./backend)
FROM deps AS test
COPY . .
RUN find . -name "*.js" -not -path "./node_modules/*" -not -path "./uploads/*" -print0 \
    | xargs -0 -n1 node --check \
    && echo "Syntax check passed"

# Development target (used by docker-compose.dev.yml, hot reload via nodemon)
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 4000
CMD ["npm", "run", "server"]

# Production image
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN mkdir -p uploads/profiles && chown -R node:node /app
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health || exit 1
CMD ["node", "server.js"]
