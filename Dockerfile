# 베이스이미지
FROM node:16-alpine


#프로젝트 파일 복사
COPY package*.json ./

RUN yarn install

COPY . .

CMD  ["node", "app.js"]

EXPOSE 3001
