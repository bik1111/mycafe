# 베이스 이미지
FROM node:16-alpine

WORKDIR /src

# 프로젝트 파일 복사
COPY package*.json ./

RUN npm install

COPY . .

# 환경 변수 설정
ENV DB_HOST=docker.for.mac.host.internal
ENV DB_USER=root
ENV DB_PASS=tkfkdgo12
ENV DB_NAME=cafe
ENV JWT_SECRET=thisissecret!
ENV REDIS_HOST=docker.for.mac.host.internal
ENV REDIS_PORT=6379
ENV SESSION_SECRET=tkfkdgo12!

CMD ["node", "app.js"]

EXPOSE 3001
