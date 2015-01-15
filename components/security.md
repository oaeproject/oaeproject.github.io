# Security

Each server in the environment has 2 network interfaces:
 * 1 internal interface
 * 1 public interface

The internal interface points to a private VLAN on which only OAE production machines are connected. The public interface
connects to the outside world.

Each server is firewalled off through a set of iptables rules. All incoming traffic on the public interface is dropped
on each server except on:
 * 80, 443 on the web nodes
 * 22 on the bastion host

Each server is allowed to have outgoing traffic on the public interface though. This is required as some servers need
access to things such as npmjs, the web (pp nodes), updates, etc..

The bastion host is the only host that accepts ssh traffic on its public interface. SSH is only allowed through
public-key authentication
