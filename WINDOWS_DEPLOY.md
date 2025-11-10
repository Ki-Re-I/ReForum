# Windows 部署指南

## 在 Windows 上生成 JWT Secret

### 方法1: 使用 PowerShell 脚本（推荐）

```powershell
# 运行脚本
.\generate-secret.ps1
```

脚本会自动生成密钥并复制到剪贴板。

### 方法2: 直接在 PowerShell 中运行

```powershell
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### 方法3: 使用在线工具

访问 https://generate-secret.vercel.app/32 生成 32 字节的 Base64 编码密钥。

## 更新 docker-compose.yml

生成密钥后，编辑 `docker-compose.yml` 文件，将 `JWT_SECRET` 替换为生成的密钥：

```yaml
environment:
  - JWT_SECRET=your_generated_secret_here
```

## 部署到服务器

### 1. 使用 Git 上传（推荐）

```powershell
# 在本地初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin <your-repository-url>
git push -u origin main
```

然后在服务器上：

```bash
git clone <your-repository-url>
cd REForum
docker-compose up -d
```

### 2. 使用 SCP 上传

```powershell
# 使用 WinSCP 或 PowerShell SCP
scp -r . user@43.167.196.43:/home/user/REForum
```

### 3. 使用 FTP/SFTP

使用 FileZilla 或其他 FTP 客户端上传项目文件夹。

## 在服务器上部署

SSH 连接到服务器后：

```bash
# 进入项目目录
cd REForum

# 检查配置
cat docker-compose.yml

# 构建并启动
docker-compose build
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 验证部署

```bash
# 检查服务状态
docker-compose ps

# 测试健康检查
curl http://localhost:3000/health

# 访问应用
# 前端: http://43.167.196.43
# 后端: http://43.167.196.43:3000
```

## 注意事项

1. **数据库密码一致性**: 确保 `backend` 服务的 `DB_PASSWORD` 与 `db` 服务的 `POSTGRES_PASSWORD` 一致
2. **JWT Secret**: 使用强随机密钥，不要使用默认值
3. **环境变量**: 确保所有环境变量都已正确配置
4. **端口开放**: 确保服务器防火墙已开放 80 和 3000 端口

## 故障排查

### 如果遇到权限问题

```powershell
# 在 PowerShell 中运行（以管理员身份）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 如果 Docker 未安装

1. 下载 Docker Desktop for Windows: https://www.docker.com/products/docker-desktop
2. 安装并重启电脑
3. 确保 WSL 2 已启用

### 如果端口被占用

```powershell
# 检查端口占用
netstat -ano | findstr :80
netstat -ano | findstr :3000

# 终止占用端口的进程
taskkill /PID <进程ID> /F
```

---

**现在您可以在 Windows 上准备部署，然后上传到服务器！** 🚀

