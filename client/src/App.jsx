import { useState, useEffect } from 'react';
import './App.css';
import Accueil from './components/Accueil';
import FormulaireBillet from './components/FormulaireBillet';
import ListeBillets from './components/ListeBillets';
import MessageStatut from './components/MessageStatut';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
    const [message, setMessage] = useState('');
    const [billets, setBillets] = useState([]);
    const [billetAModifier, setBilletAModifier] = useState(null);
    const [messageStatut, setMessageStatut] = useState({ texte: '', type: 'succes' });
    const [vue, setVue] = useState('accueil');
    const [role, setRole] = useState('utilisateur');
    const [themeClair, setThemeClair] = useState(false);
    const [recherche, setRecherche] = useState('');
    const [filtreStatut, setFiltreStatut] = useState('');
    const [filtrePriorite, setFiltrePriorite] = useState('');

    // Appelle le serveur au chargement pour vérifier la connexion
    useEffect(() => {
        fetch(`${API_URL}/`)
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(() => setMessage('Impossible de joindre le serveur'));
    }, []);

    // Récupère la liste des billets depuis le serveur, selon la recherche et les filtres actifs
    // Le filtrage par statut/priorité est réservé à l'Admin (vue Utilisateur = consultation simple)
    const chargerBillets = () => {
        const parametres = new URLSearchParams();
        if (recherche) parametres.set('recherche', recherche);
        if (role === 'admin') {
            if (filtreStatut) parametres.set('statut', filtreStatut);
            if (filtrePriorite) parametres.set('priorite', filtrePriorite);
        }

        fetch(`${API_URL}/billets?${parametres}`)
            .then(res => res.json())
            .then(setBillets);
    };

    // Recharge la liste au chargement et à chaque changement de la recherche, des filtres ou du rôle
    useEffect(() => {
        chargerBillets();
    }, [recherche, filtreStatut, filtrePriorite, role]);

    // La vue Utilisateur n'a accès qu'à la création : on force cet onglet
    // dès qu'on n'est pas Admin (au chargement et à chaque changement de rôle)
    useEffect(() => {
        if (role !== 'admin') {
            setVue('creation');
        }
    }, [role]);

    // Le fond de page vit sur <body> (pas sur .conteneur) pour couvrir tout
    // l'écran, même l'espace autour du contenu centré
    useEffect(() => {
        document.body.dataset.theme = themeClair ? 'clair' : 'sombre';
    }, [themeClair]);

    const afficherSucces = (texte) => setMessageStatut({ texte, type: 'succes' });
    const afficherErreur = (texte) => setMessageStatut({ texte, type: 'erreur' });

    // Le message de statut vit ici (pas dans FormulaireBillet) car ce
    // composant est remonté après une modification réussie et perdrait
    // sinon le message au moment même où il doit s'afficher
    const gererSucces = (texte) => {
        afficherSucces(texte);
        setBilletAModifier(null);
        chargerBillets();
    };

    // Passe à l'onglet Création pour afficher le formulaire pré-rempli
    const gererModifier = (billet) => {
        setBilletAModifier(billet);
        setVue('creation');
    };

    const annulerModification = () => {
        setBilletAModifier(null);
    };

    // Change le statut d'un billet directement depuis la liste
    const changerStatut = async (id, statut) => {
        const reponse = await fetch(`${API_URL}/billets/${id}/statut`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut }),
        });

        if (!reponse.ok) {
            const donnees = await reponse.json();
            afficherErreur(donnees.erreur);
            return;
        }

        chargerBillets();
    };

    // Supprime un billet, après confirmation de l'utilisateur
    const supprimerBillet = async (billet) => {
        if (!window.confirm(`Supprimer le billet "${billet.titre}" ?`)) {
            return;
        }

        const reponse = await fetch(`${API_URL}/billets/${billet.id}`, { method: 'DELETE' });
        const donnees = await reponse.json();

        if (!reponse.ok) {
            afficherErreur(donnees.erreur);
            return;
        }

        // Si le billet supprimé était en cours de modification, on referme le formulaire
        if (billetAModifier?.id === billet.id) {
            setBilletAModifier(null);
        }

        afficherSucces(donnees.message);
        chargerBillets();
    };

    return (
        <div className="conteneur">
            <h1>Système de gestion de billets</h1>
            <p className="statut-serveur">Statut du serveur : {message || 'Chargement...'}</p>

            <button
                className="bouton-theme"
                onClick={() => setThemeClair(!themeClair)}
                title={themeClair ? 'Passer au thème sombre' : 'Passer au thème clair'}
            >
                {themeClair ? '🌙' : '☀️'}
            </button>

            <div className="selecteur-role">
                <button
                    className={`role-bouton ${role === 'utilisateur' ? 'role-actif' : ''}`}
                    onClick={() => setRole('utilisateur')}
                >
                    Utilisateur
                </button>
                <button
                    className={`role-bouton ${role === 'admin' ? 'role-actif' : ''}`}
                    onClick={() => setRole('admin')}
                >
                    Admin
                </button>
            </div>

            <MessageStatut message={messageStatut.texte} type={messageStatut.type} />

            <nav className="onglets">
                {role === 'admin' && (
                    <button
                        className={`onglet ${vue === 'accueil' ? 'onglet-actif' : ''}`}
                        onClick={() => setVue('accueil')}
                    >
                        Accueil
                    </button>
                )}
                <button
                    className={`onglet ${vue === 'creation' ? 'onglet-actif' : ''}`}
                    onClick={() => setVue('creation')}
                >
                    Créer un billet
                </button>
                {role === 'admin' && (
                    <button
                        className={`onglet ${vue === 'liste' ? 'onglet-actif' : ''}`}
                        onClick={() => setVue('liste')}
                    >
                        Liste des billets
                    </button>
                )}
            </nav>

            {vue === 'accueil' && <Accueil />}

            {vue === 'creation' && (
                <div className="carte">
                    <FormulaireBillet
                        key={billetAModifier?.id ?? 'nouveau'}
                        billetAModifier={billetAModifier}
                        onSucces={gererSucces}
                        onErreur={afficherErreur}
                        onAnnuler={annulerModification}
                    />
                </div>
            )}

            {vue === 'liste' && (
                <>
                    <input
                        type="text"
                        className="champ-recherche"
                        placeholder="Rechercher par mot-clé (titre ou description)..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />

                    {role === 'admin' && (
                        <div className="filtres">
                            <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
                                <option value="">Tous les statuts</option>
                                <option value="Ouvert">Ouvert</option>
                                <option value="En cours">En cours</option>
                                <option value="Résolu">Résolu</option>
                                <option value="Fermé">Fermé</option>
                            </select>

                            <select value={filtrePriorite} onChange={(e) => setFiltrePriorite(e.target.value)}>
                                <option value="">Toutes les priorités</option>
                                <option value="Basse">Basse</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Haute">Haute</option>
                            </select>
                        </div>
                    )}

                    <ListeBillets
                        billets={billets}
                        role={role}
                        onModifier={gererModifier}
                        onChangerStatut={changerStatut}
                        onSupprimer={supprimerBillet}
                    />
                </>
            )}
        </div>
    );
}

export default App;
