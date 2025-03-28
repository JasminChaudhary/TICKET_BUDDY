FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Set Vite host and port
ENV VITE_PORT=8080
ENV VITE_HOST=0.0.0.0

# Expose the ports
EXPOSE 3000
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]