const express = require('express');
const router = express.Router();
const { list, newMovie, recommended, detail, search, add, create, edit, update, remove, destroy } = require('../controllers/moviesController');
const moviesAddValidator = require('../validations/moviesAddValidator');
const moviesEditValidator = require('../validations/moviesEditValidator');

router.get('/', list);
router.get('/new', newMovie);
router.get('/recommended', recommended);
router.get('/detail/:id', detail);
router.get('/search', search);
//Rutas exigidas para la creación del CRUD
router.get('/add', add);
router.post('/create', moviesAddValidator, create);
router.get('/edit/:id', edit);
router.put('/update/:id', moviesEditValidator, update);
router.get('/delete/:id', remove);
router.delete('/destroy/:id', destroy);

module.exports = router;