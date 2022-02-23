import {
    Api,
    App,
    Auth,
    Bucket,
    Stack,
    StackProps,
} from '@serverless-stack/resources';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export type AuthProps = StackProps & {
    api: Api;
    bucket: Bucket;
};

export default class AuthStack extends Stack {
    public readonly auth: Auth;

    constructor(scope: App, id: string, props: AuthProps) {
        super(scope, id, props);

        const { api, bucket } = props;

        this.auth = new Auth(this, 'Auth', {
            cognito: {
                userPool: {
                    // customers can login with their email and password
                    signInAliases: {
                        email: true,
                    },
                },
            },
        });

        this.auth.attachPermissionsForAuthUsers([
            // allow access to the api
            api,
            // policy granting access to a specific folder of the bucket
            new PolicyStatement({
                actions: ['s3:*'],
                effect: Effect.ALLOW,
                resources: [
                    bucket.bucketArn +
                        '/private/${cognito-identity.amazonaws.com:sub}/*',
                ],
            }),
        ]);

        this.addOutputs({
            Region: scope.region,
            UserPoolId: this.auth.cognitoUserPool?.userPoolId ?? '',
            IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
            UserPoolClientId:
                this.auth.cognitoUserPoolClient?.userPoolClientId ?? '',
        });
    }
}
