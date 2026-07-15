# 🎨 Guest Markets — Frontend React

Cette application est l'interface utilisateur pour le système de gestion des commandes Guest Markets. Elle a été conçue pour offrir un rendu moderne, responsive, épuré, aux couleurs de l'entreprise (Blanc/Gris, Bleu dominant, Rouge d'accent).

---

## 🛠️ Stack Technique & Bibliothèques

- **React** (avec Vite) : Framework d'interface rapide et léger.
- **Axios** : Client HTTP pour communiquer avec l'API REST.
- **React-Toastify** : Système de notifications Toast élégant pour confirmer les actions utilisateur (création, modification, suppression).
- **CSS Vanilla (Customized)** : Un système de design propre défini dans `src/index.css` avec variables CSS, pour une autonomie totale sans dépendance lourde de framework CSS.

---

## 📁 Structure du Code

Conformément aux contraintes de modularité, le code est organisé ainsi :
```
src/
├── api/
│   └── config.js            ← Constante de l'URL API (http://localhost:8080)
├── utils/
│   ├── axios-helper.js      ← Instance Axios configurée
│   └── calculations.js      ← Fonctions de calcul (CA, montant total, formatages)
├── services/
│   └── commandeService.js   ← Services CRUD d'appels API
├── components/
│   ├── Sidebar.jsx          ← Barre de navigation latérale
│   ├── Badge.jsx            ← Badge de statut coloré (En attente, Confirmée, etc.)
│   ├── Dashboard.jsx        ← Rendu des KPIs et répartition
│   ├── StatusFilter.jsx     ← Filtres boutons horizontaux
│   ├── OrderForm.jsx        ← Formulaire d'ajout/modification en popup modal
│   └── OrderList.jsx        ← Tableau des commandes, recherche et actions
├── App.jsx                  ← Orchestrateur d'état (State holder)
├── index.css                ← Système de design et variables graphiques
└── main.jsx                 ← Point d'entrée de React
```

---

## 🚀 Lancement du Projet

### 1. Installation
Assurez-vous que les dépendances sont installées (exécuté automatiquement si vous utilisez le script général) :
```bash
npm install
```

### 2. Démarrage
Lancez le serveur de développement Vite :
```bash
npm run dev
```
L'application sera accessible sur **http://localhost:5173**.

---

## 📊 Fonctionnalités Implémentées

1. **Tableau de bord interactif** : Affiche les indicateurs clés (Total commandes, commandes En attente, commandes Livrées, et Chiffre d'affaires total calculé dynamiquement hors commandes annulées).
2. **Liste & Recherche** : Tableau responsive complet avec recherche multi-critères instantanée (par nom du client, par produit ou par ID/référence).
3. **Filtres par statut** : Boutons de filtrage rapide ('Toutes', 'En attente', 'Confirmée', 'Livrée', 'Annulée') avec les couleurs correspondantes.
4. **Formulaire de création / modification** :
   - Validations en temps réel (champs requis, quantité > 0, prix unitaire > 0).
   - Calcul automatique et instantané du montant total.
   - Gestion des messages d'erreur clairs.
5. **Modification instantanée du statut** : Directement dans la liste avec un menu déroulant stylisé, se répercutant immédiatement dans l'interface et le Dashboard.
6. **Suppression sécurisée** : Demande de confirmation modal avant suppression.
7. **Notifications de confirmation** : Alertes animées (Toast) lors des ajouts, modifications, ou suppressions.
