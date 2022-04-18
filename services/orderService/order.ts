import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createOrder } from './orderManager';
import { createResponse } from './utils/utils';

const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

async function handler(event: any, context: any): Promise<any> {

if (!event.body) {
        return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
}
const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
// const body = await JSON.parse(event.body);

item[PRIMARY_KEY] = uuidv4();


const order = createOrder(item);

  const params = {
    TableName: TABLE_NAME,
    Item: order
  };

try { 
       const saved = await db.put(params).promise();
       return createResponse(200,saved);
        
} catch (err) {
        return createResponse(400, err)
}

}

export { handler };

