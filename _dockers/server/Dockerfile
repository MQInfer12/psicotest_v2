FROM ubuntu:latest AS base

ENV DEBIAN_FRONTEND noninteractive

# Install dependencies
RUN apt update
RUN apt install -y software-properties-common
RUN add-apt-repository -y ppa:ondrej/php
RUN apt update
RUN apt install -y php8.2\
    php8.2-cli\
    php8.2-common\
    php8.2-fpm\
    php8.2-pgsql\
    php8.2-zip\
    php8.2-gd\
    php8.2-mbstring\
    php8.2-curl\
    php8.2-xml\
    php8.2-bcmath\
    php8.2-pdo

# Install php-fpm
RUN apt install -y php8.2-fpm php8.2-cli

# Install composer
RUN apt install -y curl
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install nginx
RUN apt install -y nginx
RUN echo "\
    server {\n\
        listen 5013;\n\
        listen [::]:80;\n\
        root /var/www/html/public;\n\
        add_header X-Frame-Options \"SAMEORIGIN\";\n\
        add_header X-Content-Type-Options \"nosniff\";\n\
        index index.php;\n\
        charset utf-8;\n\
        location / {\n\
            try_files \$uri \$uri/ /index.php?\$query_string;\n\
        }\n\
        location = /favicon.ico { access_log off; log_not_found off; }\n\
        location = /robots.txt  { access_log off; log_not_found off; }\n\
        error_page 404 /index.php;\n\
        location ~ \.php$ {\n\
            fastcgi_pass unix:/run/php/php8.2-fpm.sock;\n\
            fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;\n\
            include fastcgi_params;\n\
        }\n\
        location ~ /\.(?!well-known).* {\n\
            deny all;\n\
        }\n\
    }\n" > /etc/nginx/sites-available/default

    RUN echo "\
    #!/bin/sh\n\
    echo \"Generando archivo .env desde variables de entorno...\"\n\
    cat <<EOF > /var/www/html/.env\n\
    APP_NAME=\"\$APP_NAME\"\n\
    APP_ENV=\"\$APP_ENV\"\n\
    APP_KEY=\"\$APP_KEY\"\n\
    APP_DEBUG=\"\$APP_DEBUG\"\n\
    APP_URL=\"\$APP_URL\"\n\
    DB_CONNECTION=\"\$DB_CONNECTION\"\n\
    DB_HOST=\"\$DB_HOST\"\n\
    DB_PORT=\"\$DB_PORT\"\n\
    DB_DATABASE=\"\$DB_DATABASE\"\n\
    DB_USERNAME=\"\$DB_USERNAME\"\n\
    DB_PASSWORD=\"\$DB_PASSWORD\"\n\
    GOOGLE_CLIENT_ID=\"\$GOOGLE_CLIENT_ID\"\n\
    GOOGLE_CLIENT_SECRET=\"\$GOOGLE_CLIENT_SECRET\"\n\
    EOF\n\
    chown www-data:www-data /var/www/html/.env\n\
    echo \"Cacheando configuración de Laravel...\"\n\
    cd /var/www/html\n\
    php artisan config:clear && php artisan config:cache\n\
    echo \"Iniciando servicios...\"\n\
    service php8.2-fpm start\n\
    nginx -g \"daemon off;\" &\n\
    echo \"Listo.\"\n\
    tail -s 1 /var/log/nginx/*.log -f\n\
" > /start.sh

COPY . /var/www/html
WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

RUN chmod -R 775 storage bootstrap/cache

RUN composer install

EXPOSE 5013

CMD ["sh", "/start.sh"]