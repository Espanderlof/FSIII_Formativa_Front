# FSIII_Formativa_Front
Formativa - Frontend Angular.


# Angular
ng serve

# Dockerfile
docker build -t front-libros .
docker run --name front-libros -p 4200:4200 front-libros

# DockerHub
1. Crear repo en https://hub.docker.com/
2. Primero, asegúrate de estar logueado en Docker Hub desde tu terminal
    docker login
3. Identifica tu imagen local. Puedes ver tus imágenes locales con:
    docker images
4. Etiqueta tu imagen local con el formato requerido por Docker Hub:
    Por ejemplo, si tu imagen local se llama "backend-app:1.0", los comandos serían:
    docker tag front-libros:latest espanderlof/fs3_formativa_frontend:latest
    docker push espanderlof/fs3_formativa_frontend:latest

# Play with Docker
1. ir a https://labs.play-with-docker.com/
2. copiar repo de dockerHub
    docker pull espanderlof/fs3_formativa_frontend:latest
3. levantar contenedor
    docker run -d --network host --name front-libros espanderlof/fs3_formativa_frontend:latest
4. verificar contenedores
    docker ps