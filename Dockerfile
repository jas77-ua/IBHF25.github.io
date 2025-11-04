FROM nginx:alpine

# YouthBank First - Prototipo Educativo
# Esta NO es una aplicación bancaria real

# Copiar archivos de la aplicación
COPY index.html /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
COPY web/ /usr/share/nginx/html/web/

EXPOSE 80

# Comando por defecto de nginx
CMD ["nginx", "-g", "daemon off;"]
