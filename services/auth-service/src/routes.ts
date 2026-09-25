import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/auth/info", async () => ({
    service: "auth-service",
    domain: "identity",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["user.authenticated","user.logout"],
  }));

  app.post("/v1/auth/login", async (req) => {
    const body = req.body as { email: string; password: string };
    if (!body.email?.includes("@")) {
      return { error: "invalid_credentials" };
    }
    const token = Buffer.from(JSON.stringify({ sub: body.email, exp: Date.now() + 3600000 })).toString("base64url");
    await deps.publish("user.authenticated", { email: body.email });
    return { accessToken: token, tokenType: "Bearer", expiresIn: 3600 };
  });
}
