---
title: 从零构建React Todo项目(九)添加CI/CD流程
date: 2021-02-28
keywords: JavaScript, React, CICD
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
参考：
 - [基于 Github Action 的 CI/CD 流程](https://zhuanlan.zhihu.com/p/250534172)
 - [使用 Github Action 进行前端自动化发布](https://zhuanlan.zhihu.com/p/113802493)
 - [Copy via ssh ACTION](https://github.com/marketplace/actions/copy-via-ssh)
{% endnote %}


## 前言

说起自动化，无论是在公司还是我们个人的项目中，都会用到或者编写一些工具来帮助我们去处理琐碎重复的工作，以节约时间提升效率，尤其是我们做前端开发会涉及诸如构建、部署、单元测试等这些开发工作流中重复的事项。

基于 Github Action, 我们可以自动化的完成代码的 CI/CD 工作流。Github Action是 GitHub 推出的持续集成 (Con­tin­u­ous in­te­gra­tion，简称 CI) 服务，它提供了配置非常不错的虚拟服务器环境，基于它可以进行构建、测试、打包、部署项目。

<br/>


## 概念

### 持续集成

持续集成指的是，频繁地（一天多次）将代码集成到主干。 它的好处主要有两个：

 - 快速发现错误。每完成一点更新，就集成到主干，可以快速发现错误，定位错误也比较容易。

 - 防止分支大幅偏离主干。如果不是经常集成，主干又在不断更新，会导致以后集成的难度变大，甚至难以集成。

持续集成的目的，就是让产品可以快速迭代，同时还能保持高质量。它的核心措施是，代码集成到主干之前，必须通过自动化测试。只要有一个测试用例失败，就不能集成。

### 持续交付

持续交付（Continuous delivery）指的是，频繁地将软件的新版本，交付给质量团队或者用户，以供评审。如果评审通过，代码就进入生产阶段。 持续交付可以看作持续集成的下一步。它强调的是，不管怎么更新，软件是随时随地可以交付的。

### 持续部署

持续部署（continuous deployment）是持续交付的下一步，指的是代码通过评审以后，自动部署到生产环境。

持续部署的目标是，代码在任何时刻都是可部署的，可以进入生产阶段。

<br/>


## Github Action

Github Actions是由Github创建的 CI/CD服务。 它的目的是使所有软件开发工作流程的自动化变得容易。 直接从GitHub构建，测试和部署代码。CI（持续集成）由很多操作组成，比如代码合并、运行测试、登录远程服务器，发布到第三方服务等等。GitHub 把这些操作就称为 actions。

很多操作在不同项目里面是类似的，完全可以共享。GitHub 允许开发者把每个操作写成独立的脚本文件，存放到代码仓库，使得其他开发者可以引用。

如果你需要某个 action，不必自己写复杂的脚本，直接引用他人写好的 action 即可，整个持续集成过程，就变成了一个 actions 的组合。这就是 GitHub Actions 最特别的地方。

GitHub 做了一个[GitHub Marketplace](https://link.zhihu.com/?target=https%3A//github.com/marketplace%3Ftype%3Dactions) ，可以搜索到他人提交的 actions。另外，还有一个[Awesome Actions](https://link.zhihu.com/?target=https%3A//github.com/sdras/awesome-actions)的仓库，也可以找到不少 action。

### 基础概念

GitHub Actions 有一些自己的术语。

 - workflow （工作流程）：持续集成一次运行的过程。
 - job （任务）：一个 workflow 由一个或多个 job 构成，含义是一次持续集成的运行，可以完成多个任务。
 - step（步骤）：每个 job 由多个 step 构成，一步步完成。
 - action （动作）：每个 step 可以依次执行一个或多个命令（action）。

### 虚拟环境

GitHub Ac­tions 为每个任务 (job) 都提供了一个虚拟机来执行，每台虚拟机都有相同的硬件资源：

2-core CPU, 7 GB RAM 内存, 14 GB SSD 硬盘空间
硬盘总容量为90G左右，可用空间为30G左右

### workflow 文件

GitHub Ac­tions 的配置文件叫做 work­flow 文件，存放在代码仓库的.github/workflows 目录中。

work­flow 文件采用 YAML 格式，文件名可以任意取，但是后缀名统一为.yml，比如 build.yml。一个库可以有多个 work­flow 文件，GitHub 只要发现.github/workflows 目录里面有.yml 文件，就会按照文件中所指定的触发条件在符合条件时自动运行该文件中的工作流程。

1. name 字段是 work­flow 的名称。若忽略此字段，则默认会设置为 work­flow 文件名。
     ```yml
     name: GitHub Actions Demo
     ```

2. on 字段指定 work­flow 的触发条件，通常是某些事件，比如示例中的触发事件是 push，即在代码 push 到仓库后被触发。on 字段也可以是事件的数组，多种事件触发，比如在 push 或 pull_request 时触发：
     ```yml
     on: [push, pull_request]
     ```

 - push 指定分支触发
     ```yml
     on:
       push:
         branches:
           - master
     ```

 - push tag 时触发
     ```yml
     on:
       push:
         tags:
           - 'v*'
     ```

3. jobs 表示要执行的一项或多项任务。每一项任务必须关联一个 ID (job_id)，比如示例中的 my_first_job 和 my_second_job。job_id 里面的 name 字段是任务的名称。job_id 不能有空格，只能使用数字、英文字母和 - 或_符号，而 name 可以随意，若忽略 name 字段，则默认会设置为 job_id。

     当有多个任务时，可以指定任务的依赖关系，即运行顺序，否则是同时运行。

     ```yml
     jobs:
       job1:
       job2:
          needs: job1
       job3:
          needs: [job1, job2]
     ```
     上面代码中，job1 必须先于 job2 完成，而 job3 等待 job1 和 job2 的完成才能运行。因此，这个 work­flow 的运行顺序依次为：job1、job2、job3。

4. runs-on 字段指定任务运行所需要的虚拟服务器环境，是必填字段
     ```yml
     runs-on: ubuntu-18.04
     ```

5. steps 字段指定每个任务的运行步骤，可以包含一个或多个步骤。步骤开头使用 - 符号。每个步骤可以指定以下字段:
 - name：步骤名称。
 - uses：该步骤引用的action或 Docker 镜像。
 - run：该步骤运行的 bash 命令。
 - env：该步骤所需的环境变量。 其中 uses 和 run 是必填字段，每个步骤只能有其一。同样名称也是可以忽略的。
 - action: GitHub Ac­tions 中的重要组成部分，这点从名称中就可以看出，actions 是 action 的复数形式。它是已经编写好的步骤脚本，存放在 GitHub 仓库中。

<br/>


## 为todo项目添加Github Action

***目的：***每次提交代码到master分支，自动运行 代码校验、单元测试、打包、部署到服务器

1. 在package.json中scripts应该有代码校验、单元测试、打包的命令

     ```json
     "scripts": {
          "start": "rm -rf .dev/ && node build/dev.js",
          "build": "rm -rf dist/ && parcel build src/index.html --no-source-maps",
          "lint": "eslint src --fix",
          "test": "jest"
     }
     ```

2. 新建 workflow 文件 （.github/workflows/publish.yml），每一个step的意义都有详细注释

     ```yml
      name: 测试的CI流程

      on:
        push:
          branches:
            - master

      jobs:
        install-test-build-deploy:
          runs-on: ubuntu-latest
          name: install、test、build and deploy

          steps:
            # 拉取最新master分支代码
            - name: checkout master branch
              uses: actions/checkout@master

            # 下载node.js环境
            - name: set node environment
              uses: actions/setup-node@v1
              with:
                node-version: 12

            # 安装项目依赖
            - name: install node modules
              run: npm i

            # 检查代码格式规范
            - name: check eslint
              run: npm run lint

            # 运行单元测试
            - name: run unit testing
              run: npm run test

            # 构建前端资源包
            - name: build package
              run: npm run build

            # 部署到服务器
            - name: deploy to the server
              uses: garygrossgarten/github-action-scp@release
              with:
                  local: dist
                  remote: /opt/application/todo
                  host: ${{ secrets.SSH_HOST }}
                  username: ${{ secrets.SSH_USER }}
                  password: ${{ secrets.PASSWORD }}
                  concurrency: 20
     ```

3. 提交代码到仓库master分支，查看Github Action执行结果

    ![cicd.jpeg](https://i.loli.net/2021/02/28/cR9LT65CD3ZFvJW.png)

4. 查看todo项目线上地址，资源已更新

    ![WX20210228-165441@2x.png](https://i.loli.net/2021/02/28/wDuNiOvk98ys4Ra.png)