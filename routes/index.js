const express = require('express');

const router= express.Router();
const proyectoController= require('../controllers/proyectoController');
const tareasController= require('../controllers/tareasController');
const usuariosController= require('../controllers/usuariosController');
const authController= require('../controllers/authController');

const {body}= require('express-validator');

module.exports= function(){
    router.get('/', 
        authController.usuarioAutenticado,
        proyectoController.proyectoHome
    );
    
    router.get('/nuevoProyecto',
        authController.usuarioAutenticado,
        proyectoController.formularioProyecto
    );

    router.post('/nuevoProyecto',
        body('nombre').not().isEmpty().trim().escape(),
        authController.usuarioAutenticado,
        proyectoController.nuevoProyecto
    );

    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectoController.proyectoPorUrl
    );

    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,  
        proyectoController.formularioEditar
    );

    router.post('/nuevoProyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.actualizarProyecto
    );

    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectoController.eliminarProyecto
    );

    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,    
        tareasController.cambiarEstadoTarea);

    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion', authController.usuarioAutenticado, authController.cerrarSesion);

    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);

return router;
}
