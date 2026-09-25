import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "media-asset-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3019"),
  pubsubEvents: ["asset.uploaded"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

