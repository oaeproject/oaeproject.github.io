# Overview

This page tries to give a general overview of how the OAE production environment is architected.

* 2 web nodes
* 4 app servers
* 3 activity servers
* 3 preview processor servers
* 3 etherpad servers
* 3 db servers
* 2 search servers
* 1 proxy server that proxies between the cache sers
* 2 caching servers (1 hot standby, cutover happens automatically )
* 2 queue servers
* 1 syslog server
* 1 puppet master server


# Web node

A web node
