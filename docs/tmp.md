# FAQ
## Where is the entry point of this website?
`src/pages/index.astro`
## How to add a section?
### Create a section file
```sh
touch src/components/NewSectionName.astro
```
### Add scripts and HTML
in the .astro file, add scripts between two `---`s and add html below. like this:
```astro
---
// scripts go here
---
{/* HTML goes here**/}
```
### Add HTML
use this template as a starter
```html
<section id="collections" class="py-20">
    <div class="container mx-auto max-w-5xl px-4">
        <h2 class="mb-12 text-center text-3xl font-bold tracking-tight">Title</h2>
        <div class="">Body</div>
    </div>
</section>
```
- `section#collections`: you can change the `py` for a better distance with other sections.
- `dev.container`: the style and the reason in below
  - `mx-auto`: centerize horizontally
  - `container`: responsive in any devices
  - `max-w-5xl`: the convention width for default devices.
  - `px-4`: padding in case we have border or background.
- `h2`: the title of this section, use the template style for consistancy
- `dev.container > div`: the body of this section, any style as you like.
### Define Props
```astro
---
import type { CollectionEntry } from "astro:content";
interface Props {
    collections: CollectionEntry<"collectionName">[];
}
---
```
The `collectionName` in `CollectionEntry<"collectionName">` is defined in `src/content.config.ts`, 
## How to create a `collection` structure?
### Define a Collection
in `src/content.config.ts`. you can define a collection by 
```ts
const collectionName = defineCollection({
    loader: glob({pattern: '**/*.md', base: './src/data/collectionName'}),
    schema: z.object({
        title: z.string(),
    }),
})
```
- `loader`: simply use `glob()` loader for same-pattern files in a **base folder**. for example, I use `**/*.md` as the pattern. it will read all the markdown files in `./src/data/collectionName`, use their metadatas as the data of each item.
- `scheam`: the item schema.  

and then, you export collections by:
```ts
export const collections = { collectionName };
```
You must use `collections` as the export name, and your collection name as one of the entry.
### Create Items
Assume you use the above collectionName and loader, create a folder in the base folder path.
```sh
mkdir src/data/collectionName
```
and create a markdown file in `src/data/collectionName/item-name.md`
```markdown
---
title: "A title"
---
```
yeah, that's it. you can consume the data later.
## How to consume a collection data?
Use `CollectionEntry<"collectionName">[]`
```ts
import type { CollectionEntry } from "astro:content";
interface Props {
    collectionName: CollectionEntry<"collectionName">[];
}
const { collectionName } = Astro.props;
```

# Notes
## About Sections
in `src/pages/index.astro`, you can see there are many components under `<main></main>`, for example: `About`, `Collections`, etc. these are call `Section`. 
our current sections are:
- About
- Collections
- MapSection



## page/works/[slug].astro
### todo
- a collection contain many works
- a work has name, location, photos
