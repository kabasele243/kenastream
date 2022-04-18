import { Stack, StackProps,RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { join } from 'path';


export class KenastreamStack extends Stack {
    
  private api = new RestApi(this, 'kenastream');
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

  const dynamoTable = new Table(this, 'orderItems', {
      partitionKey: {
        name: 'orderItemId',
        type: AttributeType.STRING
      },
      tableName: 'orderItems',
      removalPolicy: RemovalPolicy.DESTROY, 
  });
  const nodeJsFunctionProps: NodejsFunctionProps = {
    bundling: {
      externalModules: [
        'aws-sdk',
      ],
    },
    environment: {
      PRIMARY_KEY: 'orderItemId',
      TABLE_NAME: dynamoTable.tableName,
    },
    runtime: Runtime.NODEJS_14_X,
  }



  //Emit a new order
  const orderLambda = new NodejsFunction(this, 'orderLambda', {
        entry: (join(__dirname, '..', 'services', 'orderService', `order.ts`)),
        ...nodeJsFunctionProps
  });

   const getAllOrderLambda = new NodejsFunction(this, 'getAllOrderLambda', {
        entry: (join(__dirname, '..', 'services', 'orderService', 'getAllOrder.ts')),
        ...nodeJsFunctionProps

  })

  const getOrderLambda = new NodejsFunction(this, 'getOrderLambda', {
    entry: (join(__dirname, '..', 'services', 'orderService', 'getOrder.ts')),
    ...nodeJsFunctionProps

})

   // Grant the Lambda function read access to the DynamoDB table
   dynamoTable.grantReadWriteData(orderLambda);
   dynamoTable.grantReadWriteData(getAllOrderLambda);
   dynamoTable.grantReadWriteData(getOrderLambda);


   // Integrate the Lambda functions with the API Gateway resource
   const orderLambdaIntegration = new LambdaIntegration(orderLambda);
   const getAllOrderLambdaIntegration = new LambdaIntegration(getAllOrderLambda);
   const getOrderLambdaIntegration = new LambdaIntegration(getOrderLambda);

   // Create an API Gateway resource for each of the CRUD operations
   const orderLambdaResource = this.api.root.addResource('order');
   orderLambdaResource.addMethod('POST', orderLambdaIntegration);
   orderLambdaResource.addMethod('GET', getAllOrderLambdaIntegration);


   const singleOrderRessource = orderLambdaResource.addResource('{id}');
   singleOrderRessource.addMethod('GET', getOrderLambdaIntegration);
  
  }
  

}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}