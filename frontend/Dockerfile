# Use Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]
