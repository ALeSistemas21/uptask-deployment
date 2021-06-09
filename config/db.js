const  Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

const db = new Sequelize(
process.env.DB_NOMBRE, 
process.env.DB_USER,
process.env.DB_PASS,
{
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
        
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}) ;

module.exports= db;