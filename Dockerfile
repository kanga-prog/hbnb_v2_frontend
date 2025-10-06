# ÉTAPE 1 : DEV
FROM node:20-alpine AS DEVELOPMENT
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

# ÉTAPE 2 : BUILD (PROD)
FROM node:20-alpine AS BUILDER
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ÉTAPE 3 : NGINX (PROD)
FROM nginx:alpine AS PRODUCTION
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=BUILDER /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
