FROM mysql:8.0

# Copiar los scripts en orden garantizado
COPY docker-entry/01_creacion_tablas.sql        /docker-entrypoint-initdb.d/01.sql
COPY docker-entry/02_inserciones_iniciales.sql  /docker-entrypoint-initdb.d/02.sql
COPY docker-entry/03_triggers.sh                /docker-entrypoint-initdb.d/03.sh

# Dar permisos de ejecución al script bash
RUN chmod +x /docker-entrypoint-initdb.d/03.sh
