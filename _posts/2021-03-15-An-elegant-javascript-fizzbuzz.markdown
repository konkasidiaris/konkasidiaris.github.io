---
title: "An elegant javascript fizzbuzz take off"
layout: post
date: 2021-03-15 06:00
image: /assets/images/2021-03-15/fizzbuzz.png
headerImage: true
tag:
  - javascript
  - code-quality
star: false
category: blog
author: konkasidiaris
description: During the quest of creating better engineers in my team I fell on an article for an elegant take off fizzbuzz in clojure. This is my take of it in javascript
---

## The trigger

While I was scrolling on my LinkedIn feed, I fell upon [this](https://blog.klipse.tech/clojure/2020/09/11/fizbuzz-clj.html) article -I think it was posted on [clojure users group](https://www.linkedin.com/groups/1058217/). To be honest I was skeptical, it seemed a nice approach on a problem that most people discuss only on interviews (spoiler alert: it is an everyday problem). I kept it buried in the back of my head until recently.

A pull request was assigned to me, to review a super complex piece of code of a colleague, where I felt I was deep in a jungle consisted of _if/else_'s. Then it hit me, I rewrote the most complex part of it using the aforementioned technique, discussed which one was a better approach to the problem with the other engineer and both happily concluded to the latter. A few commits later we were ready to go.

The problem now is **how to communicate this to the rest of the team!**

## Preparation

There is no need to re-invent the wheel. The fizzbuzz problem is a perfect use case. Sadly, I could not just post the same article on the engineering slack group, firstly because our main language of choice is javascript and secondly because most engineers are juniors and I did not want to scare them with another wild language.

In my opinion, the best way to present it is, to pinpoint the problem of the if/elses and then to suggest a solution, so I did the following.

1. I created 3 versions of the fizzbuzz, each one developed as it was refactored from the previous code
2. Added some commentary in first person language (so it would be more direct to my colleagues) where I explained the way I think
3. Some sprinkles of humor
4. Send the whole post to a couple of other engineers outside my team for some peer review

## The actual post (translated from greek)

Gals & Guys, there is something about code quality which I do not think we will ever have the time to discuss in an backend alignment(that is how we call our weekly retrospectives).
It is called branchless programming. It is a way of removing logic from the code, making exceptional cases common.
I will demonstrate my thoughts by trying to solve the common fizzbuzz problem. For those of you who are unaware of it, fizzbuzz is a program that takes an positive **integer** and prints every number from 0 to that **integer**. If the number to print is multiple of 3 print "Fizz", if the number to print is multiple of 5 print "Buzz" and if the number to print is multiple of both 3 and 5 print "FizzBuzz".

The first thing that comes to ones mind is:

```
function fizzBuzz(number) {
  for (let i = 1; i <= number; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}
```

take a step back and observe our solution. Does it work? Yes. Is it peculiar that for a problem simple as that we got four different branches (thus complexity)? Also, yes.
Thinking about it a bit more, we can write it again with 2 less branches, using the magic of "falsy" and "truthy" of javascript as well as keeping state of the string to print
our code now is the following:

```
function fizzBuzz(number) {
  for (let i = 1; i <= number; i++) {
    let str = "";
    if (i % 3 === 0) {
      str += "Fizz";
    }
    if (i % 5 === 0) {
      str += "Buzz";
    }
    console.log(str || i);
  }
}
```

Still! There is a problem so simple and it requires handling of two different cases. Every time, we shall check what happens for bot multiples of 3 and 5. I thought we were true developers, forged by boredom. We do not have time to check two whole different cases. If we squeeze our brains a little more, there comes this wild idea of using data structures. More specifically, the one which is a collection, does not change the series of its content and there is an index of showing us where is what. ...Drumroll... Arrays!

Now our code is awesome:

```
function fizzBuzz(number) {
  const fizz = ["Fizz", "", ""];
  const buzz = ["Buzz", "", "", "", ""];
  for (let i = 1; i <= number; i++) {
    console.log(fizz[i % 3] + buzz[i % 5] || i);
  }
}
```

we see that our code is dumb now. There are no branches, no special cases!

Disclaimers:

- Maybe this is not the most performant way or the one that comes first in mind but it is the simplest by far!
- You may use a map instead of an array
- The reason that I share this with you, is to show that every problem has many different solutions. Using branchless programming we can build reliable applications which are simple(not to be confused with easy) without big surface for mistakes

Thoughts?

## How the team took it

Nobody liked it. Everyone told how this is not ok, it feels strange and complex. I fell from my pink, cotton candy cloud. I thought this was an eye opener but everyone else said the second solution was the most appropriate. I was sad. I questioned myself a lot. I personally could not see how everyone thought that the second was the best/simplest solution. Then one day, as I reviewed another PR, I saw that my colleague who previously thought that the third solution was damn peculiar has used it to implement a feature. When I asked him about it, his response was "Welp, given an example as simple as fizzbuzz did not demonstrate the full power of it. When I faced a callback pyramid with sprinkles of if/else here and there, I thought **Let's give Konstantinos' way a chance** and it worked, thanks"

OMG I am happy.

## Conclusion

Give a problem to six developers and six different working solutions will be presented to you. The hard thing about working with other people is the asynchronous communication through code. The machine can understand equally good the code it is given to. It is the people that need to read more well written, simpler code.
There are many parts of the main application my team develops that are written in the discussed way.

#### Mentions

- [Image](https://www.ezrahill.co.uk/2019/04/14/the-fizzbuzz-question)
- [Blogpost](https://blog.klipse.tech/clojure/2020/09/11/fizbuzz-clj.html)
