# First Stage: Build the Node.js application
FROM node:13-alpine AS builder

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY ./app /home/app

WORKDIR /home/app

RUN npm install

# Second Stage: Serve the application using NGINX
FROM nginx:stable-alpine

# Copy built application from the builder stage
COPY --from=builder /home/app /usr/share/nginx/html
COPY --from=builder /home/app/index.html /usr/share/nginx/html

# Copy custom nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy Node.js server
COPY --from=builder /home/app /home/app

# Install Node.js (required to run the server)
RUN apk add --no-cache nodejs npm

# Expose port 80 for the application
EXPOSE 80

# Start both Node.js and NGINX
CMD ["sh", "-c", "node /home/app/server.js & nginx -g 'daemon off;'"]
