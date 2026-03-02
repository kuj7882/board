const express = require('express');
const router = express.Router();
const controller = require('./boardController');

// 게시글 목록
router.get('/', controller.listPosts);

// 글 작성
router.get('/boardWrite', controller.showWriteForm);
router.post('/boardWrite', controller.writePost);

// 게시글 상세
router.get('/boardDetail/:id', controller.showDetail);

// 글 수정
router.get('/boardEdit/:id', controller.showEditForm);
router.post('/boardEdit/:id', controller.editPost);

// 글 삭제
router.post('/boardDelete/:id', controller.deletePost);

module.exports = router;