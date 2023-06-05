import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { orderBy, query, where } from 'firebase/firestore';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { Pregunta } from 'src/app/interfaces/pregunta';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ejercitar',
  templateUrl: './ejercitar.component.html',
  styleUrls: ['./ejercitar.component.scss'],
})
export class EjercitarComponent {
  formulario!: any;
  curso!: any;
  asignatura!: any;
  contenidosU1: any = [];
  contenidosU2: any = [];
  contenidosU3: any = [];
  contenidosU4: any = [];
  show = false;
  enunciado!: string;
  correcta!: string;
  alternativas: Array<string> = [];
  constructor(
    private readonly fb: FormBuilder,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private preguntaServicio: PreguntaService
  ) {
    this.formulario = this.fb.group({
      respuesta: ['', []],
    });
  }

  ngOnInit() {
    this.curso = this.route.snapshot.paramMap.get('curso');
    this.asignatura = this.route.snapshot.paramMap.get('asignatura');
    this.obtenerContenidosU1().subscribe((e) => {
      this.contenidosU1 = e;
    });
    this.obtenerContenidosU2().subscribe((e) => {
      this.contenidosU2 = e;
    });
    this.obtenerContenidosU3().subscribe((e) => {
      this.contenidosU3 = e;
    });
    this.obtenerContenidosU4().subscribe((e) => {
      this.contenidosU4 = e;
    });

    this.asignatura = this.asignatura.toUpperCase();
  }

  obtenerContenidosU1() {
    const q = query(
      collection(this.firestore, 'Material'),
      where('unidad', '==', 'U1'),
      where('curso', '==', this.curso),
      where('asignatura', '==', this.asignatura),
      orderBy('orden')
    );
    return collectionData(q);
  }

  obtenerContenidosU2() {
    const q = query(
      collection(this.firestore, 'Material'),
      where('unidad', '==', 'U2'),
      where('curso', '==', this.curso),
      where('asignatura', '==', this.asignatura),
      orderBy('orden')
    );
    return collectionData(q);
  }

  obtenerContenidosU3() {
    const q = query(
      collection(this.firestore, 'Material'),
      where('unidad', '==', 'U3'),
      where('curso', '==', this.curso),
      where('asignatura', '==', this.asignatura),
      orderBy('orden')
    );
    return collectionData(q);
  }

  obtenerContenidosU4() {
    const q = query(
      collection(this.firestore, 'Material'),
      where('unidad', '==', 'U4'),
      where('curso', '==', this.curso),
      where('asignatura', '==', this.asignatura),
      orderBy('orden')
    );
    return collectionData(q);
  }

  pregunta(nombre: string) {
    let contenidoPregunta: Pregunta;
    if (this.curso == '1M' && this.asignatura == 'MATEMÁTICA') {
      if (nombre == 'Operatoria en los números racionales') {
        contenidoPregunta = this.preguntaServicio.operatoriaRacionales(0);
      } else if (nombre == 'Potencias') {
        contenidoPregunta = this.preguntaServicio.potencias(0);
      } else if (nombre == 'Productos notables') {
        contenidoPregunta = this.preguntaServicio.productosNotables(0);
      } else if (nombre == 'Área de la superficie y volumen del cono') {
        contenidoPregunta = this.preguntaServicio.cono(0);
      } else {
        contenidoPregunta = 0 as unknown as Pregunta;
      }
    } else {
      contenidoPregunta = 0 as unknown as Pregunta;
    }
    console.log(contenidoPregunta);
    this.alternativas.push(contenidoPregunta.respuestaCorrecta);
    for (let i = 0; i < contenidoPregunta.respuestasIncorrectas.length; i++) {
      this.alternativas.push(contenidoPregunta.respuestasIncorrectas[i]);
    }
    this.enunciado = contenidoPregunta.enunciado;
    this.correcta = contenidoPregunta.respuestaCorrecta;
    this.show = true;
    console.log(contenidoPregunta);
  }

  revision() {
    if (this.formulario.value.respuesta == this.correcta) {
      Swal.fire({
        title: '¡Respuesta correcta!',
        text: 'Felicidades, sigue así.',
        icon: 'success',
        allowOutsideClick: false,
      });
      this.cerrar();
    } else if (this.formulario.value.respuesta == '') {
      Swal.fire({
        title: 'No has respondido',
        text: 'Recuerda marcar la alternativa correcta.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      Swal.fire({
        title: 'Respuesta incorrecta',
        text: 'La respuesta era ' + this.correcta + '.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    }
  }

  cerrar() {
    this.show = false;
    this.alternativas = [];
  }
}
