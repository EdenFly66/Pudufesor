import { Component } from '@angular/core';
import { collection,Firestore, getDocs, query } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { Curso } from 'src/app/interfaces/curso';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.scss']
})
export class AsignaturaComponent {
  formulario:any
  asignaturas:Array<any> = [] //quitar esto
  cursos:Array<Curso>=[]
  constructor(private readonly fb: FormBuilder, private userSv:UserService, private firestore:Firestore){
    this.formulario = this.fb.group({
      asignatura: ['',[Validators.required]],
      curso:['',[]]
    })
  }

  ngOnInit(){
    this.obtenerCursos()
  }

  async obtenerCursos(){
    const q = query(collection(this.firestore,"Cursos"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Curso
      this.cursos.push(datos)
    })
  }

  async agregar(){
    const ref = collection(this.firestore,"Cursos")
    if(this.formulario.value.asignatura=="" || this.formulario.value.curso=="" || this.formulario.value.curso=="Curso"){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      let cursoId;
      let arrCurso:Array<string>= [];
      for(let i =0 ; i<this.cursos.length ; i++){
        if(this.cursos[i].nombre==this.formulario.value.curso){
          cursoId = this.cursos[i]
          arrCurso = cursoId.ramos
          arrCurso.push(this.formulario.value.asignatura)
          break
        }
      }
      setDoc(doc(ref,this.formulario.value.curso),{
        "nombre":cursoId?.nombre,
        "ramos":arrCurso,
      })
      Swal.fire({
        title: '¡Hecho!',
        text: 'Se ha agregado el nuevo curso.',
        icon: 'success',
        allowOutsideClick: false,
      })
    }
  }
}
