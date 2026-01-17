# Build stage
FROM node:current-alpine3.22 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm i

# Copy Prisma schema and config
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY prisma.config.js ./prisma.config.js

# Generate Prisma client (use dummy URL for build time)
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN npx prisma generate

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:current-alpine3.22

WORKDIR /app

# Install system dependencies required by your app (if any)
RUN apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY --from=builder /app/package*.json ./

# Install production dependencies and Prisma CLI (needed for migrations)
RUN npm ci --omit=dev && npm install -g prisma

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/prisma.config.js ./prisma.config.js

# Create a startup script that runs migrations before starting the app
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Running database migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'exec node dist/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
