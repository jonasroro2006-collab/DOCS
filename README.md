# ProDoc IA V5 — espace admin privé

## Accès public
Le bouton Admin n'est plus affiché sur la page publique.
Pour ouvrir la connexion administrateur, utilise ton URL avec `?admin=1`.

Mot de passe configuré : `9512369`.

## Gestion des demandes
- En attente
- En traitement
- Prêt
- Lien de paiement envoyé
- Paiement signalé
- Paiement confirmé
- Document envoyé
- **Archiver** une demande traitée : elle reste enregistrée mais disparaît de la liste active.
- **Supprimer** une demande : suppression définitive.

## Important sur la sécurité
GitHub Pages exécute uniquement du JavaScript côté navigateur. Un mot de passe écrit dans `app.js` n'est donc pas une sécurité forte : quelqu'un de technique peut voir le code source. Cette V5 cache l'accès Admin aux visiteurs ordinaires et ajoute une session navigateur, mais pour que **toi seul** sois réellement autorisé à gérer les demandes, il faut utiliser une authentification serveur/Supabase Auth et des règles RLS correctes.

La version actuelle utilise Supabase si `supabaseUrl` et `supabaseKey` sont configurés. Ne laisse pas une politique Supabase « allow all » en production.
