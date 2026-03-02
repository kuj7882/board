const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const boardRouter = require('./router'); // router 연결

const app = express();
const PORT = 3000;

// 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'board')));

// 템플릿 엔진
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');

// 라우터 연결
app.use('/', boardRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});