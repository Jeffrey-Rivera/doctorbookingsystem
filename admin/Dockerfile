# 1) Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ✅ inject backend URL at build time (Vite reads env vars during build)
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# fail fast if not provided (prevents "undefined" in the app)
RUN test -n "$VITE_BACKEND_URL" || (echo "ERROR: VITE_BACKEND_URL is empty" && exit 1)

# create .env used by vite build
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env

RUN npm run build

# 2) Production stage
FROM nginx:alpine

# replace nginx site config
COPY default.conf /etc/nginx/conf.d/default.conf

# copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]