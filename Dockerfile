FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

EXPOSE 3001 3002

CMD [ "npm", "run", "devStart" ]
