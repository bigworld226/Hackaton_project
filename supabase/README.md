# Configuration Supabase de Common

Je n'ai pas accès au tableau de bord Supabase de ton compte depuis cette session. Le script [schema.sql](schema.sql) prépare le schéma, les politiques RLS, les fonctions SQL, le bucket d'avatars et le challenge mensuel de Dakar.

## Installation

1. Crée un projet dans Supabase et attends que la base soit prête.
2. Ouvre **SQL Editor > New query** dans le tableau de bord.
3. Copie le contenu de `schema.sql` et exécute-le une seule fois sur ce nouveau projet. Le script crée les tables, les index, les triggers et les policies RLS.
4. Dans **Authentication > URL Configuration**, définis l'URL de ton application et ajoute les URL locales de développement dans les redirect URLs.
5. Dans **Project Settings > API**, récupère l'URL du projet et la clé publishable (ou l'ancienne clé `anon`).
6. À la racine du projet, crée `.env.local` :

```env
VITE_SUPABASE_URL=https://TON-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=TA_CLE_PUBLISHABLE_OU_ANON
```

7. Vérifie que `.env.local` est ignoré par Git. Ces clés frontend sont publiques : la protection repose sur les policies RLS. **Ne place jamais la clé `service_role` dans l'application ou dans une variable `VITE_`.**
8. Ajoute le client JavaScript au projet :

```bash
npm install @supabase/supabase-js
```

Puis crée un client dans `src/lib/supabase.ts` :

```ts
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Les variables Supabase sont absentes de .env.local')
}

export const supabase = createClient(url, anonKey)
```

Redémarre Vite après avoir créé ou modifié `.env.local`.

## Ce que prépare le schéma

- Authentification Supabase Auth ; un trigger crée automatiquement `profiles` après une inscription.
- Profils, préférences, confidentialité, abonnements et positions cartographiques approximatives.
- Publications, commentaires, réactions, discussions et réponses.
- Coding Rooms, participants, messages de salle, conversations privées et notifications.
- Quiz, questions, choix, tentatives et score calculé côté SQL. Les bonnes réponses ne sont pas directement lisibles par les joueurs.
- Badges, registre de points, classements global/mensuel, challenge local et votes uniques.
- Bucket Storage `avatars`, limité aux images et aux dossiers appartenant à l'utilisateur.
- RLS sur les tables, accès public limité aux données publiables et fonctions dédiées à la carte et aux profils publics.

## Données de démonstration

Le script insère les définitions de badges et un challenge mensuel pour Dakar. Il **ne crée pas de faux utilisateurs** : les identifiants doivent venir de Supabase Auth, et les profils sont créés par le trigger. Les finalistes, scores techniques et points doivent être alimentés par des actions vérifiées côté serveur (Edge Functions ou fonctions SQL), pas par des écritures libres du client.

Les données actuellement codées dans `src/data/*.ts` ne sont pas importées automatiquement par ce script. Après avoir exécuté le SQL et configuré les clés, il faudra remplacer progressivement les fonctions de démonstration par des requêtes Supabase, en commençant par l'inscription/profil, puis forums, carte, messages et quiz.

Pour autoriser un profil à apparaître sur la carte, l'utilisateur doit choisir une position approximative, régler `map_visibility` sur `visible` et avoir un profil public. La fonction `get_nearby_developers` ne retourne que les champs nécessaires et arrondit les coordonnées.
