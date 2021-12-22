const express = require('express');
const router = express.Router();
const { list, detail } = require('../controllers/genresController');

router.get('/', list);
router.get('/detail/:id', detail);


module.exports = router;