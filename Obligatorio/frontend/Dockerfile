# Imagen base
FROM node:18-alpine

# Crear carpeta de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el frontend
COPY . .

# Exponer puerto
EXPOSE 3000

# Levantar el servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
