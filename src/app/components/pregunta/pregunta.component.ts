import { Component } from '@angular/core';
import { collection,Firestore, getDocs, query } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc, where } from 'firebase/firestore';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Curso } from 'src/app/interfaces/curso';
import { Material } from 'src/app/interfaces/material';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.scss']
})
export class PreguntaComponent {
  formulario:any
  preguntas:Array<any> = []
  cursos:Array<string>=[]
  asignaturas:Array<string>=[]
  unidades:Array<string> = ["Unidad","U1","U2","U3","U4"]
  materialesObtenidos:Array<string> = []

  constructor(private readonly fb: FormBuilder, private userSv:UserService, private firestore:Firestore){
    this.formulario = this.fb.group({
      imagen:['',[Validators.required]],
      material:['',[Validators.required]],
      respuestaIncorrecta1:['',[Validators.required]],
      respuestaIncorrecta2:['',[Validators.required]],
      respuestaIncorrecta3:['',[Validators.required]],
      respuestaIncorrecta4:['',[Validators.required]],
      respuestaCorrecta:['',[Validators.required]],
    })
  }

  ngOnInit(){
    this.obtenerMateriales()
  }

  async obtenerMateriales(){
    const q = query(collection(this.firestore,'Material'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Material
      this.materialesObtenidos.push(datos.nombre)
    })
  }


  async agregar(){
    const ref = collection(this.firestore,'Preguntas')
    
    if(this.formulario.value.imagen=="" || this.formulario.value.material=="" || this.formulario.value.respuestaIncorrecta1=="" ||
    this.formulario.value.respuestaIncorrecta2=="" || this.formulario.value.respuestaIncorrecta3=="" || this.formulario.value.respuestaIncorrecta4=="" ||
    this.formulario.value.respuestaCorrecta==""){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      const obj = Object.assign({
        "material":this.formulario.value.material,
        "imagen":this.formulario.value.imagen,
        "respuestaIncorrecta1":this.formulario.value.respuestaIncorrecta1,
        "respuestaIncorrecta2":this.formulario.value.respuestaIncorrecta2,
        "respuestaIncorrecta3":this.formulario.value.respuestaIncorrecta3,
        "respuestaIncorrecta4":this.formulario.value.respuestaIncorrecta4,
        "respuestaCorrecta":this.formulario.value.respuestaCorrecta,
      })
      addDoc(ref,obj)
      Swal.fire({
        title: '¡Hecho!',
        text: 'Se ha agregado la pregunta.',
        icon: 'success',
        allowOutsideClick: false,
      })
    }
    
   
  }
}
