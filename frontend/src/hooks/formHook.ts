import { CfnFirewallDomainList } from 'aws-cdk-lib/aws-route53resolver';
import { useState } from 'react';

export const useFormFields = (initialState: any) => {
    const [fields, setFields] = useState(initialState);

    return [
        fields,
        function (event: any) {
            setFields({
                ...fields,
                [event.target.id]: event.target.value,
            });
        },
    ];
};
