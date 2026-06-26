FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    unzip \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first for better caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package files and install node dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Run composer scripts after copying all files
RUN composer run-script post-autoload-dump || true

# Build frontend assets
RUN npm run build

# Create storage directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/app/public \
    && mkdir -p bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Create storage link
RUN php artisan storage:link || true

# Expose port
EXPOSE ${PORT:-8000}

# Start the application
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
