# 构建阶段
FROM node:20-alpine as build

WORKDIR /app

# 构建参数
ARG VITE_API_BASE_URL=https://api.reforum.space/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci

# 复制所有源代码文件（确保所有文件都被复制）
COPY src ./src
COPY index.html ./
COPY vite.config.js ./
COPY public ./public

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建结果到 nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



