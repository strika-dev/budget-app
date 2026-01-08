# Budget. — Gestionnaire de Budget Personnel

Un gestionnaire de finances avec une esthétique **néo-brutalist éditorial** inspirée du design suisse et des magazines.

## Direction Esthétique

**Style choisi** : Neo-Brutalist Editorial — un mélange de rigueur suisse, d'esthétique magazine et de brutalisme brut.

### Principes de design appliqués :

- **Fond papier crème** (#F5F0E8) au lieu des fonds sombres génériques
- **Typographie expressive** : Instrument Serif pour les titres, Space Grotesk pour le corps, IBM Plex Mono pour les données
- **Bordures épaisses noires** (3px) créant une grille visible
- **Une seule couleur d'accent** (coral #FF5A36) utilisée avec parcimonie
- **Formes géométriques** (■ ◆ ▲ ●) au lieu d'emojis
- **Asymétrie contrôlée** dans les layouts
- **Espace négatif dramatique**
- **Pas de coins arrondis excessifs** — angulaire et intentionnel

## Structure Modulaire

```
src/
├── components/
│   ├── Header.jsx        # Navigation avec tabs brutalist
│   ├── Summary.jsx       # Blocs statistiques avec bordures
│   ├── TransactionForm.jsx  # Formulaire grid strict
│   ├── TransactionList.jsx  # Liste avec marques géométriques
│   └── Charts.jsx        # Visualisations SVG minimalistes
├── hooks/
│   └── useBudget.js      # État centralisé
├── utils/
│   └── helpers.js        # Fonctions pures
├── styles/
│   └── theme.js          # Tokens de design
└── App.jsx               # Orchestration
```

## Palette

| Nom | Hex | Usage |
|-----|-----|-------|
| Paper | #FFFDF9 | Surface principale |
| Cream | #F5F0E8 | Arrière-plan |
| Ink | #1A1A1A | Texte, bordures |
| Coral | #FF5A36 | Accent unique |
| Green | #2D7A4F | Revenus, positif |
| Red | #C23B3B | Dépenses, négatif |

## Typographie

- **Display** : Instrument Serif — élégance éditoriale
- **Body** : Space Grotesk — géométrie moderne  
- **Mono** : IBM Plex Mono — données et labels

## Fonctionnalités

- **Aperçu** : Vue synthétique avec stats et graphiques
- **Opérations** : Ajout et gestion des transactions
- **Statistiques** : Analyses détaillées par catégorie

## Anti-patterns évités

Ce design évite délibérément :
- ❌ Dégradés violets/bleus génériques
- ❌ Inter, Roboto, ou polices système par défaut
- ❌ Coins arrondis partout (border-radius: 12px)
- ❌ Ombres portées excessives
- ❌ Emojis comme icônes
- ❌ Grilles symétriques prévisibles
- ❌ Mode sombre par défaut
- ❌ Glassmorphism générique

## Installation

```bash
# Utiliser directement BudgetManager.jsx pour un démo
# Ou importer les modules individuellement

import App from './src/App';
```

## Crédits typographiques

- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)
