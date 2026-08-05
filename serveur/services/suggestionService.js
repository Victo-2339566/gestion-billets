const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODELE = 'qwen2.5:7b';

const CATEGORIES_VALIDES = ['Bug', 'Amélioration', 'Question', 'Autre'];
const PRIORITES_VALIDES = ['Basse', 'Moyenne', 'Haute'];

// Ramène la réponse de l'IA vers une des valeurs valides connues
// (l'IA peut renvoyer une casse ou un accent différent), avec un repli par défaut
function normaliser(valeur, valeursValides, valeurParDefaut) {
    const trouve = valeursValides.find(
        (v) => v.toLowerCase() === String(valeur ?? '').toLowerCase().trim()
    );
    return trouve || valeurParDefaut;
}

// Envoie un prompt à l'IA locale (Ollama) et retourne l'objet JSON de sa réponse
async function appelerOllama(prompt) {
    const reponse = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODELE,
            prompt,
            stream: false,
            format: 'json',
        }),
    });

    if (!reponse.ok) {
        throw new Error("Impossible de joindre l'IA locale (Ollama).");
    }

    const donnees = await reponse.json();
    return JSON.parse(donnees.response);
}

// Demande à l'IA locale de suggérer une catégorie et une priorité
async function suggererCategorieEtPriorite(titre, description) {
    const prompt = `Tu es un assistant qui classe des billets de support informatique.

Titre : ${titre}
Description : ${description}

Catégories possibles : Bug, Amélioration, Question, Autre
Priorités possibles : Basse, Moyenne, Haute

Réponds uniquement avec un objet JSON de cette forme, sans texte autour :
{"categorie": "...", "priorite": "..."}`;

    const suggestion = await appelerOllama(prompt);

    return {
        categorie: normaliser(suggestion.categorie, CATEGORIES_VALIDES, 'Autre'),
        priorite: normaliser(suggestion.priorite, PRIORITES_VALIDES, 'Moyenne'),
    };
}

// Demande à l'IA locale de proposer des étapes de dépannage de base, avant de créer un billet
async function proposerDepannage(titre, description) {
    const prompt = `Tu es un technicien de support informatique de niveau 1.

Titre : ${titre}
Description : ${description}

Propose entre 3 et 5 étapes de dépannage de base, simples et sans risque, que l'utilisateur peut essayer lui-même avant de contacter le support technique (ex. redémarrer l'appareil, vérifier les branchements, relancer l'application). N'invente pas de détails techniques précis non mentionnés, et ne propose rien de risqué (pas de manipulation du registre, pas de suppression de fichiers système).

Réponds uniquement avec un objet JSON de cette forme, sans texte autour :
{"etapes": ["étape 1", "étape 2", "étape 3"]}`;

    const resultat = await appelerOllama(prompt);
    const etapes = Array.isArray(resultat.etapes) ? resultat.etapes : [];

    return { etapes: etapes.map((etape) => String(etape).trim()).filter(Boolean) };
}

module.exports = { suggererCategorieEtPriorite, proposerDepannage };
