FROM nginx:alpine

# Copiar archivos de la aplicación
COPY index.html /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/

EXPOSE 80

# Comando por defecto de nginx
CMD ["nginx", "-g", "daemon off;"]
