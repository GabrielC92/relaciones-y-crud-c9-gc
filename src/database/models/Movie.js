module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false
        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false
        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        release_date: {
            type: dataTypes.DATEONLY,
            allowNull: false
        },
        length: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            defaultValue: null
        },
        genre_id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            defaultValue: null
        }
    };
    let config = {
        tableName: 'movies',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        underscored: true
    }
    const Movie = sequelize.define(alias,cols,config);

    //Aquí debes realizar lo necesario para crear las relaciones con los otros modelos (Genre - Actor)
    Movie.associate = models => {
        Movie.belongsTo(models.Genre, {
            as: 'genre',
            foreignKey: 'genre_id'
        });
        Movie.hasMany(models.Actor, {
            as: 'actors',
            foreignKey: 'favorite_movie_id'
        });
        Movie.belongsToMany(models.Actor, {
            as: 'actores',
            through: 'actor_movie',
            foreignKey: 'movie_id',
            otherKey: 'actor_id'
        });
    }

    return Movie
};