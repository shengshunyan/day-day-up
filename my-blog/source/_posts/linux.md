---
title: linux
date: 2019-09-05
tags:
     - 计算机基础
---

# 系统管理

## 一、进程管理
1. ps：查看进程
    - ps aux
    - ps -le
    - pstree
2. top: 查看进程
    - 交互指令：p - 按CPU排序；m - 按内存排序
    - 启动时间；CPU空闲率；
    - 缓冲：提高写效率，一段时间间隔集中写一次数据；
    - 缓存：提高读效率，将之前读过的数据缓存在内存中；
![top截屏](https://i.loli.net/2019/07/25/5d39a141de80f41109.png)
3. kill: 终止进程
    - kill -1 2235  #重启某个进程
    - kill -9 2235  #强制杀死某个进程
4. pkill: 终止进程
    - w  #查看当前登陆用户
    - pkill -9 -t [终端名]  #踢出登录中的用户
5. killall: 终止进程
    - killall -9 [进程名]  #可以杀死一组进程
6. ps -le 命令的pri和ni是进程优先级，最终决定优先级的时候两个之和，数值越小，优先级越高；普通用户只能修改ni的值；

## 二、工作管理
1. 工作管理：是指在单个登录终端中同事管理多个工作的行为；
2. 放入后台的命令必须可以持续运行一段时间（比如启动服务器），命令后面加&表示命令在后台运行；
3. jobs查看当前工作；
4. ctrl + c 终止工作；ctrl + z 将工作放入后台并暂停；
5. fg %工作号 : 将后台暂停程序在后台重新运行；bg %工作号 : 将后台程序调到前台运行；
6. 工作进程是绑定到终端的，终端关闭，相应的后台工作也会终止；
7. 后台命令脱离登录终端的方法：
    - 后台执行的命令加入/etc/rc.local文件；
    - 用系统定时任务；
    - 使用nohup命令；nohup /root/for.sh &

## 三、系统资源查看
1. vmstat [刷新时延 刷新次数]: 监控系统资源
![image](https://i.loli.net/2019/07/29/5d3ebd0d0125063295.png)
![image](https://i.loli.net/2019/07/29/5d3ebd0d39a2744338.png)
![image](https://i.loli.net/2019/07/29/5d3ebe861a6f340104.png)
cpu-id: cpu空闲率
2. dmesg
3. free [-b/-k/-m/-g] : 查看内存使用状态
4. cat /proc/cpuinfo : 查看cpu信息

## 四、系统定时任务
1. crontab
    - crontab -e ： 进入vim编辑文档模式，添加定时任务
    ![image](https://i.loli.net/2019/07/31/5d415d19ef80767568.png)
    ![image](https://i.loli.net/2019/07/31/5d415d1a3aec665201.png)
    ```
    // 示例：表示每5分钟向/root/test文件追加一个aa
    */5 * * * * echo 'aa' >> /root/test
    ```
    - crontab -l : 查看定时任务列表
    - crontab -r : 移除所有定时任务
    - crontab中命令最好写命令的绝对路径，比如/sbin/shutdown
    - crontab -e是每个用户执行的命令，不同用户可以执行自己的定时任务；可有些定时任务需要系统执行，就需要编辑/etc/crontab这个配置文件了；
2. anacron:
    - /etc/cron.[hourly, daily, monthly] 里面的脚本为定时执行的脚本；
    - anacron会将因故障没有执行的定时任务在服务器正常时重新执行（仅限上一条中的三个目录）；
    - anacron配置文件 /etc/anacrontab；


# 软件安装管理
## 一、简介
1. 软件包分类：
    - 源码包
    - 二进制包
2. 两张软件包区别：
    - 安装前，概念上区别：源码包可以修改源代码，但二进制包安装更快；
    - 安装后，只是安装位置不同；

## 二、RPM命令管理
1. RPM包的位置，在光盘的package目录下；
2. RPM包安装：rpm -ivh 包名
    - i 安装
    - v (verbose)显示详细信息
    - h (hash)显示进度
3. RPM包升级：rpm -Uvh 包名
    - U (upgrade)升级
4. RPM包卸载：rpm -e 包名
    - e (erase)卸载
5. 查询是否安装：
    - rpm -q 包名 #查询是否安装
    - rpm -qa 查询所有已安装的RPM包
6. 查询文件属于哪个包：rpm -qf 文件
    - 示例：rpm -qf /bin/ls
6. RPM一般默认安装路径：
    - /etc/ 配置文件安装目录
    - /usr/bin/ 可执行文件安装目录
    - usr/lib/ 程序所使用的函数库保存位置
    - /usr/share/doc/ 基本的软件使用手册保存位置
    - usr/share//man/ 帮助文档位置
7. RPM包校验：RPM -V 已安装的包名
    - V (verify)校验制定RPM包中的文件

## 三、YUM在线安装
1. yum源文件所在目录：/etc/yum.repos.d
2. yum list # 查询所有可用软件包
3. yum search 关键字 # 搜索包
4. yum -y install 包名 # 安装包
    1. y 自动回答yes
5. yum -y update 包名 # 升级包
6. yum -y remove 包名 # 卸载包
7. yum软件组管理：
    1. yum grouplist # 查询所有软件组
    1. yum groupinstall 软件组名
    1. yum groupremove 软件组名

## 四、源码包安装
1. 源码包安装位置(一般)：/usr/local/软件名/
2. 源码包保存位置(一般)：/usr/local/src/
3. 安装过程：( 软件目录下的INSTALL文件中可以查看安装步骤)
    1. 解压缩到/usr/local/src/目录
    2. 进入软件目录
    3. ./configure --prefix=/usr/local/软件名
    4. make # 编译 (make clean: 清楚缓存，用于报错重新安装)
    5. make install # 编译安装
4. 删除安装目录即可删除软件

## 五、脚本安装包
1. 脚本自动化安装Nginx(本质还是源码包安装)


# 服务管理
## 一、简介与分类
1. 系统运行级别：
    1. runlevel : 查看系统运行级别；
    2. init [level] : 设置系统运行级别；
    ![image](https://i.loli.net/2019/07/31/5d418ae3b16bd20817.png)
    3. init 0 : 关机   init 6 : 重启
    4. 初始启动运行级别配置文件：/etc/inittab
2. 服务的分类：RPM包和源码包区别就是安装位置不同
    ![image](https://i.loli.net/2019/07/31/5d41927cadaf897534.png)
    1. chkconfig --list : 查看服务列表
3. 启动与自启动：
    - 服务启动：在当前系统中让服务运行；
    - 服务自启动：让服务在系统开机或者重启动之后，随着系统的启动而自动启动；
4. 端口和服务：
    - 端口号 0～65535，
    - 一般10000以内的端口是系统预留的，之外的用户可以自定义使用；
    - /etc/services 查看各服务对应端口
        1. FTP 21 文件传输
        1. TELNET 23
        1. SMTP 25 邮件
        1. DNS 53
        1. TFTP 69 简单文件传输
        1. SNMP 161 简单网络管理
    4. 查看系统通过端口开启了哪些服务：netstat -tlun

## 二、RPM包服务管理
1. 独立服务：
    - /etc/init.d/独立服务名 start|stop|status|restart
    - service 独立服务名 start|stop|status|restart
2. 改变服务自启动状态：(httpd是apache服务名)
    - chkconfig --level 2345 httpd on
    - 编辑 /etc/rc.d/rc.local 添加一行，则添加一个开机任务

## 三、源码包服务管理
1. 使用绝对路径，调用启动脚本来启动。不同源码包的启动命令不同。可以查看安装说明；
```
/usr/local/apache2/bin/apachectl start
```
2. 可以创建软连接，为源码包服务创建和RPM一样的启动方式
```
ln -s /usr/local/apache2/bin/apachectl /etc/init.d/
service apachectl start
```

## 四、总结
![image](https://i.loli.net/2019/08/02/5d43e685196c848330.png)


# 网络管理
## 一、网络基础
1. osi 7层模型：
    - 应用层：http
    - 表示层
    - 会话层
    - 传输层：TCP/UDP，不同端口不同服务，错误检测，流控
    - 网络层：报文，带ip地址，公网，选路
    - 数据链路层：帧，带mac地址，内网
    - 物理层：比特
2. TCP/IP 4层模型：
    - 应用层
    - 传输层
    - 国际互联层
    - 网络接口层
3. I-址分类：
![1.png](https://i.loli.net/2019/08/07/hoevJKWABmnFpDE.png)
4. 查看本机启用的端口：netstat -an
    - a 查看所有连接和监听端口
    - n 显示ip和端口号，而不是域名和服务器
5. 域名空间结构：
![1.png](https://i.loli.net/2019/08/08/E71yOehrdazp9L6.png)
6. 网关(类似路由器)：
    - 内网计算机访问外网时使用；
    - 网关负责将内网IP与公网IP之间互相转换；

## 二、linux网络配置
1. 临时修改ip：ifconfig
2. 修改网络配置文件: /etc/sysconfig/network-scripts/ifcfg-eth0(网卡名)

## 三、linux网络命令
1. ifconfig: 查看与配置网络状态命令
2. 关闭和启动网卡：
    - ifdown 网卡设备名 # 禁用网卡
    - ifup 网卡设备名 # 启用网卡
3. 查看网络状态：netstat 选项
    - t 列出TCP协议端口
    - u 列出UDP协议端口
    - n 使用IP地址和端口号
    - l 仅列出在监听状态的网络服务
    - a 列出所有网路服务
    - r 列出路由列表
```
netstat -tunl
netstat -an
netstat -rn
```
4. nslookup [域名或者ip] # 域名解析
5. ping [域名或者ip] # 查看连接是否通畅，网速
6. telnet [域名或者ip] [端口] # 端口探测
7. traceroute [参数] [主机] # 追踪网络数据包的路由途径
8. wget [地址] # 下载命令
9. tcpdump -i eth0 -nnX port 21 # 抓包
    - i 制定网卡接口
    - nn 将数据包中的域名和服务转换为ip和端口
    - X 以十六进制和ASCII码显示数据包内容
    - port 制定端口

## 四、远程登录工具
1. ssh 用户名@ip # 远程管理指定linux服务器
2. scp命令：文件夹操作要加-r
    - scp [-r] 用户名@ip:文件路径 本地路径 # 下载文件
    - scp [-r] 本地路径 用户名@ip:文件路径 # 上传文件


# linux权限管理之基本权限
## 一、文件基本权限
1. 文件权限查看：ls -l
![1.png](https://i.loli.net/2019/08/15/rdKPJuG9RZBQfpo.png)
2. 文件权限修改：chmod [选项] 模式 文件名
    - 选项：-R 递归
    - 模式 u代表所有者，g代表所有组，o代表其他人，a代表all三个角色
    - 权限数字 r-4 w-2 x-1 (rwxr-xr-x 755)
```
// example
chmod g+w,o+w test.av // test.av给所有组和其他人添加写权限
chmod a=rw test.av // test.av所有角色设为读写权限
chmod 644 test.av // test.av u读写，g度，o读
```
3. 权限对文件的作用：
    - r: 读取文件内容(cat more head tail)
    - w: 编辑、新增、修改文件内容(echo vi)，但是不包括删除文件(删除文件是对上一级目录的修改操作，需要对上一级目录有修改权限w)
    - x: 可执行
4. 权限对目录的作用：
    - r: 可以查询目录下文件(ls)
    - w: 具有修改目录结构的权限。如新建文件和目录，删除此目录下的文件和目录，重命名此目录下的文件和目录，剪切(touch rm mv cp)
    - x: 可以进入目录(cd)
5. 总结：
    - 对目录来说，最高权限是w
    - 对文件来说，最高权限是x
6. 修改文件所有者
    - chown 用户名 文件名
    - chgrp 组名 文件名

## 二、默认权限
1. umask查看默认权限
2. 默认最大权限
    - 文件 666
    - 目录 777
3. 计算默认权限
![2.png](https://i.loli.net/2019/08/15/CuFLnq4TSyIgRw3.png)


# linux权限管理之特殊权限
## 一、ACL权限
1. 概念：针对某个文件，给一个用户设定特殊权限；
2. 文件ACL权限查看：getfacl 文件名
3. 文件ACL权限设定：setfacl 选项 文件名
4. mask控制ACL能给予的最大权限（与操作）

## 二、sudo权限
1. sudo把本来只能超级用户执行的命令赋予普通用户执行；
2. sudo的使用：
    - visudo # 实际修改的是/etc/sudoers文件
    - ![1.png](https://i.loli.net/2019/08/20/Md9TP3bsQRn6OYA.png)
```
// 示例：授予普通用户可以重庆服务器
visudo
// 修改文件(追加)
user1 ALL= /sbin/shutdown -r now
// 查看可用的sudo命令
su -user1
sodu -l
// 执行赋予的命令
sudo /sbin/shutdown -r now
```

## 文件特殊权限
1. SetUID, SetGID, Sticky BIT(复杂，用到在细查)

## 不可改变为位权限
1. chattr [-+=] [选项] 文件或目录
