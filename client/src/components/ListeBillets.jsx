function ListeBillets({ billets, role, onModifier, onChangerStatut, onSupprimer }) {
    if (billets.length === 0) {
        return <p className="aucun-billet">Aucun billet pour le moment.</p>;
    }

    // La vue Utilisateur est limitée à la consultation : ni actions, ni changement de statut
    const estAdmin = role === 'admin';

    return (
        <table className="tableau-billets">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Catégorie</th>
                    <th>Priorité</th>
                    <th>Statut</th>
                    {estAdmin && <th></th>}
                </tr>
            </thead>
            <tbody>
                {billets.map((billet) => (
                    <tr key={billet.id}>
                        <td>{billet.titre}</td>
                        <td>{billet.description}</td>
                        <td>{billet.categorie}</td>
                        <td>{billet.priorite}</td>
                        <td>
                            {estAdmin ? (
                                <select
                                    value={billet.statut}
                                    onChange={(e) => onChangerStatut(billet.id, e.target.value)}
                                >
                                    <option value="Ouvert">Ouvert</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Résolu">Résolu</option>
                                    <option value="Fermé">Fermé</option>
                                </select>
                            ) : (
                                billet.statut
                            )}
                        </td>
                        {estAdmin && (
                            <td className="colonne-actions">
                                <button className="bouton bouton-secondaire" onClick={() => onModifier(billet)}>
                                    Modifier
                                </button>
                                <button className="bouton bouton-danger" onClick={() => onSupprimer(billet)}>
                                    Supprimer
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ListeBillets;
