import { useState, useEffect } from 'react';

function App() {
    const [message, setMessage] = useState('');

    // Appelle le serveur au chargement pour vérifier la connexion
    useEffect(() => {
        fetch('http://localhost:3001/')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(() => setMessage('Impossible de joindre le serveur'));
    }, []);

    return (
        <div>
            <h1>Système de gestion de billets</h1>
            <p>Statut du serveur : {message || 'Chargement...'}</p>
        </div>
    );
}

export default App;
