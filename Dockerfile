FROM node:10.16.3
EXPOSE 3001
WORKDIR /src
COPY . /src
RUN npm install
CMD ["npm", "run", "start"]

