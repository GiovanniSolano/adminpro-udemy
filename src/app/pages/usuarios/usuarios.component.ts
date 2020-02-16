import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  desde: number = 0;

  totalRegistros: number = 0;

  cargando: boolean = true;

  constructor( public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios());
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);

  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde).subscribe( (resp: any) => {

      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;

    });
  }

  
  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    console.log(desde);
    
    
    if(desde >= this.totalRegistros) {
      return;
    }
    if(desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario(termino: string) {

    console.log(termino);

    if(termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino).subscribe((usuarios: Usuario[]) => {
      console.log(usuarios);

      this.usuarios = usuarios;
      this.cargando = false;
      
    });
  }


  borrarUsuario(usuario: Usuario) {

    if( usuario._id === this._usuarioService.usuario._id) {
      Swal.fire({
        title: 'Error',
        text: 'No te puedes borrar a ti mismo',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      return;
    }

    Swal.fire({
      title: 'Estás seguro?',
      text: 'Está a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.borrarUsuario(usuario._id).subscribe(resp => {

          this.cargarUsuarios();

        });
        Swal.fire(
          'Borrado!',
           usuario.nombre + ' ' + 'fue borrado',
          'success'
        )
      }
    })
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }

}
