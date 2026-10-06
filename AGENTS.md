# ASCII Artist

## Mission

The main functionality of the application is to create ASCII art from the images supplied by the user. The use can open the gallery o take a picture. Then convert it to ASCII art and share it.

## Skill model

- Keep portable workflows in `.agents/skills/<skill-name>/SKILL.md`.
- Give every skill one job, explicit inputs, verifiable outputs, and clear stop conditions.
- Use `$skill-name` when showing explicit invocation.

## Coding standards

- Use strict TypeScript. Do not introduce `any`.
- Test behavior through public interfaces, not internal helpers.
- Prefer deep modules with small interfaces.
- Build vertical slices through domain, service, and UI.
- Use domain language from `CONTEXT.md`.

## Verification

```bash
npm run typecheck
npm run lint
```
