import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "catalog-search-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3018"),
  pubsubEvents: ["search.index.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

