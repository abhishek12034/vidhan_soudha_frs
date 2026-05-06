FROM mcr.microsoft.com/devcontainers/javascript-node:0-18
RUN npm install -g serve
WORKDIR /workspaces
COPY ./dist /workspaces/build
# COPY ./ssl /workspaces/ssl
CMD [ "serve", "-s", "-n", "-p", "3000", "build" ]
