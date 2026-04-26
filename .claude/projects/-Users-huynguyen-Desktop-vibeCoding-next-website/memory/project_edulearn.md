---
name: EduLearn Next.js Project
description: Full Next.js education site with JSON CMS, admin console, German classes, and homepage slider
type: project
---

Full-stack Next.js education platform (EduLearn). JSON file-based CMS in `/content/`.

**Admin console at `/admin`** — default credentials: admin / admin123

**Content files:**
- `content/courses.json` — online courses
- `content/blog.json` — blog posts
- `content/site.json` — site config including `heroSlides[]` for homepage slider
- `content/german-classes.json` — German language classes (A1–C2)
- `content/registrations.json` — student registration records

**Key routes:**
- `/german-classes` — listing page
- `/german-classes/[slug]` — detail page with registration form
- `/admin/german-classes` — manage classes + view/update registrations
- `/admin/settings` — CMS for hero slides, site config, SEO, social

**Why:** Added German classes feature, hero slider (5s auto-advance with dots/arrows), improved admin UI with gradient stat cards and sectioned settings page.

**How to apply:** When extending content, always add both the TypeScript interface to `content.ts` and a corresponding JSON file in `/content/`. Use `readJSON(file, [])` fallback pattern for optional collections.
