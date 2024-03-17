# Use Nginx as the production server
FROM nginx:1.24-bullseye

# Copy the built React app to Nginx's web server directory
COPY /dist/apps/blogs /usr/share/nginx/html
COPY /configs/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]