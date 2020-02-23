---
title: 利用Gitlab CICD实现前端资源自动部署
date: 2020-02-04
tags:
     - 计算机基础
---

## 一、GitLab Server 的搭建

### 1. 准备工作
以Centos7为例，准备一台至少内存为4G的机器。

### 2. 安装依赖软件
```
sudo yum install -y git vim gcc glibc-static telnet
sudo yum install -y curl policycoreutils-python openssh-server
sudo systemctl enable sshd
sudo systemctl start sshd

sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
```
<!-- more -->

### 3. 设置gitlab安装源
如果在国内的话，可以尝试使用清华大学的源。

新建 /etc/yum.repos.d/gitlab-ce.repo，内容为
```
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el$releasever/
gpgcheck=0
enabled=1
```
如果在国外的话，可以使用
```
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
```

### 4. 安装GitLab
关于域名，如果要是设置域名，则如下，这个域名可以是真实购买的域名，如果您要把gitlab安装到公网比如阿里云上的话。  
如果只是想本地测试，则可以像下面一样，设置一个example的域名，然后记得在本地你的笔记本设置host，如果是MAC就在 /etc/hosts里添加 一行 `192.168.211.10 gitlab.example.com`  

```
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce
```
如果不想设置域名，或者想将来再考虑，可以直接
```
sudo yum install -y gitlab-ce
```
安装完成以后，运行下面的命令进行配置
```
sudo gitlab-ctl reconfigure
```

### 5. 登陆和修改密码
打开http://gitlab.example.com/ 修改root用户密码，然后使用root和新密码登陆。


## 二、GitLab CI 服务器的搭建

GitLab CI服务器最好是单独与gitlab服务器的一台Linux机器。

### 1. 安装Docker
```
curl -sSL https://get.docker.com/ | sh
```

### 2. 安装gitlab ci runner
```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.rpm.sh | sudo bash
sudo yum install gitlab-ci-multi-runner -y
```
查看是否运行正常
```bash
[vagrant@gitlab-ci ~]$ sudo gitlab-ci-multi-runner status
gitlab-runner: Service is running!
[vagrant@gitlab-ci ~]$
```

### 3. 设置Docker权限
为了能让gitlab-runner能正确的执行docker命令，需要把gitlab-runner用户添加到docker group里, 然后重启docker和gitlab ci runner
```bash
[vagrant@gitlab-ci ~]$ sudo usermod -aG docker gitlab-runner
[vagrant@gitlab-ci ~]$ sudo service docker restart
Redirecting to /bin/systemctl restart docker.service
[vagrant@gitlab-ci ~]$ sudo gitlab-ci-multi-runner restart
```
在部署前端静态资源，删除项目文件时，可能需要sudo权限，所以要给gitlab-runner用户加上sodu权限
```bash
# 添加文件写权限
chmod u+w /etc/sudoers
# 编辑/etc/sudoers，增加一行如下： 用户名 ALL=(ALL) ALL，保存退出
gitlab-runner ALL=(ALL) NOPASSWD: ALL
# 撤销写权限
chmod u-w /etc/sudoers
```

### 4. 创建一个gitlab ci runner实例
```bash
gitlab-ci-multi-runner register
# 1. 输入gitlab地址： https://gitlab.example.cn/
# 2. 输入gitlab-ci token：gitlab项目setting -> CICD -> runner -> token复制
# 4. 输入gitlab-ci tags：runner标识，之后用于job选择哪个runner运行
# 其他随意，默认就行
```
之后你就能在gitlab项目上setting -> CICD -> runner里看到可用的runnner节点
![1.png](https://i.loli.net/2020/02/23/6ZHVKmnUyeG2I87.png)
![2.png](https://i.loli.net/2020/02/23/IHxaeqdB3otrAly.png)

### 5. 在创建runner的linux机器上安装nodeJs
```bash
# 下载二进制包
wget https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz
# 解压
xz -d node-v12.16.1-linux-x64.tar.xz 
tar node-v12.16.1-linux-x64.tar 
# 将node包移到/usr/local/node下
mv [node解压出来的文件夹] /usr/local/node
# 创建软链
ln -s /usr/local/node/bin/node /usr/bin/
ln -s /usr/local/node/bin/npm /usr/bin/
# 安装cnpm，安装更快
npm install -g cnpm --registry=https://registry.npm.taobao.org
ln -s /usr/local/node/lib/node_modules/cnpm/bin/cnpm /usr/bin/
```


## 三、配置项目

### 1. 在项目根目录创建 .gitlab-ci.yml 文件
1. cache：不同的job之间可以共享的文件
2. tags: - shenzhen：这是之前创建runner的时候输入的表情名
3. only: - master：只有在master分支变化的时候会触发任务
```
stages:
  - build
  - test
  - deploy
  
  
cache:
  paths:
    - node_modules/
    - dist/
 
  
install_and_build:
  stage: build
  tags:
    - shenzhen
  only:
    - master
  script:
    - echo "start installing..."
    - cnpm install
    - echo "start building..."
    - cnpm run build
    
deploy_184: 
  stage: deploy
  tags:
    - shenzhen
  only:
    - master
  script: 
    - echo "start deploying..."
    - sudo rm -rf /data/dist
    - sudo cp -r ./dist /data/
    - echo "deploy success!"
```
### 2. 提交或者合并代码的时候，就会触发CICD，打包部署前端资源
![3.png](https://i.loli.net/2020/02/23/7FQgnopCJYBdGjc.png)
![4.png](https://i.loli.net/2020/02/23/O2kmTgc1oXdrF8f.png)