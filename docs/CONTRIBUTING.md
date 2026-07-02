# Guide de Contribution

## Branches

- `main` - Production
- `dev` - Développement
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs

## Workflow

1. Créer une branche depuis `dev`
2. Commiter régulièrement avec des messages clairs
3. Créer une Pull Request
4. Attendre la review
5. Merger dans `dev`

## Convention de commit

```
type(scope): message

Types: feat, fix, docs, style, refactor, test, chore

Exemples:
feat(recipes): add search filter
fix(auth): resolve login bug
docs(api): update endpoints
```

## Code Style

- ESLint + Prettier configurés
- TypeScript strict mode
- Tests unitaires obligatoires

## Questions?

Ouvrir une issue ou une discussion!
