# Log de vérification — moteur de calcul (soldes & équilibrage)

Date : 2026-09-14
Méthode : pour chaque scénario, calcul manuel indépendant (formule :
part de chacun = montant × poids / somme des poids, avec
poids = taille × niveau de participation, défaut 100%), puis
injection du même jeu de données dans l'appli (environnement de test
local isolé, pas la production) et comparaison avec ce qu'elle
affiche réellement à l'écran (Soldes + Pour équilibrer les comptes).

Aucune anomalie détectée — les 5 scénarios sont strictement conformes
au calcul manuel, au centime près.

---

## Scénario 1 — Répartition simple (référence)

**Données** : Alice, Bob, Chloé — 1 dépense "Restaurant" 90,00 €,
payée par Alice, partagée à 3 (100% chacun).

**Calcul manuel** : part = 90 / 3 = 30 € chacun.
- Alice : 90 (payé) − 30 = **+60 €**
- Bob : 0 − 30 = **−30 €**
- Chloé : 0 − 30 = **−30 €**

**Appli** : Alice doit recevoir 60,00 € · Bob doit 30,00 € · Chloé
doit 30,00 €. Équilibrage : Bob→Alice 30 €, Chloé→Alice 30 €.

**Résultat : ✅ conforme.**

---

## Scénario 2 — Dépense partielle + plusieurs dépenses cumulées

**Données** : mêmes 3 personnes.
- "Restaurant" 90 € (payeur Alice, partagée à 3)
- "Essence" 40 € (payeur Bob, partagée entre Alice et Bob seulement,
  Chloé exclue)

**Calcul manuel** :
- Restaurant : 30 € chacun (Alice/Bob/Chloé)
- Essence : 20 € chacun (Alice/Bob)
- Alice : 90 (payé) − 30 − 20 = **+40 €**
- Bob : 40 (payé) − 30 − 20 = **−10 €**
- Chloé : 0 − 30 = **−30 €**

**Appli** : Alice +40,00 € · Bob −10,00 € · Chloé −30,00 €.
Équilibrage : Chloé→Alice 30 €, Bob→Alice 10 €. Ligne du haut
correctement repliée sur "Total 130,00 € sur 3 personnes" (moyenne
masquée car dépense partielle présente).

**Résultat : ✅ conforme.**

---

## Scénario 3 — Voyageur "représente 2" (couple)

**Données** : Alice (1), Bob (1), CoupleDuo (2) — "Logement" 300 €,
payé par Alice, partagé par tous.

**Calcul manuel** : poids total = 1+1+2 = 4. Part par unité de poids
= 300/4 = 75 €.
- Alice : 300 (payé) − 75×1 = **+225 €**
- Bob : 0 − 75×1 = **−75 €**
- CoupleDuo : 0 − 75×2 = **−150 €**

**Appli** : Alice +225,00 € · Bob −75,00 € · CoupleDuo −150,00 €.
Effectif total bien compté à 4 personnes (1+1+2), moyenne affichée
= 75,00 € (300/4), correcte. Équilibrage : CoupleDuo→Alice 150 €,
Bob→Alice 75 €.

**Résultat : ✅ conforme.**

---

## Scénario 4 — Participation réduite (arrivée à mi-séjour)

**Données** : Alice, Bob, Chloé — "Location10j" 500 €, payée par
Alice, partagée à 3, mais Chloé à seulement **50%** de participation
sur cette dépense (arrivée en cours de séjour).

**Calcul manuel** : poids = Alice 1, Bob 1, Chloé 0,5 → total 2,5.
Valeur d'une part = 500/2,5 = 200 €.
- Alice : 500 (payé) − 200×1 = **+300 €**
- Bob : 0 − 200×1 = **−200 €**
- Chloé : 0 − 200×0,5 = **−100 €**

**Appli** : Alice +300,00 € · Bob −200,00 € · Chloé −100,00 €.
Ligne du haut repliée sur "Total 500,00 € sur 3 personnes" (moyenne
masquée, cohérent). Équilibrage : Bob→Alice 200 €, Chloé→Alice
100 €.

**Résultat : ✅ conforme.**

---

## Scénario 5 — Cas combiné (le plus exigeant)

**Données** : Alice (1), Bob (1), CoupleXY (2), Dan (1, rejoint plus
tard). Trois dépenses, trois payeurs différents :
- "Location" 400 € (payeur Alice, partagée entre Alice/Bob/CoupleXY
  — Dan pas encore présent)
- "Diner" 90 € (payeur Bob, partagée par tous les 4, mais Dan à 50%)
- "Essence" 60 € (payeur CoupleXY, partagée entre Alice et CoupleXY
  seulement)

**Calcul manuel** (détail par dépense) :
- Location (poids total 1+1+2=4, part unitaire 100) :
  Alice −100, Bob −100, CoupleXY −200
- Diner (poids total 1+1+2+0,5=4,5, part unitaire 20) :
  Alice −20, Bob −20, CoupleXY −40, Dan −10
- Essence (poids total 1+2=3, part unitaire 20) :
  Alice −20, CoupleXY −40

Bilan par personne (payé − parts dues) :
- Alice : 400 (payé) − 100 − 20 − 20 = **+260 €**
- Bob : 90 (payé) − 100 − 20 = **−30 €**
- CoupleXY : 60 (payé) − 200 − 40 − 40 = **−220 €**
- Dan : 0 − 10 = **−10 €**

*(vérification croisée : 260 − 30 − 220 − 10 = 0 ✓)*

**Appli** : Alice +260,00 € · Bob −30,00 € · CoupleXY −220,00 € ·
Dan −10,00 €. Équilibrage (3 transactions) : CoupleXY→Alice 220 €,
Bob→Alice 30 €, Dan→Alice 10 €.

**Résultat : ✅ conforme, y compris sur le cas combinant les 4
mécanismes en même temps (taille de groupe, participation réduite,
dépense partielle, plusieurs payeurs).**

---

## Scénario 6 — Payeur qui ne participe pas lui-même

Cas réel : quelqu'un avance de l'argent pour les autres sans être
concerné par la dépense (ex: cadeau surprise, sortie pour le reste du
groupe).

**Données** : Alice, Bob, Chloé — "Anniversaire surprise" 60 €,
payée par Alice, mais partagée uniquement entre Bob et Chloé (Alice
volontairement décochée du partage bien qu'étant la payeuse).

**Vérifié aussi via l'interface réelle** (pas seulement par injection
de données) : décocher la puce "Alice" dans "Partagée entre" tout en
la laissant payeuse fonctionne normalement, et déclenche bien la
popup de confirmation avec le texte exact "Payée par Alice · partagée
entre Bob, Chloe" — confirmant que ce cas est bien accessible depuis
l'usage normal de l'appli, pas juste un état artificiel.

**Calcul manuel** : totalWeight = Bob(1) + Chloé(1) = 2. Part = 30 €
chacun. Alice ne doit rien puisqu'elle n'est pas participante.
- Alice : 60 (payé) − 0 = **+60 €**
- Bob : 0 − 30 = **−30 €**
- Chloé : 0 − 30 = **−30 €**

**Appli** : Alice +60,00 € · Bob −30,00 € · Chloé −30,00 €.
Équilibrage : Bob→Alice 30 €, Chloé→Alice 30 €. Le tableau
"Dépenses" indique bien "Alice · 1 dépense · 60,00 €" (elle est
comptée comme ayant payé, ce qui est correct, sans pour autant devoir
de part).

**Résultat : ✅ conforme.**

---

## Conclusion

6 scénarios testés, couvrant : répartition simple, dépense
partielle + cumul, pondération par taille de groupe, pondération par
participation réduite, un cas combinant tout à la fois avec
plusieurs payeurs, et un payeur exclu de sa propre dépense.
**Aucun écart constaté** entre le calcul manuel indépendant et ce que
l'appli affiche réellement — soldes au centime près et suggestions
d'équilibrage cohérentes dans tous les cas.

Tests réalisés dans un environnement local isolé (pas la production),
données nettoyées après coup.

---

## Re-vérification — 2026-09-18

Mêmes 6 scénarios rejoués à l'identique dans un nouvel environnement
local isolé, après l'ensemble des évolutions ajoutées depuis le
premier passage (steppers +/-, mode fin à la création, popups de
confirmation suppression dépense/voyageur, toast desktop, etc.), pour
s'assurer qu'aucune régression n'a été introduite sur le moteur de
calcul lui-même.

**Résultat : ✅ les 6 scénarios restent strictement conformes**, au
centime près, y compris les points annexes vérifiés au passage :
accord grammatical "CoupleDuo/CoupleXY doivent" (pluriel, taille > 1)
toujours correct, popup de confirmation "dépense partielle" avec le
texte exact attendu, et toast "Dépense ajoutée" bien visible sur
desktop.

Aucune anomalie détectée.
