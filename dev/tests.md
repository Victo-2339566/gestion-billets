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
| 9 | Priorité absente | pas de champ priorite | 400, "La priorité est obligatoire." (règle ajoutée à la fonctionnalité 5 du Livrable 2) | Réussi |
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
| 20 | Soumission avec description vide | description laissée vide | message d'erreur "La description est obligatoire." affiché | Réussi |
| 21 | Soumission avec catégorie non choisie | catégorie laissée sur "-- Choisir --" | message d'erreur "La catégorie est obligatoire." affiché | Réussi |
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

## Fonctionnalité bonus — Suggestion catégorie/priorité par IA locale (Ollama)

### Serveur (route POST /billets/suggestion)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 84 | Suggestion pour un bug évident | titre/description décrivant un bug | catégorie "Bug" retournée | Réussi |
| 85 | Suggestion pour une amélioration | titre/description décrivant une demande de fonctionnalité | catégorie "Amélioration" retournée | Réussi |
| 86 | Suggestion pour une question | titre/description formulant une question | catégorie "Question" retournée | Réussi |
| 87 | Priorité selon l'urgence | description signalant une panne totale et urgente | priorité "Haute" retournée | Réussi |
| 88 | Champ titre ou description manquant | un des deux champs absent | 400, "Le titre et la description sont requis pour la suggestion." | Réussi |

### Client (bouton "Suggérer catégorie/priorité (IA)")

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 89 | Suggestion appliquée aux champs | remplir titre/description, cliquer sur le bouton | les menus déroulants Catégorie et Priorité se remplissent avec la suggestion | Réussi |
| 90 | Message pendant le chargement | clic sur le bouton | texte du bouton change pour "Suggestion en cours..." pendant l'appel | Réussi |
| 91 | Champs vides | cliquer sur le bouton sans titre ni description | message d'erreur affiché, aucun appel à l'IA | Réussi |

---

## Fonctionnalité bonus — Génération titre/description par IA locale (Ollama) [RETIRÉE]

> Fonctionnalité retirée du projet le 30/07/2026 (jugée redondante avec la saisie manuelle du titre/description). Route `POST /billets/reformulation`, champ "phrase courte" et bouton associés supprimés du code. Cas conservés ici à titre d'historique.

### Serveur (route POST /billets/reformulation)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 92 | Génération à partir d'une phrase courte | texte="clavier ne fonctionne pas" | titre et description cohérents retournés | Retiré |
| 93 | Génération à partir d'une autre phrase | texte="imprimante hors ligne depuis ce matin" | titre et description cohérents retournés | Retiré |
| 94 | Champ texte manquant ou vide | texte="" ou absent | 400, "Décris brièvement le problème avant de générer." | Retiré |

### Client (champ "phrase courte" + bouton "Générer titre et description (IA)")

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 95 | Génération appliquée aux champs | taper une phrase courte, cliquer sur le bouton | les champs Titre et Description se remplissent avec le résultat | Retiré |
| 96 | Réinitialisation du champ phrase après succès | après une génération réussie | le champ "phrase courte" se vide | Retiré |
| 97 | Champ vide | cliquer sur le bouton sans rien écrire | message d'erreur affiché, aucun appel à l'IA | Retiré |
| 98 | Absent en mode modification | ouvrir un billet existant pour le modifier | le champ phrase courte et son bouton n'apparaissent pas | Retiré |

---

## Fonctionnalité bonus — Dépannage de niveau 1 par IA locale (Ollama)

### Serveur (route POST /billets/depannage)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 99 | Étapes proposées pour un problème matériel | titre/description décrivant une imprimante hors service | 3 à 5 étapes de dépannage plausibles retournées | Réussi |
| 100 | Étapes proposées pour un problème réseau | titre/description décrivant une panne wifi | étapes retournées, cohérentes avec le contexte | Réussi |
| 101 | Champ titre ou description manquant | un des deux champs absent | 400, "Le titre et la description sont requis pour le dépannage." | Réussi |

### Client (bouton "Voir des solutions de dépannage (IA)" + popup)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 102 | Étapes affichées dans une popup | remplir titre/description, cliquer sur le bouton | popup affichée avec une liste numérotée d'étapes | Réussi |
| 103 | Fermeture via le bouton × | clic sur le × de la popup | popup se ferme, formulaire intact | Réussi |
| 104 | Fermeture via le fond assombri | clic en dehors de la popup | popup se ferme, formulaire intact | Réussi |
| 105 | Champs conservés après fermeture | fermer la popup | titre/description saisis restent inchangés | Réussi |
| 106 | Champs vides | cliquer sur le bouton sans titre ni description | message d'erreur affiché, aucun appel à l'IA | Réussi |
| 107 | Absent en mode modification | ouvrir un billet existant pour le modifier | le bouton de dépannage n'apparaît pas | Réussi |

---

## Livrable 2 — Fonctionnalité 1 : Sélecteur de vue Admin/Utilisateur

### Client (boutons Utilisateur/Admin en haut de page)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 108 | Rôle par défaut au chargement | ouvrir la page | "Utilisateur" est actif par défaut | Réussi |
| 109 | Bascule vers Admin | clic sur "Admin" | "Admin" devient actif, "Utilisateur" redevient inactif | Réussi |
| 110 | Bascule vers Utilisateur | clic sur "Utilisateur" depuis Admin | "Utilisateur" redevient actif | Réussi |

---

## Livrable 2 — Fonctionnalité 2 : Vue Utilisateur limitée (création + consultation)

### Client (restrictions selon le rôle actif)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 111 | Recherche visible en vue Utilisateur | rôle Utilisateur, onglet Liste | champ de recherche par mot-clé visible | Réussi |
| 112 | Filtres avancés cachés en vue Utilisateur | rôle Utilisateur, onglet Liste | menus statut/priorité absents | Réussi |
| 113 | Actions cachées en vue Utilisateur | rôle Utilisateur, onglet Liste | boutons Modifier/Supprimer absents, statut affiché en texte simple | Réussi |
| 114 | Filtres visibles en vue Admin | rôle Admin, onglet Liste | menus statut/priorité affichés | Réussi |
| 115 | Actions visibles en vue Admin | rôle Admin, onglet Liste | boutons Modifier/Supprimer présents, statut modifiable via menu déroulant | Réussi |

---

## Livrable 2 — Fonctionnalité 4 : Statistiques simples (nombre de billets par statut)

### Client (onglet Accueil)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 116 | Décompte par statut affiché | ouvrir l'onglet Accueil | une carte par statut (Ouvert, En cours, Résolu, Fermé) avec le bon nombre | Réussi |
| 117 | Total cohérent avec la somme des statuts | ouvrir l'onglet Accueil | la somme des 4 cartes égale le nombre total affiché | Réussi |
| 118 | Indépendance des filtres de la liste | appliquer un filtre statut sur l'onglet Liste, puis revenir à Accueil | les statistiques affichent toujours le total réel, non filtré | Réussi |

---

## Livrable 2 — Fonctionnalité 2 (révisée) : Vue Utilisateur limitée à la création

> Portée révisée : la vue Utilisateur ne donne plus accès aux onglets Accueil et Liste des billets (initialement prévu "création + consultation"). Seul l'onglet "Créer un billet" reste visible pour ce rôle.

### Client (navigation par onglets selon le rôle)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 119 | Un seul onglet en vue Utilisateur | rôle Utilisateur (par défaut) | seul "Créer un billet" est visible dans la navigation | Réussi |
| 120 | Trois onglets en vue Admin | basculer vers Admin | Accueil, Créer un billet et Liste des billets sont tous visibles | Réussi |
| 121 | Retour forcé vers Création | depuis Admin sur un autre onglet, rebasculer vers Utilisateur | l'onglet actif redevient automatiquement "Créer un billet" | Réussi |

---

## Livrable 2 — Fonctionnalité 5 : Amélioration de l'interface et validation des formulaires

### Serveur (services/billetService.js)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 122 | Priorité vide en création | priorite: "" | 400, "La priorité est obligatoire." | Réussi |
| 123 | Priorité vide en modification | priorite: "" (PUT) | 400, "La priorité est obligatoire." | Réussi |

### Client (formulaire de création/modification)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 124 | Soumission d'un formulaire entièrement vide | clic sur "Créer le billet" sans rien remplir | 4 messages d'erreur affichés (un par champ obligatoire), champs bordés en rouge | Réussi |
| 125 | Aucun appel réseau si validation échoue | soumettre un formulaire invalide | aucune requête envoyée au serveur (validation bloquée côté client) | Réussi |
| 126 | Correction d'un seul champ | remplir uniquement le titre après une soumission vide | le message d'erreur du titre disparaît, les 3 autres restent affichés | Réussi |
| 127 | Astérisque sur les champs obligatoires | ouvrir le formulaire | Titre, Description, Catégorie et Priorité affichent un astérisque rouge | Réussi |
| 128 | Soumission valide après correction complète | remplir tous les champs puis soumettre | billet créé normalement, aucune erreur affichée | Réussi |
| 129 | Erreurs réinitialisées après succès | créer un billet avec succès, puis rouvrir le formulaire vide | aucun message d'erreur résiduel affiché | Réussi |

---

## Amélioration — Bascule thème sombre/clair

### Client (bouton icône en haut à droite de l'écran)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 130 | Thème sombre par défaut au chargement | ouvrir la page | fond sombre, icône ☀️ affichée (proposant de passer au clair) | Réussi |
| 131 | Bascule vers le thème clair | clic sur le bouton icône | fond de page ET fond des cartes deviennent clairs, texte reste lisible, icône devient 🌙 | Réussi |
| 132 | Retour au thème sombre | clic sur le bouton icône depuis le thème clair | fond redevient sombre comme au départ, icône redevient ☀️ | Réussi |
| 133 | Thème clair cohérent sur tous les onglets | basculer en clair, visiter Accueil, Créer un billet, Liste des billets | les trois vues affichent le thème clair sans zones oubliées | Réussi |
| 134 | Bouton indépendant du sélecteur de rôle | ouvrir la page | le bouton de thème est isolé en haut à droite, séparé des boutons Utilisateur/Admin | Réussi |

---

## Amélioration — Cartes de statistiques agrandies

### Client (onglet Accueil)

| # | Description | Entrée | Résultat attendu | Statut |
|---|---|---|---|---|
| 135 | Cartes occupant toute la largeur disponible | ouvrir l'onglet Accueil | les 4 cartes de statuts se répartissent également sur toute la largeur de la carte "Bienvenue" | Réussi |

---

## À venir

Les fonctionnalités des Livrables 1 et 2 sont maintenant toutes complétées.
