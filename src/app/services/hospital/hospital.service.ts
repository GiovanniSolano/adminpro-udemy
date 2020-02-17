import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Hospital } from 'src/app/models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales : number;

  constructor(public http: HttpClient, public _usuarioService: UsuarioService) { 
  }


  cargarHospitales(desde: number = 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get(url).pipe(map( (resp: any) => {

      this.totalHospitales = resp.total;
      return resp.hospitales;
    }));

  }

  eliminarHospital(id: string) {

    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url);
  }

  actualizarHospital(hospital: Hospital) {

    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(map( (resp: any) => {
      Swal.fire({
        title: 'Bien hecho',
        text: 'La información se ha modificado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      return true;
    }));

  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get(url).pipe(map((resp:any) => resp.hospital));
  }

  buscarHospitales(termino: string) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get(url).pipe(map((resp: any) => {
      return resp.hospitales;
    }));

  }

  crearHospital(nombre: string) {

    let url = URL_SERVICIOS + '/hospital';

    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre}).pipe(map((resp: any) => {
      Swal.fire({
        title: 'Bien hecho!',
        text: 'Hospital agregado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      return resp.hospital;
    }));

  }


}
