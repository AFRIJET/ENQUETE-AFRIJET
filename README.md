Projet : Application d'enquête client

Il s'agit d'une application d'enquête auprès des clients conçue pour recueillir les avis des utilisateurs concernant leur expérience avec la compagnie aérienne Afrijet. 
L'objectif est d'améliorer la satisfaction des clients en analysant les données collectées et en améliorant les services en fonction des retours.

Caractéristiques du projet :
- Interface conviviale : un frontal simple et intuitif construit avec React JS et Tailwind CSS.
- Enquêtes en temps réel : les clients peuvent répondre à différents enquêtes notamment l'enquete en agence, au comptoire d'escale, en vol et une enquete dédiée aux entreprises partenaires
  sur divers aspects et services de la compagnie aérienne.
- Gestion du backend : un backend sécurisé construit à l'aide de node JS et Express JS pour meilleur compatibilité, garantissant une collecte et un stockage efficaces des données.
- SGBD : La base de données opté pour ce projet est une BD NoSQL notamment MongoDB via son cloud MongoDB Atlas.
- Plateforme d'administration : les administrateurs peuvent voir les résultats des enquêtes sous forme de tableau de bord, générer des rapports, exporter les données sous différentes formes,
  créer des utilisateurs et analyser les donnnées pour prendre des décisions.
- Multi-plateforme : l'application est responsive Design et fonctionne à la fois sur les plates-formes de bureau et mobiles mais le choix se porte plus sur la plateforme web mobile
  accessible via le navigateur grace à un QrCode.

  Stack Technique :
- Frontend: React (Vite), Tailwind CSS, Framer Motion
- Backend: Node JS, Express JS
- Database: MongoDB (NoSQL)
- Hébergement du projet: Render pour le deploiment
- Solution Cloud: MongoDB Atlas pour stocker la BD
- Authentication: MongoDB authentification pour accéder au cloud

Commencer le projet
Conditions préalables
Pour exécuter ce projet, vous aurez besoin des outils suivants installés sur votre machine :
- Node.js (version 16 ou supérieure) : pour installer les dépendances
- Git : pour cloner le projet
- Un compte MongoDB Atlas

Installation : 
- Cloner le dépot:
git clone https://github.com/AFRIJET/ENQUETE-AFRIJET.git
cd BackEnd
- Installer les dépendances du package.json du BackEnd:
npm install
- Changer de dossier:
cd ..
cd FrontEnd
- Installer les dépendances du package.json du FrontEnd:
npm install
- Démarrer le FrontEnd
npm start
- Lancer l'application:
npm run dev
Cliquez sur le lien suivant pour accéder à l'app http://localhost:3000.

Usage :
Les clients peuvent accéder à la page d'enquête via un QrCode, répondre aux questions et soumettre leurs avis.
Les administrateurs peuvent se connecter à la plateforme d'administration pour voir les résultats de l'enquête et télécharger des données pour une analyse plus approfondie.

Contribuer
Pour participer au projet ! Veuillez cloner le référentiel et créer une pull request avec vos modifications sur la branche test. Assurez-vous que votre code suit le guide de style et est bien documenté.

Licence
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

Contact
Pour toute informations complémentaires, n'hésitez pas à me contacter via mon mail afrijetcamit@gmail.com.
