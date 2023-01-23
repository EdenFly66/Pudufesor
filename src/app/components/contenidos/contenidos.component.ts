import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { orderBy, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-contenidos',
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.scss']
})
export class ContenidosComponent {

  curso!:any;
  asignatura!:any;
  contenidosU1:any=[];
  contenidosU2:any=[];
  contenidosU3:any=[];
  contenidosU4:any=[];
  constructor(private route: ActivatedRoute, private firestore:Firestore) {

  }

  ngOnInit() {
    
    this.curso = this.route.snapshot.paramMap.get("curso");
    this.asignatura = this.route.snapshot.paramMap.get("asignatura");
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

    this.asignatura = this.asignatura.toUpperCase()
  }

  obtenerContenidosU1(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U1"),where("curso","==",this.curso), where("asignatura","==",this.asignatura), orderBy("orden"));
    return collectionData(q)
  }

  obtenerContenidosU2(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U2"),where("curso","==",this.curso), where("asignatura","==",this.asignatura), orderBy("orden"));
    return collectionData(q)
  }

  obtenerContenidosU3(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U3"),where("curso","==",this.curso), where("asignatura","==",this.asignatura), orderBy("orden"));
    return collectionData(q)
  }

  obtenerContenidosU4(){
    const q = query(collection(this.firestore, "Material"), where("unidad","==","U4"),where("curso","==",this.curso), where("asignatura","==",this.asignatura), orderBy("orden"));
    return collectionData(q)
  }
}
