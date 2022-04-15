import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

async function handler(event: any, context: any): Promise<any> {


    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from Lambda'
    }
    return result

}

export { handler };