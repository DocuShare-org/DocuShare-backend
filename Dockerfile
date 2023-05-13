FROM node:latest

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app


# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Copy the package.json and package-lock.json files for Node.js
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy the requirements.txt file for Python
# Install Python dependencies
RUN pip3 install gingerit

# Copy the code into the container
COPY . /app

# Expose the port(s) on which your application is running
EXPOSE 3001 3002

# Define the startup command for your application
CMD [ "npm", "run", "devStart" ]
