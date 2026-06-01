---
title: "Docker命令"
description: "Docker命令"
publishDate: "2025-04-10"
tags:
  - "Docker"
---

在 Docker 中查看容器、镜像、网络等状态的常用命令：

---

### **1. 查看容器状态**

#### **① 列出正在运行的容器**

```bash
docker ps
```

#### **② 列出所有容器（包括已停止的）**

```bash
docker ps -a
```

#### **③ 显示容器的实时资源占用**

```bash
docker stats
```

#### **④ 查看单个容器的详细信息**

```bash
docker inspect <容器ID或名称>
```

#### **⑤ 查看容器的日志**

```bash
docker logs <容器ID或名称>
# 实时跟踪日志
docker logs -f <容器ID或名称>
```

---

### **2. 查看镜像状态**

#### **① 列出本地所有镜像**

```bash
docker images
# 显示镜像ID（简短形式）
docker images -q
```

#### **② 查看镜像的构建历史**

```bash
docker history <镜像名>
```

#### **③ 检查镜像的详细信息**

```bash
docker inspect <镜像ID或名称>
```

---

### **3. 查看网络状态**

#### **① 列出所有网络**

```bash
docker network ls
```

#### **② 查看网络详细信息**

```bash
docker network inspect <网络名或ID>
```

---

### **4. 查看数据卷状态**

#### **① 列出所有数据卷**

```bash
docker volume ls
```

#### **② 查看数据卷详细信息**

```bash
docker volume inspect <卷名>
```

---

### **5. 查看 Docker 系统信息**

#### **① Docker 版本和系统信息**

```bash
docker version     # 版本信息
docker info       # 系统级信息（存储驱动、容器数量等）
```

#### **② 显示磁盘使用情况**

```bash
docker system df
```

#### **③ 查看构建缓存**

```bash
docker builder prune --dry-run
```

---

### **6. 常用组合命令**

#### **① 格式化输出容器列表**

```bash
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

#### **② 显示所有容器的端口映射**

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

---

### **7. 状态筛选与过滤**

#### **① 按状态过滤容器**

```bash
docker ps -f "status=exited"   # 显示已停止的容器
docker ps -f "name=web"        # 按名称筛选
```

#### **② 按标签筛选**

```bash
docker ps -f "label=env=prod"
```

---

### **8. 问题排查命令**

| 问题场景         | 命令                                     |
| ---------------- | ---------------------------------------- |
| 容器启动失败     | `docker logs <容器ID>`                   |
| 检查容器内进程   | `docker top <容器ID>`                    |
| 查看容器文件改动 | `docker diff <容器ID>`                   |
| 容器资源限制     | `docker stats <容器ID>`                  |
| 网络连通性测试   | `docker exec -it <容器ID> ping <目标IP>` |

---

### **9. 示例输出解读**

#### **`docker ps` 输出示例**

```
CONTAINER ID   IMAGE          COMMAND       STATUS        PORTS                    NAMES
a1b2c3d4e5f6   nginx:latest   "nginx -g"    Up 2 hours    0.0.0.0:8080->80/tcp     web-server
```

- **STATUS 字段**：  
  - `Up`：运行中  
  - `Exited`：已停止  
  - `Restarting`：重启中  

#### **`docker stats` 输出示例**

```
CONTAINER ID   CPU %   MEM USAGE / LIMIT     MEM %   NET I/O       BLOCK I/O   PIDS
a1b2c3d4e5f6   0.5%    50MiB / 1.944GiB     2.51%   1.2kB / 0B    0B / 0B     3
```

---

通过以上命令，你可以全面掌握 Docker 中各类资源的状态。如果需要更详细的信息，结合 `docker inspect` 和日志分析是关键！