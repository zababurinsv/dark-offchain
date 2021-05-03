#!/usr/bin/env bash

set -e

echo "*** Initialising ProductgreSQL"

#sudo apt update

sudo apt install postgresql postgresql-contrib

sudo su - postgres -c "createdb darkdot"
sudo -u postgres psql -c "create user dev with encrypted password 'RedN0seReind33r';"
sudo -u postgres psql -c "grant all privileges on database darkdot to dev;"
