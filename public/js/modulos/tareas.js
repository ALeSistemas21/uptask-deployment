import { check } from "express-validator";
import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';

const tareas=document.querySelector('.listado-pendientes');

if (tareas){

    tareas.addEventListener('click', e=>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono=e.target;
            const idTarea=icono.parentElement.parentElement.dataset.tarea;

            const url=`${location.origin}/tareas/${idTarea}`;
            
            //console.log(idTarea);
           
            axios.patch(url,{idTarea})
            .then (function(respuesta){
                
                if(respuesta.status===200){
                    icono.classList.toggle('completo');

                    actualizarAvance();
                }
            }
            )
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML=e.target.parentElement.parentElement,
            idTarea=tareaHTML.dataset.tarea;
            Swal.fire({
                title: 'Deseas eliminar la tarea?',
                text: "No se podrá recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar',
                cancelButtonText:'No, cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    const url=`${location.origin}/tareas/${idTarea}`;

                    axios.delete(url, {params:{idTarea}})
                    .then (function(respuesta){
                        if (respuesta.status===200){
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )

                            actualizarAvance();
                        }
                       // console.log(respuesta);
                    })
                }}
              )
        }
    }
    )


}

export default tareas;