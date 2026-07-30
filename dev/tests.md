# Tests fonctionnels — Système de gestion de billets

Ce fichier regroupe les cas de test manuels et automatisés du projet, ajoutés au fur et à mesure de l'avancement des fonctionnalités.

Colonnes :
- **Statut** : Réussi / Échoué / À faire

---

## Fonctionnalité 1 — Création d'un billet

### Serveur (route POST /billets)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 1 | Création avec tous les champs valides | titre, description, catégorie, priorité remplis | 201, billet retourné avec id, statut "Ouvert" | Réussi |
| 2 | Titre vide | titre: "" | 400, "Le titre est obligatoire." | Réussi |
| 3 | Titre composé uniquement d'espaces | titre: "   " | 400, "Le titre est obligatoire." | Réussi |
| 4 | Titre absent du corps de la requête | pas de champ titre | 400, "Le titre est obligatoire." | Réussi |
| 5 | Description vide | description: "" | 400, "La description est obligatoire." | Réussi |
| 6 | Description absente | pas de champ description | 400, "La description est obligatoire." | Réussi |
| 7 | Catégorie vide | categorie: "" | 400, "La catégorie est obligatoire." | Réussi |
| 8 | Catégorie absente | pas de champ categorie | 400, "La catégorie est obligatoire." | Réussi |
| 9 | Priorité absente | pas de champ priorite | 201, billet créé avec priorite: "" | Réussi |
| 10 | Espaces en début/fin de titre, description, catégorie | "  Titre  " | Champs enregistrés sans les espaces (trim) | Réussi |
| 11 | Identifiants uniques et croissants | plusieurs créations successives | id auto-incrémenté à chaque billet | Réussi |
| 12 | Statut par défaut | tout billet créé | statut = "Ouvert" | Réussi |
| 13 | Date de création renseignée | tout billet créé | dateCreation au format ISO 8601 | Réussi |
| 14 | Persistance après redémarrage du serveur | redémarrer node index.js | les billets existants restent en base, id continue d'augmenter | Réussi |
| 15 | Accents et caractères spéciaux conservés | description: "ne répond pas" | valeur retournée identique, sans corruption d'encodage | Réussi |

### Client (formulaire de création)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 16 | Statut du serveur affiché au chargement | ouvrir la page | "Statut du serveur : Serveur opérationnel" | Réussi |
| 17 | Soumission valide | tous les champs remplis, clic sur "Créer le billet" | message "Billet #X créé avec succès." affiché | Réussi |
| 18 | Réinitialisation après succès | après soumission valide | tous les champs du formulaire redeviennent vides | Réussi |
| 19 | Soumission avec titre vide | titre laissé vide | message d'erreur "Le titre est obligatoire." affiché | Réussi |
| 20 | Soumission avec description vide | description laissée vide | message d'erreur "La description est obligatoire." affiché | À faire |
| 21 | Soumission avec catégorie non choisie | catégorie laissée sur "-- Choisir --" | message d'erreur "La catégorie est obligatoire." affiché | À faire |
| 22 | Sélection de chaque catégorie (Bug, Amélioration, Question, Autre) | choisir chaque option | valeur correctement envoyée et enregistrée | À faire |
| 23 | Sélection de chaque priorité (Basse, Moyenne, Haute) | choisir chaque option | valeur correctement envoyée et enregistrée | À faire |
| 24 | Serveur injoignable | serveur Express arrêté | "Impossible de joindre le serveur" affiché | À faire |
| 25 | Créations successives | soumettre plusieurs billets à la suite | chaque billet créé avec un id distinct, formulaire fonctionnel à chaque fois | À faire |

---

## Fonctionnalité 2 — Affichage de la liste des billets

### Serveur (route GET /billets)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 26 | Liste vide | aucun billet en base | 200, tableau vide [] | Réussi |
| 27 | Liste après une création | un billet créé | tableau contenant ce billet | Réussi |
| 28 | Tri du plus récent au plus ancien | plusieurs billets créés | le dernier créé apparaît en premier | Réussi |
| 29 | Champs complets pour chaque billet | tout billet en base | id, titre, description, categorie, priorite, statut, dateCreation présents | Réussi |
| 30 | Nombre d'éléments retournés | plusieurs créations successives | le tableau contient exactement le nombre de billets créés | Réussi |

### Client (composant ListeBillets)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 31 | Aucun billet | base vide | message "Aucun billet pour le moment." affiché | Réussi |
| 32 | Affichage au chargement | ouvrir la page | tableau visible avec les colonnes Titre, Description, Catégorie, Priorité, Statut | Réussi |
| 33 | Mise à jour automatique après création | créer un billet via le formulaire | le nouveau billet apparaît en première ligne sans rechargement de page | Réussi |
| 34 | Nombre de lignes correct | plusieurs billets en base | nombre de lignes du tableau = nombre de billets en base | Réussi |
| 35 | Données affichées fidèles à la saisie | créer un billet avec des valeurs précises | les valeurs du tableau correspondent exactement à celles saisies dans le formulaire | Réussi |

---

## Fonctionnalité 3 — Modification d'un billet existant

### Serveur (route PUT /billets/:id)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 36 | Modification valide | id existant, tous les champs valides | 200, billet retourné avec les nouvelles valeurs | Réussi |
| 37 | Titre vide en modification | titre: "" | 400, "Le titre est obligatoire." | Réussi |
| 38 | Description vide en modification | description: "" | 400, "La description est obligatoire." | Réussi |
| 39 | Catégorie vide en modification | categorie: "" | 400, "La catégorie est obligatoire." | Réussi |
| 40 | Id inexistant | id: 99999 | 404, "Billet introuvable.", aucune donnée modifiée | Réussi |
| 41 | Le statut et la date de création ne changent pas | modification des autres champs | statut et dateCreation identiques à avant la modification | À faire |

### Client (mode édition du formulaire)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 42 | Préremplissage du formulaire | clic sur "Modifier" d'un billet | tous les champs affichent les valeurs actuelles du billet | Réussi |
| 43 | Titre du formulaire en mode édition | clic sur "Modifier" | titre "Modifier le billet #X" et bouton "Enregistrer les modifications" | Réussi |
| 44 | Modification réussie | changer les champs, cliquer sur "Enregistrer les modifications" | message "Billet #X modifié avec succès." affiché, liste mise à jour | Réussi |
| 45 | Retour en mode création après succès | après une modification réussie | le formulaire redevient "Créer un billet", champs vides | Réussi |
| 46 | Bouton Annuler | clic sur "Annuler" en cours de modification | retour au mode création, champs vidés, aucune requête envoyée au serveur | Réussi |
| 47 | Message d'erreur en modification | vider le titre puis "Enregistrer les modifications" | message "Le titre est obligatoire." affiché, formulaire reste en mode édition | Réussi |

---

## Fonctionnalité 4 — Changement de statut

### Serveur (route PATCH /billets/:id/statut)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 48 | Changement valide | statut: "En cours" | 200, billet retourné avec le nouveau statut | Réussi |
| 49 | Statut invalide | statut: "Abandonné" | 400, "Statut invalide.", statut inchangé en base | Réussi |
| 50 | Id inexistant | id: 99999 | 404, "Billet introuvable." | Réussi |
| 51 | Les autres champs ne changent pas | changement de statut uniquement | titre, description, catégorie, priorité identiques après | À faire |
| 52 | Les 4 statuts valides acceptés | Ouvert, En cours, Résolu, Fermé | chacun accepté et enregistré correctement | À faire |

### Client (sélecteur de statut dans la liste)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 53 | Sélecteur affiché par billet | ouvrir la liste | menu déroulant avec le statut actuel présélectionné | Réussi |
| 54 | Changement de statut depuis la liste | choisir une nouvelle valeur dans le menu | le statut se met à jour sans rechargement de page | Réussi |
| 55 | Persistance après rechargement | changer le statut puis recharger la page (F5) | le nouveau statut reste affiché (confirmé en base SQLite) | Réussi |
| 56 | Cycle complet des statuts | passer successivement par Résolu, Fermé, Ouvert | chaque changement est pris en compte correctement | Réussi |

---

## Fonctionnalité 5 — Suppression d'un billet

### Serveur (route DELETE /billets/:id)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 57 | Suppression valide | id existant | 200, "Billet supprimé avec succès.", billet retiré de la base | Réussi |
| 58 | Id déjà supprimé | supprimer deux fois le même id | 404, "Billet introuvable." la deuxième fois | Réussi |
| 59 | Id inexistant | id: 99999 | 404, "Billet introuvable." | Réussi |
| 60 | Billet absent de la liste après suppression | GET /billets après suppression | le billet supprimé n'apparaît plus | Réussi |

### Client (bouton Supprimer dans la liste)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 61 | Boîte de confirmation affichée | clic sur "Supprimer" | message "Supprimer le billet "X" ?" affiché avant toute suppression | Réussi |
| 62 | Annulation de la confirmation | clic sur "Supprimer" puis annuler | aucune requête envoyée, billet toujours dans la liste | Réussi |
| 63 | Suppression confirmée | clic sur "Supprimer" puis confirmer | message "Billet supprimé avec succès." affiché, billet retiré de la liste | Réussi |
| 64 | Persistance après rechargement | recharger la page (F5) après suppression | le billet supprimé ne réapparaît pas | Réussi |
| 65 | Suppression du billet en cours de modification | supprimer un billet pendant qu'il est affiché dans le formulaire d'édition | le formulaire revient en mode création | À faire |

---

## Fonctionnalité 6 — Recherche par mot-clé

### Serveur (route GET /billets?recherche=...)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 66 | Recherche correspondant au titre | recherche="connexion" | seuls les billets dont le titre contient "connexion" sont retournés | Réussi |
| 67 | Recherche correspondant à la description | recherche="réinitialiser" (présent seulement en description) | le billet correspondant est retourné | Réussi |
| 68 | Recherche insensible à la casse | recherche="BOUTON" | correspond aussi à "bouton" en minuscules | Réussi |
| 69 | Aucun résultat | recherche="xyzabc" | tableau vide [] | Réussi |
| 70 | Recherche vide ou absente | recherche="" ou paramètre omis | retourne tous les billets, comme la liste normale | Réussi |

### Client (champ de recherche dans l'onglet Liste)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 71 | Filtrage en direct | taper un mot-clé dans le champ | la liste se met à jour automatiquement, sans bouton "Rechercher" | Réussi |
| 72 | Aucun résultat | mot-clé introuvable | message "Aucun billet pour le moment." affiché | Réussi |
| 73 | Effacement du champ | vider le champ de recherche | tous les billets réapparaissent | Réussi |

---

## Fonctionnalité 7 — Filtrage par statut et par priorité

### Serveur (route GET /billets?statut=...&priorite=...)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 74 | Filtre par statut seul | statut="En cours" | seuls les billets avec ce statut sont retournés | Réussi |
| 75 | Filtre par priorité seule | priorite="Haute" | seuls les billets avec cette priorité sont retournés | Réussi |
| 76 | Combinaison statut + priorité | statut="Résolu" et priorite="Haute" | seuls les billets correspondant aux deux critères | Réussi |
| 77 | Combinaison recherche + priorité | recherche="Filtre" et priorite="Basse" | les trois filtres se combinent (ET logique) | Réussi |
| 78 | Statut invalide en filtre | statut="Abandonné" | 400, "Statut invalide." | Réussi |
| 79 | Aucun filtre | ni statut ni priorité fournis | retourne tous les billets | Réussi |

### Client (menus déroulants Statut/Priorité dans l'onglet Liste)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 80 | Filtrage par statut | choisir "Résolu" dans le menu | la liste se met à jour, seuls les billets "Résolu" affichés | Réussi |
| 81 | Filtrage par priorité | choisir "Haute" dans le menu | la liste se met à jour, seuls les billets "Haute" affichés | Réussi |
| 82 | Combinaison sans résultat | statut="Fermé" + priorité="Haute" (aucun billet ne correspond) | message "Aucun billet pour le moment." affiché | Réussi |
| 83 | Réinitialisation des filtres | remettre les deux menus sur leur valeur par défaut | tous les billets réapparaissent | Réussi |

---

## À venir

Les fonctionnalités du Livrable 1 sont maintenant toutes complétées. Les tests des fonctionnalités du Livrable 2 seront ajoutés ici au fur et à mesure de leur développement.
