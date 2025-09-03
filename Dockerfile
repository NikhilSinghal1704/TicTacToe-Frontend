# Dockerfile for a Next.js application

# 1. Builder Stage: Build the Next.js app
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
# This will also generate the standalone output
RUN npm run build

# 2. Runner Stage: Create the final, lightweight image
FROM node:20-slim AS runner

WORKDIR /app

# Set environment variables
# Add any production-specific environment variables here
# Example: ENV NODE_ENV=production
# ENV MY_API_KEY="your_api_key_here"

# Install production dependencies for the standalone app
COPY --from=builder /app/.next/standalone ./
RUN npm install --production

# Copy the built app from the builder stage
COPY --from=builder /app/.next/static ./.next/static


# Expose the port the app runs on
EXPOSE 3000

# Set the user to a non-root user for security
USER nextjs

# The command to run the standalone server
CMD ["node", "server.js"]
