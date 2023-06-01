import { Injectable } from '@angular/core';
import { Pregunta } from '../interfaces/pregunta';

@Injectable({
  providedIn: 'root',
})
export class PreguntaService {
  constructor() {}

  pregunta(nombre: string) {
    if (nombre == 'Conjunto de los números racionales') {
      let tipo = Math.floor(Math.random() * 2);
      if (tipo == 0) {
        //Exprese la fracción irreductible de cada una de las siguientes fracciones:
        let numero = this.generarFraccionReductible(100);
        let numerador = numero[0];
        let denominador = numero[1];
        let numDiv = numero[2];
        let denDiv = numero[3];
        let respuestasIncorrectas: Array<string> = [];

        respuestasIncorrectas.push(denDiv.toString() + '/' + numDiv.toString());
        respuestasIncorrectas.push(
          (numDiv * Math.floor(Math.random() * 3) + 1).toString() +
            '/' +
            (denDiv * Math.floor(Math.random() * 3) + 1).toString()
        );
        respuestasIncorrectas.push(
          (denDiv * Math.floor(Math.random() * 3) + 1).toString() +
            '/' +
            (numDiv * Math.floor(Math.random() * 3) + 1).toString()
        );
        respuestasIncorrectas.push(
          (Math.floor(Math.random() * 15) + 1).toString() +
            '/' +
            (Math.floor(Math.random() * 15) + 1).toString()
        );

        let contenidoPregunta: Pregunta = Object.assign({
          enunciado:
            'Simplifique la siguiente fracción: ' +
            numerador.toString() +
            '/' +
            denominador.toString(),
          respuestaCorrecta: numDiv.toString() + '/' + denDiv.toString(),
          respuestasIncorrectas: respuestasIncorrectas,
        });

        return contenidoPregunta;
      } else if (tipo == 1) {
        // fraccion a decimal
        let numero = this.generarFraccionIrreductible(100);
        let numerador = numero[0];
        let denominador = numero[1];
        let respuestasIncorrectas: Array<string> = [];
        let respuestaCorrecta = (numerador / denominador).toFixed(3).toString();

        respuestasIncorrectas.push(
          (denominador / numerador).toFixed(3).toString()
        );
        respuestasIncorrectas.push(
          ((numerador + 1) / denominador).toFixed(3).toString()
        );
        respuestasIncorrectas.push(
          (numerador / (denominador + 1)).toFixed(3).toString()
        );
        respuestasIncorrectas.push(
          ((numerador + 1) / (denominador + 1)).toFixed(3).toString()
        );
        let contenidoPregunta: Pregunta = Object.assign({
          enunciado:
            'Obtenga la forma decimal del número racional (Exprese a lo más 3 decimales)' +
            numerador.toString() +
            '/' +
            denominador.toString(),
          respuestaCorrecta: respuestaCorrecta,
          respuestasIncorrectas: respuestasIncorrectas,
        });
        return contenidoPregunta;
      }
    } else if (nombre == 'Adición y sustracción de números racionales') {
      let cantSumandos = Math.floor(Math.random() * 2) + 2; //dos o tres sumandos
      let sumaResta: Array<number> = []; //guarda las operaciones, si son sumas o restas
      let numeros: Array<number> = [];
      let operacion;

      for (let i = 0; i < cantSumandos - 1; i++) {
        operacion = Math.floor(Math.random() * 2 + 1);
        sumaResta.push(operacion);
      }

      for (let i = 0; i < cantSumandos; i++) {
        let n = this.generarFraccionReductible(25);
        numeros.push(n[0]);
        numeros.push(n[1]);
      }

      let texto: string = '';
      let cont = 0;
      for (let i = 0; i < numeros.length; i += 2) {
        texto += '(' + numeros[i] + '/' + numeros[i + 1] + ')';
        if (sumaResta[cont] == 1) {
          texto += '-';
        } else if (sumaResta[cont] == 2) {
          texto += '+';
        }
        cont++;
      }
      let denominadorF = 1;
      for (let i = 1; i < numeros.length; i += 2) {
        denominadorF = numeros[i] * denominadorF;
      }

      cont = -1;
      let numeradoresF = 0,
        numeradorError1 = 0,
        numeradorError2 = 0;
      for (let i = 0; i < numeros.length; i += 2) {
        if (cont < 0) {
          numeradoresF += numeros[i] * (denominadorF / numeros[i + 1]);
          numeradorError1 += numeradoresF;
          numeradorError2 += numeradoresF;
        } else {
          numeradoresF +=
            numeros[i] *
            (denominadorF / numeros[i + 1]) *
            (-1) ** sumaResta[cont];
          numeradorError1 +=
            numeros[i] *
            (denominadorF / numeros[i + 1]) *
            ((-1) ** sumaResta[cont] + 1);
          numeradorError2 +=
            numeros[i] * numeros[i + 1] * ((-1) ** sumaResta[cont] + 1);
        }

        cont++;
      }
      let simplificado = this.simplificar(numeradoresF, denominadorF);
      let simplificadoError1 = this.simplificar(numeradorError1, denominadorF);
      let simplificadoError2 = this.generarFraccionIrreductible(25);

      while (1) {
        if (
          simplificadoError2[0] != simplificado[0] &&
          simplificadoError2[0] != numeradoresF &&
          simplificadoError2[0] != simplificadoError1[0] &&
          simplificadoError2[1] != denominadorF &&
          simplificadoError2[1] != simplificado[1] &&
          simplificadoError2[1] != simplificadoError1[1]
        ) {
          break;
        } else {
          simplificadoError2 = this.generarFraccionIrreductible(25);
        }
      }
      let respuestasIncorrectas: Array<string> = [];

      respuestasIncorrectas.push(
        simplificado[0].toString() + '/' + denominadorF
      );
      respuestasIncorrectas.push(
        numeradoresF.toString() + '/' + simplificado[1]
      );
      respuestasIncorrectas.push(
        simplificadoError1[0].toString() + '/' + simplificadoError1[1]
      );
      respuestasIncorrectas.push(
        simplificadoError2[0].toString() + '/' + simplificadoError2[1]
      );
      let respuestaCorrecta =
        simplificado[0].toString() + '/' + simplificado[1].toString();
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: 'Resuelva el siguiente ejercicio: ' + texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
      });
      console.log(contenidoPregunta);
      return contenidoPregunta;
    } else if (nombre == 'Multiplicación y división de números racionales') {
      let cantFactores = Math.floor(Math.random() * 2) + 2; //dos o tres sumandos
      let multDiv: Array<number> = []; //guarda las operaciones, si son sumas o restas
      let numeros: Array<number> = [];
      let operacion;

      for (let i = 0; i < cantFactores - 1; i++) {
        operacion = Math.floor(Math.random() * 2 + 1);
        multDiv.push(operacion);
      }

      for (let i = 0; i < cantFactores; i++) {
        let n = this.generarFraccionReductible(30);
        numeros.push(n[0]);
        numeros.push(n[1]);
      }

      let texto: string = '';
      let cont = 0;
      for (let i = 0; i < numeros.length; i += 2) {
        texto += '(' + numeros[i] + '/' + numeros[i + 1] + ')';
        if (multDiv[cont] == 1) {
          texto += 'x';
        } else if (multDiv[cont] == 2) {
          texto += '÷';
        }
        cont++;
      }
      console.log(texto);
      let numeradorCorrecto = numeros[0];
      let denominadorCorrecto = numeros[1];
      let numeradorIncorrecto1 = numeros[0];
      let denominadorIncorrecto1 = numeros[1];

      cont = 0;
      for (let i = 2; i < numeros.length; i += 2) {
        if (multDiv[cont] == 1) {
          numeradorCorrecto *= numeros[i];
          denominadorCorrecto *= numeros[i + 1];
        } else {
          numeradorCorrecto *= numeros[i + 1];
          denominadorCorrecto *= numeros[i];
        }
      }
      let simplificado = this.simplificar(
        numeradorCorrecto,
        denominadorCorrecto
      );

      let error1 = this.generarFraccionIrreductible(25);
      while (1) {
        if (error1[0] != simplificado[0] && error1[1] != simplificado[1]) {
          break;
        } else {
          error1 = this.generarFraccionIrreductible(25);
        }
      }

      let error2 = this.generarFraccionIrreductible(25);
      while (1) {
        if (
          error2[0] != simplificado[0] &&
          error2[1] != simplificado[1] &&
          error1[0] != error2[0] &&
          error1[1] != error2[1]
        ) {
          break;
        } else {
          error2 = this.generarFraccionIrreductible(25);
        }
      }

      let error3 = this.generarFraccionIrreductible(25);
      while (1) {
        if (
          error3[0] != simplificado[0] &&
          error3[1] != simplificado[1] &&
          error1[0] != error3[0] &&
          error1[1] != error3[1] &&
          error3[0] != error2[0] &&
          error3[1] != error2[1]
        ) {
          break;
        } else {
          error3 = this.generarFraccionIrreductible(25);
        }
      }

      let error4 = this.generarFraccionIrreductible(25);
      while (1) {
        if (
          error4[0] != simplificado[0] &&
          error4[1] != simplificado[1] &&
          error1[0] != error4[0] &&
          error1[1] != error4[1] &&
          error4[0] != error2[0] &&
          error4[1] != error2[1] &&
          error4[0] != error3[0] &&
          error4[1] != error3[1]
        ) {
          break;
        } else {
          error4 = this.generarFraccionIrreductible(25);
        }
      }

      let respuestaCorrecta =
        simplificado[0].toString() + '/' + simplificado[1].toString();

      let respuestasIncorrectas: Array<string> = [];

      respuestasIncorrectas.push(
        error1[0].toString() + '/' + error1[1].toString()
      );
      respuestasIncorrectas.push(
        error2[0].toString() + '/' + error2[1].toString()
      );
      respuestasIncorrectas.push(
        error3[0].toString() + '/' + error3[1].toString()
      );
      respuestasIncorrectas.push(
        error4[0].toString() + '/' + error4[1].toString()
      );

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: 'Resuelva el siguiente ejercicio: ' + texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
      });
      console.log(contenidoPregunta);
      return contenidoPregunta;
    } else if (nombre == 'Operaciones combinadas') {
      let cantidadTerminos = Math.floor(Math.random() * 2) + 3;
      let operandos = [];
      let texto;
      let fracciones = [];
      let num;
      let respuestaCorrecta;
      let respuestasIncorrectas = [];
      for (let i = 0; i < cantidadTerminos; i++) {
        num = this.generarFraccionIrreductible(25);
        fracciones.push(num[0]);
        fracciones.push(num[1]);
      }
      if (cantidadTerminos == 3) {
        operandos[0] = Math.floor(Math.random() * 2)+1;
        if (operandos[0] == 2) {
          operandos[0] = '-';
        } else {
          operandos[0] = '+';
        }
        texto =
          fracciones[0].toString() +
          '/' +
          fracciones[1].toString() +
          operandos[0] +
          fracciones[2].toString() +
          '/' +
          fracciones[3] +
          'x' +
          fracciones[4].toString() +
          '/' +
          fracciones[5];
      } else if (cantidadTerminos == 4) {
        operandos[0] = Math.floor(Math.random() * 2);
        operandos[1] = Math.floor(Math.random() * 2);
        if (operandos[0] == 2) {
          operandos[0] = '-';
        } else {
          operandos[0] = '+';
        }
        if (operandos[1] == 2) {
          operandos[1] = '-';
        } else {
          operandos[1] = '-';
        }
        texto =
          '(' +
          fracciones[0].toString() +
          '/' +
          fracciones[1].toString() +
          operandos[0] +
          fracciones[2].toString() +
          '/' +
          fracciones[3].toString() +
          ')' +
          'x' +
          '(' +
          fracciones[4].toString() +
          '/' +
          fracciones[5].toString() +
          operandos[1] +
          fracciones[6].toString() +
          '/' +
          fracciones[7].toString() +
          ')';
      }
      console.log(texto);
    }
    return 0 as unknown as Pregunta;
  }

  simplificar(numerador: number, denominador: number) {
    let divisor: number = 0;
    while (numerador == denominador || divisor == 0) {
      divisor = this.mismoDiv(numerador, denominador);
    }
    let numDiv = numerador / divisor;
    let denDiv = denominador / divisor;

    return [numDiv, denDiv];
  }

  generarFraccionIrreductible(magnitud: number) {
    let numerador = 1;
    let denominador = 1;
    let divisor: number = 0;
    while (numerador == denominador || divisor == 0) {
      numerador = Math.floor(Math.random() * magnitud) + 1;
      denominador = Math.floor(Math.random() * magnitud) + 1;
      divisor = this.mismoDiv(numerador, denominador);
    }
    let numDiv =
      (numerador * (-1) ** (Math.floor(Math.random() * 2) + 1)) / divisor;
    let denDiv = denominador / divisor;

    return [numDiv, denDiv];
  }

  generarFraccionReductible(magnitud: number) {
    let numerador = 1;
    let denominador = 1;
    let divisor: number = 0;
    while (numerador == denominador || divisor == 0) {
      numerador = Math.floor(Math.random() * magnitud) + 1;
      denominador = Math.floor(Math.random() * magnitud) + 1;
      divisor = this.mismoDiv(numerador, denominador);
    }
    numerador = numerador * (-1) ** (Math.floor(Math.random() * 2) + 1);
    let numDiv = numerador / divisor;
    let denDiv = denominador / divisor;

    return [numerador, denominador, numDiv, denDiv];
  }

  mismoDiv(a: number, b: number) {
    for (let i = 100; i > 1; i--) {
      if (a % i == 0 && b % i == 0) {
        return i;
      }
    }
    return 0;
  }
}
