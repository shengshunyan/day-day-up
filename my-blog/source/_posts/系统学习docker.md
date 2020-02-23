---
title: 系统学习docker
date: 2020-02-23
tags:
     - 计算机基础
---


*示例代码地址：https://github.com/15754600159/imooc-docker-code*

## 第一章、容器技术和Docker简介
### 一、long time ago
1. 结构
![1.png](https://i.loli.net/2019/12/25/8O6vAeuMgtSx7iq.png)
2. 很久以前的应用部署：
    1. 买一个物理机
    2. 装操作系统
    3. 部署应用
3. 很久以前的应用部署缺点：
    1. 部署慢
    2. 成本高
    3. 资源浪费
    4. 难于前一和拓展
    5. 可能会被限定硬件厂商
<!-- more -->

### 二、虚拟化技术
1. 结构
![2.png](https://i.loli.net/2019/12/25/lI7UFKC4gGbsZAu.png)
2. 特点：
    1. 一个物理机可以部署多个app
    2. 每个app独立运行在一个VM里
3. 优点：
    1. 资源池：一个物理机的资源分配到了不同的虚拟机里
    2. 很容易拓展：加物理机器or加虚拟机
    3. 很容易云化：亚马逊AWS，阿里云
4. 局限性：
    1. 每个虚拟机都是一个完整的操作系统，要给其分配资源，当虚拟机数量增多时，操作系统本身消耗的资源势必增多；

### 三、容器技术
1. 容器的出现：
    1. 容器技术提供app的打包，解决了开发者和运维人员的矛盾；
    2. 在开发和运维之间搭建了一个桥梁，是实现devops的最佳解决方案；
2. 什么是容器：
    1. 对软件和其依赖的标准化打包
    2. 应用之间相互隔离
    3. 共享同一个OS kernel
    4. 可以运行在很多主流操作系统上
3. 结构
![3.png](https://i.loli.net/2019/12/25/J2HFgy3T9RVCwEr.png)
4. 和虚拟化技术的区别：容器是APP层面的隔离，虚拟化是物力资源层面的隔离
![4.png](https://i.loli.net/2019/12/25/Kv8ExqOFuribLBl.png)
5. 虚拟化+容器
![5.png](https://i.loli.net/2019/12/25/Mh7njR1CwW2fQxl.png)
6. docker是容器技术的一种实现

## 第二章、docker环境搭建
### 一、mac安装linux虚拟机
1. VirtualBox：一款相当强大且开源免费跨平台的虚拟机软件
2. Vagrant：是一个用来构建和管理虚拟机环境的工具

### 二、docker machine
1. Docker Machine是Docker 官方提供的一个工具，它可以帮助我们在远程的机器上安装 Docker，或者在虚拟机 host 上直接安装虚拟机并在虚拟机中安装 Docker。

### 三、环境搭建
![1.png](https://i.loli.net/2019/12/30/7SCtATIK4dVpvDF.png)

## 第三章、docker的镜像和容器
### 一、docker架构和底层技术
1. docker是一个平台
    1. docker提供一个开发，打包，运行app的平台
    2. 把app和底层的infrastructure隔离开来
    ![2.png](https://i.loli.net/2019/12/30/OZo6AGudjS4f2Ir.png)
2. docker engine
    1. 后台进程（dockerd）
    2. REST API Server
    3. CLI接口（docker）
![3.png](https://i.loli.net/2019/12/30/pFKkO9DHzGaBAWX.png)
3. docker architecture
![4.png](https://i.loli.net/2019/12/30/17KEJLMwF8BkqVz.png)
4. 底层技术支持
    1. Namespaces: 做隔离pid, net, ipc, mnt, uts
    2. Control groups: 做资源限制
    3. Union file systems: Container和image的分层

### 二、Docker Image概述
1. 什么是image
    1. 文件和meta data的集合（root filesystem）
    2. 分层的，并且每一层都可以添加改变删除文件，成为一个新的image
    3. 不同的image可以共享相同的layer
    4. Image本身是read-only的
    ![1.png](https://i.loli.net/2020/01/15/2voeCugzLN9WE6f.png)
2. image的获取
    1. build from dockerfile
    2. pull from registry (docker hub)
3. 镜像的发布
    1. 申请Docker Hub账号
    2. docker push [image name]:
4. image的常见类型：
    1. 常驻内存的应用容器（如web应用）
    2. 一个命令行工具，可以在run的时候传入不同的参数
5. 自定义一个base image
    1. 创建一个hello.c简单C语言程序
    ```bash
    mkdir hello-world
    cd hello-world/
    vim hello.c
    
    #include<stdio.h>
    int main()
    {
    	printf("hello docker\n");
    }
    ```
    2. 编译C语言程序为二进制可执行文件
    ```bash
    yum install gcc glibc-static # 安装相关编译工具
    gcc -static hello.c -o hello # 编译得到一个二进制可执行文件hello
    ```
    3. 创建一个Dockerfile文件
    ```bash
    vim Dockerfile
    
    FROM scratch # 继承自哪个镜像，scratch表示不继承其他镜像
    ADD hello / # 添加hello二进制文件到根目录
    CMD ["/hello"] # 命令行执行 /hello
    ```
    4. 构建镜像
    ```bash
    docker build -t shengshunyan/hello-world . # -t 是给镜像一个标签； . 是指Dockerfile文件在当前目录
    
    docker image ls # 查看image列表
    docker history [image id] # 查看image的结构，image id可以在image列表中获取
    ```
    5. 运行
    ```bash
    docker run shengshunyan/hello-world # 打印 hello docker，可以通过参数对容器的资源(CPU、内存等)进行限制
    ```
    
### 三、Docker Container
1. 什么是Container
    1. 通过Image创建（copy）
    2. 在Image Layer之上建立一个container layer（可读写）
    3. 类比面向对象：类和实例
    4. Image负责app的存储和分发，Container负责运行app
2. 常用命令
```bash
docker container ls # 查看正在运行的容器列表(docker ps是简写)
docker container ls -a # 查看所有容器列表（包括退出的容器）
docker container stop [container id] # 停止容器运行 (docker stop [container id]是简写)
docker container rm [container id] # 移除容器
docker rm $(docker ps -aq) # 移除所有暂停的容器
docker inspect [container id] # 查看容器详细信息
docker logs [container id] # 查看容器运行日志

docker run -it centos # 运行容器并不退出，进入容器

docker run -d shengshunyan/flask-hello-world # 后台运行容器
docker exec -it [docker id] /bin/bash # 进入容器，运行bash

docker # 查看docker的帮助
docker container # 查看docker container的帮助
```

### 四、Dockerfile (文档：[docker doc -> reference](https://docs.docker.com/engine/reference/builder//) )
1. 构建自己的docker镜像
    1. 创建Dockerfile文件
    ```
    FROM centos
    RUN yum install -y vim
    ```
    2. 创建镜像
    ```bash
    docker build -t shengshunyan/centos-vim .
    ```
2. Dockerfile语法
    1. FROM (尽量使用官方的image作为base image)
    ```
    FROM scratch # 制作base image
    FROM centos # 使用base image
    FROM ubuntu:14.04
    ```
    2. LABEL (帮助信息，类似注释)
    ```
    LABEL maintainer="shengshunyan@163.com"
    LABEL version="1.0"
    LABEL description="This is description"
    ```
    3. RUN：为了美观复杂的RUN请用反斜线换行，避免无用的分层，合并多条命令成一行
    ```
    RUN yum update && yum install -y vim \
        python-dev  # 反斜线换行
    ```
    4. WORKDIR：设定当前目录，类似cd
    ```
    WORKDIR /root
    WORKDIR /test # 如果没有会自动创建test目录
    ```
    5. ADD and COPY：将文件添加到容器里面，大部分情况下COPY优于ADD；添加远程文件/目录请使用curl或者wget
    ```
    ADD hello / # 添加hello到根目录
    ADD test.tar.gz / # 添加到根目录并解压，比COPY多一点功能
    ```
    6. ENV：设定环境常量
    ```
    ENV MYSQL_VERSION 5.6 # 设置常量
    RUN apt-get install -y mysql-server="${MYSQL_VERSION}" # 应用常量
    ```
    7. VOLUME and EXPOSE：存储和网络
3. RUN vs CMD vs ENTRYPOINT
    1. RUN：执行命令并创建新的Image Layer
    2. CMD：
        1. 设置容器启动后默认执行的命令和参数；
        2. 如果docker run指定了其他命令(比如docker run -it [docker container tag] /bin/bash)，CMD命令会被忽略；
        3. 如果定义了多个CMD，只有最后一个会执行；
    3. ENTRYPOINT：
        1. 设置容器启动时运行的命令，让容器以应用程序或者服务的形式运行
        2. 不会被忽略，一定会执行
        3. 最佳实践：写一个shell脚本作为entrypoint
        ```
        COPY docker-entrypoint.sh /usr/local/bin/
        ENTRYPOINT ["docker-entrypoint.sh"]
        ```
4. Shell和Exec格式
    1. Shell格式
    ```bash
    RUN apt-get install -y vim
    CMD echo "hello docker"
    ENTRYPOINT echo "hello docker"
    ```
    2. Exec格式
    ```bash
    RUN ["apt-get", "install", "-y", "vim"]
    CMD ["/bin/echo", "hello docker"]
    ENTRYPOINT ["/bin/echo", "hello docker"]
    ```
5. 当容器作为一个命令行工具，即可以每次运行的时候传入不同的参数
```
FROM ubuntu
RUN apt-get update && apt-get install -y stress # stress是一个测试工具
ENTRYPOINT ["/usr/bin/stress"]
CMD []
```
6. Dockerfile实战
    1. 创建一个python程序
    ```python
    from flask import Flask
    app = Flask(__name__)
    @app.route('/')
    def hello():
    	return "hello docker"
    if __name__ == '__main__':
    	app.run()
    ```
    2. 创建一个Dockerfile
    ```
    FROM python:2.7
    LABEL maintainer="shengshunyan<15754600159@163.com>"
    RUN pip install flask
    COPY app.py /app/
    WORKDIR /app
    EXPOSE 5000
    CMD ["python", "app.py"]
    ```
    3. 构建镜像，并运行
    ```bash
    docker build -t shengshunyan/flask-hello-world .
    docker run shengshunyan/flask-hello-world
    # 后台运行
    docker run -d shengshunyan/flask-hello-world
    ```
    4. 构建镜像中的调试
    ![1.png](https://i.loli.net/2020/01/17/2eaUyZ56ndq14XB.png)
    ```bash
    # 可以对中间态的镜像运行调试，进入容器查看文件夹状态
    docker run -it ad82d0470bac /bin/bash
    # 可以查看容器运行日志
    docker logs [container id]
    ```

## 第四章、Docker的网络
### 一、概述
1. 单机：
    1. Bridge Network
    2. Host Network
    3. None Network
2. 多机：Overlay Network

### 二、网络基础回顾
1. 网络的分层
![1.png](https://i.loli.net/2020/01/18/dtZeSJ9rTzn4C8q.png)
2. 共有IP和私有IP
    1. Public IP：互联网上的唯一标识，可以访问internet
    2. Provate IP：不可以在互联网上使用，仅供机构内部使用
    ![2.png](https://i.loli.net/2020/01/18/B9gvmLpMeWxSYiz.png)
3. 网络地址转换NAT：将内网的私有地址转换成外部能访问的共有地址
![3.png](https://i.loli.net/2020/01/18/pENuSsWwr61qeaF.png)
4. 网络工具
    1. ping：利用ICMP，验证IP的可达性
    2. telnet：验证服务的可用性
    ```
    ping 10.75.44.10
    telnet 10.75.44.10 80
    ```
5. 网络的命名空间

### 三、docker网络
1. docker网络
    1. bridge
    2. none
    3. host
    ```
    # 查看docker网络状况，type是以上三种类型
    docker network inspect [type] 
    ```
2. 容器网络之bridge
    1. 示例图
    ![4.png](https://i.loli.net/2020/01/19/Zg5TQEBiLesbtjI.png)
    2. 容器之间的link
        1. 在实例化容器的时候，添加--link [container name]，就能在生产的容器中直接用container name访问，ping [container name]
        2. --link参数相当于给新容器添加了一条DNS记录
    3. 容器的端口映射
    ```bash
    # 将容器的80端口映射到宿主机host的8000端口，然后通过hostip:8000就可以访问容器中nginx的服务
    docker run -d -p 8000:80 --name web nginx 
    ```
3. 容器网络之none
    1. 容器启动的时候设置network参数为none
    ```bash
    docker run -d --name test1 --network none [image name]
    ```
    2. 容器的服务不能从外部访问，适合存储敏感数据，只能本地通过命令行进入容器查看
4. 容器网络之host
    1. 容器启动的时候设置network参数为host
    ```bash
    docker run -d --name test1 --network host [image name]
    ```
    2. 容器的network namespace和host主机是一样的，不独立，可能会和主机相关端口的服务冲突
5. 多容器复杂应用的部署演示
    1. 启动redis服务容器
    ```bash
    docker run -d --name redis redis # 回去拉取docker hub的redis镜像
    ```
    2. 创建app.py和Dockerfile
    ```python
    # app.py
    from flask import Flask
    from redis import Redis
    import os
    import socket
    
    app = Flask(__name__)
     # REDIS_HOST是运行容器时传入的环境变量
    redis = Redis(host=os.environ.get('REDIS_HOST', '127.0.0.1'), port=6379)
    
    
    @app.route('/')
    def hello():
        redis.incr('hits')
        return 'Hello Container World! I have been seen %s times and my hostname is %s.\n' % (redis.get('hits'),socket.gethostname())
    
    
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000, debug=True)

    ```
    ```
    # Dockerfile
    FROM python:2.7
    LABEL maintaner="shengshunyan"
    COPY . /app
    WORKDIR /app
    RUN pip install flask redis
    EXPOSE 5000
    CMD [ "python", "app.py" ]
    ```
    3. 构建容器和运行
    ```bash
    docker build -t shengshunyan/flask-redis .
    # --link 可以让app容器访问redis容器
    # -e为 app容器注入环境变量
    docker run -d -p 5000:5000 --link redis --name flask-redis -e REDIS_HOST=redis shengshunyan/flask-redis
    ```
    4. 在host机上就可以测试访问
    ```bash
    curl 127.0.0.1:5000
    ```
    5. 结构图
    ![5.png](https://i.loli.net/2020/01/19/pj728AIaVcWk4f6.png)
6. DOcker Overlay网络和etcd实现多级容器通信

## 第五章、Docker的持久化存储和数据共享
### 一、docker持久化数据
1. docker持久化数据方案
    1. 基于本地文件系统的Volume：可以在执行Docker create或者Docker run时，通过-v参数将主机的目录作为容器的数据卷。这部分功能是基于本地文件系统的volume管理。
    2. 基于plugin的Volume：支持第三方的存储发难，比如NAS，aws
2. Volume的类型
    1. 受管理的data Volume，由docker后台自动创建
    2. 绑定挂载的Volume，具体挂载位置可以由用户指定

### 二、数据持久化之Data Volume
1. 利用mysql的镜像做实验
```bash
# 创建一个mysql容器，-v设置volume（路径和名称）
docker run -d -v mysql:/var/lib/mysql --name mysql1 -e MYSQL_ALLOW_EMPTY_PASSWORD=true mysql
# 查看volume
docker volume ls
# 进入mysql1容器中的bash，添加一个database
docker exec -it mysql1 /bin/bash
mysql -u root
create database docker;
show databases;
# 移除mysql1容器
docker rm -f mysql1 
# 查看volume还是存在的
docker volume ls
# 用之前的volume创建一个新的容器mysql2，查看database，之前创建的docker database还是依旧存在
docker run -d -v mysql:/var/lib/mysql --name mysql2 -e MYSQL_ALLOW_EMPTY_PASSWORD=true mysql
docker exec -it mysql2 /bin/bash
mysql -u root
show databases;
```

### 三、数据持久化之Bind Mounting
1. 命令
```bash
# 容器中文件夹与host机中文件夹同步；:左边是host路径，右边是容器路径
docker run -v /home/aaa:/root/aaa
```
2. 软件开发中比较常用，在容器外更新更新app相关文件即可同步容器中的服务；

## 第六章、Docker compose多容器部署
### 一、Docker compose是什么
1. 对多个docker容器进行批处理的需求
2. docker compose是一个工具，这个工具可以通过一个yml文件定义多容器的docker应用，通过一条命令就可以根据yml文件的定义去创建或管理这多个容器

### 二、Docker compose管理wordpress多容器的示例
1. Docker compose需要翻墙安装
2. yml文件
```
version: '3'

services:

  wordpress:
    image: wordpress
    ports:
      - 8080:80
    depends_on:
      - mysql
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_PASSWORD: root
    networks:
      - my-bridge

  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - my-bridge

volumes:
  mysql-data:

networks:
  my-bridge:
    driver: bridge
```
3. docker-compose的一些常用命令
4. docker-compose负载均衡
    1. 启动五个web服务：docker-compose up --scale [service name]=5 -d
    2. haproxy做代理

## 第七章、容器编排Docker swarm
### 一、swarm mode
![1.png](https://i.loli.net/2020/02/09/aXDdP2MgRbNBcl5.png)
![2.png](https://i.loli.net/2020/02/09/rMXTtmKFj5x6CuP.png)

### 二、为什么需要容器编排
1. 管理很多容器
2. 方便的横向拓展
3. 容器如果down了，可以自动恢复
4. 不影响业务的情况下更新容器
5. 监控追踪容器
6. 调度容器的创建
7. 保护隐私数据

### 三、创建一个三节点的swarm集群
1. 三个主机（manager, work1, work2）（可以用虚拟机创建）
2. 初始化swarm集群，设置管理节点：docker swarm init --advertise-addr=[manager ip]
3. 添加work节点，进入work类型的主机（work1，work2），执行相关命令（命令是上一步初始化的输出）

### 四、service的创建维护和水平拓展
1. 创建service
```bash
docker service create --name demo busybox sh -c "while true;do sleep 3600;done"
# 查看service
docker service ls
# 查看service创建的容器运行在哪个节点
service ps demo
```
2. 水平拓展
```bash
docker service scale demo=5
# 5个容器运行，一个容器down了，可自动恢复
```
3. 删除service
```bash
docker service rm demo
```
### 五、集群服务间通信之Routing Mesh
1. Internal: container和container之间的访问通过overlay网络（通过虚拟IP）
![1.png](https://i.loli.net/2020/02/10/qrn8HYeT7NvKMOa.png)
2. Ingress: 如果服务有绑定接口，则此服务可以通过任意swarm节点的相应接口访问
    1. 外部访问的负载均衡
    2. 服务端口被暴露到各个swarm节点
    3. 内部通过IPVS进行负载均衡
![2.png](https://i.loli.net/2020/02/10/OJGExtH7kUCe2wA.png)

### 六、docker stack
1. docker stack简介：单机模式下，我们可以使用 Docker Compose 来编排多个服务，而 Docker Swarm 只能实现对单个服务的简单部署。本文的主角 Docker Stack ，通过 Docker Stack 我们只需对已有的 docker-compose.yml 配置文件稍加改造就可以完成 Docker 集群环境下的多服务编排
2. docker compose.yml文件
```
version: '3'

services:

  web:
    image: wordpress
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_PASSWORD: root
    networks:
      - my-network
    depends_on:
      - mysql
    deploy:
      mode: replicated
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s

  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - my-network
    deploy:
      mode: global
      placement:
        constraints:
          - node.role == manager

volumes:
  mysql-data:

networks:
  my-network:
    driver: overlay
```
3. 在manager节点部署服务，docker stack deploy example --compose-file=docker-compose.yml 
4. 访问8080端口可以查看节点可视化页面

### 七、docker secret管理和使用
1. secret包括：用户名密码、SSH Key、TLS认证、不想让别人看到的数据
2. secret management：
    1. 存在swarm manager节点raft database里
    2. secret可以assign给一个service，这个service就可以看到secret
    3. 在container内部，secret看起来像文件，但实际是在内存中

### 八、service更新
1. 当service的容器个数（scale的值）> 1时，就可以不中断服务得更新
2. 更新servuce：docker service update --image [new image name] [service name]

## 第八章、DevOps初体验-docker cloud
### 一、docker cloud
1. 简介：提供容器的管理、编排、部署的托管服务
2. 两种模式：
    1. standard: 一个node就是一个docker host
    2. swarm: 多个node组成的swarm cluster
3. devOps
![1.png](https://i.loli.net/2020/02/11/h5Hkg9YRltFyKvb.png)

## 第九章、容器编排Kubernetes
### 一、Kubernetes简介
1. 结构图  
[![1a3197ca36f57008a.png](https://file.moetu.org/images/2020/02/13/1a3197ca36f57008a.png)](https://moetu.org/image/j3HHx)
![27b219afd671f002f.png](https://file.moetu.org/images/2020/02/13/27b219afd671f002f.png)
![39cf31f8543d32b06.png](https://file.moetu.org/images/2020/02/13/39cf31f8543d32b06.png)
2. 简介：kubernetes，简称K8s，是用8代替8个字符“ubernete”而成的缩写。是一个开源的，用于管理云平台中多个主机上的容器化的应用，Kubernetes的目标是让部署容器化的应用简单并且高效（powerful）,Kubernetes提供了应用部署，规划，更新，维护的一种机制。

### 二、K8S最小调度单位Pod
1. 一个Pod包含一个或多个Container
2. Pod内部共享命名空间
3. Pod建立、对外暴露服务端口
4. Pod横向拓展，创建多个Pod

### 三、deployment
1. 简介：
- deployment 是用来管理无状态应用的，面向的集群的管理，而不是面向的是一个不可变的个体，举例：有一群鸭子，要吃掉一个，只需要再放一个新的鸭仔就好了，不会影响什么，而有状态的应用，就同时养三条狗一样，而每个狗都是无法代替用新的事物代替的，因为有“感情”这个状态在里面
- Deployment 为Pod 和 ReplicaSet 之上，提供了一个声明式定义（declarative）方法，用来替代以前的ReplicationController 来方便的管理应用。你只需要在 Deployment 中描述您想要的目标状态是什么，Deployment controller 就会帮您将 Pod 和ReplicaSet 的实际状态改变到您的目标状态。您可以定义一个全新的 Deployment 来

### 四、多节点K8S集群

### 五、service
1. 不要直接使用和管理Pods，在更新或者做拓展的时候，Pods有可能被terminated
2. service简介
    1. kubectl expose命令，会给Pods创建一个service，供外部访问
    2. service有三种类型：clusterIP，NodePort，外部的loadBalancer
    3. 另外也可以使用DNS，但需要DNS的add-on

## 第十章、Kubernetes简介和安装
### 一、Kubernetes安装
1. minikube：可以在本地搭建一个开发测试的环境，只有一个节点
2. kubeadm：在本地搭建一个k8s的集群
3. 在云服务商搭建k8s集群

## 第十一章、Kubernetes中的基本概念和操作
### 一、Kubectl的基本使用
```bash
# 获取集群节点信息
kubectl get node
kubectl get node -o wide
# 切换集群
kubectl config use-context minikube
```

### 二、k8s的节点和标签
1. 节点
```bash
# 查看节点详情
kubectl describe node [node name]
```
2. 标签
```bash
# 查看节点标签
kubectl get node --show-labels
# 添加label
kubectl label node [node name] [label]
kubectl label node k8s-master env=test # 示例
# 删除label
kubectl label node k8s-master env-
```
3. roles：可通过添加label的方式添加

### 三、k8s的最小调度单位pod
1. pod
    1. k8s最小调度单位
    2. 分享相同命名空间的容器
    3. 一个或一组容器，他们共享资源（如volume）
![1.png](https://i.loli.net/2020/02/20/DAEoSha1OB9Mirx.png)
2. pod的创建：.yml文件
![2.png](https://i.loli.net/2020/02/20/FxpHCN8D1G6kKrV.png)
3. pod的操作
```bash
# pod创建
kubectl create -f nginx_busybox.yml
# 查看pod
kubectl get pods
kubectl get pods -o wide
# 获取pod详细信息
kubectl describe pod [pod name]
# 进入pod的容器
kubectl exec [pod name] -it sh # 默认进入第一个容器
kubectl exec [pod name] -c [container name] -it sh # 可指定容器
# 删除pod
kubectl delete -f nginx_busybox.yml
```

### 四、命名空间namespace
1. 在不同的命名空间中，各种资源的名字是相互独立，比如可以具有相同名称的pod存在
2. namespace操作
```bash
# 创建namespace
kubectl create namespace [space name]
# 查询全部pod
kubectl get pod  --all-namespaces
```

### 五、context
1. 可以改变当前使用的默认namespace，默认是default

### 六、controller和deployment
1. deployment和控制器模型：
    1. 定义一组Pod期望数量，Controller会维持Pod数量与期望数量一致
    2. 配置Pod的发布方式，controller会按照给定的策略更新Pod，保证更新过程中不可用Pod维持在限定数量范围内
    3. 如果发布有问题支持回滚
2. deployment是一种期望状态
```go
for {
    实际状态 := 获取集群中对象X的实际状态
    期望状态 := 获取集群中对象X的期望状态
    if 实际状态 == 期望状态 {
        什么都不做
    } else {
        执行编排动作，将实际状态调整为期望状态
    }
}
```
3. deployment操作
```bash
# 创建deployment
kubectl create -f nginx_deployment.yml
# 查询deployment
kubectl get deployment
# 更新deployment
kubectl apply -f nginx_update.yml
# 回滚
kubectl rollout undo deployment [deployment name] ... 
```

## 第十二章、容器的运维和监控
### 一、容器的基本监控
1. 命令行查看
```bash
# 查看后台容器情况
docker ps
# 查看容器内部运行的进程
docker top [container id]
# 查看容器占用系统的资源
docker stats
```
2. docker监控工具：weavescope

### 二、k8s集群
1. k8s集群运行资源监控工具：heapster
2. 根据资源占用自动横向伸缩
3. 集群log的采集和展示——ELK + Fluentd
4. 集群监控方案：prometheus

## 第十三章、decker + DevOps实战
详细内容独立记在笔记《利用Gitlab CICD实现前端资源自动部署》中