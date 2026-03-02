const express = require('express');
const router = express.Router();
const controller = require('./boardController');

// 게시글 목록
router.get('/', controller.listPosts);

// 글 작성 페이지
router.get('/boardWrite', controller.showWriteForm);

// 글 작성 처리
router.post('/boardWrite', controller.writePost);

// 게시글 상세
router.get('/boardDetail/:id', controller.showDetail);

module.exports = router;