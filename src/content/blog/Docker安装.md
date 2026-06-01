---
title: "Docker安装"
description: "Docker安装"
publishDate: "2025-04-10"
tags:
  - "Docker"
---

> 参考教程：https://www.mliev.com/docs/1ms.run/install-docker

## 1. Docker安装

### 一键安装

```bash 
bash <(curl -f -s --connect-timeout 10 --retry 3 https://linuxmirrors.cn/docker.sh) --source mirrors.tencent.com/docker-ce --source-registry docker.1ms.run --protocol https --install-latested true --close-firewall false --ignore-backup-tips
```



## 2. Docker Compose安装

### 国内安装（速度超快）

```bash
sudo curl -L "https://ghproxy.cc/https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### 普通安装（速度超慢）

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```