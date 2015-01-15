# Puppet scripts

## Where
The puppet scripts can be found in the [https://github.com/oaeproject/puppet-hilary](puppet-hilary) repository.

## What
Our puppet scripts are used to define the state of each machine in the cluster. It will define:
 * configuration
 * packages to be installed
 * users to be created
 * ssh public keys
 * ..

# How

As most projects, we use Hiera in combination with puppet.

## Hiera
Each value that might change from server to server or environment to environment, should be defined through Hiera. All
Hiera configuration can be found under the `environments` directory. Each environment has its own directory, with its
own set of configuration. The hiera configuration will be loaded in the following order:
  - %{::clientcert}_hiera_secure
  - %{::clientcert}
  - %{nodetype}_hiera_secure
  - %{nodetype}
  - common_hiera_secure
  - common

You will notice that the `*_hiera_secure` files are not present in the repository. These files tend to contain sensitve
information such as API keys, passwords, etc.. They are NOT to be committed to the repository. They are however present
on the puppet master node.

As most projects, we make use of the `hiera_classes` functionality. This means that we can define which puppet classes
should be applied on which machines. `common.json` will hold all the common classes such as firewall rules, bash settings,
nagios checks, etc.. . More classes will be added depending on the node type. You'll notice that all these classe tend
to start with `::oaeservice`. The `oaeservice` module is a "special" module as it's the only one that will read information
from Hiera. All other puppet modules should aim to be Hiera agnostic and just be configurable through plain puppet
parameters. This rule has made it easier to bring in thirdy-party modules and walk the path to open-source some of our
own modules.


Additionally, each environment can have a puppet module which adds some extra logic. The qa environment for example,
needs this to install the reset scripts and cron job for example.

## Puppet modules

As said earlier, everything starts from the `oaeservice` module. Let's have a look at how we might deploy the Hilary
app server for example. The following files are important here:
 * environments/production/hiera/app.json
 * environments/production/hiera/common.json
 * modules/oaeservice/manifests/hilary.pp
 * modules/hilary/manifests/init.pp
 * modules/hilary/manifests/install/archive.pp

Let's start by looking at `environments/production/hiera/app.json`. In the `classes` array, you'll find that we want to
apply the `::oaeservice::hilary` class. This class can be found in `modules/oaeservice/manifests/hilary.pp`. As you can
see this class pulls a lot of data from Hiera and ensures that some dependencies are installed prior to installing Hilary.

Check out the `app_install_method` lines. We pull the installation method from Hiera (git or archive) and pass that on
to the `::hilary` class.

The `::hilary` class can be found in `modules/hilary/manifests/init.pp`. From here on, no data should be pulled from
Hiera anymore. Now, depending on that install_method, Hilary will be installed through git or pulled down as an archive.
