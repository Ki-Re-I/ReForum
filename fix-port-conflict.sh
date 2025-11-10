#!/bin/bash

# 修复端口冲突脚本

echo "检查端口占用情况..."

# 检查 5432 端口
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  端口 5432 已被占用"
    echo "占用进程："
    lsof -Pi :5432 -sTCP:LISTEN
    echo ""
    echo "解决方案："
    echo "1. 停止占用端口的服务"
    echo "2. 或修改 docker-compose.yml 移除数据库端口映射（推荐）"
else
    echo "✅ 端口 5432 未被占用"
fi

