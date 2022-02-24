import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../lib/contextLib';
import './Login.css';
import { useHistory } from 'react-router-dom';
import { LoaderButton } from '../components/LoaderButton';
import { onError } from '../lib/errorLib';
import { useFormFields } from '../hooks/formHook';

export default function Login() {
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const context = useAppContext();
    const history = useHistory();

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            await Auth.signIn(fields.email, fields.password);
            context?.setIsAuthenticated(true);
            history.push('/');
        } catch (e: any) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    disabled={!validateForm()}
                    isLoading={isLoading}
                >
                    Login
                </LoaderButton>
            </Form>
        </div>
    );
}
