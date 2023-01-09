import { Component } from '@angular/core';
import { collection,Firestore, getDocs, query } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc } from 'firebase/firestore';
import { Curso } from 'src/app/interfaces/curso';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss']
})
export class CursoComponent {

  formulario:any
  cursos:Array<any> = []
  constructor(private readonly fb: FormBuilder, private userSv:UserService, private firestore:Firestore){
    this.formulario = this.fb.group({
      curso: ['',[Validators.required]],
    })
  }

  async agregar(){
    const ref = collection(this.firestore,'Cursos')
    const q = query(collection(this.firestore,'Cursos'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Curso
      this.cursos.push(datos.nombre)
    })
    if(this.formulario.value.curso==""){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      let guardar = true;
      for(let i = 0; i<this.cursos.length ; i++){
        if(this.cursos[i]==this.formulario.value.curso){
          guardar = false
        }
      }
      console.log(guardar)
      if(!guardar){
        Swal.fire({
          title: '¡Denegado!',
          text: 'Ya existe la asignatura.',
          icon: 'warning',
          allowOutsideClick: false,
        })
      }
      else{
        const obj = Object.assign({
          "nombre":this.formulario.value.curso,
        })
        addDoc(ref,obj)
        Swal.fire({
          title: '¡Hecho!',
          text: 'Se ha agregado el nuevo curso.',
          icon: 'success',
          allowOutsideClick: false,
        })
       }
    }
    
    
  }
}
