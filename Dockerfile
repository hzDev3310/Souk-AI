FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    xz-utils \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libpq-dev \
    gnupg \
    procps \
    sudo

# Install Node.js 20.x (LTS - required for Vite)
RUN NODE_VERSION=20.19.2 \
    && ARCH=$(dpkg --print-architecture) \
    && if [ "$ARCH" = "arm64" ]; then NODE_ARCH="arm64"; else NODE_ARCH="x64"; fi \
    && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz" \
       | tar -xJ -C /usr/local --strip-components=1 \
    && node --version && npm --version

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Prevent Git dubious ownership issues
RUN git config --global --add safe.directory /var/www

# Set working directory
WORKDIR /var/www

EXPOSE 9000
CMD ["php-fpm"]
