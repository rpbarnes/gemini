import handler from './util/handler';
import dynamoDB from './util/dynamoDB';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const main = handler(async (event: APIGatewayProxyEvent) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            userId: event.requestContext?.authorizer?.iam.cognitoIdentity
                .identityId,
            noteId: event.pathParameters?.id,
        },
        UpdateExpression: 'SET content = :content, attachment = :attachment',
        ExpressionAttributeValues: {
            ':attachment': data.attachment || null,
            ':content': data.content || null,
        },
        ReturnValues: 'ALL_NEW',
    };

    await dynamoDB.update(params);

    return { status: true };
});
