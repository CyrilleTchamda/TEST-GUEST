# 📦 Guest Markets — Mini Système de Gestion de Commandes

Ce projet est une solution full-stack complète pour enregistrer, suivre et gérer des commandes clients. Il a été conçu avec la stack **React + Node.js (Express) + Sequelize + MySQL** en respectant l'identité visuelle de **Guest Markets** (Bleu de marque, Rouge fort d'accent, Blanc/Gris épuré).

---

## 🚀 Démarrage Rapide

Pour lancer le projet complet, suivez ces étapes :

### Étape 1 : Base de données MySQL

1. Démarrez votre serveur MySQL (WAMP, XAMPP, Laragon ou Docker).

2. Créez une base de données vide nommée :

```sql
CREATE DATABASE guest_markets;
```

### Étape 2 : Lancer le Backend

1. Ouvrez un terminal dans le dossier `backend` :

```bash
cd backend
npm install
npm run dev
```

2. Le serveur va démarrer sur le port `8080`, synchroniser automatiquement les tables Sequelize, et insérer les **4 commandes de démonstration initiales**.

### Étape 3 : Lancer le Frontend

1. Ouvrez un nouveau terminal dans le dossier du frontend (`frontend/mon-ascenseur`) :

```bash
cd frontend/gs-stock
npm install
npm run dev
```

2. L'application est maintenant disponible sur **http://localhost:5173**.

---

## 📁 Architecture du Projet

Le code est rigoureusement structuré en respectant les consignes de séparation des responsabilités :

### 🔹 Backend (`/backend`)

- **`config/dbConfig.js`** : Paramètres de connexion MySQL.
- **`models/`** : Modèles de données avec Sequelize (`commande.model.js`).
- **`controllers/commande.controller.js`** : Logique métier (CRUD complet, calculs automatiques de montants, génération de références uniques, agrégats KPIs).
- **`routes/commande.routes.js`** : Déclaration des points d'entrée (Endpoints REST).
- **`index.js`** : Point d'entrée, middlewares CORS, initialisation et seed initial.

### 🔹 Frontend (`/frontend/gs-stock`)

- **`src/api/`** et **`src/services/`** : Services d'appels API encapsulés dans des modules isolés (`commandeService.js`).
- **`src/utils/`** : Utilitaires de calculs (chiffre d'affaires) et de formatages (dates, prix en FCFA).
- **`src/components/`** : Composants atomiques réutilisables (`Sidebar`, `Badge`, `Dashboard`, `OrderForm`, `OrderList`, `StatusFilter`).
- **`src/index.css`** : Design system global basé sur des variables CSS de la palette Guest Markets.

---

## 💡 Choix Techniques & Justifications

1. **Sequelize ORM & MySQL** : Pour un projet robuste, Sequelize permet de s'assurer de la cohérence de la structure de données directement par le code (modèles), et d'éviter les requêtes SQL brutes sujettes aux injections.
2. **Calcul du Chiffre d'Affaires & Montants côté Serveur** :
   - Les montants totaux (`quantite` * `prixUnitaire`) sont calculés côté serveur à la création/modification pour garantir l'intégrité de la donnée financière.
   - Les commandes avec le statut `Annulée` sont exclues du chiffre d'affaires.

3. **Formulaires avec validation stricte** :
   - Bloque la validation côté client et côté serveur si le nom du client/produit est vide ou si la quantité/prix unitaire est inférieur ou égal à 0.

4. **Interaction directe et réactive** :
   - Modification du statut des commandes directement depuis le tableau via un menu déroulant dynamique. L'UI et le tableau de bord se mettent à jour instantanément sans nécessiter de recharger la page.

5. **Confirmation de suppression** : Un dialogue modal prévient des suppressions accidentelles.

---

## 🛠️ Outils d'Intelligence Artificielle Utilisés

- **Antigravity (Google DeepMind)** : Utilisé pour la génération de la structure de projet, l'implémentation de la logique métier réutilisable et du design system, et l'écriture de la documentation.

---

## 🎯 Préparation pour la modification en direct (10 minutes)

Voici comment réaliser les options de modification en direct demandées par les recruteurs :

- **Option 1 (Filtre > 100 000 FCFA)** : Ajouter une case à cocher ou bouton dans `OrderList.jsx` appliquant un filtre supplémentaire sur `cmd.montantTotal > 100000` lors du filtrage.
- **Option 2 (Champ téléphone)** :
   1. Ajouter un champ `telephone` dans le modèle `commande.model.js` (côté backend).
   2. Ajouter le champ au formulaire dans `OrderForm.jsx` et l'affichage dans `OrderList.jsx` (côté frontend).

- **Option 3 (Empêcher suppression des commandes livrées)** : Dans `OrderList.jsx`, désactiver ou masquer le bouton de suppression si `commande.statut === 'Livrée'`.
- **Option 4 (Nombre total d'articles commandés)** : Dans `Dashboard.jsx`, ajouter un KPI calculant la somme cumulée : `commandes.reduce((sum, cmd) => sum + cmd.quantite, 0)`.
- **Option 5 (Tri par montant décroissant)** : Dans `OrderList.jsx`, ajouter un bouton pour trier le tableau filtré avec `commandesFiltrees.sort((a, b) => b.montantTotal - a.montantTotal)`.
- **Option 6 (Couleur différente par statut)** : Déjà implémenté dans le design system via les badges colorés et les sélecteurs de statut personnalisés (`index.css` & `Badge.jsx`).
