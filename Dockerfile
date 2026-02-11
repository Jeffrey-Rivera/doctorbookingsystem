# 1️⃣ Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2️⃣ Production stage
FROM nginx:alpine

# replace nginx site config
COPY default.conf /etc/nginx/conf.d/default.conf

# copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
