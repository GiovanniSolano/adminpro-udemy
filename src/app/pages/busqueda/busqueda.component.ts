import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(public activadedRoute: ActivatedRoute,
    public http: HttpClient) { 
    
    activadedRoute.params.subscribe( params => {

      let termino = params['termino'];


      this.buscar(termino);

    });

  }

  ngOnInit() {
  }

  buscar(termino: string) {

    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get(url).subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      
    });

  }

}
