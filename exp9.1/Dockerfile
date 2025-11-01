# ---------- Stage 1: Build Stage ----------
FROM node:18-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files to container
COPY . .

# Build the React app for production
RUN npm run build


# ---------- Stage 2: Production Stage ----------
FROM nginx:alpine

# Copy the build output to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
