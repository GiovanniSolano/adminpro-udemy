import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {


  medicos: Medico[] = [];

  desde: number = 0;

  totalRegistros: number = 0;

  constructor(public _medicosService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }


  cambiarDesde(valor: number) {

    console.log(valor);
    
    let desde = this.desde + valor;

    if(desde >= this.totalRegistros) {
      return;
    }
    if(desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();

  }

  cargarMedicos() {

    this._medicosService.obtenerMedicos(this.desde).subscribe(medicos => {
      this.medicos = medicos;
      this.totalRegistros = this._medicosService.totalMedicos;

    });

  }

  buscarMedico(termino: string) {

    if(termino.length <= 0) {
      this.cargarMedicos();
      return;
    }


    this._medicosService.buscarUsuarios(termino)
    .subscribe(medicos => {
      this.medicos = medicos;
    });

  }

  agregarMedico() {

  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Está a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this._medicosService.borrarMedico(medico._id).subscribe(resp => {
          this.cargarMedicos();

        });
        Swal.fire(
          'Borrado!',
           medico.nombre + ' ' + 'fue borrado',
          'success'
        )
      }
    });
  }
}
