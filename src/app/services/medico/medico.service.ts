import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0; 

  constructor(public http: HttpClient,
              public _usuarioService: UsuarioService) { }


  obtenerMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get(url).pipe(map((resp: any) => {

      this.totalMedicos = resp.total;      
      return resp.medicos;
    }));
  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url).pipe(map( (resp: any) => resp.medicos));
  }


  borrarMedico(id: string) {

    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url);

  }

  cargarMedico(id: string) {

    let url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url).pipe(map((resp: any) => resp.medico));
    
  }

  guardarMedico(medico: Medico) {

    let url = URL_SERVICIOS + '/medico';


    if(medico._id) {

      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;


      return this.http.put(url, medico).pipe(map( (resp: any) => {

        Swal.fire({
          title: 'Bien hecho',
          text: 'La información se ha actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        return resp.medico;

      }));

    } else {
      // creando

      url += '?token=' + this._usuarioService.token;

      return this.http.post(url, medico).pipe(map((resp: any) => {
  
        Swal.fire({
          title: 'Bien hecho',
          text: 'La información se ha registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        return resp.medico;
      }));
    }


  }

 }
