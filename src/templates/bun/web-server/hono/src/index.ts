import { Hono } from "hono";

const app = new Hono();

app.notFound((c) => {
  return c.json({ message: "Not found", status: 404 }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: err.message, status: 500 }, 500);
});

app.get("/", (c) => {
  return c.json({ message: "Hello, world!", status: 200 }, 200);
});

export default {
  port: 8080,
  fetch: app.fetch,
};
