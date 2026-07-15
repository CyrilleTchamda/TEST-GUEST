# 🚀 Guest Markets — Backend API

## Stack technique

| Outil | Rôle |
|---|---|
| **Node.js** | Runtime JavaScript côté serveur |
| **Express.js** | Framework HTTP / routeur REST |
| **Sequelize** | ORM — abstraction de la base de données |
| **MySQL2** | Driver MySQL pour Node.js |
| **CORS** | Autoriser les appels depuis le frontend React |
| **Nodemon** | Redémarrage automatique en développement |

---

## Structure du projet

```
backend/
├── config/
│   └── dbConfig.js          ← Paramètres de connexion MySQL
├── models/
│   ├── index.js             ← Connexion Sequelize + import des modèles
│   └── commande.model.js    ← Définition de la table "commandes"
├── controllers/
│   └── commande.controller.js  ← Logique métier (CRUD + dashboard)
├── routes/
│   └── commande.routes.js   ← Mapping URL → controller
├── index.js                 ← Point d'entrée du serveur Express
└── package.json
```

> **Pattern identique au Sample** : config → models → controllers → routes → index.js

---

## Installation

### 1. Prérequis
- Node.js installé
- MySQL en cours d'exécution (WAMP, XAMPP ou autre)

### 2. Créer la base de données MySQL

```sql
CREATE DATABASE guest_markets;
```

### 3. Installer les dépendances

```bash
cd backend
npm install
```

### 4. (Optionnel) Configurer la connexion

Modifier `config/dbConfig.js` si besoin :
```js
HOST: 'localhost',
USER: 'root',      // votre utilisateur MySQL
PASSWORD: '',      // votre mot de passe MySQL
DB: 'guest_markets'
```

### 5. Lancer le serveur

```bash
# Développement (avec rechargement automatique)
npm run dev

# Production
npm start
```

Le serveur démarre sur **http://localhost:8080**

---

## Endpoints REST

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/commandes` | Toutes les commandes |
| `GET` | `/api/commandes/dashboard` | KPIs (total, CA, statuts) |
| `GET` | `/api/commandes/:id` | Une commande par ID |
| `POST` | `/api/commandes` | Créer une commande |
| `PUT` | `/api/commandes/:id` | Modifier une commande complète |
| `PUT` | `/api/commandes/:id/statut` | Changer uniquement le statut |
| `DELETE` | `/api/commandes/:id` | Supprimer une commande |

### Exemple — Créer une commande (POST)

```json
{
  "client": "Jean Dupont",
  "produit": "Ordinateur portable",
  "quantite": 1,
  "prixUnitaire": 350000,
  "statut": "En attente"
}
```

Le `montantTotal` et la `reference` (CMD-XXX) sont **calculés automatiquement côté serveur**.

### Exemple — Réponse dashboard (GET /dashboard)

```json
{
  "total": 4,
  "enAttente": 1,
  "confirmees": 1,
  "livrees": 1,
  "annulees": 1,
  "chiffreAffaires": 855000
}
```

---

## Données initiales

Au premier démarrage, si la table est vide, le serveur insère automatiquement **4 commandes de démo** :

| Référence | Client | Produit | Statut |
|---|---|---|---|
| CMD-001 | Jean Dupont | Ordinateur portable | Confirmée |
| CMD-002 | Sarah Mbarga | Téléphone | En attente |
| CMD-003 | Paul Ndom | Écran 24 pouces | Livrée |
| CMD-004 | Aline Fotso | Clavier sans fil | Annulée |

---

## Explication des choix techniques

### Pourquoi Sequelize ?
Sequelize permet de définir les tables sous forme de modèles JavaScript. Au démarrage, `db.sequelize.sync()` crée automatiquement les tables — pas besoin d'écrire du SQL manuellement.

### Calcul du montant total
Le `montantTotal` est calculé **côté serveur** dans le controller :
```js
const montantTotal = quantite * prixUnitaire
```

### Génération de la référence CMD-XXX
```js
const count = await Commande.count()
const reference = `CMD-${String(count + 1).padStart(3, '0')}`
```

### Route /dashboard avant /:id
Dans Express, les routes sont évaluées dans l'ordre. Si `/:id` était avant `/dashboard`, Express interpréterait "dashboard" comme un paramètre `id`.

---

## Outils IA utilisés
- **Antigravity (Google DeepMind)** — génération de la structure backend complète.
