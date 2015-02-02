# Nagios

We use nagios extensively to run various checks. Among others we check:

 * Hilary is running on each app/activity/pp node
 * Cassandra is running on the db node (AND accepting queries)
 * Elasticsearch is running
 * etc..

We also use Nagios to monitor the Hilary error counts. The error count is
published to Redis (in the hash `oae-telemetry:counts:data` with key `logger:error.count`).
If this value goes past 10, Nagios will complain until it's been reset. Resetting
can be done through `redis-cli` on the `cache0` node:
cache0$ redis-cli
cache0$ redis 127.0.0.1:6379> hset oae-telemetry:counts:data logger:error.count 0
(integer) 1

