# Texte à lire — présentation Vacances app

Script complet, à lire à voix haute pendant l'enregistrement. Chaque
bloc `[Action : ...]` indique ce qu'il faut faire à l'écran juste
avant ou pendant la phrase qui suit. Lis à ton rythme, tu peux
paraphraser — l'important est de ne rien oublier.

Avant de démarrer l'enregistrement : réinitialise l'app pour partir
d'un écran vide.

---

## 1. Introduction — le général

> Bonjour ! Aujourd'hui je vous présente une petite application que
> j'ai développée : Vacances, une appli pour partager les dépenses
> entre plusieurs personnes pendant un voyage, et savoir facilement,
> à la fin, qui doit combien à qui.
>
> Le problème qu'elle résout, c'est celui que tout le monde connaît en
> vacances entre amis ou en famille : untel a payé le restaurant,
> tel autre l'essence, un troisième le logement — et personne n'a
> envie de sortir la calculette pour savoir qui doit quoi à la fin du
> séjour.
>
> C'est une application qui tourne entièrement dans le navigateur :
> pas de compte à créer, pas d'inscription, les données restent chez
> vous.

## 2. Le voyage — nommer et choisir la langue

**[Action : cliquer dans le champ titre en haut, effacer, taper un
nouveau nom]**

> On commence par donner un nom à son voyage — ici je vais l'appeler
> "Vacances en Bretagne".

**[Action : ouvrir le sélecteur de langue, choisir English, puis
revenir en Français]**

> L'application est disponible en trois langues : français, anglais
> et espagnol. Si je change la langue... tout se traduit d'un coup —
> les titres, les boutons, les messages. Je repasse en français pour
> la suite.

## 3. Les voyageurs — du général au particulier

**[Action : ajouter un premier prénom via le champ "Prénom" +
bouton Ajouter]**

> Ensuite, j'ajoute les voyageurs, un par un. Je tape un prénom, et
> j'ajoute.

**[Action : ajouter 1 ou 2 autres prénoms de la même façon]**

> Je fais pareil pour les autres personnes du voyage.

**[Action : ajouter un dernier voyageur en mettant 2 dans le champ
"représente"]**

> Et voici un détail auquel je tiens : ce champ "représente", à côté
> du prénom. Si un couple, par exemple, préfère être compté comme une
> seule entrée dans la liste plutôt que de créer deux prénoms
> séparés, on indique simplement qu'il représente 2 personnes. Ça
> compte alors pour 2 dans tous les calculs de moyenne et de parts,
> sans avoir à dupliquer une ligne.

## 4. Une dépense partagée par tout le monde

**[Action : remplir "Nouvelle dépense" — description, montant,
payeur — laisser "Partagée entre" sur "Tous", valider]**

> Passons aux dépenses. Je remplis la description, le montant, qui a
> payé, et par défaut la dépense est partagée entre tout le monde. Je
> valide... et elle est ajoutée directement, sans autre question,
> puisque tout le monde participe.

## 5. Une dépense partielle — le garde-fou

**[Action : nouvelle dépense, décocher un ou deux voyageurs dans
"Partagée entre" avant de valider]**

> Maintenant, un cas différent : une dépense qui ne concerne pas tout
> le monde — ici je décoche une personne qui n'était pas présente,
> par exemple. Je valide...

**[Action : montrer la popup de confirmation qui s'affiche]**

> ...et cette fois, une fenêtre de confirmation apparaît. Elle me
> rappelle noir sur blanc qui paie et avec qui c'est partagé, avant
> de valider définitivement. C'est volontaire : ça évite d'oublier
> quelqu'un dans la précipitation. Je peux annuler pour corriger, ou
> continuer si tout est correct.

**[Action : cliquer Continuer]**

> Je continue.

## 6. Un voyageur qui arrive en cours de séjour

**[Action : ajouter un nouveau voyageur maintenant que des dépenses
existent déjà]**

> Voici maintenant une situation très concrète : quelqu'un qui
> rejoint le groupe après le début du voyage, alors que des dépenses
> ont déjà été enregistrées. J'ajoute ce nouveau voyageur...

**[Action : montrer la fenêtre "Merci de sélectionner les dépenses..."
qui s'ouvre automatiquement]**

> ...et une fenêtre s'ouvre automatiquement, qui me demande à quelles
> dépenses passées cette personne doit participer.

**[Action : pointer/zoomer sur les lignes en rouge]**

> Vous voyez ces dépenses en rouge ? Ce sont celles qui n'étaient
> **pas** partagées par tous les voyageurs déjà présents — l'appli me
> prévient explicitement pour que je vérifie si le nouvel arrivant
> doit vraiment y être inclus ou non.

**[Action : cocher les dépenses concernées, ou "Tous", puis Valider]**

> Je coche celles qui le concernent, je valide, et ses parts sont
> automatiquement recalculées sur les dépenses choisies — sans avoir
> à modifier chaque dépense une par une à la main.

## 7. Le tableau des dépenses

**[Action : faire défiler jusqu'au tableau "Dépenses"]**

> Un peu plus bas, le tableau "Dépenses" récapitule combien chaque
> personne a payé au total. Seules celles qui ont réellement avancé
> de l'argent apparaissent ici, pour ne pas encombrer l'affichage.

## 8. Les soldes

**[Action : faire défiler jusqu'à "Soldes"]**

> Juste après, la section "Soldes" montre, personne par personne, qui
> doit recevoir de l'argent et qui en doit — un aperçu rapide de la
> situation de chacun.

## 9. Équilibrer les comptes

**[Action : faire défiler jusqu'à "Pour équilibrer les comptes"]**

> Et voici la partie la plus utile : "Pour équilibrer les comptes".
> L'application calcule automatiquement le nombre minimal de
> virements à faire pour que tout le monde soit remboursé — sous
> forme de tickets "De... à... Montant".

**[Action : cliquer sur un prénom dans "Filtrer par voyageur"]**

> Je peux filtrer par voyageur, pour ne voir que ce qui concerne une
> personne en particulier...

**[Action : remettre "Tous"]**

> ...et revenir à la vue complète.

**[Action : cliquer sur "Copier le résultat"]**

> Dernier détail important : ce bouton "Copier le résultat" copie
> uniquement la conclusion finale — qui doit quoi à qui — prête à
> coller dans une conversation de groupe. Volontairement, il ne copie
> pas le détail de chaque dépense : comme la répartition varie d'une
> dépense à l'autre, un recalcul à la main serait compliqué et
> source d'erreurs. Ici, tout le monde a directement la bonne
> réponse.

## 10. Modifier une dépense

**[Action : cliquer "Modifier" sur une ligne de la liste des
dépenses, changer un montant, Enregistrer]**

> On peut aussi revenir corriger une dépense après coup — un clic sur
> "Modifier", je change ce qu'il faut, j'enregistre, et tous les
> calculs se remettent à jour automatiquement.

## 11. Sauvegarder et récupérer son voyage

**[Action : cliquer "Enregistrer le fichier .json"]**

> Pour finir, comme les données restent dans le navigateur, je
> recommande d'exporter régulièrement son voyage dans un vrai
> fichier, avec ce bouton. C'est un fichier portable, que je peux
> ranger où je veux — un drive, une clé USB — et le recharger plus
> tard avec "Ouvrir le fichier .json", sur n'importe quel appareil.

## 12. Conclusion — le général, à nouveau

> Voilà pour la présentation de Vacances : ajouter ses voyageurs, ses
> dépenses, et laisser l'application calculer qui doit quoi à qui —
> même quand tout le monde ne participe pas à tout, et même quand
> quelqu'un rejoint en cours de route.
>
> Merci d'avoir regardé, n'hésitez pas à laisser vos remarques en
> commentaire !

---

## Rappel express (si tu perds le fil en lisant)

Général → nommer le voyage → langue → voyageurs (dont un "représente
2") → dépense totale → dépense partielle + popup → nouveau voyageur +
fenêtre rouge → tableau Dépenses → Soldes → Équilibrer + filtre +
copier → Modifier une dépense → Export/Import → conclusion générale.
