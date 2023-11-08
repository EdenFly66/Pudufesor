import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { collection, Firestore } from '@angular/fire/firestore';
import { query, getDocs, where, orderBy } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Curso } from 'src/app/interfaces/curso';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent {
  vacio: Array<any> = [''];
  formulario: any;
  rol?: string;
  cursos: Array<Curso> = [];
  asig1M: Array<string> = [];
  asig2M: Array<string> = [];
  constructor(
    private readonly fb: FormBuilder,
    private firestore: Firestore,
    private userSv: UserService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      curso: ['', []],
      asignatura: ['', []],
    });
  }

  ngOnInit() {
    this.rolUser();
    this.obtenerData();
  }

  async obtenerData() {
    const q = query(collection(this.firestore, 'Cursos'), where("habilitado","==",true),orderBy("nombre"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      const datos = e.data() as Curso;
      this.cursos.push(datos);
    });
    for (let i = 0; i < this.cursos.length; i++) {
      if (this.cursos[i].nombre == '1M') {
        this.asig1M = this.cursos[i].ramos;
      } else if (this.cursos[i].nombre == '2M') {
        this.asig2M = this.cursos[i].ramos;
      }
    }
  }

  async rolUser() {
    const id = await this.userSv.getUid();
    const q = query(collection(this.firestore, 'Usuarios'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      const datos = e.data() as Usuario;
      if (datos.UID === id) {
        this.rol = datos.rol;
      }
    });
  }

  contenidos() {
    if (
      this.formulario.value.curso == '' ||
      this.formulario.value.curso == 'Curso' ||
      this.formulario.value.asignatura == '' ||
      this.formulario.value.asignatura == 'Asignatura'
    ) {
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No especificaste tu curso ni asignatura.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      let idCurso:number = 0;
      for(let i=0;i<this.cursos.length;i++){
        if (this.cursos[i].nombre==this.formulario.value.curso){
          idCurso = this.cursos[i].idCurso
        }
      }

      this.router.navigate([
        '/contenidos' +
          '/' +
          idCurso +
          '/' +
          this.formulario.value.asignatura,
      ]);
    }
  }

  ejercitar() {
    if (
      this.formulario.value.curso == '' ||
      this.formulario.value.curso == 'Curso' ||
      this.formulario.value.asignatura == '' ||
      this.formulario.value.asignatura == 'Asignatura'
    ) {
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No especificaste tu curso ni asignatura.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      let idCurso:number = 0;
      for(let i=0;i<this.cursos.length;i++){
        if (this.cursos[i].nombre==this.formulario.value.curso){
          idCurso = this.cursos[i].idCurso
        }
      }

      this.router.navigate([
        '/ejercitar' +
          '/' +
          idCurso +
          '/' +
          this.formulario.value.asignatura,
      ]);
    }
  }

  puduebas() {
    if (
      this.formulario.value.curso == '' ||
      this.formulario.value.curso == 'Curso' ||
      this.formulario.value.asignatura == '' ||
      this.formulario.value.asignatura == 'Asignatura'
    ) {
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No especificaste tu curso ni asignatura.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      let idCurso:number = 0;
      for(let i=0;i<this.cursos.length;i++){
        if (this.cursos[i].nombre==this.formulario.value.curso){
          idCurso = this.cursos[i].idCurso
        }
      }

      this.router.navigate([
        '/puduebas' +
          '/' +
          idCurso +
          '/' +
          this.formulario.value.asignatura,
      ]);
    }
  }

  agregarCurso() {
    this.router.navigate(['/curso']);
  }

  agregarAsignatura() {
    this.router.navigate(['/asignatura']);
  }

  agregarMaterial() {
    this.router.navigate(['/material']);
  }
  
}
