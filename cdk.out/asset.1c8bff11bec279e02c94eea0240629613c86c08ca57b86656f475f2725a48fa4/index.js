var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/services/orderService/order.ts
var order_exports = {};
__export(order_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(order_exports);

// asset-input/services/orderService/orderManager.ts
function createOrder(body) {
  const order = {
    orderId: Math.floor(Math.random() * 498553757),
    name: body.name,
    address: body.name,
    productId: body.productId,
    quantity: body.quantity,
    orderDate: Date.now(),
    eventType: "order_placed"
  };
  return body;
}

// asset-input/services/orderService/utils/utils.ts
function createResponse(statusCode, message) {
  const response = {
    statusCode,
    body: JSON.stringify(message)
  };
  return response;
}

// asset-input/services/orderService/order.ts
async function handler(event, context) {
  const body = JSON.parse(event.body);
  const order = createOrder(body);
  console.log(order);
  try {
    console.log(event.body);
    createResponse(200, order);
  } catch (err) {
    createResponse(400, err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
