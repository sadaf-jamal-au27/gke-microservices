import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "invoice-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3027"),
  pubsubEvents: ["invoice.issued"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

