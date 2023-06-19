# 베이스이미지
FROM node:16-alpine

# 컨테이너 안에서 어떤 경로로 실행할지 기재
WORKDIR /src

#프로젝트 파일 복사
COPY package*.json ./
COPY .env .

RUN yarn install

COPY . .

CMD  ["node", "app.js"]

EXPOSE 3001
