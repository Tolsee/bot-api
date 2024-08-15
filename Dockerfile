FROM node:18-alpine AS server
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9000
CMD ["npm", "run", "start:prod"]
