import handler from './util/handler';
import dynamoDB from './util/dynamoDB';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const main = handler(async (event: APIGatewayProxyEvent) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            userId: event.requestContext?.authorizer?.iam.cognitoIdentity
                .identityId,
            noteId: event.pathParameters?.id,
        },
    };

    const result = await dynamoDB.get(params);
    if (!result.Item) {
        throw new Error('Item not found for note: ' + event.pathParameters?.id);
    }

    return result.Item;
});
