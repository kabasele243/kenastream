import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import {join} from 'path';


export class KenastreamStack extends Stack {
    
  private api = new RestApi(this, 'kenastream');
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

   

   const orderLambda = new NodejsFunction(this, 'orderLambda', {
        entry: (join(__dirname, '..', 'services', 'orderService', `order.ts`)),
        handler: 'handler',
      })
      const orderLambdaIntegration = new LambdaIntegration(orderLambda);
      const orderLambdaResource = this.api.root.addResource('order');
      orderLambdaResource.addMethod('POST', orderLambdaIntegration);


    }
  

}
