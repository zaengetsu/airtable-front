# Airtable Frontend

## Description
Frontend de l'application de gestion de projets ESGI, développé avec Next.js, TypeScript et Tailwind CSS. Cette application permet aux utilisateurs de visualiser, créer et gérer des projets, avec une interface moderne et responsive.

## Liens du projet
- Frontend (ce repository) : https://github.com/zaengetsu/airtable-front
- Backend : https://github.com/zaengetsu/airtable-back

## Fonctionnalités
- Authentification (connexion/déconnexion)
- Visualisation des projets
- Création et modification de projets (pour les admins et auteurs)
- Interface responsive
- Intégration avec l'API backend

## Technologies utilisées
- Next.js
- TypeScript
- Tailwind CSS
- NextAuth.js pour l'authentification
- Heroicons pour les icônes
- React Query pour la gestion des données

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/zaengetsu/airtable-front.git
cd airtable-front
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application en mode développement :
```bash
npm run dev
```

L'application démarrera sur le port 3000.

## Structure de l'application

### Pages principales
- `/` - Page d'accueil avec la liste des projets
- `/projects/[projectID]` - Détails d'un projet
- `/dashboard` - Tableau de bord admin
- `/login` - Page de connexion

### Composants principaux
- `ProjectCard` - Carte de présentation d'un projet
- `ProjectForm` - Formulaire de création/modification de projet
- `CommentSection` - Section des commentaires
- `AuthProvider` - Gestion de l'authentification

## Compte test
Pour tester l'application, vous pouvez utiliser le compte admin suivant :
- Username : zango
- Password : mespotes

## Membres du projet
- Leonce Yopa

## Design
- Interface moderne et responsive
- Utilisation de Tailwind CSS pour le style
- Composants réutilisables
- Design system cohérent


