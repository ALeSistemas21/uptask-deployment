const passport=require('passport');
const localStrategy=require('passport-local').Strategy;

const Usuarios=require('../models/Usuarios');

passport.use(
    new localStrategy(
        {
            usernameField:'email',
            passwordField:'password'
        },
        async (email, password, done)=>{
            try {
                const usuario=await Usuarios.findOne({
                    where:{
                        email,
                        activo:1
                }
                })
                if(!usuario.verificarPassword(password)){
                    //usuario existe, password incorrecto
                    return done(null,false,{
                        message:'Password incorrecto'
                    })
                    

                }
                //email existe, password correcto                
                return done(null, usuario);
            } catch (error) {
                //usuario no existe
                return done(null, false, {
                    message:'esa cuenta no existe'
                })
            }
        }
    )
);

passport.serializeUser((usuario,callback)=>{
    callback(null, usuario);

});

passport.deserializeUser((usuario,callback)=>{
    callback(null, usuario);

});

module.exports =passport;