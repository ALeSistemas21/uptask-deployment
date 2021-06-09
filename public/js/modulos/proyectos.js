import Swal from 'sweetalert2';
import axios from 'axios';
import { param } from 'express-validator';

const BtnEliminar=document.querySelector('#eliminar-proyecto');

if (BtnEliminar){
    BtnEliminar.addEventListener('click',e=>{
        const urlProyecto=e.target.dataset.proyectoUrl;
       // console.log(urlProyecto);

        Swal.fire({
            title: 'Deseas eliminar el proyecto?',
            text: "No se podrá recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText:'No, cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

                const url=`${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url,{params:{urlProyecto}})
                    .then(function(respuesta){
                    //console.log(respuesta)
                    //return;
                    Swal.fire(
                        'Eliminado!',
                        respuesta.data,
                        'success'
                    )
                    setTimeout(() => {
                        window.location.href="/"
                    }, 3000);
                    })
                    .catch(()=>{
                        Swal.fire({
                            icon:'error',
                            title:'Hubo un error',
                            text:'No se pudo eliminar el proyecto'
                        })
                    }                        
                    )
                                
            }
          })
    
          
    }
    
    
    )
}

export default BtnEliminar;