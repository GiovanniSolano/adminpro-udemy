import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  totalRegistros: number = 0;

  desde: number = 0;

  cargando: boolean = true;

  constructor(public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarHospitales());

  }

  cambiarDesde(valor: number) {
    
    let desde = this.desde + valor;

    if(desde >= this.totalRegistros) {
      return;
    }
    if(desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();

  }

  borrarHospital(hospital: Hospital) {

        Swal.fire({
          title: 'Estás seguro?',
          text: 'Está a punto de borrar a ' + hospital.nombre,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, borrarlo!'
        }).then((result) => {
          if (result.value) {
            this._hospitalService.eliminarHospital(hospital._id).subscribe(resp => {
              this.cargarHospitales();
  
            });
            Swal.fire(
              'Borrado!',
               hospital.nombre + ' ' + 'fue borrado',
              'success'
            )
          }
        });
  }

  actualizarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe(resp => {
      this.cargarHospitales();
    });
  }

  buscarHospital(termino: string) {

    if(termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;

    this._hospitalService.buscarHospitales(termino)
    .subscribe((hospitales: Hospital[]) => {
      console.log(hospitales);

      this.hospitales = hospitales;
      this.cargando = false;
      
    });
  }

  mostrarModal(id: string) {    
    this._modalUploadService.mostrarModal('hospitales', id);

  }

  cargarHospitales() {
    return this._hospitalService.cargarHospitales(this.desde)
    .subscribe((hospitales: any) => {

      this.cargando = false;
      this.hospitales = hospitales;
      this.totalRegistros = this._hospitalService.totalHospitales;
    });
  }

  agregarHospital(nombre: string) {

    Swal.fire({
      title: 'Crear nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Ingresa nombre del hospital',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      showLoaderOnConfirm: true,
      preConfirm: (hospital) => {
        if (!hospital) {
          Swal.showValidationMessage(
            `Ingresa el nombre`
          )
          return;
        }
        this._hospitalService.crearHospital(hospital)
        .subscribe(resp => {
          this.cargarHospitales();
        });

      },
    });
  }

}
