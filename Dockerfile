FROM node:16.14.0-alpine3.15 AS build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_GDN_URL=REACT_APP_GDN_URL \
    REACT_APP_GITHUB_URL=REACT_APP_GITHUB_URL

COPY package.json package-lock.json ./
RUN npm install --silent
COPY . ./
RUN npm run build

# Configure Nginx with gui app
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html/
COPY start-container.sh ./
EXPOSE 80

CMD ["/bin/sh", "start-container.sh"]
