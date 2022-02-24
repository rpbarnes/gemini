import { Auth } from 'aws-amplify';
import React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router';
import { LoaderButton } from '../components/LoaderButton';
import { useFormFields } from '../hooks/formHook';
import { useAppContext } from '../lib/contextLib';
import { onError } from '../lib/errorLib';
import './Signup.css';

const Signup = () => {
    const [fields, handleFieldChanged] = useFormFields({
        email: '',
        password: '',
        confirmPassword: '',
        confirmationCode: '',
    });
    const history = useHistory();
    const [newUser, setNewUser] = useState<boolean>(false);
    const context = useAppContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = (): boolean => {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    };

    const validateConfirmationForm = (): boolean => {
        return fields.confirmationCode.length > 0;
    };

    const onReset = () => {
        setNewUser(false);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setNewUser(true);
        } catch (e: any) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmationSubmit = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            context?.setIsAuthenticated(true);
            history.push('/');
        } catch (e: any) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const renderConfirmationForm = () => {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        onChange={handleFieldChanged}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>
                        Please check your email for the code.
                    </Form.Text>
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
                <Button block onClick={onReset}>
                    Reset
                </Button>
            </Form>
        );
    };

    const renderSignUp = () => {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChanged}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChanged}
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handleFieldChanged}
                        value={fields.confirmPassword}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </Form>
        );
    };

    return (
        <div className="Signup">
            {!newUser ? renderSignUp() : renderConfirmationForm()}
        </div>
    );
};

export default Signup;

/*
aws cognito-idp admin-confirm-sign-up \
--region us-east-1 \
--user-pool-id us-east-1_T2H2JQCyD \
--username YOUR_USER_EMAIL
*/
