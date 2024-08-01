# Use the official PHP image as a base
FROM php:8.0-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev libzip-dev git unzip libonig-dev libxml2-dev libpq-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && docker-php-ext-install gd && docker-php-ext-install zip && docker-php-ext-install pdo_mysql && docker-php-ext-install pdo_pgsql

# Install Composer
RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php \
    && curl -sS https://composer.github.io/installer.sig | \
       php -r "if (hash_file('sha384', '/tmp/composer-setup.php') === trim(file_get_contents('https://composer.github.io/installer.sig'))) { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('/tmp/composer-setup.php'); exit(1); } echo PHP_EOL;" \
    && php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm -f /tmp/composer-setup.php

RUN composer self-update

RUN composer --version

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . .

# Allow Composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install PHP dependencies
# RUN composer install

# Install PHP dependencies
RUN composer config

RUN cd /var/www && composer update --no-cache --prefer-dist

# Expose port 9000
EXPOSE 9000

# Start the PHP-FPM server
CMD ["php-fpm"]
