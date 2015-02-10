# Provisioning module

## Where
The provisioning scripts can be found in [the oae-provisioning repository](https://github.com/oaeproject/oae-provisioning).

## What

It defines how an environment (qa, staging, production, ..) should look like.
It holds the following information:
 * The name of the environment (`staging`, `production`, ..)
 * The account that should be used in Joyent
 * Which datacenter the servers should be provisioned in (Amsterdam, NY, ..)
 * The number of nodes that should be created
    * Each nodetype is templated. For example, an app server only needs 512MB RAM and a single CPU.
      The templates file will define this for each group (app, cache, db, search, pp, ...)


## How

Actual provisioning happens through [slapchop](https://github.com/oaeproject/slapchop) and from the `oae-provisioning`
directory


### Listing an existing environment

The following lists all the servers in the QA environment

```
$ slapchop -d qa
[slapchop] Environment: qa
[slapchop] Account:     *****
[slapchop] Data Center: eu-ams-1
[slapchop]
[slapchop] Fetching remote machine information
Enter PEM pass phrase:
[puppet] I am in state "running" with IP *****
[qa0] I am in state "running" with IP *****
[qa1] I am in state "running" with IP *****
[qa2] I am in state "running" with IP *****
[unit0] I have not been bootstrapped
[release0] I am in state "running" with IP *****
[slapchop] Complete
```

What happened here is that Slapchop will:
 - Get the running servers in the QA environment from the Joyent API
 - read the template and provisioning file from the QA directory
 - match the provisioning file against the output from the API and display what is running

### Provision all the servers in an environment

`slapchop -d qa bootstrap`

### Destroy all the servers in an environment

`slapchop -d qa destroy`

### Destroy a specific server in an environment

```
$ slapchop -d qa destroy -i qa1
[slapchop] Environment: qa
[slapchop] Account:     sakaigerqa
[slapchop] Data Center: eu-ams-1
[slapchop]
[slapchop] Fetching remote machine information
Enter PEM pass phrase:
prompt: The following machines will be irrecoverably destroyed: ["qa1"]. Continue? (y / n):
...
```
