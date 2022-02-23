import handler from './util/handler';
import dynamoDB from './util/dynamoDB';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const main = handler(async (event: APIGatewayProxyEvent) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            userId: '123',
            noteId: event.pathParameters?.id,
        },
    };

    await dynamoDB.delete(params);

    return { status: true };
});
