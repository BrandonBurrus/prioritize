const firestoreRouters = require("./firestore");
const logger = require("./logger");
const { v4: transId } = require("uuid");

const routers = [...firestoreRouters];

function responseFactory(res) {
  const { headers = {}, body = {}, ...rest } = res;
  const status = rest.status || body.status || 200;
  return {
    statusCode: status,
    headers: {
      "Content-Type": headers["Content-Type"] || "application/json",
      ...headers,
    },
    body:
      typeof body === "string"
        ? body
        : JSON.stringify({
            status,
            ...body,
            ...rest,
          }),
  };
}

module.exports.handler = async function (event, ctx) {
  const transactionId = String(event.headers["x-transaction-id"] || transId());
  const log = logger.child({ transactionId });
  try {
    for (const router of routers) {
      const routerResult = router.handle(event, log, ctx);
      if (routerResult) {
        const res = responseFactory(routerResult);
        log.http(res, { type: "response" });
        return res;
      }
    }
    const notFoundRes = responseFactory({
      status: 404,
      error: {
        msg: "Not Found",
      },
    });
    log.http(notFoundRes, { type: "response" });
    return notFoundRes;
  } catch (err) {
    const errorRes = responseFactory({
      status: 500,
      err,
    });
    log.http(errorRes, { type: "response" });
    return errorRes;
  }
};
