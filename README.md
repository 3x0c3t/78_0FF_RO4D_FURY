# 🏁 0FF_RO4D_FURY

Un jeu **off‑road arcade 3D** en pur JavaScript, dopé à **Three.js**, au sable, à la poussière, et à de mauvaises décisions mécaniques.

Pas de moteur AAA. Pas de build obscur. Juste du code, des assets, et des véhicules qui n’ont aucun respect pour la gravité.

---

## 🚗 Concept

**0FF_RO4D_FURY** est un prototype de jeu off‑road :

* sélection de véhicules (4x4, buggy, truck)
* sélection de maps (désert, forêt, montagne, banlieue)
* rendu 3D temps réel avec Three.js
* éditeurs intégrés pour **voitures** et **cartes**

Tout est pensé pour être **lisible**, **hackable**, et **extensible**.

---

## 🧱 Structure du projet

```
├── cars/           # Données véhicules + modèles
├── maps/           # Données des maps
├── editor/         # Éditeurs (map & car)
├── libs/           # Three.js + loaders
├── media/          # Musiques, textures, miniatures
├── index.html      # Entrée principale du jeu
├── home.html       # Menu / accueil
└── script.js       # Logique globale
```

Aucune magie noire. Chaque dossier fait exactement ce que son nom suggère.

---

## 🛠️ Tech

* **JavaScript vanilla**
* **Three.js (module)**
* GLTF pour les modèles 3D
* JSON pour les données (maps, véhicules)
* HTML / CSS simples, sans framework

Objectif : rester **léger**, **compréhensible**, et modifiable sans doctorat.

---

## 🎮 Éditeurs intégrés

Le projet inclut :

* un **éditeur de véhicules** (stats, modèles, comportement)
* un **éditeur de maps** (données, aperçu, viewer)

Pensés pour tester vite, casser des trucs, recommencer.

---

## 🚀 Lancer le projet

Servir le dossier via un serveur web (obligatoire à cause des modules ES).

Exemple :

```bash
python3 -m http.server
```

Puis ouvrir :

```
http://localhost:8000
```

---

## 🧪 État du projet

* Prototype fonctionnel
* En développement actif
* Aucune promesse de stabilité
* Beaucoup de potentiel

---

## 📌 Version

Branche principale : **v1.0**
Tag : **v1.0.0**

---

## 🧠 Philosophie

Pas un jeu fini.
Pas un framework.

Un **terrain de jeu** pour tester des idées, expérimenter avec Three.js, et faire rugir des moteurs polygonaux dans le désert.

---

## 📜 Licence

À définir.
Pour l’instant : regarde, teste, apprends. Et ne fais pas semblant d’avoir tout compris du premier coup.
