FROM node:18-alpine AS build
WORKDIR /app

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package*.json ./
RUN npm install

COPY . .

RUN test -n "$VITE_BACKEND_URL" || (echo "ERROR: VITE_BACKEND_URL is empty" && exit 1)
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env

RUN npm run build

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
