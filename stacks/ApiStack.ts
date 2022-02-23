import {
    Api,
    ApiAuthorizationType,
    App,
    Stack,
    StackProps,
    Table,
} from '@serverless-stack/resources';

export type ApiProps = StackProps & {
    table: Table;
};

export default class ApiStack extends Stack {
    public readonly api: Api;
    constructor(scope: App, id: string, props: ApiProps) {
        super(scope, id, props);
        this.api = new Api(this, 'Api', {
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: props.table.tableName,
                },
            },
            defaultAuthorizationType: ApiAuthorizationType.AWS_IAM,
            routes: {
                'POST        /notes': 'src/create.main',
                'GET    /notes/{id}': 'src/get.main',
                'GET         /notes': 'src/list.main',
                'PUT    /notes/{id}': 'src/update.main',
                'DELETE /notes/{id}': 'src/delete.main',
            },
        });

        this.api.attachPermissions([props.table]);

        this.addOutputs({
            ApiEndpoint: this.api.url,
        });
    }
}
