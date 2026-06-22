import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.E2E_STATIC_PORT || 3210);
const root = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

const server = createServer(async (request, response) => {
   const pathname = new URL(request.url || "/", `http://127.0.0.1:${port}`)
      .pathname;

   if (request.method === "OPTIONS" && pathname.startsWith("/v1/")) {
      response.writeHead(204, {
         "access-control-allow-origin": "*",
         "access-control-allow-methods": "POST, OPTIONS",
         "access-control-allow-headers": "authorization, content-type",
      });
      response.end();
      return;
   }

   if (request.method === "POST" && pathname.startsWith("/v1/")) {
      const apiHeaders = {
         "access-control-allow-origin": "*",
         "content-type": "application/json; charset=utf-8",
      };

      if (pathname === "/v1/error") {
         response.writeHead(500, apiHeaders);
         response.end(
            JSON.stringify({
               error: { message: "Simulated provider failure" },
            })
         );
         return;
      }

      if (pathname === "/v1/unauthorized") {
         response.writeHead(401, apiHeaders);
         response.end(
            JSON.stringify({
               error: { message: "Simulated unauthorized provider response" },
            })
         );
         return;
      }

      response.writeHead(200, apiHeaders);
      response.end(
         JSON.stringify({
            choices: [
               {
                  message: {
                     content: "Mocked AI response from the deterministic test server.",
                  },
               },
            ],
         })
      );
      return;
   }

   const fileName = pathname === "/" ? "selection.html" : pathname.slice(1);
   const filePath = normalize(join(root, fileName));

   if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
   }

   try {
      const body = await readFile(filePath);
      response.writeHead(200, {
         "content-type": fileName.endsWith(".html")
            ? "text/html; charset=utf-8"
            : "text/plain; charset=utf-8",
      });
      response.end(body);
   } catch {
      response.writeHead(404);
      response.end("Not found");
   }
});

server.listen(port, "127.0.0.1", () => {
   console.log(`Static test server listening on http://127.0.0.1:${port}`);
});
