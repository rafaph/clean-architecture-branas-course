FROM node:14-alpine

RUN apk add -U bash entr ruby python make gcc g++ git

EXPOSE 3000

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN ["chmod", "+x", "/usr/local/bin/entrypoint.sh"]

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]