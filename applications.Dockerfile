# Builder
FROM --platform=linux/amd64 node:20-bullseye-slim AS builder

USER node

WORKDIR /home/node/api

COPY --chown=node:node . .

WORKDIR /home/node/api

RUN npm ci --no-audit --progress=false
RUN npm run build
RUN npm prune --production

WORKDIR /home/node/api

FROM builder

USER root

CMD [ "npm", "run", "start:prod" ]
