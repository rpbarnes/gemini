import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import handler from './util/handler';
import dynamoDb from './util/dynamoDB';

export const main = handler(async (event: APIGatewayProxyEvent) => {
    if (!event.body) {
        throw new Error('No body passed in event');
    }
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME ?? '',
        Item: {
            userId: event.requestContext?.authorizer?.iam.cognitoIdentity
                .identityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now(),
        },
    };
    await dynamoDb.put(params);

    return params.Item;
});
