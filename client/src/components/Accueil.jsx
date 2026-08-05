import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const STATUTS = ['Ouvert', 'En cours', 'Résolu', 'Fermé'];

function Accueil() {
    const [billets, setBillets] = useState([]);

    // Récupère toujours la liste complète, sans tenir compte des filtres actifs
    // sur l'onglet Liste, pour que les statistiques soient toujours justes
    useEffect(() => {
        fetch(`${API_URL}/billets`)
            .then(res => res.json())
            .then(setBillets);
    }, []);

    const compterParStatut = (statut) => billets.filter((billet) => billet.statut === statut).length;

    return (
        <div className="carte">
            <h2>Bienvenue</h2>
            <p>Nombre total de billets : {billets.length}</p>

            <div className="statistiques">
                {STATUTS.map((statut) => (
                    <div className="stat-carte" key={statut}>
                        <div className="stat-valeur">{compterParStatut(statut)}</div>
                        <div className="stat-etiquette">{statut}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Accueil;
