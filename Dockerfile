# Build stage
FROM oven/bun:1.3 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the application (type-check runs in CI, skip in Docker for faster builds)
RUN bun run build-only

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80 internally
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
