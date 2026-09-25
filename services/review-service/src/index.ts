import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "review-service",
  domain: "customer",
  port: Number(process.env.PORT ?? "3053"),
  pubsubEvents: ["review.submitted"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

