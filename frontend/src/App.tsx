import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import './App.css';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';
import { AppContext } from './lib/contextLib';
import Auth from '@aws-amplify/auth';
import { useHistory } from 'react-router';
import { onError } from './lib/errorLib';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
    const history = useHistory();

    const handleLogout = async () => {
        await Auth.signOut();
        setIsAuthenticated(false);
        history.push('/login');
    };

    const onLoad = async () => {
        try {
            await Auth.currentSession();
            setIsAuthenticated(true);
        } catch (e: any) {
            if (e !== 'No current user') {
                onError(e);
            }
        }
        setIsAuthenticating(false);
    };

    useEffect(() => {
        onLoad();
    }, []);

    if (isAuthenticating) {
        return <></>;
    }

    return (
        <div className="App container py-3">
            <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                <LinkContainer to="/">
                    <Navbar.Brand className="font-weight-bold text-muted">
                        Scratch
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav activeKey={window.location.pathname}>
                        {isAuthenticated ? (
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        ) : (
                            <>
                                <LinkContainer to="/signup">
                                    <Nav.Link>Signup</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <AppContext.Provider
                value={{
                    isAuthenticated,
                    setIsAuthenticated: setIsAuthenticated,
                }}
            >
                <Routes />
            </AppContext.Provider>
        </div>
    );
}

export default App;
