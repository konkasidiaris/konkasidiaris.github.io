---
title: Website credits
date: 2025-11-11
draft: false
slug: credits
image: respect.jpg
imageCaption: Graffiti-tag on wall saying respect with a sad face
readingTime: true
summary: Pay respect to the giants on whose shoulders this website stands
tags: [oss, hugo, tailwind, web, go, docker]
credits:
    - text: Photo by Claudio Schwarz on Unsplash
      url: "https://unsplash.com/@purzlbaum?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
---

This blog is based entirely on open source technologies. Here's what powers it.

## Tech You See

### Hugo

[Hugo](https://gohugo.io/) is a static site generator (SSG). This website is designed to
feel and be snappy for the reader—hence the SSG. Hugo, however, does much more than
build HTML, CSS, and JS. It also optimizes images, which by itself is a huge win.

### Tailwind

[Tailwind](https://tailwindcss.com/) is a CSS utility framework. Using Tailwind
relieves the pain of creating a whole design system, because as a proper framework,
it handles typography and class naming conventions. In other words, it saves you time.

### Heroicons

[Heroicons](https://heroicons.com/) is a collection of SVGs by the makers of *Tailwind*.
It saves a lot of time searching for good SVGs.

### Pagefind

[Pagefind](https://pagefind.app/) is a fully static search library. It builds the
search indexes at website build time and performs extremely well.

## Behind the Curtains

### Docker

[Docker](https://www.docker.com/) is a containerization technology. It is used alongside
devcontainers and CLI tools (eg. Glyphhanger).

### Go

[Go](https://go.dev/) is a programming language made by Google. It also powers *Hugo*.
The scripts used in this website are written in Go.

### SVGO

[SVGO](https://svgo.dev/) is a tool that optimizes SVGs to serve them faster.

### Glyphhanger

[Glyphhanger](https://github.com/zachleat/glyphhanger) is a tool for font subsetting.
It would be silly to serve fonts for languages that aren't used on this website, wouldn't it?

## Other Services

### Unsplash

[Unsplash](https://unsplash.com/) is a directory of royalty-free photos from professional
photographers.

### SVGRepo

[SVGRepo](https://www.svgrepo.com/) is a directory of SVGs. I found some SVGs here that I could not find in *Heroicons*.

*Thanks to these projects and services for making this site possible.*
