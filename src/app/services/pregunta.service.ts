import { Injectable } from '@angular/core';
import { Pregunta } from '../interfaces/pregunta';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  constructor() { }

  pregunta(nombre:string){
    if(nombre=="Conjunto de los números racionales"){
      let tipo = Math.floor(Math.random() * 2);
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
        let respuestasIncorrectas:Array<string>=[]

        respuestasIncorrectas.push(denDiv.toString()+'/'+numDiv.toString())
        respuestasIncorrectas.push((numDiv*Math.floor(Math.random() * 3)+1).toString()+'/'+(denDiv*Math.floor(Math.random() * 3)+1).toString())
        respuestasIncorrectas.push((denDiv*Math.floor(Math.random() * 3)+1).toString()+'/'+(numDiv*Math.floor(Math.random() * 3)+1).toString())
        respuestasIncorrectas.push((Math.floor(Math.random() * 15)+1).toString()+'/'+(Math.floor(Math.random() * 15)+1).toString())
        
        let contenidoPregunta:Pregunta = Object.assign({
          'enunciado': 'Simplifique la siguiente fracción: '+numerador.toString()+'/'+denominador.toString(),
          'respuestaCorrecta': numDiv.toString()+'/'+denDiv.toString(),
          'respuestasIncorrectas':respuestasIncorrectas,
        })
        
        return contenidoPregunta
      }
      else if(tipo==1){
        let numerador = 1;
        let denominador = 1;
        while(numerador==denominador){
          numerador = Math.floor(Math.random() * 100)+1;
          denominador = Math.floor(Math.random() * 100)+1;
        }
        let respuestasIncorrectas:Array<string>=[]
        let respuestaCorrecta = ((numerador/denominador).toFixed(3)).toString()

        respuestasIncorrectas.push(((denominador/numerador).toFixed(3)).toString())
        respuestasIncorrectas.push((((numerador+1)/denominador).toFixed(3)).toString())
        respuestasIncorrectas.push(((numerador/(denominador+1)).toFixed(3)).toString())
        respuestasIncorrectas.push((((numerador+1)/(denominador+1)).toFixed(3)).toString())
        let contenidoPregunta:Pregunta = Object.assign({
          'enunciado': 'Obtenga la forma decimal del número racional (Exprese a lo más 3 decimales)'+numerador.toString()+'/'+denominador.toString(),
          'respuestaCorrecta': respuestaCorrecta,
          'respuestasIncorrectas':respuestasIncorrectas,
        })
        return contenidoPregunta
      }
      
    }
    return 0 as unknown as Pregunta
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
