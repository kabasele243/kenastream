import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createOrder } from './orderManager';
import { createResponse } from './utils/utils';

async function handler(event: any, context: any): Promise<any> {

 
    const body = await JSON.parse(event.body);
    const order = createOrder(body);
    
    console.log(order)
    try { 
        console.log(event.body);
        return createResponse(200,order);
        
    } catch (err) {
        return createResponse(400, err)
    }

}

export { handler };