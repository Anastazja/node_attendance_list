const userSchema = require('./../validators/userSchema');
const usersDatabaseToUserEntity = require('./../mappers/usersDatabaseToUserEntity');
const userDatabaseToUserEntity = require('./../mappers/userDatabaseToUserEntity');
const Joi = require('joi');

const getAll = (req, res) => {
    const user = require('./../models/user');
    user.findAll().then(data => {
        res.send(usersDatabaseToUserEntity(data));
    });
};

const get = (req, res) => {
    const user = require('./../models/user');
    user.findByPk(req.params.id).then(data => {
        if(data === null){
            res.status(404);
            return res.send('User not found :(');
        }
        res.send(userDatabaseToUserEntity(data));
    });
};

const create = (req, res) => {
    const user = require('./../models/user');
   const result = Joi.validate(req.body, userSchema);
   if (result.error !== null) {
       result.error.status = 400;
       throw result.error;
   }
    user.create({
            name: req.body.name,
            surname: req.body.surname,
            party: req.body.party,
            joinDate: req.body.joinDate
        }
    )
        .then((data) => {
            res.send(data)
        });
};

const edit = (req, res) => {
    const user = require('./../models/user');
    const result = Joi.validate(req.body, userSchema);
    if (result.error !== null) {
        result.error.status = 400;
        throw result.error;
    }
    user.update(
        {
            name: req.body.name,
            surname: req.body.surname,
            party: req.body.party,
            joinDate: req.body.joinDate
        },
        {where: {id: req.params.id}}
    ).then(data => {
        if(data[0] === 0){
            return res.send('Nothing changed');
        }
        user.findByPk(req.params.id).then(data => {
            res.send(userDatabaseToUserEntity(data));
        });
    });
};

const remove = (req, res) => {
    //todo id validation
    const user = require('./../models/user');
    user.destroy({where: {id: req.params.id}}).then(data => {
            if(data === 0){
                return res.send('Nothing changed');
            }
            res.send(`${data} deleted`);
        }
    );
};

module.exports = {get, getAll, create, edit, remove};