console.log("Hello World");

import Router from "koa-router";
import koa from "koa";

const app = new koa();
const router = new Router();

router.get("/hello", (ctx) => (ctx.body = "Hello World!"));

router.get("/videos/:id", (ctx) => {
  ctx.body = "Hello World! " + ctx.params.id;
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend started at http://localhost:${PORT}`)
);
