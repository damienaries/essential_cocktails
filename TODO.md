# Swizzle — backlog

Things deliberately parked to get the MVP out. Ordered roughly by when they make
sense, not by size. Last updated 2026-08-07.

---

## Before / around launch

- [ ] **Fix "classsic" typo** in `og:title` and `twitter:title` in `index.html` —
      three s's, and it's the headline of every share card.
- [ ] **Make the first admin drink write** so `meta/library` gets created. Until it
      exists, `fetchLibraryVersion` returns 0 and every load does a full library
      fetch (no errors, just no savings).
- [ ] **Create a non-admin test account** and walk the signed-in flows: save, menus,
      account tabs, the signed-out hints.
- [ ] **Fallback drink image** — `DrinkDetailModal` has a `todo` where a missing
      `imageUrl` currently renders nothing over the gradient.

## Content

- [ ] **Drink histories via AI research** _(after all drinks are in — one pass over
      the full library)_. Populate `description` with origin, era, creator, first
      printed appearance.

      The catch: cocktail history is unusually unreliable — many origin stories are
      apocryphal or contested (Margarita, Moscow Mule, Martini), and a model will
      state the popular myth confidently. So don't ask for prose, ask for
      **structured claims with provenance**:

      ```
      firstPrinted: { work: "The Savoy Cocktail Book", year: 1930 }
      attributedTo: "Harry MacElhone, Harry's New York Bar, Paris"
      origin:       { place: "Paris", circa: "1920s" }
      confidence:   documented | attributed | disputed
      sources:      ["Wondrich, Imbibe!", "Difford's Guide"]
      ```

      Then render prose from the fields. Restrict sources to credible references
      (Wondrich, Oxford Companion to Spirits & Cocktails, Embury, Savoy, Jerry
      Thomas 1862, Difford's, Punch); reject content-farm blogs. Synthesize and
      cite — never paste, those texts are copyrighted.

      **A human review pass is required**, not optional: ~30s per drink, an hour or
      two total. Publishing unreviewed AI history would undermine the legitimacy
      this feature exists to build.

- [ ] Only 12 of 142 drinks have a `description` today — this is mostly greenfield.

## Sharing & growth

- [ ] **Per-drink share cards** — a Netlify Edge Function on `/drinks/*` that
      rewrites `<head>` with each drink's name, description, and photo. Crawlers
      never run JS, so the static `index.html` tags are all they see today; every
      drink link currently advertises the generic site card.

      ~60 lines. The real decision is slug → drink lookup: either add a `slug` field
      to drink docs (write path + 142-doc backfill) and do one filtered Firestore
      REST query, or have the function read a cached copy of the whole library.
      **Do this after the CDN `library.json` below** — otherwise the lookup gets
      built twice.

- [ ] **Per-drink OG images** — drink photos are 560px squares, which suits the
      `summary` card we chose. If we ever want the wide `summary_large_image`
      layout, they'd need generated 1200×630 composites.

- [ ] **Admin "generate a post" button** — one-click copy/paste social post for a
      drink: name, a hook drawn from the description, the share link, hashtags.
      Trivial to build (no APIs, clipboard only) and worth doing first.

- [ ] **Direct FB/IG publishing** — meaningfully harder than it sounds. Instagram
      content publishing goes through the Graph API, which needs a Business or
      Creator account linked to a Facebook Page, a Meta app, and **app review** for
      the publishing permission. Posting is a two-step container/publish flow and
      the image must be at a public URL (our Storage URLs qualify). Treat as a
      project, not an afternoon — the copy/paste version above gets 80% of the
      value for 5% of the work.

## Performance & cost

- [ ] **Static `library.json` on the CDN** — the public library is admin-curated and
      identical for everyone, so it's a static asset living in a database. Generate
      on drink write (Cloud Function or build step) → Storage/CDN. One HTTP request,
      **zero** Firestore reads, and `ETag` replaces the `meta/library` check. Also
      becomes the edge function's data source.

- [ ] **`onSnapshot` on `meta/library`** for instant invalidation. Today a spec
      correction reaches users on their next load (5min `staleTime`,
      `refetchOnWindowFocus` is off); open tabs keep the old copy. One doc listener
      → 1 read to establish, fires only on publish, turns "next visit" into
      "within a second". ~15 lines.

- [ ] **Code splitting** — the JS bundle is ~1MB (340KB gzipped) and Vite warns on
      every build. Route-level `lazy()` would be the obvious first cut.

- [ ] **`404.png` is 2.4MB** — larger than the entire JS bundle.

## Quality & tests

- [ ] **Auth flow tests**, in value order: 1. `friendlyAuthError` — pure function, no mocks, and it encodes a **security
      decision**: `wrong-password` / `user-not-found` / `invalid-credential` all
      collapse to one message so an attacker can't enumerate registered emails.
      One careless "helpful" edit reintroduces enumeration. Highest value in the
      app, ~15 lines of test. 2. Extract the redirect logic from `SignIn` (`rawNext || isAdmin ? /admin :
       /account`) into a pure module, then test it. No Firebase mocking needed. 3. Submit flows with `firebase/auth` mocked — error display, disabled state,
      and SignUp's `updateProfile` → `refreshUser` → navigate ordering (the
      comment there notes `updateProfile` fires no auth event, so a reorder
      silently breaks the header name).

- [ ] **Menus mutation hooks** (`useCreateMenu` / `useUpdateMenu` cache
      invalidation) and the `Timestamp → millis` mapping in the api layer are
      untested.

- [ ] **Add a `.prettierrc`** — there's no config, so running Prettier applies its
      defaults (spaces, double quotes) against the repo's tabs/single-quote style
      and reformats whole files.

- [ ] **Pre-existing lint errors** (all predate this work): `DrinkAdminTable`
      setState-in-effect, `useTheme` empty block, `useAuthUser` exhaustive-deps.

- [ ] **Modal focus trap** — `Modal` locks background scroll but doesn't trap focus;
      tabbing escapes to the page behind.

- [ ] **Duplicate menu names** — the menus page blocks names that would collide as
      URLs, but `AddToMenuButton`'s inline create doesn't. A duplicate created there
      makes one of the two unreachable by URL.

- [ ] **Rename a menu** — `useUpdateMenu` supports `name`, there's just no UI.

- [ ] **Menu sheet capacity** — `MENU_PAGE_CAPACITY = 6` was derived from type
      sizes, not from looking at printed output. Tune once you've printed one.

## Later features

- [ ] **Venues / teams** (bar manager creates menus for their staff). Sketched
      already: `venues/{id}` with a `members/{uid}` doc as the authorization record
      that rules read via `get()`. Membership docs over custom claims — stale claims
      survive up to an hour after you remove someone. Venue-private drinks go in
      `venues/{id}/drinks`, a **separate collection** rather than a `visibility`
      flag, so a private recipe physically cannot appear in a public query.

      The only piece needing a server is **invite redemption** — a client can't be
      allowed to write its own membership doc. High-entropy token as the invite doc
      id, collection unreadable so tokens can't be enumerated, Cloud Function
      validates and writes the member doc.

      **Decide before there are many menus:** `drinkIds: string[]` becomes ambiguous
      once drinks come from two collections. Switch to `{ source, id }` refs or path
      strings — cheap now, a migration later.

- [ ] **Reviews / comments / ratings.** Per-drink subcollection, fetched when the
      modal opens, so you only pay for drinks people actually open.

      **The trap:** the natural move is denormalising average rating onto the drink
      doc — but every drink write bumps `meta/library`, so a single review would
      invalidate the cached library for every user and make the version stamp
      worthless. Keep aggregates in a separate `drinkStats/{drinkId}` collection,
      or stamp `meta/library` only on admin content writes. Content and social
      belong on separate clocks.
