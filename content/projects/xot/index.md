---
title: "XOT - Static Website"
date: 2025-11-16T00:04:42Z
draft: false
slug: xot
image: xot_homepage_screenshot.jpg
imageCaption: Screenshot of https://xot.gr
readingTime: true
summary: How I built (and rocked!) a static website as a backend engineer for a local nonprofit traditional Greek dance studio
tags: ["Hugo", "Tailwind", "sanity.io", "SEO", "Pagefind", "Cloudflare", "Docker", "Dev Containers", "GitHub Actions", "Frontend"]
credits: []
---

## Some context

There is a local dance studio in my hometown that teaches traditional Greek dances. They wanted to get a bit more digital, as they felt they had fallen behind on the whole “internet” thing. In their defense, most of the board are over 60 years old—craftspeople by day, dancers by night. They already had some social media accounts and a voice in the local press. The main problem they faced was the lack of a centralized place to list their events, performances, and news.

By now, you’ve probably understood that we’re talking about non‑technical people (point 1).

The dance studio is also a nonprofit organization. Thus, they cannot afford to pay someone to build their website (point 2).

For reasons irrelevant to this post, they reached out to me and we agreed that I would build their website in my free time, pro bono.

## Features

In our initial conversation, they asked if I could build a simple blog. They also looked at several other websites to give me a sense of what they wanted and provided a color palette.

### Homepage

Feature #1: the [homepage](https://xot.gr/). When someone lands on the homepage, they should immediately understand that this is about a traditional Greek dance studio.

To achieve this, the hero section uses a blurred video background from a previous studio event, showing people dancing in traditional Greek attire, with calls to action (CTAs) to book a class and read the blog posts.

Below that, there is an [About section](https://xot.gr/#about), conveying the studio’s accumulated love and knowledge of Greek dances.

Two fonts are used: [Gentium](https://software.sil.org/gentium/) -simple and easy to read- and [CavafyScript](https://www.onassis.org/initiatives/cavafy-archive/cavafy-script), an open‑source font made by the Onassis Foundation, based on the handwriting of [Constantine P. Cavafy](https://en.wikipedia.org/wiki/Constantine_P._Cavafy), one of the most famous Greek poets.

### Dressing Room/News

Features #2 and #3. [Dressing Room](https://xot.gr/dressing-room/) and [News](https://xot.gr/news/) are two different blog‑style sections. In Dressing Room, they will upload posts for each traditional costume with complementary text about its history. In News, they’ll post events, performances, and studio updates. Both should support search by text, date range, and tags.

### Schedule

Feature #4. A clearly presented [schedule](https://xot.gr/classes/) of each class. The height of each class block reflects its duration. Each class is color‑coded by hashing its name and mapping the result to an opacity of the primary color.

### CMS

Feature #5. Everything should be addable/editable/deletable by them. I should not be in the loop for content management -only for development, delivery, and occasional annual maintenance. Enter the CMS. My initial thought was to use a Git‑based CMS. That way, no infrastructure would be needed. Everything would be committed to GitHub -no backups, no servers.

#### TinaCMS

I made a PoC using [TinaCMS](https://tina.io/). It felt unstable and buggy, and to make basic things work (like uploading an image), I had to implement many workarounds. It was a no‑go, as the people who would use it are not tech‑savvy.

#### Other Git‑based CMSes

I also tried [Decap CMS](https://decapcms.org/) and [Sveltia](https://github.com/sveltia/sveltia-cms), to name a few. All of them had rough edges. They may be perfect for developers, but for non‑technical users, it was a hard no.

I ended up with [Sanity.io](https://www.sanity.io/) for its generous free tier. More in the [CMS](#sanityio) section.

### SEO

Feature #6: discoverability. I made it clear that this is not entirely my job. They have to keep the website content up to date and maintain backlinks to their social media at least. On my part, [structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) is set in the head where appropriate, there is always a title and a description on each page, and I added two hidden features (nobody asks for these, but everyone expects them).

#### Hidden feature 1: Performance

Want Google to rank you higher in results? Offer a fast user experience: pages load instantly, no layout shifts, images load quickly. Non‑negotiable.

How?

- Serve AVIF or WebP images when possible
- Use fallback system fonts that closely match your web fonts
- Subset fonts to the characters used on the site
- Declare width and height for all visible media to avoid layout shifts
- Compress images
- Compress video
- Crop images and video for different devices/viewports
- Use a CDN for media
- Lazy‑load media, and add async or defer to scripts wherever possible

#### Hidden feature 2: Accessibility

Still want Google to rank you higher? Offer an accessible experience. Under many circumstances, everyone benefits from accessibility. Bright sunlight on your phone? That’s temporary low vision. Carrying groceries with one hand? You only have one free hand. You don’t need a permanent disability to benefit from accessibility features.

How?

- Use high‑contrast colors
- Use readable fonts
- Use semantic HTML (proper headings, landmarks)
- Provide descriptive alt text and ARIA attributes when appropriate

### Implicit requests

No one will ever explicitly ask for the following features, but everyone expects them on their site.

#### Hidden feature 3: 404 page

A missing page causes frustration. Keep users on your site and let them know something is missing with a helpful [404](https://xot.gr/invalid-url) page.

#### Hidden feature 4: Privacy policy

You’re building a static site with little to no JavaScript and no cookies. Then someone wants to add a YouTube video, a Google Maps iframe, or an X post. These embeds may require a [privacy statement](https://xot.gr/privacy-policy/) and sometimes a cookie banner.

#### Hidden feature 5: Open Graph

When sharing a page via social media or messaging apps, users expect a relevant image and descriptive text. Implement this yourself with [Open Graph](https://ogp.me/) meta tags.

## Tech used

Let’s explore the stack I picked and why, based on the 6 + 5 features the client requested and needed.

### Hugo

The website needs to be static. No running server means $0/month. There are several static site generators (SSGs) out there. I chose [Hugo](https://gohugo.io/) as it is fast, robust, and battle‑tested, with built‑in image optimization (which I ended up not using -more on that in the [CMS](#sanityio) section).

The website needs to run at the lowest possible cost. The JavaScript SSG ecosystem felt messy (to me). I’ve used [Nuxt](https://nuxt.com/) and [Astro](https://astro.build/) in the past for SSG, and the breaking changes even months after release were frustrating. They are also slow. I’ve heard only good things about [Eleventy](https://www.11ty.dev/), but I didn’t want to spend time experimenting. Hugo—even though it’s still 0.x—has a record of very few breaking changes over the years.

### Tailwind

No need for a design system, CSS optimizations, [critical CSS](https://web.dev/articles/extract-critical-css), [BEM](https://getbem.com/), [SCSS](https://sass-lang.com/), or hunting for a good [CSS reset](https://en.wikipedia.org/wiki/Reset_style_sheet) stylesheet. [Tailwind](https://tailwindcss.com/) has me covered. Peace of mind.

### Docker

Several tools (e.g., font subsetting, glyphhanger) that I wanted to run only once—without installing them on my machine—were [wrapped in a container](https://www.docker.com/). Keep your workstation clean, folks!

### Dev Containers

With an Everything‑as‑Code mindset, [Dev Containers](https://containers.dev/) are a no‑brainer. From the versions of Node, Hugo, and Pagefind to the enabled VS Code extensions, Dev Containers have you covered. And if you have more than one workstation (e.g., a desktop and a laptop), you’re just a rebuild away from any change.

### JavaScript/Node.js

I picked [JS](https://nodejs.org/en) for a couple of scripts -mostly for syncing the repo with the CMS- for three reasons: I know it well, it was already included in the container image, and Sanity.io uses it, too. [Go](https://go.dev/) was a close second, though.

### Pagefind

I’m in love with [this library](https://pagefind.app/). Statically search a website based on indexes built at build time? Where do I sign?

### Sanity.io

I chose it for the generous free tier. Its customizability, though—chef’s kiss. I created an admin environment in Greek with custom buttons to trigger actions. It also optimizes JPEG images to WebP and AVIF, has a nice UI to crop them, and serves them from a CDN.

### GitHub Actions

To keep CMS API calls to a minimum, I created an [action](https://github.com/features/actions) that pulls new data from Sanity.io, creates/updates/deletes files based on changes, and commits those changes. It’s triggered via a custom button in Sanity. This helps in scenarios where multiple changes happen -multiple photos uploaded, several posts written- resulting in a single website sync and a single API call.

### Cloudflare

CDN, DDoS mitigation, and bot management are some of the reasons I like [Cloudflare](https://www.cloudflare.com/). Bonus: a generous free tier.

### FFmpeg

I needed to crop, modify, blur, compress, lower quality, and mute a video—all in a [single command](https://www.ffmpeg.org/).

### Lighthouse

I used it via browser [dev tools](https://developer.chrome.com/docs/lighthouse/overview). It was an excellent indicator of what to change and what was holding back the website from loading properly with a good user experience.

### WebAIM

Check [color contrast](https://webaim.org/resources/contrastchecker/). Background and text colors should have high contrast to be easily readable.

### Copilot

You might wonder: “This bloke said he is a backend engineer, yet here we are talking about font subsetting, performance, image compression, Web Vitals, SEO, etc.” Enter [Copilot](https://github.com/features/copilot). I use it primarily as a pair programmer -constantly asking about the project’s direction, what to watch out for, and how to implement things. Most solutions I got stuck on were solved with custom code and heavy Googling. But what do you search for if you don’t know what to search for? LLMs helped me structure my initial queries to Google -and all of this inside my editor, minimizing context switching.

## Web Vitals (Performance)

For readability, I’m including only a fraction of the report for two pages. Feel free to visit [Web Vitals](https://pagespeed.web.dev) and run your own tests.

{{< image src="xot_homepage.jpg" caption="Web Vitals screenshot from <https://pagespeed.web.dev/> for xot.gr" alt="Web Vitals screenshot from <https://pagespeed.web.dev/> for xot.gr" >}}
{{< image src="xot_classes.jpg" caption="Web Vitals screenshot from <https://pagespeed.web.dev/> for xot.gr/classes" alt="Web Vitals screenshot from <https://pagespeed.web.dev/> for xot.gr/classes" >}}

There is only a small penalty in performance, accessibility, and SEO from some injected scripts from Google Maps and Cloudflare. Not worth fighting for at the moment.

## Answers to questions that may arise

### Why take a project like this when you prefer working with servers?

I consider myself an engineer. That being said, I craft systems. I may like working on some parts of a system more than others, but the end user does not *and should not* care about that. They care about the end product. I would be a terrible engineer if I selectively rejected work just because I don’t feel like it.

When working with a team, I mostly gravitate toward backend tasks because I feel I can provide a better, faster solution than my frontend colleagues. To consistently create solutions suited for user‑facing applications, one must understand the constraints of the client application (in this context, the website).

### Which part did you enjoy the most?

Pagefind. Period. I had to find a way to accommodate search on a static site. I had previously considered [lunr.js](https://lunrjs.com/) and [Algolia](https://www.algolia.com/). Reading the Pagefind docs and API felt familiar -easy to use, easy to understand.

A close second was dockerizing CLIs. To run [glyphhanger](https://github.com/zachleat/glyphhanger) to subset the fonts, I would otherwise need to install Python, globally install the glyphhanger library, and install FontTools, Brotli, and Zopfli. It may not seem difficult, but imagine having to do this for every library you want to explore -not for regular use, but just to try. Dockerize it, remove the container/image afterward, keep your workstation clean.

### What did you learn?

#### Web performance can be a PITA

In what order will your scripts load? How will they load? Setting image formats, crop for different screens, and load them based on their position in the viewport.
Forget to set a min‑height on the header? [CLS](https://web.dev/articles/cls) will spike.
Import fonts inside your Tailwind configuration instead of preloading them per page? Put [this](https://www.youtube.com/watch?v=XhzpxjuwZy0) on before opening the page.

#### Technology promises vs. reality

Once again, just because a technology promises solutions does not mean that it actually offers them. I fought with CMSes a lot. I wanted TinaCMS to work properly -I really did. After spending a week, simple things still didn’t work (like uploading an image and then failing to upload a second one in a post), so I started over with Sanity.

#### Accessibility is not only for people with disabilities

Not everyone is viewing your website on a 4K screen in [STP](https://en.wikipedia.org/wiki/Standard_temperature_and_pressure). They might be holding a newborn, using their non‑dominant hand, and not wearing their glasses. It is important to make your website as accessible as possible. Keyboard‑navigation‑friendly &#x2705;. Screen‑reader‑friendly &#x2705;. Proper color contrast &#x2705;.

### Which part provides the most value to the customer?

Keeping the running costs at $0: a static website, served by Cloudflare CDN, built on demand using GitHub Actions triggered by a custom button in the Sanity.io dashboard.

## Closing thoughts

Overall, it was an interesting project. I learned a lot, helped a local nonprofit, and polished my rusty frontend skills. Web performance is a big beast to tame, and keeping every Web Vitals metric green is hard.

I also learned that urgency can fade once a solution exists. As of now, the site still uses the default images and copy I provided. It has remained unchanged for about a month.
