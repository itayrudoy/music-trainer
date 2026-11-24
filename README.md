# Key Change Trainer

Practice switching scales on the fly: run your scale up and down while the app
calls out a new random key every few seconds.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run lint
```

## Structure

- `src/config.ts` — trainer settings (tempo range, key-change timing)
- `src/music/` — musical data (the 12 keys, 4/4 meter)
- `src/hooks/` — timing logic (`useBeat`, `useRandomKey`)
- `src/components/` — UI pieces, each with its own CSS module
