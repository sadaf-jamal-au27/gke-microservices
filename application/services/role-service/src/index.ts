import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "role-service",
  domain: "identity",
  port: Number(process.env.PORT ?? "3003"),
  pubsubEvents: ["role.assigned"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

