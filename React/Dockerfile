# Build stage
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage with NGINX
FROM nginx:alpine AS production

# Copy build output from Vite (Vite outputs to /app/dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
