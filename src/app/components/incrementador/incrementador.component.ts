import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress', { static: false }) txtProgress: ElementRef;

  @Input() porcentaje: number = 50;
  @Input('nombre') leyenda: string = 'Leyenda';

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();



  constructor() { }

  ngOnInit() {
  }

  onChange( newValue: number) {

    // let elemento: any = document.getElementsByName('porcentaje')[0];
    // console.log(elemento.value);

    if ( newValue >= 100) {
      this.porcentaje = 100;
    } else if (newValue <= 0 ) {
      this.porcentaje = 0;

    }else {
      this.porcentaje = newValue;
    }

    this.txtProgress.nativeElement.value = this.porcentaje;

    this.cambioValor.emit(this.porcentaje);

  }

  cambiarValor(valor: number) {
    if(this.porcentaje >= 100 && valor > 0) {
      this.porcentaje = 100;
      return;
    }
    if(this.porcentaje <= 0 && valor < 0) {
      this.porcentaje = 0;
      return;
    }
    this.porcentaje = this.porcentaje + valor;

    this.cambioValor.emit(this.porcentaje);

    this.txtProgress.nativeElement.focus();
  }

}
