const express = require('express');
const router = express.Router();
const { list, detail } = require('../controllers/actorsController');

router
    .get('/', list)
    .get('/detail/:id', detail)

module.exports = router;