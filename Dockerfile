# ===== Base Stage =====
# Use a specific Node.js version for consistency.
FROM node:20-slim AS base

# Set the working directory in the container.
WORKDIR /app

# Set the NODE_ENV environment variable.
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy package manager files and install dependencies.
# This layer is cached and will only be re-run if these files change.
COPY package.json ./
RUN pnpm install --prod --frozen-lockfile

# ===== Build Stage =====
# This stage builds the Next.js application.
FROM node:20-slim AS build

WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json ./

# Install all dependencies, including devDependencies, for building.
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code.
COPY . .

# Build the Next.js application.
RUN pnpm build

# ===== Production Stage =====
# This is the final, optimized image for production.
FROM node:20-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy the dependency installation from the 'base' stage.
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

# Copy the built application from the 'build' stage.
# This includes the .next folder, public folder, and next.config.ts.
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

# Expose the port the app will run on.
EXPOSE 3000

# The command to start the Next.js application in production mode.
CMD ["pnpm", "start", "-p", "3000"]
