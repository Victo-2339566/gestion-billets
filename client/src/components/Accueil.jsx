function Accueil({ billets }) {
    return (
        <div className="carte">
            <h2>Bienvenue</h2>
            <p>Nombre total de billets : {billets.length}</p>
        </div>
    );
}

export default Accueil;
