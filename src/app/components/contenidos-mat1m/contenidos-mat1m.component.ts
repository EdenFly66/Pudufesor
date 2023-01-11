import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { getDocs, orderBy, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-contenidos-mat1m',
  templateUrl: './contenidos-mat1m.component.html',
  styleUrls: ['./contenidos-mat1m.component.scss']
})
export class ContenidosMat1mComponent {
  contenidosU1:any=[];
  contenidosU2:any=[];
  contenidosU3:any=[];
  contenidosU4:any=[];
  constructor(private firestore:Firestore){

  }

  ngOnInit(){
    this.obtenerContenidosU1().subscribe(e=>{
      this.contenidosU1 = e;
    })
    this.obtenerContenidosU2().subscribe(e=>{
      this.contenidosU2 = e;
    })
    this.obtenerContenidosU3().subscribe(e=>{
      this.contenidosU3 = e;
    })
    this.obtenerContenidosU4().subscribe(e=>{
      this.contenidosU4 = e;
    })
  }

  obtenerContenidosU1(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U1"),where("curso","==","1M"), where("asignatura","==","Matemática"), orderBy("orden"));
    return collectionData(q)
  }

  obtenerContenidosU2(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U2"),where("curso","==","1M"), where("asignatura","==","Matemática"), orderBy("orden"));
    return collectionData(q)
  }

  obtenerContenidosU3(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U3"),where("curso","==","1M"), where("asignatura","==","Matemática"), orderBy("orden"));
    return collectionData(q)
  }

  obtenerContenidosU4(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U4"),where("curso","==","1M"), where("asignatura","==","Matemática"), orderBy("orden"));
    return collectionData(q)
  }

  redirigir(link:any){

  }
}
