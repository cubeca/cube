# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /work/

# Copy package.json, package-lock.json and tsconfig.json to the working directory
COPY package*.json tsconfig.json /work/

# Copy the rest of the application code to the working directory
COPY src /work/src/

# Install app dependencies and build the app
RUN npm install && npm run build

# Expose the port your app will run on
EXPOSE 4551

# Define the command to run your application
CMD ["npm", "run", "serve"]
