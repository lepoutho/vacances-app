# Vacances — Partage des dépenses

Petite application web pour partager les dépenses entre voyageurs pendant des vacances : qui a payé quoi, combien chacun doit, et comment équilibrer les comptes avec le minimum de virements.

## Utilisation

Ouvre [`html/index.html`](html/index.html) dans un navigateur. Aucune installation, aucune dépendance, aucun build : c'est du HTML/CSS/JS pur.

## Fonctionnalités

- Ajout des voyageurs
- Saisie des dépenses (montant, payeur, participants)
- Calcul automatique des totaux par personne et des soldes (qui doit / qui est créditeur)
- Suggestion des virements à effectuer pour équilibrer les comptes (algorithme glouton, nombre minimal de transactions)
- Export / import du voyage au format `.json`
- Sauvegarde automatique dans le navigateur (`localStorage`)

## Structure

```
html/index.html      → structure et styles
javascript/app.js     → logique de l'application
```
