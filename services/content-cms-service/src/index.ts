import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "content-cms-service",
  domain: "content",
  port: Number(process.env.PORT ?? "3070"),
  pubsubEvents: ["content.published"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

