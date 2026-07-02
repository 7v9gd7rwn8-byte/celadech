# Documentation API

## Base URL

```
http://localhost:3001/api
```

## Authentification

Utilise JWT dans le header:
```
Authorization: Bearer <token>
```

## Endpoints principaux

### Recettes
- `GET /recipes` - Lister les recettes
- `GET /recipes/:id` - Détail d'une recette
- `POST /recipes` - Créer une recette (auth)
- `PUT /recipes/:id` - Modifier une recette (auth)
- `DELETE /recipes/:id` - Supprimer une recette (auth)

### Utilisateurs
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /users/profile` - Profil actuel (auth)
- `PUT /users/profile` - Modifier profil (auth)

### Favoris
- `GET /favorites` - Mes favoris (auth)
- `POST /favorites/:recipeId` - Ajouter aux favoris (auth)
- `DELETE /favorites/:recipeId` - Retirer des favoris (auth)

### Menus
- `GET /menus` - Mes menus (auth)
- `POST /menus` - Créer un menu (auth)
- `PUT /menus/:id` - Modifier menu (auth)

### Shopping List
- `GET /shopping-list` - Ma liste (auth)
- `POST /shopping-list` - Ajouter article (auth)
- `PUT /shopping-list/:itemId` - Marquer comme acheté (auth)

## Erreurs

- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `500` - Erreur serveur
