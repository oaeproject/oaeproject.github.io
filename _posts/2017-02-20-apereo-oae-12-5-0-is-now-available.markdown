---
layout: post
title:  "New release: Apereo OAE 12.5.0!"
date:   2017-02-20 17:00:00
author_image: /assets/img/authors/salla.png
author: Salla Karppinen
---
<p>After a period of hibernation, Apereo Open Academic Environment (OAE) project is happy to announce a new minor release: OAE 12.5.0.</p><p>This release comprises some new features, usability improvements and bug fixes.</p><p>Our next step will be to improve documentation and to make the project more approachable to newcomers, but the team is also continuing to modernise the code base, so fear not; the next major release is on the horizon!</p>
<!--more-->
<h2>Changelog</h2>
  <h3>Administration improvements</h3><p>Both tenant and global administators can now use the administration interface to add a new logo for a tenancy.</p>
  <h3>Search improvements</h3><p>Private tenancies will no longer have content from other tenancies showing up in the search and similarly their content or users will never be visible in the search results of other tenancies.</p>
  <h3>Linked content improvements</h3><p>If a link is created pointing directly to a file, we will no longer trigger a download prompt when it's opened. Instead, OAE will attempt to embed the file where possible.</p>
  <h3>Activity feed and email bug fixes</h3><p>A bug where some user thumbnails occasionally caused a 401 error in the activity feed was fixed, as was an error where some characters were rendering incorrectly in emails.</p>
  <h3>Group bug fixes</h3><p>Deleted users will no longer have links to their homepages in groups. Additionally, a bug where a user's name would sometimes not be displayed correctly in a group's members list was fixed.</p>
<h2>Try it out</h2>
  <p>OAE 12.5.0 can be experienced on the project's QA server at <a href="http://oae.oae-qa0.oaeproject.org" target="_blank">http://oae.oae-qa0.oaeproject.org</a>. It is worth noting that this server is actively used for testing and will be wiped and redeployed every night.</p>
  <p>The source code has been tagged with version number 12.5.0 and can be downloaded from the following repositories:</p>
  <p>Back-end: <a href="https://github.com/oaeproject/Hilary/tree/12.5.0" target="_blank">https://github.com/oaeproject/Hilary/tree/12.5.0</a></p>
  <p>Front-end: <a href="https://github.com/oaeproject/3akai-ux/tree/12.5.0" target="_blank">https://github.com/oaeproject/3akai-ux/tree/12.5.0</a></p>
  <p>Documentation on how to install the system can be found at <a href="https://github.com/oaeproject/Hilary/blob/12.5.0/README.md" target="_blank">https://github.com/oaeproject/Hilary/blob/12.5.0/README.md</a>.</p>
  <p>The repository containing all deployment scripts can be found at <a href="https://github.com/oaeproject/puppet-hilary" target="_blank">https://github.com/oaeproject/puppet-hilary</a>.</p>
<h2>Get in touch</h2>
  <p>The project website can be found at <a href="http://www.oaeproject.org" target="_blank">http://www.oaeproject.org</a>. The project blog will be updated with the latest project news from time to time, and can be found at <a href="http://www.oaeproject.org/blog" target="_blank">http://www.oaeproject.org/blog</a>.</p>
  <p>The mailing list used for Apereo OAE is <a href="mailto:oae@apereo.org">oae@apereo.org</a>. You can subscribe to the mailing list at <a href="https://groups.google.com/a/apereo.org/d/forum/oae" target="_blank">https://groups.google.com/a/apereo.org/d/forum/oae</a>.</p>
  <p>Bugs and other issues can be reported in our issue tracker at <a href="https://github.com/oaeproject/3akai-ux/issues" target="_blank">https://github.com/oaeproject/3akai-ux/issues</a>.</p>
