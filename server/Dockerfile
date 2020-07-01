FROM node:14.3-alpine
# Make sure you have libavahi-compat-libdnssd-dev for debianesque for mdns
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
