import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) { 

    this.cargarStorage();
  }

  logout() {
    this.usuario = null;
    this.token = '';


    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  cargarStorage() {
    if(localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  estaLogueado() {
    return (this.token.length > 5) ? true: false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;


  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token } ).pipe(map( (resp:any) => {
      this.guardarStorage(resp.id, resp.token,resp.usuario);
      return true;
    }));
  }

  login(usuario: Usuario, recordar: boolean = false) {

    if( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

   

    // saber cuando se hacen las cosas
    return this.http.post(url, usuario).pipe(map( (resp: any) => {

      // localStorage.setItem('id', resp.id);
      // localStorage.setItem('token', resp.token);
      // localStorage.setItem('usuario', JSON.stringify(resp.usuario));

      this.guardarStorage(resp.id, resp.token,resp.usuario);
      return true;
    }));

  }



  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario).pipe(map( (resp: any) => 
      {
        Swal.fire({
          title: 'Felicidades' + ' ' + usuario.nombre,
          text: 'Te registraste correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        return resp.usuario;
      }

    ));



  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;

    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map( (resp: any) => {

      let usuarioDB: Usuario = resp.usuario;
      this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
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

  cambiarImagen( archivo: File, id: string) {

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id).then((resp: any) => {

      this.usuario.imagen = resp.usuario.imagen;

      Swal.fire({
        title: 'Bien hecho' + ' ' + this.usuario.nombre,
        text: 'La imagen se ha actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });

      this.guardarStorage(id, this.token, this.usuario);

    }).catch( resp => {

      console.log(resp);
      
    });


  }


}
