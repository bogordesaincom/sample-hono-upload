import dotenv from "dotenv";
dotenv.config();
import { serve } from "@hono/node-server";

import { Hono } from "hono";
// import formidable from "formidable";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
// import fie from "file-type";
import { fileTypeFromBuffer } from "file-type";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const port = process.env.PORT || 6700;
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Cloudflare Workers!");
});

app.post("/upload", async (c) => {
  const { image } = await c.req.parseBody();
  const arr = await image.arrayBuffer();
  const buffer = Buffer.from(arr);
  const fileType = await fileTypeFromBuffer(buffer);

  if (fileType.ext) {
    const outputFileName = path.join(
      __dirname,
      `${image.name}.${fileType.ext}`
    );
    fs.createWriteStream(outputFileName).write(buffer);
  } else {
    console.log(
      "File type could not be reliably determined! The binary data may be malformed! No file saved!"
    );
  }

  return c.text("Hello Cloudflare Workers!");
});

serve({
  fetch: app.fetch,
  port: port,
});
