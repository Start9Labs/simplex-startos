#!/bin/sh

set -e 

mkdir -p /mnt/backup/etc
mkdir -p /mnt/backup/log
compat duplicity create /mnt/backup/etc /etc/opt/simplex
compat duplicity create /mnt/backup/etc /etc/opt/simplex-xftp
compat duplicity create /mnt/backup/log /var/opt/simplex