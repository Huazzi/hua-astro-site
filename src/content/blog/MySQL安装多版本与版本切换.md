---
slug: "152931"
aliases:
  - mysql安装多版本与版本切换
title: "MySQL安装多版本与版本切换"
description: "MySQL安装多版本与版本切换"
publishDate: "2025-02-28"
tags:
  - "MySQL"
  - "数据库"
---



今天在将双创项目部署到本地，这个项目使用的MySQL版本是MySQL5.7，应该是比较古早的项目了，但是我现在装的是8.4版本的，所以涉及MySQL的版本切换，这里记录一下操作方法。





---

### 如何安全切换版本而不删除原有MySQL？

#### 1. **仅停止旧服务，保留文件**

   - 停止并删除旧服务（若之前安装的时候没有自己指定MySQL服务名，则默认为`MySQL`）：

     ```bash
     #停止现有的MySQL服务
     net stop MySQL
     # 确认旧服务不会再用可以选择直接在删除服务
     sc delete MySQL
     ```

   - **注意**：此操作仅移除服务注册，不会删除安装目录（如`D:\MySQL\mysql-8.4.1-winx64`）和数据目录（默认在`ProgramData\MySQL`或自定义路径）。

> 为什么需要删除服务？
>
> 当你在Windows中安装MySQL时，系统会注册一个服务（如默认的`MySQL`或`MySQL80`）。若直接安装第二个MySQL实例，可能会因服务名冲突导致报错`The service already exists!`。因此，**删除旧服务是为了解决服务名冲突问题，而不是卸载MySQL**。切换版本时只需处理服务注册项，保留原有数据和程序文件即可。



#### 2. **添加配置文件`my.ini`**

若安装MySQL的方法为直接下载压缩包的话，是没有自带`my.ini`文件的，需要自己新建一个，位置为根目录`D:\MySQL\mysql-8.4.1-winx64\`下，具体内容如下。

示例`my.ini`配置：

```ini
[mysqld]
#端口号 若有多个mysql，端口号应不同
port = 3307              
#mysql-5.7.43-winx64的路径
basedir=D:\MySQL\mysql-5.7.43-winx64           #修改为自己的数据库解压路径
#mysql-5.7.43-winx64的路径+\data
datadir=D:\MySQL\mysql-5.7.43-winx64\data   #修改为自己的数据库存储路径
 
#最大连接数
max_connections=200
#编码
character-set-server=utf8
default-storage-engine=INNODB
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

[mysql]
#编码
default-character-set=utf8 
```



#### 3. **安装新版本时指定独立配置**

   - 进入新版本的**`bin`目录**，执行安装命令时需：

     - **指定新服务名**：避免与旧服务冲突（如`MySQL_New`）。
     - **配置独立端口和数据目录**：在`my.ini`中设置不同端口（如3307）和`datadir`路径。

     ```bash
     mysqld install MySQL_New --defaults-file="D:\新版本路径\my.ini"
     
     # 例：
     mysqld install MySQL57 --defaults-file="D:\MySQL\mysql-5.7.37-winx64\my.ini"
     ```

   - 初始化并启动新服务：

     执行初始化命令之后会得到一个随机生成的密码，用于初次连接登录。

     ```bash
     # 初始化
     mysqld --defaults-file="D:\MySQL\mysql-5.7.37-winx64\my.ini" --initialize --console
     # 启动
     net start MySQL_New
     ```

   - 连接，进入MySQL命令行

     ```bash
     # 连接版本（端口3307）
     mysql -uroot -P3307 -p
     ```

   - 更改密码

     将随机密码更改为自己熟悉的密码，如``123456`

     ```bash
     ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
     ```



#### 4. **多版本共存与切换**

   - **通过不同服务名启动/停止**：

     ```bash
     net start MySQL_New   # 启动新版本
     net stop MySQL_Old    # 停止旧版本
     ```

   - **通过不同端口连接**：

     ```bash
     mysql -uroot -P3306 -p   # 连接旧版本（端口3306）
     mysql -uroot -P3307 -p   # 连接新版本（端口3307）
     ```

   - **环境变量切换**（可选）：
     将常用版本的`bin`目录放在系统变量`Path`最前面，或通过批处理脚本临时切换路径。

---

### **注意事项**

1. **数据安全**：  
   删除服务时切勿误删`datadir`文件夹（包含数据库文件）或`basedir`（安装目录）。若需彻底卸载，才需手动删除这些目录。
2. **注册表残留**：  
   若后续安装失败，检查注册表`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services`中是否残留旧服务项并手动删除。
3. **配置文件隔离**：  
   确保新旧版本的`my.ini`文件独立，避免端口或路径冲突。

---

篇结。