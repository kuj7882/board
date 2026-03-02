const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// -------------------- 미들웨어 --------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'board')));

// -------------------- 템플릿 --------------------
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');

// -------------------- DB 연결 --------------------
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',    // DB 계정
  password: '',    // 없으면 빈 문자열
  database: 'postDB'
});

// -------------------- DB 헬퍼 함수 --------------------
async function getPosts() {
  const [rows] = await pool.query('SELECT * FROM board ORDER BY id ASC');
  return rows.map(row => ({
    ...row,
    createdAt: row.createdAt.toISOString().split('T')[0] // YYYY-MM-DD로 변환
  }));
}

async function addPost(title, content) {
  await pool.query('INSERT INTO board (title, content) VALUES (?, ?)', [title, content]);
}

async function getPostById(id) {
  const [rows] = await pool.query('SELECT * FROM board WHERE id = ?', [id]);
  if (!rows[0]) return null;

  return {
    ...rows[0],
    createdAt: rows[0].createdAt.toISOString().split('T')[0] // YYYY-MM-DD
  };
}

// -------------------- 라우터 --------------------

// 게시글 목록
app.get('/', async (req, res) => {
  const posts = await getPosts();
  res.render('boardList', { posts });
});

// 글 작성 페이지
app.get('/boardWrite', (req, res) => {
  res.render('boardWrite');
});

// 글 작성 처리
app.post('/boardWrite', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('제목과 내용을 모두 입력해주세요.');

  await addPost(title, content);
  res.redirect('/');
});

// 게시글 상세 페이지
app.get('/boardDetail/:id', async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) return res.status(404).send('게시글을 찾을 수 없습니다.');

  res.render('boardDetail', { post });
});

// -------------------- 서버 실행 --------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});