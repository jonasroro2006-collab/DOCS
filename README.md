# ProDoc IA V6 — Client + Admin privé

## Ce que fait cette version
### Client
- Crée un CV, une lettre de motivation, un devis ou une lettre professionnelle.
- Ajoute une photo au CV.
- Reçoit un numéro de demande `PD-XXXXXX`.
- Suit sa demande avec ce numéro.
- Quand le document est prêt, voit le prix et le lien de paiement.
- Signale qu'il a payé.
- Le PDF reste bloqué jusqu'à la confirmation de l'administrateur.

### Administrateur
L'accès n'est PAS affiché sur la page publique.

Pour ouvrir l'espace admin, ajoute `?admin=1` à l'adresse du site.
Exemple :
`https://TON-COMPTE.github.io/TON-DEPOT/?admin=1`

Mot de passe configuré : `9512369`.

Dans l'admin :
- voir les demandes ;
- ouvrir les informations ;
- mettre en traitement ;
- marquer prêt ;
- définir le prix ;
- enregistrer/générer le lien de paiement ;
- ajouter le PDF ;
- confirmer le paiement ;
- marquer le document envoyé ;
- archiver une demande terminée ;
- supprimer définitivement une demande.

## Base de données
Le code est prêt à utiliser Supabase si `supabaseUrl` et `supabaseKey` sont renseignés dans `app.js`.
Sans Supabase, il utilise `localStorage` : les données restent uniquement dans le navigateur.

### Installation Supabase
1. Crée un projet Supabase.
2. Exécute `supabase.sql` dans SQL Editor.
3. Mets l'URL et la clé anon du projet dans `app.js`.
4. Pour une vraie sécurité admin, utilise Supabase Auth/RLS ou un backend/Edge Function. Le mot de passe écrit dans JavaScript ne doit pas être considéré comme une protection forte.

## Paiement
Le paiement Wave reste manuel dans cette version :
- l'admin renseigne le montant et le lien ;
- le client paie ;
- le client clique sur « J'ai effectué le paiement » ;
- l'admin vérifie son Wave Business et confirme.

Aucune confirmation automatique de Wave n'est prétendue sans API.

## GitHub Pages
Décompresse le ZIP et envoie les fichiers à la racine du dépôt :
`index.html`, `styles.css`, `app.js`, `manifest.json`, `sw.js`, `supabase.sql`, `README.md`.
