---
title: "Photo tag"
date: 2026-09-05T00:00:00Z
draft: false
slug: photo_tag
image: photos.jpg
imageCaption: 4 instant photos on a desk
readingTime: true
summary: How to search a bucket of more than 10.000 items with privacy in mind
tags: ["NAS", "Python", "Local AI", "GO", "SQLite", "Docker", "HTMX", "Tailwind"]
credits: 
    - text: Photo by Corinne Kutz on Unsplash
      url: "https://unsplash.com/@corinnekutz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
---

## Some Context

My wife and I back up photos taken by our phones automatically to our NAS. Why NAS and not **insert_famous_company_s_name_here** photos application? We value our privacy. We simple do not like the idea of models training on our family's data.

The thing is that our solution so far was 2 buckets of photos on NAS, each one acting as a back up of each of our smartphones respectively. As you already thiking, this is not scalable. In just about 1 year, we have more than 10.000 photos, with obfuscated names like `PHONE_2026080822351234.jpeg`.

My wife likes order. Sometimes she is adamant about it. Her biggest issue with that stuff was not that there were 2 buckets with all the photos scattered inside but that these were not inside nicely made folders like `Wife's birthday 2025`. Her idea was to spend a weekend or so to organize every photo we had taken so far.

## My point of view

My initial thoughts were "That's not scalable, we are going to need a weekend spend on photo taxonomy at least once a year"! Coding to the resque.

## The problem

The thing is that it's not that my wife likes pretty folders, complex directory structures and stuff. She just wants to find what she is looking for easily. To be honest, I like that too. Scrolling and searching thousands of photos in the not so UX friendly app of the NAS, is not the thing everyone was wishing for.

**A high level solution would be an app that given a couple of filters or a free text, would find the photos that we are searching for.**

### Breakdown

In order for a program to search through photos, photos should carry the proper metadata. For example

```json
{
    "tags": ["beach", "candles", "birthday"],
    "people": ["mother", "kid"],
    "date": "2026-09-05T17:35:00Z",
    "location": "/absolute/path/to/file.jpg"
}
```

1. Some of these can be found by viewing the [EXIF](https://en.wikipedia.org/wiki/Exif) data of the image, like **date**, **thumbnail** and **location** if it is enabled in your phone.
1. The others are not so easy to create. Or is it? AI to the resque! I am not an AI maximizer, do not get me wrong. This is exactly the type of problems AI excels at, pattern recognition and classification.
  There are 2 cases where we need to fetch metadata:
    - initially to cover every existing photo
    - when new photos are added to the buckets
1. OK, let's say we have a way to extract this kind of data from every photo. We need to frequently query on this data, so we will store it on a database.
1. Data querying and fetching should be easy for non technical people, a nice simple interface is needed.
1. This should run entirely on NAS. Meaning 4GB of RAM and an Intel Celeron CPU. Thus the AI should be local and the routine should not be resource hungry!
1. Privacy! No outside-world calls.

### Problem 1: Models need RAM and resources

Having models loaded in the memory 24/7 is inefficient. The application will consist of two parts:

- A service which upon receiving requests will load the models in memory, respond to all incoming requests and after some idle time, stop, thus freeing the resources.
- A daemon/server which will be on top of everything else, extracting metadata from exif, read/write from thedatabase, serving the UI, on top of cronjobs, listen to ionotify for folder changes etc.

In order to handle the start/stop of the first service, I used an NGINX as reverse proxy. Upon receiving requests, it starts the service container. When more than 2 minutes without request have passed, it stops the service.

NOTE: *the service could be a command but -as I quickly found out- loading the models in memory has an overhead of ~10 seconds. This is heavy price to pay for thousands of photos*

### Problem 2: Image classification

I had my fair time of brainstorming with LLMs in order to find where should I start here. I am not an AI affictionado. I had to find my way around hugging face, the various models that exists, the industry standards etc. Long story short, if I use python to interact with the AI's, it would be easier and as a classification model for my low performance NAS, [openai/clip-vit-base-patch32](https://huggingface.co/openai/clip-vit-base-patch32) would be sufficient.

I set up a [FastAPI](https://fastapi.tiangolo.com/) project with the help of [uv](https://docs.astral.sh/uv/) and my beloved [devcontainers](https://containers.dev/).

The service has only 2 endpoints:

- `GET /health` with a typical `200` `{ "status": "ok" }` response
- `POST /images/labels` which accepts a multipart request with an `image` field and responds with

```json
{
  "labels": {
    "setting": [{"label":"beach","confidence":0.88}, ...],
    "people": [{"label":"small_group","confidence":0.34}, ...]
  }
}
```

The model works by providing it a list of labels and an image and it responds with confidence per label.
I kinda wanted a structured response and as much confidence as possible for each photo so I let performance take a hit and run the model 5 times for each photo, in order to have the following categories of tags:

```json
{
    "people": [
        "no_people",
        "single_person",
        "two_people",
        "small_group",
        "large_group",
        "family_group",
        "adult_and_child",
        "multiple_children",
        "multiple_adults",
        "baby_present",
        "toddler_present"
    ],
    "setting": [
        "indoor",
        "outdoor",
        "home",
        "living_room",
        "kitchen",
        "bedroom",
        "garden",
        "park",
        "beach",
        "pool",
        "restaurant",
        "school",
        "playground",
        "street",
        "travel_destination"
    ],
    "activity": [
        "portrait",
        "group_portrait",
        "candid",
        "playing",
        "eating",
        "cooking",
        "talking",
        "hugging",
        "holding_child",
        "walking",
        "running",
        "sitting",
        "standing",
        "celebrating",
        "opening_gifts",
        "blowing_candles",
        "taking_selfie",
        "posing_for_camera"
    ],
    "occasion": [
        "everyday",
        "birthday",
        "holiday",
        "vacation",
        "wedding",
        "graduation",
        "party",
        "family_reunion",
        "christmas",
        "new_year",
        "religious_event",
        "sports_event",
        "school_event"
    ],
    "photo_characteristics": [
        "close_up",
        "medium_shot",
        "wide_shot",
        "selfie",
        "group_photo",
        "landscape",
        "portrait_orientation",
        "old_photo",
        "black_and_white",
        "photo_of_photo",
        "indoor_low_light",
        "outdoor_daylight"
    ]
}
```

### Problem 3: Image Recognition

Did you know that CLIP models, responsible for image classification suck at image recognition? I did not. So it was a bummer when I found out. Having the classification model labeling an image as "adult_and_child" is not sufficient enough. Spending a couple of hours brainstorming with LLMs again, I found out about a pretrained model for face recognition called [insightface](https://www.insightface.ai/).

The best way to use it is to generate image embeddings for the people you want it to recognize. 3-5 pictures at most for each person. I went with 4 pictures per family member. One *en face*, two *profile* pictures, left/right side respectively and 1 more *en face* wearing sunglasses.

NOTE: *image embeddings are biometric data and should be treated with care. If you make such an app on your own, do not commit them to any VCS and/or upload them online*

Then I enriched the existing `POST /images/label` endpoint's response:

```json
{
  "people": [{"name":"Konstantinos", "confidence":0.9834, ...}],
  "labels": {
    "setting": [{"label":"beach","confidence":0.88}, ...],
    "people": [{"label":"small_group","confidence":0.34}, ...]
  }
}
```

and for sanity reasons I also enriched the `GET /health` endpoint's response:

```json
{ "status": "ok", "people_loaded": 3 }
```

### Problem 4: Models reaching to the internet

During development, it came to my attention that models were trying to connect to hugging face.
After a quick search, I understood that libraries were searching for models in Hugging Face too, not only locally thus I added this to the `Dockerfile`:

```Dockerfile
ENV HF_HUB_OFFLINE=1
ENV TRANSFORMERS_OFFLINE=1
```

In order to be 100% sure that there is no chit chatting with any third party, I built a docker image and run it with the `--network=none`, in order to be sure that it works offline.

Up to this point, the first service is completed!

### Problem 5: The daemon

The server that would run 24/7 on the NAS should by any means be light on resources. That prohibits the usage of VM languages (eg python, server-side javascript, elixir, java).
It should also be cross platform, as it would be developed and tested on a linux machine and run on another platform. **GO** enters the chat, this is were it shines.

Database server should be easy on resources too. As the scale will not be that much. Let's say that we produce `10.000 photos/year * 20 years = 200.000 photos` to search. Let's get rid of the server, use just a file but keep all the SQL niceties. **SQLite** it is. If it is suficient for an [Airbus A350](https://www.sqlite.org/famous.html), it will do for this usecase.

**Why a daemon and not just a webserver with a couple of cronjobs though?**

It would be far easier to listen to `ionotify` (or similar tech depending on the platform) and store the new picture location in the database in order to be processed later than to compare which photos are not in the database or check a whole bucket's photos' timestamps again and again daily.

#### Listen for file events

#### Cronjob

### Problem 6: Extracting EXIF data

### Problem 7: Store EXIF and photo_tag data to DB

### Problem 8: User interaction

#### HTMX

#### Templ

#### Tailwind

### Problem 9: Logging & Monitoring

### Problem 10: Distribution

## Final product

## Repositories

This work is open-source, please have a look and get inspired for your own projects:

- [photo_tag repository](https://github.com/konkasidiaris/photo_tag)
- [photo_daemon repository](https://github.com/konkasidiaris/photo_daemon)

## Closing Thoughts

This was an amazing experiment. I learnt a lot about local AI. I had fun working with python after years, the ecosystem around the language has changed A LOT. Containers proved once again their amazing value. Working on constrained environments had me question a lot of **best practices** and **industry standards** out there. Last but not least, I made my wife happy and saved us a couple of weekends.
This was a refreshing reminder that coding is fun.
