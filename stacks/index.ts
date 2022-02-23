import StorageStack from './StorageStack';
import ApiStack from './ApiStack';
import * as sst from '@serverless-stack/resources';
import AuthStack from './AuthStack';
import FrontendStack from './FrontendStack';

export default function main(app: sst.App): void {
    // Set default runtime for all functions
    app.setDefaultFunctionProps({
        runtime: 'nodejs14.x',
    });

    const storageStack = new StorageStack(app, 'storage');

    const apiStack = new ApiStack(app, 'api', {
        table: storageStack.table,
    });

    const authStack = new AuthStack(app, 'auth', {
        api: apiStack.api,
        bucket: storageStack.bucket,
    });

    new FrontendStack(app, 'frontend', {
        api: apiStack.api,
        bucket: storageStack.bucket,
        auth: authStack.auth,
    });
}
