FROM arm32v6/node:lts-alpine
RUN apk update && apk add avahi-tools avahi dbus
# && dbus-daemon --system && avahi-daemon -D --no-drop-root
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
