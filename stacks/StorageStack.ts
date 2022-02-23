import {
    Table,
    Stack,
    App,
    StackProps,
    TableFieldType,
    Bucket,
} from '@serverless-stack/resources';
import { HttpMethods } from 'aws-cdk-lib/aws-s3';

export default class StorageStack extends Stack {
    public readonly table: Table;
    public readonly bucket: Bucket;

    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        this.table = new Table(this, 'Notes', {
            fields: {
                userId: TableFieldType.STRING,
                noteId: TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' },
        });

        this.bucket = new Bucket(this, 'Uploads', {
            s3Bucket: {
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ['*'],
                        allowedHeaders: ['*'],
                        allowedMethods: [
                            HttpMethods.GET,
                            HttpMethods.POST,
                            HttpMethods.PUT,
                            HttpMethods.DELETE,
                            HttpMethods.HEAD,
                        ],
                    },
                ],
            },
        });
    }
}
