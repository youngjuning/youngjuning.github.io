#!/bin/bash
if [[ "$(docker images -q baota 2> /dev/null)" != "" ]];
then
  docker rmi baota
fi
docker commit -a "backup_shell" -m "backup baota" -p baota baota
docker save -o baota.tar baota
