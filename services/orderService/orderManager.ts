
function createOrder(body: any){
    const order = {
        orderId: Math.floor(Math.random() * 498553757),
        name: body.name,
        address: body.name,
        productId: body.productId,
        quantity: body.quantity,
        orderDate: Date.now(),
        eventType: 'order_placed'
    }

    return order
}


export {
    createOrder
}