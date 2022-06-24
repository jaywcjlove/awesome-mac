# https://lipanski.com/posts/smallest-docker-image-static-website
# https://github.com/lipanski/docker-static-website
FROM lipanski/docker-static-website:latest

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY ./dist .