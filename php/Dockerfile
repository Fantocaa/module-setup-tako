FROM php:8.4-fpm

ENV COMPOSER_MEMORY_LIMIT='-1'

ENV PS1="\u@\h:\w\\$ "
ENV TZ="Asia/Jakarta"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        openssh-server \
        git \
        cron \
        nano

# Install PHP extensions using the helper script
RUN curl -sSL https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions -o /usr/local/bin/install-php-extensions && \
    chmod +x /usr/local/bin/install-php-extensions

# Part 1: Core and common extensions
RUN install-php-extensions \
    exif \
    pcntl \
    intl \
    gmp \
    zip \
    bcmath \
    gd

# Part 2: Database, Cache, and specialized extensions (including soap)
RUN install-php-extensions \
    soap \
    pdo_pgsql \
    pdo_mysql \
    redis \
    mongodb \
    imagick \
    xdebug \
    memcached

#####################################
# Composer:
#####################################
# Install composer and add its bin to the PATH.
RUN curl -s http://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer


#####################################
# Node.js & NPM (NodeSource):
#####################################
# Kita pakai Node.js v24 (LTS).
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs

# Verifikasi instalasi (Opsional saat build)
RUN node -v && npm -v

#####################################
# Laravel Schedule Cron Job:
#####################################
RUN echo "* * * * * root /usr/local/bin/php /var/www/html/artisan schedule:run >> /dev/null 2>&1" >> /etc/cron.d/laravel-scheduler
RUN chmod 0644 /etc/cron.d/laravel-scheduler

#
#--------------------------------------------------------------------------
# Final Touch
#--------------------------------------------------------------------------
#

ADD ./php/local.ini /usr/local/etc/php/conf.d

#####################################
# Aliases:
#####################################
# docker-compose exec php-fpm dep --> locally installed Deployer binaries
RUN echo '#!/bin/bash\n/usr/local/bin/php /var/www/vendor/bin/dep "$@"' > /usr/bin/dep
RUN chmod +x /usr/bin/dep
# docker-compose exec php-fpm art --> php artisan
RUN echo '#!/bin/bash\n/usr/local/bin/php /var/www/html/artisan "$@"' > /usr/bin/art
RUN chmod +x /usr/bin/art
# docker-compose exec php-fpm migrate --> php artisan migrate
RUN echo '#!/bin/bash\n/usr/local/bin/php /var/www/html/artisan migrate "$@"' > /usr/bin/migrate
RUN chmod +x /usr/bin/migrate
# docker-compose exec php-fpm fresh --> php artisan migrate:fresh --seed
RUN echo '#!/bin/bash\n/usr/local/bin/php /var/www/html/artisan migrate:fresh --seed' > /usr/bin/fresh
RUN chmod +x /usr/bin/fresh
# docker-compose exec php-fpm t --> run the tests for the project and generate testdox
RUN echo '#!/bin/bash\n/usr/local/bin/php /var/www/html/artisan config:clear\n/var/www/vendor/bin/phpunit -d memory_limit=2G --stop-on-error --stop-on-failure --testdox-text=tests/report.txt "$@"' > /usr/bin/t
RUN chmod +x /usr/bin/t
# docker-compose exec php-fpm d --> run the Laravel Dusk browser tests for the project
RUN echo '#!/bin/bash\n/usr/local/bin/php /var/www/html/artisan config:clear\n/bin/bash\n/usr/local/bin/php /var/www/html/artisan dusk -d memory_limit=2G --stop-on-error --stop-on-failure --testdox-text=tests/report-dusk.txt "$@"' > /usr/bin/d
RUN chmod +x /usr/bin/d

RUN rm -r /var/lib/apt/lists/*

# Copy existing application directory contents
COPY ./src /var/www/html

# Set working directory
WORKDIR /var/www/html

# Environment Setup
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Composer install
RUN composer install --no-interaction --optimize-autoloader

# Generate key
RUN php artisan key:generate --force

# NPM install and build
RUN npm install && npm run build

# Set permissions
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

COPY ./php/docker-entrypoint.sh /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN ln -s /usr/local/bin/docker-entrypoint.sh /

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 9000
CMD ["php-fpm"]