const passport =require('passport');
const Usuarios=require('../models/Usuarios');
const crypto=require('crypto');
const Sequelize=require('sequelize');
const Op=Sequelize.Op;
const bcrytp=require('bcrypt-nodejs');
const enviarEmail=require('../handlers/email')

exports.autenticarUsuario=passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/iniciar-sesion',
    failureFlash:true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}


exports.enviarToken=async(req,res)=>{
    const {email}=req.body;
    const usuario=await Usuarios.findOne({where:{email} });

    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.render('restablecer',{
            nombrePagina:'Restablecer tu contraseña',
            mensajes:req.flash()
        });
    }

    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expiracion= Date.now()+3600000;

    usuario.save();

    const resetUrl=`http://${req.headers.host}/restablecer/${usuario.token}`;
///enviar mail
    await enviarEmail.enviar({
        usuario,
        subject:'Resetear password',
        resetUrl,
        archivo: 'restablecer-password'
    })
    
    req.flash('correcto','Se envio un mensaje a tu correo'),
    res.redirect('/iniciar-sesion');
}

exports.validarToken=async(req,res)=>{
    const usuario=await Usuarios.findOne({
        where:{
            token:req.params.token
        }
    })
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    res.render('resetPassword',{
        nombrePagina:'restablecer contraseña'
    })
}

exports.actualizarPassword=async(req, res)=>{
    const usuario=await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion:{
                [Op.gt] :  Date.now()
            }
        }
    })

    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    usuario.password= bcrytp.hashSync(req.body.password,bcrytp.genSaltSync(10));
    usuario.token=null;
    usuario.expiracion=null;

    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}