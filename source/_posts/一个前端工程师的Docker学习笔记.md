---
title: 一个前端工程师的Docker学习笔记
date: 2020-03-31 00:23:31
categories:
  - [运维, Docker]
tags:
  - [学习笔记]
---

![](https://i.loli.net/2020/03/31/UI9JSTCENRvqDwY.png)

<!--more-->

Docker 是个划时代的开源项目，它彻底释放了计算虚拟化的威力，极大提高了应用的维护效率，降低了云计算应用开发的成本！使用 Docker，可以让应用的部署、测试和分发都变得前所未有的高效和轻松！

无论是应用开发者、运维人员、还是其他信息技术从业人员，都有必要认识和掌握 Docker，节约有限的生命。

本文是笔者以一个前端工程师的视角学习 Docker 过程中的笔记，如果对您有所帮助，荣幸之至。

# 基础入门

**Docker** 使用 `Google` 公司推出的 [Go 语言](https://golang.org/) 进行开发实现，基于 `Linux` 内核的 [cgroup](https://zh.wikipedia.org/wiki/Cgroups)，[namespace](https://en.wikipedia.org/wiki/Linux_namespaces)，以及 [OverlayFS](https://docs.docker.com/storage/storagedriver/overlayfs-driver/) 类的 [Union FS](https://en.wikipedia.org/wiki/Union_mount) 等技术，对进程进行封装隔离，属于 [操作系统层面的虚拟化技术](https://en.wikipedia.org/wiki/Operating-system-level_virtualization)。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。最初实现是基于 [LXC](https://linuxcontainers.org/lxc/introduction/)，从 0.7 版本以后开始去除 `LXC`，转而使用自行开发的 [libcontainer](https://github.com/docker/libcontainer)，从 1.11 开始，则进一步演进为使用 [runC](https://github.com/opencontainers/runc) 和 [containerd](https://github.com/containerd/containerd)。

## 概念

### **DevOps**

DevOps（**Dev**elopment和**Op**erations的组合词）是一种重视软件开发人员（Dev）和IT运维技术人员（Ops）之间沟通合作的文化、运动或惯例。透过自动化“软件交付”和“架构变更”的流程，来使得构建、测试、发布软件能够更加地快捷、频繁和可靠。

DevOps 的引入能对产品交付、[测试](https://zh.wikipedia.org/wiki/测试)、功能开发和[维护](https://zh.wikipedia.org/wiki/軟體維護)（包括曾经罕见但如今已屡见不鲜的“[热补丁](https://zh.wikipedia.org/wiki/Hot_fix)”）起到意义深远的影响。在缺乏 DevOps 能力的组织中，开发与运营之间存在着信息“鸿沟”。例如运营人员要求更好的可靠性和安全性，开发人员则希望[基础设施](https://zh.wikipedia.org/wiki/基础设施)响应更快，而业务用户的需求则是更快地将更多的特性发布给最终用户使用。这种信息鸿沟就是最常出问题的地方。

### 容器

容器有效地将由单个操作系统管理的资源划分到孤立的组中，以更好地在孤立的组之间平衡有冲突的资源使用需求。与虚拟化相比，这样既不需要指令级模拟，也不需要即时编译。容器可以在核心 CPU 本地运行指令，而不需要任何专门的解释机制。此外，也避免了准虚拟化（para-virtualization）和系统调用替换中的复杂性。

### 虚拟化

在计算机技术中，虚拟化是一种资源管理技术，是将计算机中的各种实体资源，如服务器、网络、内存及存储等，予以抽象、转换后呈现出来，打破实体结构间的不可切割的障碍，使用户可以用比原来的组态更好的方式来应用这些资源。

### Docker 与虚拟机比较

| 特性       | 容器               | 虚拟机      |
| ---------- | ------------------ | ----------- |
| 启动       | 秒级               | 分钟级      |
| 硬盘使用   | 一般为 `MB`        | 一般为 `GB` |
| 性能       | 接近原生           | 弱于        |
| 系统支持量 | 单机支持上千个容器 | 一般几十个  |

如下图，虚拟机是在硬件层面实现虚拟化，需要额外的虚拟机管理应用和虚拟机操作系统层。Docker容器是在操作系统层面上实现虚拟化，直接复用本地主机的操作系统，因此更加轻量级。

![](https://i.loli.net/2020/03/31/mZiyHL2kGAgrMFx.png)

### Docker核心概念

#### 镜像（Image）

我们都知道，操作系统分为内核和用户空间。对于 Linux 而言，内核启动后，会挂载 `root` 文件系统为其提供用户空间支持。而 Docker 镜像（Image），就相当于是一个 `root` 文件系统。比如官方镜像 `ubuntu:18.04` 就包含了完整的一套 Ubuntu 18.04 最小系统的 `root` 文件系统。

Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

**分层存储**

因为镜像包含操作系统完整的 `root` 文件系统，其体积往往是庞大的，因此在 Docker 设计时，就充分利用 [Union FS](https://en.wikipedia.org/wiki/Union_mount) 的技术，将其设计为分层存储的架构。所以严格来说，镜像并非是像一个 ISO 那样的打包文件，镜像只是一个虚拟的概念，其实际体现并非由一个文件组成，而是由一组文件系统组成，或者说，由多层文件系统联合组成。

镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像。因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉。

分层存储的特征还使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。

#### 容器（Container）

镜像（`Image`）和容器（`Container`）的关系，就像是面向对象程序设计中的 `类` 和 `实例` 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 [命名空间](https://en.wikipedia.org/wiki/Linux_namespaces)。因此容器可以拥有自己的 `root` 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。也因为这种隔离的特性，很多人初学 Docker 时常常会混淆容器和虚拟机。

前面讲过镜像使用的是分层存储，容器也是如此。每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为 **容器存储层**。

容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。

按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用 [数据卷（Volume）](https://vuepress.mirror.docker-practice.com/data_management/volume.html)、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高。

数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷后，容器删除或者重新运行之后，数据却不会丢失。

#### 仓库注册服务器（Registry）

一个 **Docker Registry** 中可以包含多个 **仓库**（`Repository`）；每个仓库可以包含多个 **标签**（`Tag`）；每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 `<仓库名>:<标签>` 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 `latest` 作为默认标签。

以 [Ubuntu 镜像](https://hub.docker.com/_/ubuntu) 为例，`ubuntu` 是仓库的名字，其内包含有不同的版本标签，如，`16.04`, `18.04`。我们可以通过 `ubuntu:16.04`，或者 `ubuntu:18.04` 来具体指定所需哪个版本的镜像。如果忽略了标签，比如 `ubuntu`，那将视为 `ubuntu:latest`。

仓库名经常以 *两段式路径* 形式出现，比如 `jwilder/nginx-proxy`，前者往往意味着 Docker Registry 多用户环境下的用户名，后者则往往是对应的软件名。但这并非绝对，取决于所使用的具体 Docker Registry 的软件或服务。

**公有 Docker Registry：**

-  [Docker Hub](https://hub.docker.com/)
- [网易云镜像服务](https://c.163.com/hub#/m/library/)
- [DaoCloud 镜像市场](https://hub.daocloud.io/)
- [aliyun镜像库](https://cr.console.aliyun.com/)

**私有 Docker Registry：**

- [Sonatype Nexus](https://vuepress.mirror.docker-practice.com/repository/nexus3_registry.html)
- [Harbor](https://github.com/goharbor/harbor)

### 守护进程 daemon

在一个多任务的电脑操作系统中，守护进程（daemon）是一种在后台执行的电脑程序。此类程序会被以进程的形式初始化。守护进程程序的名称通常以字母”d“结尾：例如，`syslogd` 就是指管理系统日志的守护进程。

通常，守护进程没有任何存在的父进程（即PPID=1），且在 UNIX 系统进程层级中直接位于 init 之下。守护进程程序通常通过如下方法是自己成为守护进程：对一个子进程进行 fork，然后使其父进程立即终止，使得这个子进程能在 init 下运行。这种方法通常被称为”脱壳“。

系统通常在启动时一同引导守护进程。守护进程为对网络请求，硬件活动等进行响应，或其他通过某些任务对其他应用程序的请求进行回应提供支持。守护进程也能够对硬件进行配置（如某些Linux系统上的devfsd），运行计划任务（例如cron），以及运行其他任务。

在 DOS 环境中，此类应用程序被称为驻留程序（TSR）。在 Windows 系统中，由称为 Windows服务的应用程序来履行守护进程的职责。

在原本的 Mac OS 系统中，此类应用程序被称为”extensions“。而作为 Unux-like 的 Mac OS X 有守护进程。

## 安装配置

- 操作系统：Linux ubuntu18 4.15.0-91-generic，通过 `uname -a` 查看
- docker-ce镜像：https://developer.aliyun.com/mirror/docker-ce?spm=a2c6h.13651102.0.0.52471b11cIp2pH

### 卸载旧版本

```shell
$ apt remove docker docker-engine docker.io containerd runc
```

### 通过软件包安装

```shell
# step 1: 安装必要的一些系统工具
sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates curl gnupg-agent pass software-properties-common
# step 2: 安装GPG证书
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
# Step 3: 写入软件源信息
sudo add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
# Step 4: 更新并安装Docker-CE
sudo apt-get -y update
sudo apt-get -y install docker-ce
```

### 通过脚本安装

```shell
$ curl -fsSL https://get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```

安装成功后，会自动启动 Docker 服务。用户可以使用 `systemctl is-enabled docker` 来确认 Docker 服务是否是开机自启动。

### 可选配置

**解决 `WARNING: Your kernel does not support cgroup swap limit capabilities`：**

1. 编辑 `/etc/default/grub` 文件

   ```shell
   $ nano /etc/default/grub
   ```

2. 找到 `GRUB_CMDLINE_LINUX=` 配置项，并追加 `cgroup_enable=memory swapaccount=1`。

3.  保存文件后执行一下命令：`sudo update-grub`

4. 重启服务器：`reboot`

### 测试 Docker 是否安装正确

```shell
$ docker run hello-world
```

执行以上命令，若能正常输出以下信息，则说明安装成功。

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
Digest: sha256:f9dfddf63636d84ef479d645ab5885156ae030f611a56f3a7ac7f2fdd86d7e4e
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### Docker Deamon 配置

执行 `nano /etc/docker/daemon.json` 中写入如下内容：

```json
{
  "ip": "127.0.0.1",
  "experimental": false,
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://mirror.ccs.tencentyun.com",
    "http://docker.mirrors.ustc.edu.cn",
    "http://hub-mirror.c.163.com"
  ]
}
```

重新启动服务:

```shell
$ systemctl daemon-reload
$ systemctl restart docker.service
```

## 使用Docker镜像

### 获取镜像

> `docker pull [选项] [Docker Registry 地址[:端口号]/][用户名]<仓库名>[:TAG]`

- 默认选项
  - `-a`，`--all-tags=true|false`：是否获取仓库中的所有镜像，默认为否
  - `--disable-content-trust`：取消镜像的内容校验，默认为真
- 默认 Docker Registry：`registry.hub.docker.com`
- 默认用户名：`library`，也就是官方镜像
- 默认TAG：`latest`

### 查看镜像信息

#### 列出本地主机上已有镜像

> `docker image ls` | `docker images`

镜像的大小信息只是表示了该镜像的逻辑体积大小，实际上由于相同的镜像层本地只会存储一份，物理上占用的存储空间会小于各镜像逻辑体积之和。

#### 使用 tag 命令添加镜像标签

> `docker tag ubuntu:latest myubuntu:latest`

为了方便在后续工作中使用特定镜像，还可以使用 `docker tag` 命令来为本地镜像任意添加新的标签。

#### 使用 inspect 命令查看详细信息

> `docker inspect <仓库>`

使用 `docker inspect` 命令可以获取该镜像的详细信息，包括制作者、适应架构、各层的数字摘要等。

#### 使用 history 命令查看镜像历史

>`docker history <REPOSITORY>[:TAG]` 或 `docker history <IMAGE ID>`

注意，过长的命令会被自动截断了，可以使用 `--no-trunc` 选项来输出完整命令。

#### 删除镜像

1. 使用标签删除镜像

   > `docker rmi <IMAGE> [IMAGE...]` 或 `docker image rm <IMAGE> [IMAGE...]`

2. 使用镜像 ID 来删除镜像

   > `docker rmi <IMAGE ID>`

   当使用 `docker rmi` 命令，并且后面跟上镜像的 ID（也可以是能进行区分的部分 ID 串前缀）时，会先尝试删除所有指向该镜像的标签，然后删除该镜像文件本身。

   > 注意，当有基于该镜像创建的容器时，镜像文件默认是无法被删除的。我们可以使用 `docker ps -a` 命令可以查看本机上存在的所有容器。
   >
   > 最佳实践：先用 `docker rm <Container ID>` 删除依赖该镜像的所有容易，然后执行 `docker rmi <IMAGE ID>` 再来删除镜像。

#### 清理镜像

> `docker image prune [options]`
>
> - `-a`，`--all`：删除所有无用镜像，不光是临时镜像
> - `-f`,`--force`：强制删除镜像，而不进行提示确认

使用 Docker 一段时间后，系统中可能会遗留一些临时的镜像文件，以及没有使用的镜像，可以通过 `docker image prune` 命令来进行清理。

我们可以结合 crontab 来定时清理，执行 `crontab -e`，写入一下配置：

```
# 一定要记得在后面按 Enter 输入换行符，否则不会生效的
59 23 * * * docker image prune -f

```

### 创建镜像

#### 1. 基于已有容器创建

> `docker commit [OPTIONS] <CONTAINER> <REPOSITORY>[:TAG]`
>
> - `-a`，`--author=`：作者信息
> - `-m`，`--message=""`：提交信息
> - `-p`，`--pause=true`：提交时暂停容器执行

首先，启动一个 alpine 镜像，并在其中进行安装 nano 的操作，然后发布一个新的镜像：

```shell
$ docker run -it alpine bash
$ docker commit -m "install nano" -a "杨俊宁" ff3034d2ffa7 my-alpine:0.1
```

#### 2. 基于 Dockerfile 创建

> `docker build -t <IMAGE NAME> <上下文路径/URL/->`

通过 Dockerfile 创建是最常见的方式。Dockerfile 是一个文本文件，利用指定的指令描述基于某个父镜像创建新镜像的过程。

下面给出 Dockerfile 的一个简单示例，基于 alpine 镜像安装 node 环境，构成一个新的 `youngjuning/alpine` 镜像：

```
FROM alpine

LABEL version="1.0" maintainer="youngjuning<youngjuning@aliyun.com>"

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
```

构建：

```shell
$ docker build -t youngjuning/alpine:latest .
```

### 存储镜像

如果要导出镜像到本地文件，可以使用 `docker save` 命令。该命令支持 `-o <string>` 或 `--output <string>` 参数，导出镜像到指定的文件中。

例如，导出本地 alpine 镜像为文件 alpine.tar，如下所示：

```shell
$ docker save -o alpine.tar alpine
```

之后，用户就可以通过复制 alpine.tar 文件将该镜像分享给他人。

### 载入镜像

可以使用 `docker load` 将导出的 tar 文件再导入到本地镜像库。支持 `-i <string>` 或 `-input <string>` 选项，从指定文件中读入镜像内容。

例如，从文件 alpine.tar 导入镜像到本地镜像列表，如下所示：

```shell
$ docker load -i alpine.tar
```

### 上传镜像

> `docker push [选项] [Docker Registry 地址[:端口号]/][用户名]<仓库名>[:TAG]`

**发布新版本流程：**

- 发布 latest 版本：`docker push youngjuning/alpine:latest`
- 添加新标签：`docker tag youngjuning/alpine:latest youngjuning/alpine:1.0.0`
- 发布 1.0.0 版本：`docker push youngjuning/alpine:1.0.0`

> 可以查看https://hub.docker.com/r/youngjuning/alpine项目查看我发布的基于aliyun镜像的 Aplpine Docker Image

## 操作 Docker 容器

- Docker 容器是镜像的一个运行实例。
- Docker 容器是独立运行的一个（或一组）应用，以及它们必需的运行环境

### 启动容器

#### 1. 新建并启动

```shell
$ docker run -it ubuntu:18.04 /bin/bash
```

其中, `-t` 选项让 Docker 分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上，`-i` 则让容器的标准输入保持打开。

当利用 `docker run` 来创建容器时，Docker 在后台运行的标准操作包括：

1. 检查本地是否存在指定的镜像，不存在就从公有仓库下载
2. 利用镜像创建并启动一个容器
3. 分配一个文件系统，并在只读的镜像层外面挂在一层可读写层
4. 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
5. 从地址池配置一个ip地址给容器
6. 执行用户指定的应用程序
7. 执行完毕后容器被终止

**一些常用选项：**

- `-d`，`--detach=true|false`：是否在后台运行容器，默认为`false`
- `-i`，`--interactive=true|false`：保持标准输入打开，默认为 `false`
- `-p`，`--publish=[]`：指定如何映射到本地主机端口，例如 `-p 9000:9000`
- `--restart="no"`：容器的重启策略，包括 `no`、`on-failure[:max-retry]`、`always`、`unless-stopped` 等
- `--rm=true|false`：容器退出后是否自动删除，不能跟 `-d` 同时使用
- `-t`，`--tty=true|false`：是否分配一个伪终端，默认为 `false`
- `-v [HOST-DIR:]<CONTAINER-DIR>[:OPTIONS]`，`--volume=[HOST-DIR:]<CONTAINER-DIR>[:OPTIONS]`：挂在主机上的文件卷到容器内
- `--name=""`：指定容器的别名

#### 2. 启动已终止容器

可以利用 `docker start <CONTAINER ID>` 命令，直接将一个已经终止的容器启动运行。

#### 3. 查看容器输出

要获取容器的输出信息，可以通过 `docker <CONTAINER ID> logs` 命令。

### 终止容器

可以使用 `docker stop <CONTAINER ID>` 来终止一个运行中的容器。

处于终止状态的容器，可以通过 `docker container start` 命令来重新启动。

此外，`docker container restart` 命令会将一个运行态的容器终止，然后再重新启动它。

### `exec`进入容器

在使用 `-d` 参数时，容器启动后会进入后台。

某些时候需要进入容器进行操作，推荐大家使用 `docker exec` 命令：

```shell
$ docker run -dit alpine
$ docker ps
CONTAINER ID        IMAGE                 COMMAND             CREATED             STATUS              PORTS                      NAMES
3d95dabef801        alpine                "/bin/sh"           21 seconds ago      Up 19 seconds                                  recursing_aryabhata
```

```shell
$ docker exec -it <CONTAINER ID>
```

如果从这个 stdin 中 exit，不会导致容器的停止。

###  删除容器

可以使用 `docker container rm` 来删除一个处于终止状态的容器。例如

```shell
$ docker rm  <CONTAINER ID>
# 删除运行中的容器，并删除容器挂载的数据卷
$ docker rm -vf
```

如果要删除一个运行中的容器，可以添加 `-f` 参数。Docker 会发送 `SIGKILL` 信号给容器。

### 清理所有处于终止状态的容器

```shell
$ docker container prune
```

### 导出和导入容器

```shell
$ docker export 7691a814370e > ubuntu.tar
$ cat ubuntu.tar | docker import - test/ubuntu:v1.0
$ docker import http://example.com/exampleimage.tgz example/imagerepo
```

### 查看容器

#### 1. 查看容器详情

```shell
$ docker inspect [OPTIONS] <CONTAINER ID>
```

#### 2. 查看容器内进程

```shell
$ docker top [OPTIONS] <CONTAINER ID>
```

#### 3. 查看统计信息

```shell
$ docker stats [OPTIONS] <CONTAINER ID>
```

### 更新配置

```shell
$ docker update --restart=always <CONTAINER ID>
```

### 重命名容器

```shell
$ docker rename <old name> <new name>
```

### 查看容器日志

```shell
$ docker logs -f <CONTAINER ID>
```

### Portainer 容器管理工具

```shell
$ docker volume create portainer_data
$ docker run -d -p 9000:9000 \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v portainer_data:/data \
		--name portainer \
		--restart always \
		portainer/portainer
```

配置 `/etc/nginx/sites-enabled/dafulat` 文件：

```nginx
upstream portainer {
    server 127.0.0.1:9000;
}

server {
  listen 80;

  location /portainer/ {
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      proxy_pass http://portainer/;
  }
  location /portainer/ws/ {
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_http_version 1.1;
      proxy_pass http://portainer/ws/;
  }
}
```

## Docker 数据持久化

`数据卷` 是一个可供一个或多个容器使用的特殊目录，它绕过 UFS，可以提供很多有用的特性：

- `数据卷` 可以在容器之间共享和重用
- 对 `数据卷` 的修改会立马生效
- 对 `数据卷` 的更新，不会影响镜像
- `数据卷` 默认会一直存在，即使容器被删除

### 1. 创建数据卷

```shell
$ docker volume create my-vol
```

除了 `create` 子命令外，docker volume 还支持 `inspect`(查看详细信息)、`ls`（列出已有数据卷）、`prune`（清理无用数据卷）、`rm`（删除数据卷）

### 2. 绑定数据卷

#### `--mount`

```bash
$ docker run -d -P \
    --name web \
    --mount source=my-vol,target=/webapp \
    training/webapp \
    python app.py
```

#### `-v`，`--volume`

```shell
$ docker run -d -P \
    --name web \
    -v my-vol:/wepapp \
    training/webapp \
    python app.py
```

> source 也可以是绝对路径的任意系统位置。

> 如果直接挂载一个文件到容器，使用文件编辑工具，包括 vi 或者 `sed --in-place` 的时候，可能会造成文件 inode 的改变，从 Docker 1.1 起，这会导致报错误信息。所以推荐的方式是直接挂载文件所在的目录到容器内。

## Dockerfile

> 详细指令详解请查看：[Dockerfile 指令详解](https://vuepress.mirror.docker-practice.com/image/dockerfile/)

![](https://i.loli.net/2020/04/11/hmlMV4QA2opON9j.png)

# 应用安装

## GitLab 及其官方镜像

> 特别耗CPU，我的服务器太辣鸡带不动！！！

### docker-compose.yml

```yaml
web:
  image: 'gitlab/gitlab-ce:latest'
  restart: always
  hostname: 'gitlab.yangjunning.pro'
  environment:
    GITLAB_OMNIBUS_CONFIG: |
      external_url 'http://gitlab.yangjunning.pro:8929'
      gitlab_rails['gitlab_shell_ssh_port'] = 2224
  ports:
    - '8929:8929'
    - '2224:22'
  volumes:
    - 'gitlab_config:/etc/gitlab'
    - 'gitlab_logs:/var/log/gitlab'
    - 'gitlab_data:/var/opt/gitlab'
```

### 运行容器

```
$ docker-compose up -d
```

### 更新 gitlab

```shell
$ docker-compose pull
$ docker-compose up -d
```

## 待实践

- SonarQube
- Nexus Repository Manager
- ShowDoc
- Verdaccio
- EasyMock
- Sentry
- Ansible
- code-push-server
- BugOut

# Docker 相关的定时任务

```
# crontab -e
# 每天凌晨强制删除无用镜像，不光是临时镜像；每天凌晨清理无用的数据卷
00 00 * * * docker image prune -af && docker volume prune -f && rsync -arv /var/lib/docker/volumes /backups/docker
```

> qshell 同步文件到七牛云的配置请参考[备份到七牛云](https://juejin.im/post/5e81e2db518825737b4ad911#heading-59)

# 扩展阅读

- [DevOps 知识平台 Ledge](https://devops.phodal.com/)
- [jenkins+docker 持续集成](https://juejin.im/post/5b6af759e51d451951138eb4#heading-7)

# 联系作者

|                           作者微信                           |                           知识星球                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb24c7412?w=200&h=200&f=jpeg&s=17183" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb26af8e1?w=200&h=200&f=png&s=39093" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb338c643?w=698&h=700&f=png&s=315492" style="width:200px"/> |