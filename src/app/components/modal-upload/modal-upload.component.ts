import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {


  imagenSubir: File;

  imagenTemporal: string;

  constructor(public _subirArchivoService: SubirArchivoService,
              public _modalUploadService: ModalUploadService
    ) {
    
   }

   cerrarModal() {
     this.imagenTemporal = null;
     this.imagenSubir = null;

     this._modalUploadService.ocultarModal();
   }

  ngOnInit() {
  }

  subirImagen() {

    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
    .then( resp => {
      

      this._modalUploadService.notificacion.emit(resp);
      this.cerrarModal();


    }).catch( err => {
      console.log('Error en la carga...');
    });
  }

  seleccionImagen( archivo: File ) {

    if (!archivo ){
      this.imagenSubir = null;
      return;
    }

    if(archivo.type.indexOf('image') < 0) {

      Swal.fire({
        title: 'sólo imágenes',
        text: 'El archivo seleccionado no es una imágen',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      this.imagenSubir = null;
      return;
    }



    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
 
      this.imagenTemporal = reader.result as string;

    }
    
  }

}
