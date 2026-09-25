# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/service-core ./packages/service-core
COPY services/bff-api-service ./services/bff-api-service
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @retail/bff-api-service build

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/bff-api-service/dist ./dist
COPY --from=build /app/services/bff-api-service/package.json ./
COPY --from=build /app/node_modules ./node_modules
USER nonroot
EXPOSE 8080
CMD ["dist/index.js"]
