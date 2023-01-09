import { Component } from '@angular/core';
import { collection,Firestore, getDocs, query } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc } from 'firebase/firestore';
import { Asignatura } from 'src/app/interfaces/asignatura';
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
  asignaturas:Array<any> = []
  constructor(private readonly fb: FormBuilder, private userSv:UserService, private firestore:Firestore){
    this.formulario = this.fb.group({
      asignatura: ['',[Validators.required]],
    })
  }

  async agregar(){
    const ref = collection(this.firestore,'Asignaturas')
    const q = query(collection(this.firestore,'Asignaturas'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Asignatura
      this.asignaturas.push(datos.nombre)
    })
    if(this.formulario.value.asignatura==""){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      let guardar = true;
      for(let i = 0; i<this.asignaturas.length ; i++){
        if(this.asignaturas[i]==this.formulario.value.curso){
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
          "nombre":this.formulario.value.asignatura,
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
