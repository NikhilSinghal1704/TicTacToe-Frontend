# Dockerfile

# 1. Installer Stage: Install dependencies
FROM node:20-slim AS installer
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm install

# 2. Builder Stage: Build the Next.js application
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies from installer stage
COPY --from=installer /app/node_modules ./node_modules
# Copy all other source files
COPY . .

# Environment variables can be added here
# Example: ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the app
RUN npm run build

# 3. Runner Stage: Run the application
FROM node:20-slim AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy the built app from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# The default command to run the app
CMD ["node", "server.js"]
