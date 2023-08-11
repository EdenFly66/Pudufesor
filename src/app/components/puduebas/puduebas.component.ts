import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { orderBy, query, where } from 'firebase/firestore';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Material } from 'src/app/interfaces/material';
import { Pregunta } from 'src/app/interfaces/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';

@Component({
  selector: 'app-puduebas',
  templateUrl: './puduebas.component.html',
  styleUrls: ['./puduebas.component.scss'],
})
export class PuduebasComponent {
  curso!: any;
  asignatura!: any;
  contenidosU1: any = [];
  contenidosU2: any = [];
  contenidosU3: any = [];
  contenidosU4: any = [];
  enunciado!: string;
  correcta!: string;
  alternativas: Array<string> = [];
  cantP: Array<number> = [];
  preguntasPudu: Array<Pregunta> = [];
  constructor(
    private readonly fb: FormBuilder,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private preguntaServicio: PreguntaService,
    private router: Router
  ) {}

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

  solicitud() {
    let cantidades: any = document.querySelectorAll('.quantity');
    let botonCompra: any = document.getElementById('crear');
    let cantidadesAcumuladas: Array<any> = [];

    botonCompra.addEventListener('click', () => {
      cantidades.forEach((cantidad: any) => {
        cantidadesAcumuladas.push(Number(cantidad.value));
      });
      this.cantP = cantidadesAcumuladas;
      this.mostrar();
    });
  }

  mostrar() {
    let suma: number = 0;
    for (let i = 0; i < this.cantP.length; i++) {
      suma += this.cantP[i];
    }
    if (suma > 30) {
      Swal.fire({
        title: 'Demasiadas preguntas',
        text: 'La cantidad total de preguntas no puede superar las 30.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else if (suma == 0) {
      Swal.fire({
        title: 'No has ingresado nada',
        text: 'Asegúrate de indicar cuantas preguntas quieres según tema.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      this.generarPudueba();
    }
  }

  generarPudueba() {
    let nombres: Array<Material> = this.contenidosU1
      .concat(this.contenidosU2)
      .concat(this.contenidosU3)
      .concat(this.contenidosU4);
    let contenidoPregunta: Pregunta;
    let nombre: string;
    for (let i = 0; i < this.cantP.length; i++) {
      nombre = nombres[i].nombre;
      for (let j = 0; j < this.cantP[i]; j++) {
        contenidoPregunta = this.preguntaServicio.tematica(
          nombre,
          this.curso,
          this.asignatura
        );
        this.preguntasPudu.push(contenidoPregunta);
      }
    }

    //console.log(this.preguntasPudu);
    this.router.navigate(['/prueba']);
  }
}
