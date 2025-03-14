import React from "react";

const Lobby = () => {
    return (
        <div style={styles.body}>
            <div style={styles.lobbyContainer}>
                <div style={styles.room}>Maths</div>
                <div style={styles.room}>Biology</div>
                <div style={styles.room}>Physics</div>
                <div style={styles.room}>Chemistry</div>
            </div>
        </div>
    );
};

const styles = {
    body: {
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#3C8EFA',
        margin: 0,
        padding: 0,
    },
    lobbyContainer: {
        display: 'flex',
        flexDirection: 'column', // Stack the rooms vertically
        justifyContent: 'flex-start', // Align the rooms from the top
        alignItems: 'center', // Center the rooms horizontally
        padding: '20px',
        height: '100vh', // Full height of the screen
    },
    room: {
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        padding: '20px',
        margin: '10px 0',
        width: '80%',
        textAlign: 'center',
        fontSize: '18px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
    },
    roomHover: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    roomActive: {
        backgroundColor: '#0056b3',
    },
};

export default Lobby;
