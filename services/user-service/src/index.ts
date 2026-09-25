import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "user-service",
  domain: "identity",
  port: Number(process.env.PORT ?? "3002"),
  pubsubEvents: ["user.created","user.updated"],
  enableDatabase: true,
});

registerRoutes(service.app, service.deps);
await service.start();

