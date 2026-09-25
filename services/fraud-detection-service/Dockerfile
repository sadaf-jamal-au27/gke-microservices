# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/service-core ./packages/service-core
COPY services/fraud-detection-service ./services/fraud-detection-service
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @retail/fraud-detection-service build

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/fraud-detection-service/dist ./dist
COPY --from=build /app/services/fraud-detection-service/package.json ./
COPY --from=build /app/node_modules ./node_modules
USER nonroot
EXPOSE 8080
CMD ["dist/index.js"]
