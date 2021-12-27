const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const {validationResult} = require('express-validator');

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                return res.render('moviesList.ejs', {movies})
            })
            .catch(error => console.log(error));
    },
    'detail': (req, res) => {
        let promMovies = db.Movie.findByPk(req.params.id,{
            include: ['genre','actors']
        })
        let promGenres = db.Genre.findAll()
        let promActors = db.Actor.findAll()
        Promise.all([promMovies, promGenres, promActors])
            .then(([movie, allGenres, allActors]) => {
                //return res.send(movie)
                return res.render('moviesDetail.ejs', {
                    movie,
                    allGenres,
                    allActors
                });
            })
            .catch(error => console.log(error));
    },
    'newMovie': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                return res.render('newestMovies', {movies});
            })
            .catch(error => console.log(error));
    },
    'recommended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                return res.render('recommendedMovies.ejs', {movies});
            })
            .catch(error => console.log(error));
    },
    search : (req,res) => {
        Movies.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.substring]: req.query.keywords
                    }
                }]
            }
        })
            .then(movies => res.render('moviesResult',{
                title: 'Resultado de la búsqueda',
                movies,
                busqueda: req.query.keywords.trim()
            }))
            .catch(error => console.log(error));
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: (req, res) => {
        let promGenres = Genres.findAll({order: [['name']]});
        let promActors = Actors.findAll({order: [['last_name']]});
        
        Promise
        .all([promGenres, promActors])
            .then(([allGenres, allActors]) => res.render('moviesAdd',{
                allGenres,
                allActors
            }))
            .catch(error => console.log(error));
    },
    create: (req, res) => {
        let errors = validationResult(req);
        const {title,rating,awards,release_date,length,genre_id} = req.body;

        if (errors.isEmpty()) {
            Movies.create({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length,
                genre_id
            })
                .then(movie => {
                    console.log(movie);
                    return res.redirect('/movies')
                })
                .catch(error => console.log(error));
        } else {
            let promGenres = Genres.findAll({order: [['name']]});
            let promActors = Actors.findAll({order: [['last_name']]});
            
            Promise
            .all([promGenres, promActors])
            .then(([allGenres, allActors]) => {
                return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {
                    allGenres,
                    allActors,
                    errors: errors.mapped(),
                    old: req.body
                })})
                .catch(error => console.log(error));
        }
    },
    edit: (req, res) => {
        let Movie = Movies.findByPk(req.params.id,{
            include: ['genre']
        })
        let allGenres = Genres.findAll({
            order: [['name']]
        })
        Promise.all(([Movie,allGenres]))
            .then(([Movie,allGenres]) => {
                Movie.release_date = moment(Movie.release_date).format('L');
                return res.render('moviesEdit',{
                    Movie,
                    allGenres
                })})
            .catch(error => console.log(error));
    },
    update: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            Movies.update({
                ...req.body
            },
            {
                where: {
                    id: req.params.id
                }
            })
                .then(() => res.redirect('/movies'))
                .catch(error => console.log(error));
        } else {
            let Movie = Movies.findByPk(req.params.id,{
                include: ['genre']
            })
            let allGenres = Genres.findAll({
                order: [['name']]
            })
            Promise.all(([Movie,allGenres]))
                .then(([Movie,allGenres]) => {
                    Movie.release_date = moment(Movie.release_date).format('L');
                    return res.render('moviesEdit',{
                        errors: errors.mapped(),
                        old: req.body,
                        Movie,
                        allGenres
                    })
                })
                .catch(error => console.log(error));
        }
    },
    remove: (req, res) => {
        Movies.findByPk(req.params.id)
        .then(Movie => res.render('moviesDelete',{
            Movie
        }))
        .catch(error => console.log(error));
    },
    destroy: (req, res) => {
        Movies.destroy({
            where: {
                id: req.params.id
            },
            force: true
        })
            .then(() => res.redirect('/movies'))
            .catch(error => console.log(error));
    }
}

module.exports = moviesController;