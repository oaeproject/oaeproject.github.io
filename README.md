# The oaeproject website

This repository contains all the logic that is driving the [OAE project's website](http://oaeproject.org).

## How it works

All content is statically generated through [Jekyll](https://jekyllrb.com) and hosted on [GitHub Pages](https://pages.github.com). This means that there's no external webserver required to host anything.

### Local development

Install the jekyll gem (`gem install jekyll`) and run `jekyll serve` from the root directory of this repository. This will fire up a local HTTP server and serve the website at [http://localhost:4000](http://localhost:4000). Every time you edit a page or blogpost, jekyll will regenerate the appropriate files.

### Updating the live website

Commit the changes you'd like to make to the master branch, push them to the origin (oaeproject/oaeproject.github.io) repository and GitHub will automatically deploy a new version for you. Depending on the load on their servers, this could take up to a minute.

### Adding a blogpost

All blogposts are stored under the `_posts` directory. Simply add a new file (ensure it's name follows the YYY-MM-DD-simple-title.markdown format) that has the following information in it:
```
---
layout:       post
title:        "<Your title goes here>"
date:         <Date in YYYY-MM-DD HH:mm:ss format>
author:       <The plain text author>
author_image: <A URL to an author image, check out /assets/img/authors. It defaults to nicolaas>
banner:       <a URL to a banner image>
---
<your intro message goes here>
<!--more-->
<the rest of the blogpost goes here>
```
