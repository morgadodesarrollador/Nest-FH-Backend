<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API
  1. Clonar el repositorio
  2. Ejecutar
   ```
    yarn install
   ```
  3. Tener Nest CLI instalado
   ```
  npm i -g @nestjs/cli
   ```
  4. Clonar el fichero ```.env.template``` y renombrarlo a ```.env```
  5. Modificar las variables de entorno
  6. Levantar la Base de Datos 
   ```
  docker-compose up -d
   ```

  7. Levantar el entorno de desarrollo ``` yarn start:dev```

  8. Reconstruir la BD con la semilla Seed desde Postman
  ```
  http://localhost:3000/api/seed
  ```
## Stack usados
* MongoDB
* Nest JS
* TypeORM/PostgresSQL