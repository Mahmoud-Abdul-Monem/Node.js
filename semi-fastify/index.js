import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import path from "path";

import { pagesRouter } from "./routes/pages.routes.js";
import { authRouter } from "./routes/auth.route.js";
import { productsRouter } from "./routes/product.route.js";
import { ordersRouter } from "./routes/order.route.js";
import { cartRouter } from "./routes/cart.route.js";
import { checkAuth } from "./middleware/check.auth.js";
import { checkRole } from "./middleware/check.role.js";

process.loadEnvFile();

const app = Fastify({ logger: true });

await app.register(fastifyCookie);

await app.register(fastifyStatic, {
    root: path.join(import.meta.dirname, "pages"),
    serve: true
});

app.addHook("onRequest", async (req, reply) => {
    console.log(new Date().toLocaleString(), req.method, req.url);
});

await app.register(authRouter, { prefix: "/auth" });
await app.register(productsRouter, { prefix: "/api/products" });

await app.register(async function (protectedApi) {
    protectedApi.addHook("preHandler", checkAuth);
    protectedApi.addHook("preHandler", checkRole("customer"));

    protectedApi.register(cartRouter, { prefix: "/cart" });
    protectedApi.register(ordersRouter, { prefix: "/orders" });
}, { prefix: "/api" });




await app.register(pagesRouter);
// static

app.setErrorHandler((err, req, reply) => {
    console.log("err", err);
    reply.status(500).send({ error: "something went wrong" });
});



try {
    await app.listen({ port: 3000 });
    console.log("Server listening on http://localhost:3000");
} catch (err) {
    app.log.error(err);
    process.exit(1);
}