import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { orderBy, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-ejercitar',
  templateUrl: './ejercitar.component.html',
  styleUrls: ['./ejercitar.component.scss']
})
export class EjercitarComponent {

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

  pregunta(nombre:string){
    if(nombre=="Conjunto de los números racionales"){
      let tipo = Math.floor(Math.random() * 1);
      if(tipo==0){ //Exprese la fracción irreductible de cada una de las siguientes fracciones:
        let numerador = 1;
        let denominador = 1;
        let divisor:number = 0;
        while(numerador==denominador || divisor==0){
          numerador = Math.floor(Math.random() * 100)+1;
          denominador = Math.floor(Math.random() * 100)+1;
          divisor = this.mismoDiv(numerador,denominador)
        }
        let numDiv = numerador/divisor;
        let denDiv = denominador/divisor;

        console.log(numerador.toString()+'/'+denominador.toString()+'='+numDiv+'/'+denDiv)
      }
    }
  }

  mismoDiv(a:number,b:number){
    for(let i = 100; i>1; i--){
      if(a%i==0 && b%i==0){
        return i
      }
    }
    return 0
  }
}
