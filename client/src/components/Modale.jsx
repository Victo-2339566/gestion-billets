function Modale({ titre, onFermer, children }) {
    return (
        <div className="modale-fond" onClick={onFermer}>
            <div className="modale-contenu" onClick={(e) => e.stopPropagation()}>
                <div className="modale-entete">
                    <h3>{titre}</h3>
                    <button type="button" className="modale-fermer" onClick={onFermer}>
                        ×
                    </button>
                </div>
                <div className="modale-corps">{children}</div>
            </div>
        </div>
    );
}

export default Modale;
