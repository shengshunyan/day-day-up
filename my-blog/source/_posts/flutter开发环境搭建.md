---
title: flutter开发环境搭建
date: 2019-05-30
tags:
     - 大前端
---

## 官网安装教程
1. https://flutter.dev/docs/get-started/install
2. 在官网根据不同操作系统，下载不同版本的Flutter SDK；
3. 没有科学上网页面打开会有点慢；

## macOS catalina（v10.15.x）开发环境搭建
详细步骤参考bilibili视频：https://www.bilibili.com/video/av52490605?p=15

### 一、 前期准备：
1. 操作系统: macOS (64-bit)
2. 磁盘空间: 700 MB（这是理论值，实际装完Xcode、Android Studio和其他一些依赖，磁盘空间很大）
3. Flutter 依赖下面这些命令行工具：bash, mkdir, rm, git, curl, unzip, which

### 二、SDK安装：
1. 官网下载
2. 官网网速较慢，可以搜索国内相关镜像下载

### 三、flutter SDK安装
1. 下载：
    1. 官网
    2. 国内镜像 https://www.awaimai.com/2835.html
2. 添加flutter到你的环境变量，并且配置国内包的镜像
    1. bash终端
    ```bash
    vim ～/.bash_profile
    # 添加以下三行
    export PATH=${PATH}:[flutter folder path]/flutter/bin
    export PUB_HOSTED_URL=https://mirrors.cloud.tencent.com/dart-pub
    export FLUTTER_STORAGE_BASE_URL=https://mirrors.cloud.tencent.com/flutter
    # 使文件生效
    source $HOME/.bash_profile
    ```
    2. zsh终端
    ```bash
    vim ～/.zprofile
    # 添加以下三行
    export PATH=${PATH}:[flutter folder path]/flutter/bin
    export PUB_HOSTED_URL=https://mirrors.cloud.tencent.com/dart-pub
    export FLUTTER_STORAGE_BASE_URL=https://mirrors.cloud.tencent.com/flutter
    # 使文件生效
    source $HOME/.z_profile
    ```
    
### 四、检查flutter开发环境
1. 运行flutter doctor，检查开发环境; (第一次运行一个flutter命令（如flutter doctor）时，它会下载它自己的依赖项并自行编译。)
```
flutter doctor
```
2. 此时，应该flutter项的检查ok了，还需要配置开发工具
3. 创建一个flutter项目
```
flutter create my_app
```

## 工具配置
不用都安装，选其中一种就行

### 一、Android—— Android Studio
1. 安装时proxy确认窗点取消就行
2. configure -> SDK tools -> 显示隐藏项目 -> 勾选SDK tools选项
    <img src="https://i.loli.net/2020/03/02/9T3dhvAQrnau6JD.png" width="400" height="250" />  
3. configure -> plugins -> 下载flutter插件
    <img src="https://i.loli.net/2020/03/02/AT3BumfXGrUSNYt.png" width="400" height="300" /> 
4. 启动 Android Studio>Tools>Android>AVD Manager 并选择 Create Virtual Device.
    3. 选择一个设备并选择 Next
    4. 为要模拟的Android版本选择一个系统映像(踩坑：选择Q运行调试有问题，选择Pie就可以运行调试项目)
        <img src="https://i.loli.net/2019/06/27/5d149031d94c716754.png" width="400" height="250" /> 
    5. 添加完成后，用vscode打开flutter示例项目，启动Android模拟器
        <img src="https://i.loli.net/2019/06/27/5d1491ee57fa485704.png" width="400" height="250" /> 
        <img src="https://i.loli.net/2019/06/27/5d1492592bb3b32518.png" width="200" height="300" /> 
    6. 运行flutter示例项目
    ```
    cd my_app
    flutter run
    ```
    7. Android真机测试：
        1. 在您的设备上启用 开发人员选项 和 USB调试 。详细说明可在Android文档中找到。
        2. 使用USB将手机插入电脑。如果您的设备出现提示，请授权您的计算机访问您的设备。
        3. 在终端中，运行 flutter devices 命令以验证Flutter识别您连接的Android设备。
        4. 运行启动您的应用程序 flutter run。


### 二、平台设置：IOS—— Xcode
1. 从App Store中安装Xcode
2. 配置Xcode命令行工具
    ```
    sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
    ```
3. 通过Xcode许可协议
    ```
    sudo xcodebuild -license
    ```
4. 打开终端模拟器
    ```
    open -a Simulator
    ```
    <img src="https://i.loli.net/2019/06/27/5d148de09234884312.png" width="200" height="400" />  
5. 运行flutter示例项目
    ```
    cd my_app
    flutter run
    ```
6. IOS真机测试：涉及收费项目

### 三、vscode也可以作为编辑器
1. VSCode编辑器插件安装：点击安装Flutter插件会自动帮你把Dart插件也一起安装；
    <img src="https://i.loli.net/2019/06/27/5d148975b04a911750.png" width="200" height="250" />  
2. 还是得安装、配置Xcode（第二步）
3. 打开终端模拟器
    ```
    open -a Simulator
    ```
4. 运行flutter示例项目
    ```
    cd my_app
    flutter run
    ```
    
## 调试终端快捷键：
1. R: 热加载，查看预览效果；
2. P：显示网格；
3. O：切换系统；
4. Q：退出调试模式；
