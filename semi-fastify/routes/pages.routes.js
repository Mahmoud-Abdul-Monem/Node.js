import jwt from "jsonwebtoken";

process.loadEnvFile();

async function pageAuth(req, reply) {
  const token = req.cookies.node_api_token;
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return reply.redirect("/login.html");
  }
}

function pageRole(...roles) {
  return async (req, reply) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return reply.redirect("/login.html");
    }
  };
}

export async function pagesRouter(fastify) {
  fastify.get("/home.html", { preHandler: [pageAuth] }, (req, reply) => {
    return reply.sendFile("home.html");
  });

  fastify.get("/cart.html", { preHandler: [pageAuth, pageRole("customer")] }, (req, reply) => {
    return reply.sendFile("cart.html");
  });

  fastify.get("/orders.html", { preHandler: [pageAuth, pageRole("customer")] }, (req, reply) => {
    return reply.sendFile("orders.html");
  });

  fastify.get("/merchant/products.html", { preHandler: [pageAuth, pageRole("merchant")] }, (req, reply) => {
    return reply.sendFile("merchant/products.html");
  });

  fastify.get("/merchant/product-form.html", { preHandler: [pageAuth, pageRole("merchant")] }, (req, reply) => {
    return reply.sendFile("merchant/product-form.html");
  });

  // 404 Handler for Page Routes
  fastify.setNotFoundHandler((req, reply) => {
    if (req.raw.url.startsWith("/api") || req.raw.url.startsWith("/auth")) {
      return reply.status(404).send({ error: "Route not found" });
    }
    return reply.status(404).sendFile("404.html");
  });
}