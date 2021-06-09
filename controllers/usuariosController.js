const Usuarios = require("../models/Usuarios");
const enviarEmail=require('../handlers/email');
const { param } = require("express-validator");

exports.formCrearCuenta=(req,res)=>{
    res.render('crearCuenta',{
        nombrePagina:'Crear Cuenta en UpTask'
    })

}

exports.formIniciarSesion=(req,res)=>{  
    const{email, password}=req.body;
    const {error}=res.locals.mensajes;
    
    res.render('iniciarSesion',{
        nombrePagina:'Inicia sesión en UpTask',
        error,
        email,
        password
    })

}

exports.crearCuenta=async(req, res)=>{
   const{email, password}=req.body;

   try {
        await Usuarios.create({email, password});
        //res.redirect('/iniciar-sesion');

        /// confirmar correo
        const confirmarUrl=`http://${req.headers.host}/confirmar/${email}`;

        const usuario={
            email
        };

        await enviarEmail.enviar({
            usuario,
            subject:'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash('correcto','Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');


   } catch (error) {       
        req.flash('error',error.errors.map(error=>error.message)); 
        res.render('crearCuenta',{
            mensajes:req.flash(),
            nombrePagina:'Crear Cuenta en UpTask',
            email,
            password
        }) ;
        console.log(error.errors);
   }
   
   }

   exports.formRestablecerPassword=(req,res)=>{
       res.render('restablecer',{
           nombrePagina:'Restablecer tu contraseña'
       });
   }

   exports.confirmarCuenta=async(req,res)=>{
       const usuario=await Usuarios.findOne({
           where:{
               email:req.params.correo
           }
       });

       if(!usuario){
            req.flash('error','No valido');
            res.redirect('/crear-cuenta');
       }

       usuario.activo=1;
       await usuario.save();

       req.flash('correcto','Cuenta activada correctamente');
       res.redirect('/iniciar-sesion');

       
   }