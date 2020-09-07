---
title: git合并不同仓库的分支代码
date: 2020-07-07
keywords: JavaScript, git, 分支，合并
cover: https://i.loli.net/2020/09/07/czjVJ4ZKnB1XNFh.png
tags:
     - note
---


## 需求背景

当一个代码仓库A因为业务需求，在一个时间节点复制出另一个代码仓库B，并且之后开始各自维护更新代码。在某个时候A仓库的某分支需要同步仓库B某分支的代码修改，这时候就可以按照下面介绍的步骤来实现代码的同步。

Ps: 两个仓库需要有一个提交节点代码是相同的

<br/>


## 示例仓库

下面以工作中的两个仓库为例

1. pony-A仓库
```bash
$ git remote show origin
* remote origin
  Fetch URL: https://code.gitlab.cn/frontend/middle-platform/pony-A.git
  Push  URL: https://code.gitlab.cn/frontend/middle-platform//pony-A.git
  ...
```

2. pony-B仓库
```bash
$ git remote show origin
* remote origin
  Fetch URL: https://code.gitlab.cn/frontend/middle-platform/pony-B.git
  Push  URL: https://code.gitlab.cn/frontend/middle-platform/pony-B.git
  ...
```

现在需要将pony-B develop分支的代码同步到pony-A develop分支上

<br/>


## 分支合并的方式（merge / rebase）

1. 在A仓库本地添加一下B仓库的远程仓库

  **/pony-A**
  ```bash
  git remote add pony-B https://code.gitlab.cn/frontend/middle-platform/pony-B.git

  <!-- 查看远程仓库源 -->
  git remote show                                                                                        
    origin
    pony-B
  ```

2. 拉取pony-B远程仓库代码到pony-A本地

  **/pony-A**
  ```bash
  git fetch pony-B

  <!-- 查看本地所有分支 -->
  git branch -a                                                                                   
  * develop
    remotes/pony-B/develop
    remotes/pony-B/master
    remotes/origin/HEAD -> origin/develop
    remotes/origin/develop
    remotes/origin/master
  ```

3. 合并分支代码（merge或rebase的方式， 这里以merge的方式为例）

  **/pony-A**
  ```bash
  <!-- a. 新建一个分支用来做代码同步操作，保证原分支不受影响 -->
  git checkout -b mergeBranch

  <!-- b. 合并pony-B develop分支代码 -->
  git merge pony-B/develop     
  
  <!-- c. 如果有冲突，需先解决冲突，然后再次提交；如果没有冲突，则直接到下一步 -->                                                           
  git add .
  git commit -m "feat(module): add new feat on pony-B develop"

  <!-- d. 如果确认合并完成没有问题，则将代码合入develop分支 -->
  git checkout develop
  git merge mergeBranch   
  ```

<br/>


## cherry-pick的方式

如果你只需要同步部分代码变动（某几个提交），这时可以采用 Cherry pick。

1. 在A仓库本地添加一下B仓库的远程仓库

  **/pony-A**
  ```bash
  git remote add pony-B https://code.gitlab.cn/frontend/middle-platform/pony-B.git

  <!-- 查看远程仓库源 -->
  git remote show                                                                                        
    origin
    pony-B
  ```

2. 拉取pony-B远程仓库代码到pony-A本地

  **/pony-A**
  ```bash
  git fetch pony-B

  <!-- 查看本地所有分支 -->
  git branch -a                                                                                   
  * develop
    remotes/pony-B/develop
    remotes/pony-B/master
    remotes/origin/HEAD -> origin/develop
    remotes/origin/develop
    remotes/origin/master
  ```

3. 同步相关commit的代码

  **/pony-A**
  ```bash
  <!-- a. 新建一个分支用来做代码同步操作，保证原分支不受影响 -->
  git checkout -b mergeBranch

  <!-- b. 查看pony-B/develop的提交记录，获取需要同步的commit hash，然后同步某个commit的代码（以最近一个记录为例） -->
  git log pony-B/develop --oneline
    a8100b8 add something a
    379df9f add something b
    1d0bd0e add something c
    5bdaf55 add something d
    e3b17f6 add something e
    f54bd4e add something f
    0b93794 add something g
    3f588d2 add something h

  git cherry-pick a8100b8
  
  <!-- c. 如果有冲突，需先解决冲突，然后再次提交；如果没有冲突，则直接到下一步 -->                                                           
  git add .
  git cherry-pick --continue

  <!-- d. 如果确认合并完成没有问题，则将代码合入develop分支 -->
  git checkout develop
  git merge mergeBranch   
  ```

<br/>