import Swal from "sweetalert2";
import { postVersion } from "../../api/versions/versions";

/**
 * 
 * @param {JSON} user objeto con información del usuario
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 */
const manageCreateVersion = async (user, selectedProject) => {
    await Swal.fire({
      title: "Ingrese el nombre de la nueva versión",
      input: "text",
      inputPlaceholder: "Nombre",
      showCancelButton: true,
      confirmButtonText: "Crear versión",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "El nombre de la arquitectura es obligatorio";
        }
      },
    }).then(result => {
      if(result.isConfirmed){
        submitVersion(result.value, user, selectedProject);
      }
    });
};

/**
 * Subir la nueva versión a la base de datos
 * @param {String} versionName el nombre ingresado de la versión 
 * @param {JSON} user objeto con información del usuario
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 */
const submitVersion = async (versionName, user, selectedProject) => {
    const formData = getFormData(versionName, user, selectedProject);
    const response = await postVersion(formData);
    if(response !== 'Error'){
        swlSuccess();
    }
    else{
        //Respuesta fallida
    }
} 

/**
 * Popup temporal de SweetAlert con mensaje exitoso
 */
const swlSuccess = () => {
    Swal.fire({
      title: "¡Nueva versión creada!",
      icon: "success",
      showConfirmButton: false,
      timer: 4000,
    });
}

/**
 * Construir el form-data
 * @param {String} versionName arreglo que contiene todos los archivos XML
 * @param {JSON} user objeto con información del usuario
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 */
const getFormData = (versionName, user, selectedProject) => {
    const formData = new FormData();
    formData.append('uid', user.uid);
    formData.append('version_name', versionName);
    formData.append('ver_index', selectedProject.verIndex);
    formData.append('arc_index', selectedProject.arcIndex);
    formData.append('project_index', selectedProject.projectIndex);
    return formData;
}

export {
    manageCreateVersion,
}