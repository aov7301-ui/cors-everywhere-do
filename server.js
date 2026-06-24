const http = require("http");
const cors_proxy = require("cors-anywhere");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8080);

const proxy = cors_proxy.createServer({
  originWhitelist: [],
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
  httpProxyOptions: {
    xfwd: true,
  },
});

const server = http.createServer((req, res) => {
  const path = (req.url || "").split("?")[0];

  if (path === "/health" || path === "/healthz") {
    res.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    });
    res.end(
      JSON.stringify({
        ok: true,
        service: "cors-anywhere",
        version: "1.0.0",
      })
    );
    return;
  }

  proxy.emit("request", req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`cors-anywhere listening on http://${HOST}:${PORT}`);
});
