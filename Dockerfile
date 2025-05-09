
# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add security headers
RUN echo "add_header X-Frame-Options SAMEORIGIN;" >> /etc/nginx/conf.d/default.conf && \
    echo "add_header X-Content-Type-Options nosniff;" >> /etc/nginx/conf.d/default.conf && \
    echo "add_header X-XSS-Protection \"1; mode=block\";" >> /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
