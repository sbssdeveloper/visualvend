# Use the official PHP image as a base
FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev libzip-dev git unzip libonig-dev libxml2-dev libpq-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && docker-php-ext-install gd && docker-php-ext-install zip && docker-php-ext-install pdo_mysql && docker-php-ext-install pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . .

# Allow Composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install PHP dependencies
# RUN composer install

# Install PHP dependencies
RUN cd /var/www && composer update

# Expose port 9000
EXPOSE 9000

# Start the PHP-FPM server
CMD ["php-fpm"]
