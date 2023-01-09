import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { collection,Firestore } from '@angular/fire/firestore';
import { query, getDocs } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Curso } from 'src/app/interfaces/curso';
import { Asignatura } from 'src/app/interfaces/asignatura';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {
  formulario:any;
  rol?:string;
  cursos:Array<string>=[]
  asignaturas:Array<string>=[]
  constructor(private readonly fb: FormBuilder, private firestore:Firestore, private userSv: UserService, private router:Router){
    this.formulario = this.fb.group({
      curso: ['',[],],
      asignatura:['',[]]
    })
  }

  ngOnInit(){
    this.rolUser()
    this.obtenerCursos()
    this.obtenerAsignaturas()
    console.log(this.cursos,this.asignaturas)
  }

  async obtenerCursos(){
    const q = query(collection(this.firestore,'Cursos'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Curso
      this.cursos.push(datos.nombre)
    })
  }

  async obtenerAsignaturas(){
    const q = query(collection(this.firestore,'Asignaturas'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Asignatura
      this.asignaturas.push(datos.nombre)
    })
  }

  async rolUser(){
    const id = await this.userSv.getUid()
    const q = query(collection(this.firestore,'Usuarios'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Usuario
      if(datos.UID===id){
        this.rol = datos.rol
      } 
    })
  }

  contenidos(){
    this.router.navigate(['/no-disponible'])
  }

  ejercitar(){
    this.router.navigate(['/no-disponible'])
  }

  puduebas(){
    this.router.navigate(['/no-disponible'])
  }

  agregarCurso(){
    this.router.navigate(['/curso'])
  }

  agregarAsignatura(){
    this.router.navigate(['/asignatura'])
  }

  agregarMaterial(){
    this.router.navigate(['/material'])
  }
  agregarPregunta(){
    this.router.navigate(['/pregunta'])
  }
}
