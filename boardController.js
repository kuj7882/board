const mysql = require('mysql2/promise');

// DB 연결
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // 본인 DB 비밀번호
  database: 'postDB'
});

// 게시글 목록 조회
async function getPosts() {
  const [rows] = await pool.query('SELECT * FROM board ORDER BY id ASC');
  return rows.map(row => ({
    ...row,
    createdAt: row.createdAt.toISOString().split('T')[0]
  }));
}

// 게시글 작성
async function addPost(title, content) {
  await pool.query('INSERT INTO board (title, content) VALUES (?, ?)', [title, content]);
}

// 게시글 상세
async function getPostById(id) {
  const [rows] = await pool.query('SELECT * FROM board WHERE id = ?', [id]);
  if (!rows[0]) return null;
  return {
    ...rows[0],
    createdAt: rows[0].createdAt.toISOString().split('T')[0]
  };
}

// 컨트롤러 함수
module.exports = {
  listPosts: async (req, res) => {
    const posts = await getPosts();
    res.render('boardList', { posts });
  },

  showWriteForm: (req, res) => {
    res.render('boardWrite');
  },

  writePost: async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).send('제목과 내용을 모두 입력해주세요.');
    await addPost(title, content);
    res.redirect('/');
  },

  showDetail: async (req, res) => {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).send('게시글을 찾을 수 없습니다.');
    res.render('boardDetail', { post });
  }
};