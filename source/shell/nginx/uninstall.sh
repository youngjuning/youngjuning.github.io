#!/bin/bash
sudo service nginx stop
sudo apt-get --purge remove nginx
sudo apt-get --purge remove nginx-common
sudo apt-get --purge remove nginx-core
sudo apt-get autoremove
