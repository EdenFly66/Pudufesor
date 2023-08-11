import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pregunta } from 'src/app/interfaces/pregunta';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss']
})
export class PruebaComponent {
  preguntasPudu!:any

  constructor(private route: ActivatedRoute,){

  }

  ngOnInit(){
    this.preguntasPudu = this.route.snapshot.paramMap.get('preguntasPudu')
    console.log(this.preguntasPudu)
  }
}
