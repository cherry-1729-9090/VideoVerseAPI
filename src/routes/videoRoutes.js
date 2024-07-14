const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../middleware/upload');

router.post('/hi',(req,res)=>{
    res.send("Hello");
})
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.post('/trim', videoController.trimVideo);
router.post('/concatenate', videoController.concatenateVideos);

module.exports = router;