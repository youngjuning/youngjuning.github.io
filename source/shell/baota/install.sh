#!/bin/bash
docker run -tid --name baota --net=host --privileged=true --shm-size=1g --restart always -v baota_www:/www -v ~/wwwroot:/www/wwwroot pch18/baota
