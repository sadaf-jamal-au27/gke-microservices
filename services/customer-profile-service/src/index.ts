import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "customer-profile-service",
  domain: "customer",
  port: Number(process.env.PORT ?? "3050"),
  pubsubEvents: ["profile.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

