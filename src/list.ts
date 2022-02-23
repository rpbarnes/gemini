import handler from './util/handler';
import dynamoDB from './util/dynamoDB';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const main = handler(async (event: APIGatewayProxyEvent) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId':
                event.requestContext?.authorizer?.iam.cognitoIdentity
                    .identityId,
        },
    };

    const result = await dynamoDB.query(params);

    return result.Items;
});
