import {
    Api,
    App,
    Auth,
    Bucket,
    ReactStaticSite,
    Stack,
    StackProps,
} from '@serverless-stack/resources';

type FrontendProps = StackProps & {
    api: Api;
    auth: Auth;
    bucket: Bucket;
};

export default class FrontendStack extends Stack {
    constructor(scope: App, id: string, props: FrontendProps) {
        super(scope, id, props);

        const { api, auth, bucket } = props;

        if (!auth.cognitoUserPool || !auth.cognitoUserPoolClient) {
            throw new Error(
                'Auth not properly setup. UserPool and UserPoolClient are borked.'
            );
        }

        const site = new ReactStaticSite(this, 'frontend', {
            path: 'frontend',
            environment: {
                REACT_APP_API_URL: api.url,
                REACT_APP_REGION: scope.region,
                REACT_APP_BUCKET: bucket.bucketName,
                REACT_APP_USER_POOL_ID: auth.cognitoUserPool?.userPoolId,
                REACT_APP_IDENTITY_POOL_ID: auth.cognitoCfnIdentityPool.ref,
                REACT_APP_USER_POOL_CLIENT_ID:
                    auth.cognitoUserPoolClient?.userPoolClientId,
            },
        });

        this.addOutputs({
            SiteUrl: site.url,
        });
    }
}
