# Essential Cocktails

A curated compendium of classic cocktails—as reviewed and used by bar professionals—for bartenders, bar managers, training, and serious enthusiasts.

## Vision

- **Now:** trustworthy recipes and structure (families, variations) with a public, read-only browse experience.
- **Later:** analytics for usage insights; **member-only** features such as featured cocktail menus (upload a full menu), social activity on drinks (comments/likes, optional user images); and a section for **ingredient recipes** (syrups, infusions, techniques).

## MVP (current)

- **Public site:** no login required to browse.
- **Home:** full drink list (~200 starters), **search / filter** by name, family, or ingredient.
- **Families:** browse by cocktail family (Martini, Sour, Daiquiri, Old Fashioned, etc.).
- **Detail:** click a card to open recipe details (ingredients, build, garnish, notes).
- **Admin:** single maintainer during build; CRUD and image tooling will land after browse parity.
- **Images:** AI-generated placeholders in development only until real photography or assets exist.

Stack: **React**, **TypeScript**, **Vite**, **React Router**, **TanStack Query**, **Firebase** (Firestore for drinks).

## Setup

```bash
npm install
cp .env.example .env.local
# Fill VITE_FIREBASE_* from Firebase Console → Project settings → Your apps (Web).
npm run dev
```

Firestore expects a **`drinks`** collection with documents ordered by **`name`** (same as the legacy Vue app). Security rules should allow **public read** for the MVP; **writes** stay restricted to admins when you wire auth and rules.

## Scripts

| Command       | Action              |
| ------------- | ------------------- |
| `npm run dev` | Start dev server    |
| `npm run build` | Production build  |
| `npm run preview` | Preview production build |

## License

Private / all rights reserved unless you add a license.
