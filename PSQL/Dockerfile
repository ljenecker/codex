FROM postgres
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD pg123
ENV POSTGRES_DB my_products
COPY tables.sql /docker-entrypoint-initdb.d/
EXPOSE 5432