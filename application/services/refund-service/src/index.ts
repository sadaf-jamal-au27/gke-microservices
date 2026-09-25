import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "refund-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3026"),
  pubsubEvents: ["refund.processed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

