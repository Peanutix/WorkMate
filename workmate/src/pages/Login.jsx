import React from 'react';
// import { useHistory } from "react-router-dom";
import logo from '../assets/workmate_logo2.png';

const Login = () => {
    // const history = useHistory();
    // const handleLogin = () => {
    //     // After login is successful, navigate to the Lobby page
    //     history.push("/lobby");
    // };
    return (
        <div style={styles.body}>
            <div style={styles.loginContainer}>
                <img src={logo} alt="Logo" style={styles.logo} />
                <div style={styles.loginBox}>
                    <p style={styles.loginText}>Login</p>
                    <input type="text" placeholder="Username" style={styles.inputField}/>
                    <input type="password" placeholder="Password" style={styles.inputField}/>
                    {/*<button style={styles.signinButton} onClick={handleLogin}>Sign In</button>*/}
                    <button style={styles.signinButton}>Sign In</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    body: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#3C8EFA',
        fontFamily: 'Inter, sans-serif',
        fontSize: '25px',
        margin: 0,
    },
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
    },
    logo: {
        width: '500px',
        marginBottom: '20px',
    },
    loginBox: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 5px 6px rgba(0, 0, 0, 0.1)',
        width: '300px',
    },
    loginText: {
        fontSize: '24px',
        fontWeight: '700',
    },
    inputField: {
        width: '92%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '1px',
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
    },
    signinButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px',
        fontFamily: 'Inter, sans-serif',
    },
};

export default Login;
