import { APIGatewayProxyEvent } from 'aws-lambda';

export default function handler(
    lambda: (event: APIGatewayProxyEvent, context: any) => any
) {
    return async function (event: APIGatewayProxyEvent, context: any) {
        let body, statusCode;
        try {
            body = await lambda(event, context);
            statusCode = 200;
        } catch (e: any) {
            console.error(e);
            body = { error: e.message };
            statusCode = 500;
        }
        return {
            statusCode,
            body: JSON.stringify(body),
        };
    };
}
