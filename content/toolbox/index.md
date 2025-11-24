---
title: My toolbox
summary: Tools that I use to deliver reliable software
layout: single
slug: toolbox
image: toolbox-open-grey.jpg
imageCaption: An open toolbox in grey
readingTime: true
credits:
  - text: Photo by Dan Crile on Unsplash
    url: https://unsplash.com/@dancrile?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

Disclaimer: This is a live document; tools may change as I evolve as a programmer.

## Core Languages

### Go

**Binaries and simple API servers**. I find that Go hits the sweet spot between agility and robustness for rapid iterations that may evolve into a full-blown solution in the future. The huge standard library, predictable performance, and the ergonomics of the language are solid reasons to choose it.

### Elixir

**MVP creation**. BEAM’s fault tolerance, Ecto’s integration with the database, the LiveView paradigm of UI creation, and the readability of Elixir are just some of the reasons to choose it. It is perfect for full-blown web apps.

### Node.js

**Scripting and SPAs**. Each year I move away a bit more from Node.js and its ecosystem. Do not get me wrong: Node.js has become a wonderful runtime to work with. Much of the ecosystem is not viable for long-running applications and servers. To keep a system safe, you have to live on the bleeding edge. In all of my previous Node.js-centric jobs, we needed at least two developer-weeks (code reviews and non-automated tests included) each year just to update all the libraries and the runtime to the latest version. However, it is a popular language/runtime. It is easy to find people to work on/maintain the project once started.

## Frameworks/Libraries

### Tailwind

1. No countless hours spent talking about naming CSS classes; no nit PR comments; no BEM; no SMACSS.
2. No duplicated CSS just because there are different classes.
3. No need for critical CSS.
4. No need for a reset stylesheet.
5. No need for a design system.
6. HTML snapshot testing also tests CSS changes.

Tailwind is an amazing concept. It removes so much cognitive load from the developer's mind.

### Hugo

If you need a static site, Hugo has your back. Scales to thousands of pages. Builds almost instantly. It is stable. It has image resizing, cropping, quality control, and JPG to WebP conversion. It integrates well with tools like Tailwind.

## Data Stores

### SQLite

**Prototyping, binaries, and MVPs**. Using WAL mode to sync to object storage for extra durability—chef's kiss.

### PostgreSQL

**Web apps and servers** that require more than **100 writes/second** and/or heavy analytics workloads.

### Redis

**Caching and ephemeral state**. Workers, database caching, and data sync between different application nodes mostly.

### R2

**Object storage**. It is S3-compatible and is provided by Cloudflare.

### Pagefind

**Static search** for static websites made easy.

## Messaging

I have worked with both **RabbitMQ** and **Kafka**. I find RabbitMQ easier to set up. However, once set up, both are robust, reliable solutions for burst smoothing and retries. Decoupling enables resilience, and these tools stabilize the system under load spikes. However, I typically introduce these in already established applications because there is significant operational overhead.

## Infrastructure

### Docker

I am a **containerize-everything** person. The benefits of reproducibility and security outweigh the small overhead of setting up Docker. Used in **testing** (testcontainers), **development** (devcontainers), and **production**.

### GitHub Actions

Automate everything: linting, formatting, testing, security checks, deployment to staging, deployment to production, packaging for XYZ platform. Using either GitHub's or self-hosted runners.

### Cloudflare

CDN, request caching, bot mitigation, Brotli compression, missing headers? Cloudflare covers.

## Observability

I have worked with various technologies in the past, mostly with Datadog and New Relic. What I value most are:

- Structured logging
- Metrics (RED/USE patterns)
- Tracing readiness (OpenTelemetry)
- Actionable alert thresholds (avoid noise)

## Architecture & Design Principles

These are conceptual, cognitive tools but deserve a place here.

- 12-factor alignment
- Configuration over hardcoding
- Domain-Driven Design
- Test-Driven Design

## Tool Selection Criteria

- Maturity
- Community health
- Licensing
- Integration effort
- Lower recurring OPEX
