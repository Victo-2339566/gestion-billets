import { useState, useEffect } from 'react';

const DUREE_AFFICHAGE_MS = 3000;

function MessageStatut({ message, type }) {
    const [visible, setVisible] = useState(false);

    // Réaffiche le message et relance la minuterie à chaque nouveau message
    useEffect(() => {
        if (!message) {
            return;
        }

        setVisible(true);
        const minuterie = setTimeout(() => setVisible(false), DUREE_AFFICHAGE_MS);

        return () => clearTimeout(minuterie);
    }, [message]);

    if (!message || !visible) {
        return null;
    }

    return <p className={`message message-${type}`}>{message}</p>;
}

export default MessageStatut;
