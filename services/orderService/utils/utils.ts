import { APIGatewayProxyResult } from 'aws-lambda';
 
function createResponse(statusCode: any, message:any){

    return {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
}

export {
    createResponse
}