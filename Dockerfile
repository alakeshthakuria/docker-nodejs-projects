# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 (or any other port if needed)
EXPOSE 3000

ENV RUNNING_IN_DOCKER=true  

# Define the command to run the application
CMD ["node", "server.js"]


