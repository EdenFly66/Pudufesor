import { Component } from '@angular/core';
import { collection,Firestore, getDocs, query } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc } from 'firebase/firestore';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Curso } from 'src/app/interfaces/curso';
import { Material } from 'src/app/interfaces/material';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent {
  formulario:any
  materiales:Array<any> = []
  cursos:Array<string>=[]
  asignaturas:Array<string>=[]
  unidades:Array<string> = ["Unidad","U1","U2","U3","U4"]

  constructor(private readonly fb: FormBuilder, private userSv:UserService, private firestore:Firestore){
    this.formulario = this.fb.group({
      curso: ['',[Validators.required]],
      nombre:['',[Validators.required]],
      asignatura:['',[Validators.required]],
      video:['',[Validators.required]],
      imagen:['',[Validators.required]],
      documento:['',[Validators.required]],
      orden:['',[Validators.required]],
      unidad:['',[Validators.required]],
    })
  }

  ngOnInit(){
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

  async agregar(){
    const ref = collection(this.firestore,'Material')
    const q = query(collection(this.firestore,'Material'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Material
      this.materiales.push(datos.nombre)
    })
    if(this.formulario.value.curso=="Curso" || this.formulario.value.nombre=="" || this.formulario.value.asignatura=="Asignatura"
    || this.formulario.value.unidad=="Unidad"|| this.formulario.value.orden==""|| this.formulario.value.imagen==""
    || this.formulario.value.video==""|| this.formulario.value.documento==""){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      let guardar = true;
      for(let i = 0; i<this.materiales.length ; i++){
        if(this.materiales[i]==this.formulario.value.curso){
          guardar = false
        }
      }
      console.log(guardar)
      if(!guardar){
        Swal.fire({
          title: '¡Denegado!',
          text: 'Ya existe este material.',
          icon: 'warning',
          allowOutsideClick: false,
        })
      }
      else{
        const obj = Object.assign({
          "curso": this.formulario.value.curso,
          "nombre":this.formulario.value.nombre,
          "asignatura":this.formulario.value.asignatura,
          "video":this.formulario.value.video,
          "imagen":this.formulario.value.imagen,
          "documento":this.formulario.value.documento,
          "orden":this.formulario.value.orden,
          "unidad":this.formulario.value.unidad,
        })
        addDoc(ref,obj)
        Swal.fire({
          title: '¡Hecho!',
          text: 'Se ha agregado el nuevo material.',
          icon: 'success',
          allowOutsideClick: false,
        })
       }
    }
    
   
  }
  
  archivoHandler(){
    
  } 
}
