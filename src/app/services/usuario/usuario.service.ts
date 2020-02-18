import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) { 

    this.cargarStorage();
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';

    url += '?token=' + this.token;

    return this.http.get(url).pipe(map( (resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', this.token);

      console.log('Token renovado');
      

      return true;
    }),
    catchError(err => {


      this.router.navigate(['/login']);

      Swal.fire({
        title: 'Lo sentimos, no se pudo renovar token',
        text: 'No fue posible renovar token',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });

      return throwError(err.message);

    }));
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];


    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  cargarStorage() {
    if(localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));

    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  estaLogueado() {
    return (this.token.length > 5) ? true: false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {


    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;



  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token } ).pipe(map( (resp:any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);      
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

      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }),
    catchError(err => {

      console.log(err.status);

      Swal.fire({
        title: 'Lo sentimos',
        text: err.error.mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });

      return throwError(err.message);

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
      }),
      catchError(err => {

        console.log(err.status);
  
        Swal.fire({
          title: err.error.mensaje,
          text: err.error.errors.message,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
  
        return throwError(err.message);
      }));



  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;

    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map( (resp: any) => {


      if(usuario._id === this.usuario._id) {

      let usuarioDB: Usuario = resp.usuario;
      this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
      }

      Swal.fire({
        title: 'Bien hecho',
        text: 'La información se ha modificado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      return true;
    }), catchError(err => {

      console.log(err.status);

      Swal.fire({
        title: err.error.mensaje,
        text: err.error.errors.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });

      return throwError(err.message);
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

      this.guardarStorage(id, this.token, this.usuario, this.menu);

    }).catch( resp => {

      console.log(resp);
      
    });


  }

  cargarUsuarios(desde: number = 0 ) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;


    return this.http.get(url);


  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url).pipe(map( (resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {

    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url);

  }


}
