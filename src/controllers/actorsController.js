const db = require('../database/models');

module.exports = {
    list: (req,res) => {
        db.Actor.findAll()
            .then(actors => {
                res.render('actorsList',{
                    actors
                })
            })
            .catch(error => console.log(error));
    },
    detail: (req,res) => {
        let promActors = db.Actor.findByPk(req.params.id,{
            include: ['movie']
        })
        let promMovies = db.Movie.findAll()
        Promise.all([promActors,promMovies])
            .then(([actor, allMovies]) => {
                res.render('actorsDetail',{
                    actor,
                    allMovies
                })
            })
            .catch(error => console.log(error));
    }
}