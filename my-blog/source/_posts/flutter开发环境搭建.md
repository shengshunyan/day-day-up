---
title: flutter开发环境搭建
date: 2019-05-30
tags:
     - 大前端
---

# [官网安装教程](https://flutter.dev/docs/get-started/install)
1. 在官网根据不同操作系统，下载不同版本的Flutter SDK；
2. 没有科学上网页面打开会有点慢；

<!-- more -->

# macOS开发环境搭建
1. 前期准备：
    1. 操作系统: macOS (64-bit)
    2. 磁盘空间: 700 MB（这是理论值，实际装完Xcode、Android Studio和其他一些依赖，磁盘空间占用10G以上）
    3. Flutter 依赖下面这些命令行工具：bash, mkdir, rm, git, curl, unzip, which
    4. 下载安装Java JDK
2. [SDK下载](https://storage.googleapis.com/flutter_infra/releases/stable/macos/flutter_macos_v1.5.4-hotfix.2-stable.zip)
3. 解压SDK包：
```
 cd ~/development
 unzip ~/Downloads/flutter_macos_v1.5.4-hotfix.2-stable.zip
```
4. 添加flutter到你的环境变量
    1. 方法一：只在当前终端有效
    ```
    export PATH="$PATH:`pwd`/flutter/bin"
    ```
    2. 方法二: 永久将Flutter添加到PATH中
    ```
    // a. 打开或者新建$HOME/.bash_profile.文件(可查阅学习vim指令编辑文件方法)
    vim $HOME/.bash_profile
    // b. 添加以下内容到文件尾
    export PATH="$PATH:[PATH_TO_FLUTTER_GIT_DIRECTORY]/flutter/bin"
    // c. 执行 source $HOME/.bash_profile 指令让环境变量生效
    // d. 打印$PATH验证flutter环境变量是否添加成功
    echo $PATH
    ```
    ![确认PATH添加成功](https://i.loli.net/2019/06/27/5d1486605443755092.png)
5. VSCode编辑器插件安装：点击安装Flutter插件会自动帮你把Dart插件也一起安装；
![vscode插件](https://i.loli.net/2019/06/27/5d148975b04a911750.png)
6. 运行flutter doctor，检查开发环境; (第一次运行一个flutter命令（如flutter doctor）时，它会下载它自己的依赖项并自行编译。)
```
flutter doctor
```
7. 创建一个flutter项目
```
flutter create my_app
```
8. 平台设置：IOS
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
    ![终端](https://i.loli.net/2019/06/27/5d148de09234884312.png)
    5. 运行flutter示例项目
    ```
    cd my_app
    flutter run
    ```
    6. IOS真机测试：涉及收费项目
9. 平台设置：Android
    1. 安装[android studio](https://developer.android.com/studio)(可找国内镜像下载)
    2. 启动 Android Studio>Tools>Android>AVD Manager 并选择 Create Virtual Device.
    3. 选择一个设备并选择 Next
    4. 为要模拟的Android版本选择一个系统映像(踩坑：选择Q运行调试有问题，选择Pie就可以运行调试项目)
    ![image](https://i.loli.net/2019/06/27/5d149031d94c716754.png)
    5. 添加完成后，用vscode打开flutter示例项目，启动Android模拟器
    ![vscode](https://i.loli.net/2019/06/27/5d1491ee57fa485704.png)
    ![android](https://i.loli.net/2019/06/27/5d1492592bb3b32518.png)
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

10. 调试终端快捷键：
    1. R: 热加载，查看预览效果；
    2. P：显示网格；
    3. O：切换系统；
    4. Q：退出调试模式；
# [windows开发环境搭建](https://flutter.dev/docs/get-started/install/windows)
1. 主要差别在没有macOS的Xcode，不能使用IOS模拟器；