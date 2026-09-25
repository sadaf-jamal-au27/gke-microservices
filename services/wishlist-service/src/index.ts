import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "wishlist-service",
  domain: "customer",
  port: Number(process.env.PORT ?? "3052"),
  pubsubEvents: ["wishlist.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

