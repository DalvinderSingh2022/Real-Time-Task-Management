const express = require("express");
const { allComments, addComment } = require("../controllers/comment");

const router = express.Router();

router.route('/api/comments/:taskId').post(addComment).get(allComments);

module.exports = router;