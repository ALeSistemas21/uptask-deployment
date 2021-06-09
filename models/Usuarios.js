const Sequelize=require('sequelize');
const db = require('../config/db');
const Proyectos= require('./Proyectos');
const bcrytp=require('bcrypt-nodejs');

const Usuarios=db.define('usuario',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            isEmail:{
                msg : 'Ingresa un correo válido'
            },
            notEmpty:{
                msg : 'El e-mail no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg:'Usuario ya registrado'
        }
    },
    password:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{               
                msg : 'El password no puede ir vacio'
            }
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue:0

    },
    token:Sequelize.STRING,
    expiracion: Sequelize.DATE
},
    {
        hooks:{
        beforeCreate(usuario){
                usuario.password= bcrytp.hashSync(usuario.password,bcrytp.genSaltSync(10));
        }
        }
    }    
);

Usuarios.prototype.verificarPassword=function(password){
    return bcrytp.compareSync(password,this.password);

}
Usuarios.hasMany(Proyectos);

module.exports=Usuarios;