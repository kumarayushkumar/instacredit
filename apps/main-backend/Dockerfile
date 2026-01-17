# Build stage
FROM node:current-alpine3.22 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm i

# Copy all source code
COPY . .

# Generate Prisma client (use dummy URL for build time)
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# Production stage
FROM node:current-alpine3.22

WORKDIR /app

# Install system dependencies required by your app (if any)
RUN apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Copy built assets from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Start the application
CMD ["node", "dist/server.js"]
