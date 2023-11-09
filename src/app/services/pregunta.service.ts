import { Injectable } from '@angular/core';
import { Pregunta } from '../interfaces/pregunta';

@Injectable({
  providedIn: 'root',
})
export class PreguntaService {
  constructor() {}

  generarFraccionIrreductible(magnitud: number) {
    let numerador = 1;
    let denominador = 1;
    let divisor: number = 0;
    while (numerador == denominador || divisor == 0) {
      numerador = Math.floor(Math.random() * magnitud) + 1;
      denominador = Math.floor(Math.random() * magnitud) + 1;
      divisor = this.mismoDiv(numerador, denominador);
    }
    let numDiv = numerador / divisor;
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
  generarNaturales(tamanno: number) {
    let numero = Math.floor(Math.random() * tamanno);
    return numero;
  }

  generarNegativo(tamanno: number) {
    let numero = Math.floor(Math.random() * tamanno) + 1;
    return -numero;
  }

  generarEntero(tamanno: number) {
    let numero = Math.floor(Math.random() * tamanno);
    let signo = Math.floor(Math.random() * 2);

    if (signo == 0) {
      return numero;
    } else {
      return -numero;
    }
  }

  maximoComunDivisor(a: number, b: number) {
    let temporal; //Para no perder b
    while (b != 0) {
      temporal = b;
      b = a % b;
      a = temporal;
    }
    return a;
  }

  simplificar(a: number, b: number) {
    const mcd = this.maximoComunDivisor(a, b);
    return [a / mcd, b / mcd];
  }

  operatoriaRacionales(tipo: number): Pregunta {
    if (tipo == 0) {
      //indica que no hay preferencia de pregunta tipo, se generará una pregunta con un tipo aleatorio
      tipo = this.generarNaturales(4) + 1; //4 preguntas tipo, del 1 al 4
    }
    if (tipo == 1) {
      //Convertir de número decimal (2 decimales) a fracción
      let unidades = this.generarNaturales(9);
      let decimas = this.generarNaturales(9);
      let centesimas = this.generarNaturales(9);

      while (decimas == 0 && centesimas == 0) {
        unidades = this.generarNaturales(3);
        decimas = this.generarNaturales(9);
        centesimas = this.generarNaturales(9);
      }
      //enunciado
      let texto =
        'Convierta a fracción el siguiente número: ' +
        unidades.toString() +
        ',' +
        decimas.toString() +
        centesimas.toString();

      //cálculo de la respuesta correcta
      let numero = unidades * 100 + decimas * 10 + centesimas * 1;
      let simplificado = this.simplificar(numero, 100);

      let respuestaCorrecta =
        simplificado[0].toString() + '/' + simplificado[1].toString();

      //cálculo de errores
      let respuestasIncorrectas: Array<string> = [];

      //error 1
      let error1 = this.simplificar(numero, 1000);
      respuestasIncorrectas.push(
        error1[0].toString() + '/' + error1[1].toString()
      );

      //error 2
      let error2 = this.simplificar(numero, 10);
      respuestasIncorrectas.push(
        error2[0].toString() + '/' + error2[1].toString()
      );

      //corroborar que tanto respuesta correcta, como errores 1 y 2 sean simplificables
      if (
        numero == simplificado[0] ||
        simplificado[1] == 100 ||
        error1[1] == simplificado[1] * 10 ||
        error1[1] == simplificado[1] / 10 ||
        (simplificado[1] == 25 && error1[1] == 125 && error2[1] == 5)
      ) {
        return this.operatoriaRacionales(1);
      }
      //error 3 y 4
      let error3 = this.generarFraccionIrreductible(25);
      let error4 = this.generarFraccionIrreductible(25);

      while (
        error3 == error1 ||
        error3 == error2 ||
        error3 == error4 ||
        error4 == error1 ||
        error4 == error2
      ) {
        error3 = this.generarFraccionIrreductible(25);
        error4 = this.generarFraccionIrreductible(25);
      }

      respuestasIncorrectas.push(
        error3[0].toString() + '/' + error3[1].toString()
      );
      respuestasIncorrectas.push(
        error4[0].toString() + '/' + error4[1].toString()
      );
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      //suma y resta de fracciones  formato: (a/b)+(c/d)-(e/f)
      let f1 = this.generarFraccionIrreductible(10);
      let f2 = this.generarFraccionIrreductible(10);
      let f3 = this.generarFraccionIrreductible(10);
      if (f1[1] == f2[1] || f1[1] == f3[1] || f2[1] == f3[1]) {
        //evita fracciones con el mismo denominador
        return this.operatoriaRacionales(2);
      }
      //crear enunciado
      let texto =
        'Resuelva el siguiente ejercicio: ' +
        '(' +
        f1[0] +
        '/' +
        f1[1] +
        ')' +
        ' + ' +
        '(' +
        f2[0] +
        '/' +
        f2[1] +
        ')' +
        ' - ' +
        '(' +
        f3[0] +
        '/' +
        f3[1] +
        ')';

      //respuesta correcta
      let simplificado = this.simplificar(
        f1[0] * f2[1] * f3[1] + f2[0] * f1[1] * f3[1] - f3[0] * f1[1] * f2[1],
        f1[1] * f2[1] * f3[1]
      );
      let respuestaCorrecta =
        simplificado[0].toString() + '/' + simplificado[1].toString();

      //cálculo de errores
      let respuestasIncorrectas: Array<string> = [];

      //error1
      let mayorDiv;
      if (f1[1] > f2[1] && f1[1] > f3[1]) {
        mayorDiv = f1[1];
      } else if (f2[1] > f1[1] && f2[1] > f3[1]) {
        mayorDiv = f2[1];
      } else {
        mayorDiv = f3[1];
      }
      let error1 = this.simplificar(
        f1[0] * f2[1] * f3[1] + f2[0] * f1[1] * f3[1] + f3[0] * f1[1] * f2[1],
        mayorDiv
      );
      respuestasIncorrectas.push(
        error1[0].toString() + '/' + error1[1].toString()
      );

      //error2
      let error2 = this.simplificar(
        f1[0] * f2[1] * f3[1] + f2[0] * f1[1] * f3[1] + f3[0] * f1[1] * f2[1],
        f1[1] * f2[1] * f3[1]
      );
      respuestasIncorrectas.push(
        error2[0].toString() + '/' + error2[1].toString()
      );

      if (simplificado[1] == error2[1]) {
        this.operatoriaRacionales(2);
      }
      //error 3 y 4
      //error 3 y 4
      let error3 = this.generarFraccionIrreductible(10);
      let error4 = this.generarFraccionIrreductible(10);

      while (
        error3 == error1 ||
        error3 == error2 ||
        error3 == error4 ||
        error4 == error1 ||
        error4 == error2
      ) {
        error3 = this.generarFraccionIrreductible(10);
        error4 = this.generarFraccionIrreductible(10);
      }

      respuestasIncorrectas.push(
        error3[0].toString() + '/' + error3[1].toString()
      );
      respuestasIncorrectas.push(
        error4[0].toString() + '/' + error4[1].toString()
      );
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      //division y multiplicacion formato: (a/b)/(c/d) - (e/f)*(g/h)
      let f1 = this.generarFraccionIrreductible(10);
      let f2 = this.generarFraccionIrreductible(10);
      let f3 = this.generarFraccionIrreductible(10);
      let f4 = this.generarFraccionIrreductible(10);
      if (
        f1[1] == f2[1] ||
        f1[1] == f3[1] ||
        f2[1] == f3[1] ||
        f1[1] == f4[1] ||
        f2[1] == f4[1] ||
        f3[1] == f4[1]
      ) {
        //evita fracciones con el mismo denominador
        return this.operatoriaRacionales(3);
      }

      //crear enunciado
      let texto =
        'Resuelva la siguiente operación: ' +
        '(' +
        f1[0] +
        '/' +
        f1[1] +
        ')' +
        ' ÷ ' +
        '(' +
        f2[0] +
        '/' +
        f2[1] +
        ')' +
        ' - ' +
        '(' +
        f3[0] +
        '/' +
        f3[1] +
        ')' +
        ' · ' +
        '(' +
        f4[0] +
        '/' +
        f4[1] +
        ')';

      //respuesta correcta
      let paso1 = f1[0] * f2[1];
      let paso2 = f1[1] * f2[0];
      let paso3 = f3[0] * f4[0];
      let paso4 = f3[1] * f4[1];
      let simplificado = this.simplificar(
        paso1 * paso4 - paso3 * paso2,
        paso2 * paso4
      );
      if (simplificado[1] < 0) {
        simplificado[0] = simplificado[0] * -1;
        simplificado[1] = simplificado[1] * -1;
      }
      let respuestaCorrecta =
        simplificado[0].toString() + '/' + simplificado[1].toString();

      //cálculo de errores
      let respuestasIncorrectas: Array<string> = [];

      //error1  error de signos
      let error1 = this.simplificar(
        paso1 * paso4 + paso3 * paso2,
        paso2 * paso4
      );
      if (error1[1] < 0) {
        error1[0] = error1[0] * -1;
        error1[1] = error1[1] * -1;
      }
      respuestasIncorrectas.push(
        error1[0].toString() + '/' + error1[1].toString()
      );

      if (simplificado[1] == error1[1]) {
        return this.operatoriaRacionales(3);
      }

      //error2  no aplica papomudas
      let e2p1 = this.simplificar(paso1, paso2);
      let e2p2 = this.simplificar(
        e2p1[0] * f3[1] - f3[0] * e2p1[1],
        e2p1[1] * f3[1]
      );
      let error2 = this.simplificar(e2p2[0] * f4[0], e2p2[1] * f4[1]);
      if (error2[1] < 0) {
        error2[0] = error2[0] * -1;
        error2[1] = error2[1] * -1;
      }
      respuestasIncorrectas.push(
        error2[0].toString() + '/' + error2[1].toString()
      );

      //error3 papomudas + error de signo
      let e3p1 = this.simplificar(paso1, paso2);
      let e3p2 = this.simplificar(
        e3p1[0] * f3[1] + f3[0] * e3p1[1],
        e3p1[1] * f3[1]
      );
      let error3 = this.simplificar(e3p2[0] * f4[0], e3p2[1] * f4[1]);
      if (error3[1] < 0) {
        error3[0] = error3[0] * -1;
        error3[1] = error3[1] * -1;
      }
      respuestasIncorrectas.push(
        error3[0].toString() + '/' + error3[1].toString()
      );

      //error4 papomudas + error de signo
      let e4p1 = f1[0] * f2[0];
      let e4p2 = f1[1] * f2[1];
      let error4 = this.simplificar(e4p1 * paso4 - paso3 * e4p2, e4p2 * paso4);
      if (error4[1] < 0) {
        error4[0] = error4[0] * -1;
        error4[1] = error4[1] * -1;
      }
      respuestasIncorrectas.push(
        error4[0].toString() + '/' + error4[1].toString()
      );
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let dinero = 1;
      while (dinero % 1000 != 0) {
        dinero = Math.floor(Math.random() * 100000) + 1;
      }
      let f1 = this.generarFraccionIrreductible(15);
      let f2 = this.generarFraccionIrreductible(15);

      if ((f1[0] * f2[1] + f2[0] * f1[1]) / (f1[1] * f2[1]) > 1) {
        return this.operatoriaRacionales(4);
      }

      let texto =
        'Se dispone de $' +
        dinero +
        ' para compras. En la mañana gastas (' +
        f1[0] +
        '/' +
        f1[1] +
        ') y en la tarde (' +
        f2[0] +
        '/' +
        f2[1] +
        ') de lo que quedaba. ¿Cuánto dinero le queda?';

      //correcta
      let resultado =
        dinero -
        (dinero * f1[0]) / f1[1] -
        (dinero - (dinero * f1[0]) / f1[1]) * (f2[0] / f2[1]);
      let respuestaCorrecta = '$' + resultado.toString();

      //cálculo de errores
      let respuestasIncorrectas: Array<string> = [];

      //error 1 suma las fracciones del enunciado
      let e1p1 = this.simplificar(f1[0] * f2[1] + f2[0] * f1[1], f1[1] * f2[1]);
      let error1 = (dinero * e1p1[0]) / e1p1[1];
      respuestasIncorrectas.push('$' + error1.toString());

      //error 2 calcula cuanto gasta en la tarde
      let error2 = (dinero - (dinero * f1[0]) / f1[1]) * (f2[0] / f2[1]);
      respuestasIncorrectas.push('$' + error2.toString());

      //error 3 calcula el gasto total
      let error3 = dinero - error2;
      respuestasIncorrectas.push('$' + error3.toString());

      //error 4 cuantó gasta en la mañana
      let error4 = (dinero * f1[0]) / f2[1];
      respuestasIncorrectas.push('$' + error4.toString());

      if (
        resultado != Math.trunc(resultado) ||
        error1 != Math.trunc(error1) ||
        error2 != Math.trunc(error2) ||
        error3 != Math.trunc(error3) ||
        error4 != Math.trunc(error4) ||
        resultado == error1 ||
        resultado == error2 ||
        resultado == error3 ||
        resultado == error4 ||
        error1 == error2 ||
        error1 == error3 ||
        error1 == error4 ||
        error2 == error3 ||
        error2 == error4 ||
        error3 == error4
      ) {
        return this.operatoriaRacionales(4);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else {
      return 0 as unknown as Pregunta;
    }
  }

  potencias(tipo: number): Pregunta {
    if (tipo == 0) {
      //indica que no hay preferencia de pregunta tipo, se generará una pregunta con un tipo aleatorio
      tipo = this.generarNaturales(4) + 1; //4 preguntas tipo, del 1 al 4
    }
    if (tipo == 1) {
      let base = this.generarNaturales(3);
      if (base <= 1) {
        return this.potencias(1);
      }
      let exp1 = this.generarNaturales(9);
      let exp2 = this.generarNaturales(9);
      let exp3 = this.generarNaturales(9);
      if (
        exp1 == 1 ||
        exp2 == 1 ||
        exp3 == 1 ||
        exp1 + exp2 - exp3 < -5 ||
        exp1 + exp2 + exp3 < -5 ||
        exp1 - exp2 - exp3 < -5 ||
        exp1 - exp2 + exp3 < -5 ||
        -exp1 + exp2 - exp3 < -5
      ) {
        return this.potencias(1);
      }
      let texto =
        'Resuelva el siguiente ejercicio: (' +
        base.toString() +
        '^' +
        exp1.toString() +
        ') · (' +
        base.toString() +
        '^' +
        exp2.toString() +
        ') ÷ (' +
        base.toString() +
        '^' +
        exp3.toString() +
        ')';

      //calculo respuesta correcta
      let resultado: any = base ** (exp1 + exp2 - exp3);
      let respuestaCorrecta = resultado.toString();
      //cálculo de errores
      let respuestasIncorrectas: Array<string> = [];
      let error1: any = base ** (exp1 + exp2 + exp3);
      let error2: any = base ** (exp1 - exp2 - exp3);
      let error3: any = base ** (exp1 - exp2 + exp3);
      let error4: any = base ** (-exp1 + exp2 - exp3);

      if (
        resultado == error1 ||
        resultado == error2 ||
        resultado == error3 ||
        resultado == error4 ||
        error1 == error2 ||
        error1 == error3 ||
        error1 == error4 ||
        error2 == error3 ||
        error2 == error4 ||
        error3 == error4
      ) {
        return this.potencias(1);
      }

      if (resultado != Math.trunc(resultado)) {
        resultado = resultado.toFixed(2);
      }
      if (error1 != Math.trunc(error1)) {
        error1 = error1.toFixed(2);
      }
      if (error2 != Math.trunc(error2)) {
        error2 = error2.toFixed(2);
      }
      if (error3 != Math.trunc(error3)) {
        error3 = error3.toFixed(2);
      }
      if (error4 != Math.trunc(error4)) {
        error4 = error4.toFixed(2);
      }
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let base = this.generarNaturales(3);
      if (base <= 1) {
        return this.potencias(2);
      }
      let exp1 = this.generarEntero(9);
      let exp2 = this.generarEntero(9);
      let exp3 = this.generarEntero(9);

      let texto =
        'Resuelva le siguiente ejercicio: ((' +
        base.toString() +
        '^' +
        exp1.toString() +
        ') ^ ' +
        exp2.toString() +
        ') ^' +
        exp3.toString();

      let expCorrecto = exp1 * exp2 * exp3;
      let expE1 = exp1 + exp2 + exp3;
      let expE2 = base * exp1 * exp2 * exp3;
      let expE3 = (exp1 + exp2) * exp3;
      let expE4 = exp1 * exp2 + exp3;

      if (
        expCorrecto == expE1 ||
        expCorrecto == expE2 ||
        expCorrecto == expE3 ||
        expCorrecto == expE4 ||
        expE1 == expE2 ||
        expE1 == expE3 ||
        expE1 == expE4 ||
        expE2 == expE3 ||
        expE2 == expE4 ||
        expE3 == expE4
      ) {
        return this.potencias(2);
      }
      let respuestaCorrecta = base.toString() + '^' + expCorrecto.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(base.toString() + '^' + expE1.toString());
      respuestasIncorrectas.push(base.toString() + '^' + expE2.toString());
      respuestasIncorrectas.push(base.toString() + '^' + expE3.toString());
      respuestasIncorrectas.push(base.toString() + '^' + expE4.toString());

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let base = this.generarNaturales(5);
      if (base <= 1) {
        return this.potencias(3);
      }
      let exp1 = this.generarNegativo(5);
      let exp2 = this.generarNegativo(5);

      let texto =
        'Resuelva el siguiente ejercicio: (' +
        base.toString() +
        '^' +
        exp1.toString() +
        ') · (' +
        base.toString() +
        '^' +
        exp2.toString() +
        ')';

      let expCorrecto = exp1 + exp2;
      let expE1 = exp1 - exp2;
      let expE2 = -exp1 - exp2;
      let expE3 = -exp1 + exp2;
      let expE4 = this.generarEntero(10);

      if (
        expCorrecto == expE1 ||
        expCorrecto == expE2 ||
        expCorrecto == expE3 ||
        expCorrecto == expE4 ||
        expE1 == expE2 ||
        expE1 == expE3 ||
        expE1 == expE4 ||
        expE2 == expE3 ||
        expE2 == expE4 ||
        expE3 == expE4
      ) {
        return this.potencias(3);
      }

      let respuestaCorrecta = base.toString() + '^' + expCorrecto.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(base.toString() + '^' + expE1.toString());
      respuestasIncorrectas.push(base.toString() + '^' + expE2.toString());
      respuestasIncorrectas.push(base.toString() + '^' + expE3.toString());
      respuestasIncorrectas.push(base.toString() + '^' + expE4.toString());

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let base = this.generarNaturales(3);
      if (base <= 1) {
        return this.potencias(4);
      }
      let exp1 = this.generarEntero(5);
      let exp2 = this.generarEntero(5);
      let exp3 = this.generarEntero(5);
      let exp4 = this.generarEntero(5);
      let exp5 = this.generarEntero(5);

      let texto =
        '((' +
        base.toString() +
        '^' +
        exp1.toString() +
        ') ÷ (' +
        base.toString() +
        '^' +
        exp2.toString() +
        '))^' +
        exp3.toString() +
        ' · (' +
        base.toString() +
        '^' +
        exp4.toString() +
        ')^' +
        exp5.toString();

      let expCorrecto = (exp1 - exp2) * exp3 + exp4 * exp5;
      let expE1 = (exp1 + exp2) * exp3 + exp4 * exp5;
      let expE2 = exp1 + exp2 + exp3 + (exp4 + exp5);
      let expE3 = (exp1 - exp2) * exp3 + exp4 + exp5;
      let expE4 = exp1 - exp2 + exp3 + exp4 * exp5;

      if (
        expCorrecto > 5 ||
        expCorrecto == expE1 ||
        expCorrecto == expE2 ||
        expCorrecto == expE3 ||
        expCorrecto == expE4 ||
        expE1 == expE2 ||
        expE1 == expE3 ||
        expE1 == expE4 ||
        expE2 == expE3 ||
        expE2 == expE4 ||
        expE3 == expE4
      ) {
        return this.potencias(4);
      }

      let resultado: any = base ** expCorrecto;
      let error1: any = base ** expE1;
      let error2: any = base ** expE2;
      let error3: any = base ** expE3;
      let error4: any = base ** expE4;

      if (resultado != Math.trunc(resultado)) {
        resultado = resultado.toFixed(2);
      }
      if (error1 != Math.trunc(error1)) {
        error1 = error1.toFixed(2);
      }
      if (error2 != Math.trunc(error2)) {
        error2 = error2.toFixed(2);
      }
      if (error3 != Math.trunc(error3)) {
        error3 = error3.toFixed(2);
      }
      if (error4 != Math.trunc(error4)) {
        error4 = error4.toFixed(2);
      }
      let respuestaCorrecta = resultado.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else {
      return 0 as unknown as Pregunta;
    }
  }

  productosNotables(tipo: number): Pregunta {
    if (tipo == 0) {
      //indica que no hay preferencia de pregunta tipo, se generará una pregunta con un tipo aleatorio
      tipo = this.generarNaturales(4) + 1; //4 preguntas tipo, del 1 al 4
    }
    if (tipo == 1) {
      //cuadrado de binomio,suma
      let a = this.generarNaturales(9) + 1;
      let b = this.generarNaturales(9) + 1;

      if (b == 1) {
        return this.productosNotables(1);
      }

      let a2 = a ** 2;
      let ab = a * b;
      let dos_ab = a * b * 2;
      let b2 = b ** 2;
      let texto;
      let respuestaCorrecta;
      let respuestasIncorrectas: Array<string> = [];
      if (a == 1) {
        texto =
          'Resuelva el siguiente ejercicio: ( x + ' + b.toString() + ' )²';
        respuestaCorrecta =
          'x² + ' + dos_ab.toString() + 'x + ' + b2.toString();
        respuestasIncorrectas.push(
          'x² - ' + dos_ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(
          'x² + ' + ab.toString() + 'x + ' + b2.toString()
        );
        respuestasIncorrectas.push(
          'x² + ' + ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(a2.toString() + 'x² + ' + b2.toString());
      } else {
        texto =
          'Resuelva el siguiente ejercicio: ( ' +
          a.toString() +
          'x + ' +
          b.toString() +
          ' )²';
        respuestaCorrecta =
          a2.toString() + 'x² + ' + dos_ab.toString() + 'x + ' + b2.toString();
        respuestasIncorrectas.push(
          a2.toString() + 'x² + ' + dos_ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(
          a2.toString() + 'x² + ' + ab.toString() + 'x + ' + b2.toString()
        );
        respuestasIncorrectas.push(
          a2.toString() + 'x² + ' + ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(a2.toString() + 'x² + ' + b2.toString());
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      //cuadrado de binomio, resta
      let a = this.generarNaturales(9) + 1;
      let b = this.generarNaturales(9) + 1;

      if (b == 1) {
        return this.productosNotables(2);
      }

      let a2 = a ** 2;
      let ab = a * b;
      let dos_ab = a * b * 2;
      let b2 = b ** 2;
      let texto;
      let respuestaCorrecta;
      let respuestasIncorrectas: Array<string> = [];
      if (a == 1) {
        texto =
          'Resuelva el siguiente ejercicio: ( x - ' + b.toString() + ' )²';
        respuestaCorrecta =
          'x² - ' + dos_ab.toString() + 'x + ' + b2.toString();
        respuestasIncorrectas.push(
          'x² - ' + dos_ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(
          'x² + ' + ab.toString() + 'x + ' + b2.toString()
        );
        respuestasIncorrectas.push(
          'x² + ' + ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(a2.toString() + 'x² - ' + b2.toString());
      } else {
        texto =
          'Resuelva el siguiente ejercicio: ( ' +
          a.toString() +
          'x - ' +
          b.toString() +
          ' )²';
        respuestaCorrecta =
          a2.toString() + 'x² - ' + dos_ab.toString() + 'x + ' + b2.toString();
        respuestasIncorrectas.push(
          a2.toString() + 'x² - ' + dos_ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(
          a2.toString() + 'x² + ' + ab.toString() + 'x + ' + b2.toString()
        );
        respuestasIncorrectas.push(
          a2.toString() + 'x² + ' + ab.toString() + 'x + ' + b.toString()
        );
        respuestasIncorrectas.push(a2.toString() + 'x² - ' + b2.toString());
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      //suma por su diferencia
      let a = this.generarNaturales(9) + 1;
      let b = this.generarNaturales(9) + 1;
      let a2 = a ** 2;
      let b2 = b ** 2;
      let texto;
      let respuestaCorrecta;
      let respuestasIncorrectas: Array<string> = [];

      if (b == 1) {
        this.productosNotables(3);
      }

      if (a == 1) {
        texto =
          'Resuelva el siguiente ejercicio: ( x +' +
          b.toString() +
          ' ) ( x -' +
          b.toString() +
          ' )';
        respuestaCorrecta = 'x² -' + b2.toString();
        respuestasIncorrectas.push('x² +' + b2.toString());
        respuestasIncorrectas.push('x -' + b2.toString());
        respuestasIncorrectas.push('x² +' + b.toString());
        respuestasIncorrectas.push('x -' + b.toString());
      } else {
        texto =
          'Resuelva el siguiente ejercicio: ( ' +
          a.toString() +
          'x +' +
          b.toString() +
          ' ) ( ' +
          a.toString() +
          'x -' +
          b.toString() +
          ' )';
        respuestaCorrecta = a2.toString() + 'x² -' + b2.toString();
        respuestasIncorrectas.push(a2.toString() + 'x² +' + b2.toString());
        respuestasIncorrectas.push(a.toString() + 'x -' + b2.toString());
        respuestasIncorrectas.push(a2.toString() + 'x² +' + b.toString());
        respuestasIncorrectas.push(a2.toString() + 'x -' + b.toString());
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      //binomio con termino comun
      let a = this.generarNaturales(9) + 1;
      let b = this.generarNaturales(9) + 1;
      let c = this.generarNaturales(9) + 1;

      if (b * c == b + c) {
        return this.productosNotables(4);
      }

      let texto;
      let respuestaCorrecta;
      let respuestasIncorrectas: Array<string> = [];

      if (a == 1) {
        texto =
          'Resuelva el siguiente ejercicio: ( ' +
          'x + ' +
          b.toString() +
          ' )' +
          '( ' +
          'x - ' +
          c.toString() +
          ' )';
        respuestaCorrecta =
          'x² + ' + (b - c).toString() + 'x + ' + (b * -c).toString();
        respuestasIncorrectas.push(
          'x² + ' + (b + c).toString() + 'x + ' + (b * c).toString()
        );
        respuestasIncorrectas.push(
          (b * c).toString() +
            'x² + ' +
            (2 * a).toString() +
            'x+ ' +
            (c + b).toString()
        );
        respuestasIncorrectas.push('x² + ' + (b + c).toString());
        respuestasIncorrectas.push('x² + ' + (b * -c).toString());
      } else {
        texto =
          'Resuelva el siguiente ejercicio: ( ' +
          a.toString() +
          'x + ' +
          b.toString() +
          ' )' +
          '( ' +
          a.toString() +
          'x - ' +
          c.toString() +
          ' )';
        respuestaCorrecta =
          (a ** 2).toString() +
          'x² + ' +
          (b - c).toString() +
          'x + ' +
          (b * -c).toString();
        respuestasIncorrectas.push(
          (a ** 2).toString() +
            'x² + ' +
            (b + c).toString() +
            'x + ' +
            (b * c).toString()
        );
        respuestasIncorrectas.push(
          (b * c).toString() +
            'x² + ' +
            (2 * a).toString() +
            'x+ ' +
            (c + b).toString()
        );
        respuestasIncorrectas.push(
          (a ** 2).toString() + 'x² + ' + (b + c).toString()
        );
        respuestasIncorrectas.push(
          (a ** 2).toString() + 'x² + ' + (b * -c).toString()
        );
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else {
      return 0 as unknown as Pregunta;
    }
  }

  cono(tipo: number): Pregunta {
    if (tipo == 0) {
      //indica que no hay preferencia de pregunta tipo, se generará una pregunta con un tipo aleatorio
      tipo = this.generarNaturales(4) + 1; //4 preguntas tipo, del 1 al 4
    }

    if (tipo == 1) {
      let r = this.generarNaturales(30) + 1;
      let h = this.generarNaturales(30) + 1;
      let g = (r ** 2 + h ** 2) ** (1 / 2);
      if (g != Math.trunc(g)) {
        return this.cono(1);
      }
      let texto =
        'Calcula el área total de un cono cuya generatriz es de ' +
        g.toString() +
        'cms y el radio de su base es de ' +
        r.toString() +
        'cm.';
      let respuestaCorrecta =
        (3.14 * g * r + 3.14 * r ** 2).toFixed(2).toString() + 'cm²';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((3.14 * g * r).toFixed(2).toString() + 'cm²');
      respuestasIncorrectas.push((3.14 * r ** 2).toFixed(2).toString() + 'cm²');
      respuestasIncorrectas.push(
        (3.14 * g * r * 3.14 * r ** 2).toFixed(2).toString() + 'cm²'
      );
      respuestasIncorrectas.push(
        (3.14 * g * r + 3.14 * r).toFixed(2).toString() + 'cm²'
      );

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let r = this.generarNaturales(30) + 1;
      let h = this.generarNaturales(30) + 1;
      let g = (r ** 2 + h ** 2) ** (1 / 2);
      if (g != Math.trunc(g)) {
        return this.cono(2);
      }
      let texto =
        'Calcula el área total de un cono cuya altura es de ' +
        h.toString() +
        'cms y el radio de su base es de ' +
        r.toString() +
        'cm.';
      let respuestaCorrecta =
        (3.14 * (h ** 2 + r ** 2) ** (1 / 2) * r + 3.14 * r ** 2)
          .toFixed(2)
          .toString() + 'cm²';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        (3.14 * (h + r) ** (1 / 2) * r + 3.14 * r ** 2).toFixed(2).toString() +
          'cm²'
      );
      respuestasIncorrectas.push(
        (3.14 * h * r + 3.14 * r ** 2).toFixed(2).toString() + 'cm²'
      );
      respuestasIncorrectas.push(
        (3.14 * (h ** 2 + r ** 2) ** (1 / 2) * r).toFixed(2).toString() + 'cm²'
      );
      respuestasIncorrectas.push((3.14 * r ** 2).toFixed(2).toString() + 'cm²');

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let r = this.generarNaturales(30) + 1;
      let h = this.generarNaturales(30) + 1;
      let g = (r ** 2 + h ** 2) ** (1 / 2);
      if (g != Math.trunc(g)) {
        return this.cono(3);
      }
      let texto =
        'Calcula el volumen de un cono cuya generatriz es de ' +
        g.toString() +
        'cms y el radio de su base es de ' +
        r.toString() +
        'cm.';
      let respuestaCorrecta =
        (3.14 * r ** 2 * (g ** 2 - r ** 2) ** (1 / 2) * (1 / 3))
          .toFixed(2)
          .toString() + 'cm³';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        (3.14 * r ** 2 * (g ** 2 + r ** 2) ** (1 / 2) * (1 / 3))
          .toFixed(2)
          .toString() + 'cm³'
      );
      respuestasIncorrectas.push(
        (3.14 * r ** 2 * (g ** 2 - r ** 2) ** (1 / 2)).toFixed(2).toString() +
          'cm³'
      );
      respuestasIncorrectas.push(
        (3.14 * r ** 2 * (g ** 2 + r ** 2) ** (1 / 2)).toFixed(2).toString() +
          'cm³'
      );
      respuestasIncorrectas.push(
        ((3.14 * r ** 2 + (g ** 2 - r ** 2) ** (1 / 2)) * (1 / 3))
          .toFixed(2)
          .toString() + 'cm³'
      );

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let r = this.generarNaturales(30) + 1;
      let h = this.generarNaturales(30) + 1;
      let g = (r ** 2 + h ** 2) ** (1 / 2);
      if (g != Math.trunc(g)) {
        return this.cono(4);
      }
      let texto =
        'Calcula el volumen de un cono cuya altura es de ' +
        h.toString() +
        'cms y el radio de su base es de ' +
        r.toString() +
        'cm.';
      let respuestaCorrecta =
        (3.14 * r ** 2 * h * (1 / 3)).toFixed(2).toString() + 'cm³';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        (3.14 * r ** 2 * h).toFixed(2).toString() + 'cm³'
      );
      respuestasIncorrectas.push(
        (3.14 * r * h * (1 / 3)).toFixed(2).toString() + 'cm³'
      );
      respuestasIncorrectas.push((3.14 * r * h).toFixed(2).toString() + 'cm³');
      respuestasIncorrectas.push(
        (3.14 * h ** 2 * r * (1 / 3)).toFixed(2).toString() + 'cm³'
      );

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  sistemaEcuacionesLineales(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let a = this.generarNaturales(50) + 1;
      let b = this.generarNaturales(50) + 1;
      let c = this.generarNaturales(50) + 1;
      let d = this.generarNaturales(50) + 1;
      let e = this.generarNaturales(50) + 1;
      let f = this.generarNaturales(50) + 1;
      let y = this.generarNaturales(50) + 1;
      let x = (-y * (b + e) + c - f) / (a - d);

      while (
        a * x + b * y != c ||
        d * x - e * y != f ||
        b == e ||
        x == 1 ||
        y == 1
      ) {
        a = this.generarNaturales(50) + 1;
        b = this.generarNaturales(50) + 1;
        c = this.generarNaturales(50) + 1;
        d = this.generarNaturales(50) + 1;
        e = this.generarNaturales(50) + 1;
        f = this.generarNaturales(50) + 1;
        y = this.generarNaturales(50) + 1;
        x = (-y * (b + e) + c - f) / (a - d);
      }

      let texto =
        'Resuelva el sistema de ecuaciones: ' +
        a.toString() +
        'x + ' +
        b.toString() +
        'y = ' +
        c.toString() +
        ' ; ' +
        d.toString() +
        'x - ' +
        e.toString() +
        'y = ' +
        f.toString();

      let xCorrecta = x,
        yCorrecta = y;
      let xIncorrecta1 = (-y * (b - e) + c - f) / (a - d),
        yIncorrecta1 = (-xIncorrecta1 * (a + d) + c - f) / (b + e);
      let xIncorrecta2 = (-y * (b + e) + c - f) / (a + d),
        yIncorrecta2 = (-xIncorrecta2 * (a - d) + c - f) / (b - e);
      let xIncorrecta3 = (-y * (b - e) + c - f) / (a + d),
        yIncorrecta3 = (xIncorrecta3 * (a + d) + c + f) / (b - e);
      let xIncorrecta4 = (-y * (b + e) + c + f) / (a - d),
        yIncorrecta4 = (-xIncorrecta4 * (a + d) + c + f) / (b + e);

      let respuestaCorrecta =
        'x = ' + xCorrecta.toFixed(2) + ' , y = ' + yCorrecta.toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        'x = ' + xIncorrecta1.toFixed(2) + ' , y = ' + yIncorrecta1.toFixed(2)
      );
      respuestasIncorrectas.push(
        'x = ' + xIncorrecta2.toFixed(2) + ' , y = ' + yIncorrecta2.toFixed(2)
      );
      respuestasIncorrectas.push(
        'x = ' + xIncorrecta3.toFixed(2) + ' , y = ' + yIncorrecta3.toFixed(2)
      );
      respuestasIncorrectas.push(
        'x = ' + xIncorrecta4.toFixed(2) + ' , y = ' + yIncorrecta4.toFixed(2)
      );

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let total = this.generarNaturales(100);
      while (total % 2 != 0) {
        total = this.generarNaturales(100);
      }
      let dif = this.generarNaturales(100);
      while (total % 2 != 0) {
        dif = this.generarNaturales(100);
      }

      let texto =
        'El doble de la suma de dos números es ' +
        total.toString() +
        ' y su diferencia es ' +
        dif.toString() +
        '¿Qué números son?';
      let y = (total - dif) / 2;
      let x = y + dif;
      let respuestaCorrecta = 'x = ' + x.toString() + ' , y = ' + y.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        'x = ' + (y - dif).toString() + ' , y = ' + y.toString()
      );
      respuestasIncorrectas.push(
        'x = ' +
          (total / 2 - dif + dif).toString() +
          ' , y = ' +
          (total / 2 - dif).toString()
      );
      respuestasIncorrectas.push(
        'x = ' +
          (total / 2 - dif - dif).toString() +
          ' , y = ' +
          (total / 2 - dif).toString()
      );
      respuestasIncorrectas.push(
        'x = ' +
          ((total - dif) / 2 + dif).toString() +
          ' , y = ' +
          ((total / 2 - dif) / 2).toString()
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sistemaEcuacionesLineales(2);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let suma = this.generarNaturales(100);
      while (suma % 5 == 0) {
        suma = this.generarNaturales(100);
      }
      let y = suma / 5;
      let x = 4 * y;
      let texto =
        'La suma de dos números es ' +
        suma.toString() +
        ' y la mitad del primero es el doble del segundo. ¿Qué números son?';
      let respuestaCorrecta = 'x = ' + x.toString() + ' , y = ' + y.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        'x = ' + (2 * y).toString() + ' , y = ' + y.toString()
      );
      respuestasIncorrectas.push(
        'x = ' + ((suma / 4) * 4).toString() + ' , y = ' + (suma / 4).toString()
      );
      respuestasIncorrectas.push(
        'x = ' + ((suma / 4) * 2).toString() + ' , y = ' + (suma / 4).toString()
      );
      respuestasIncorrectas.push(
        'x = ' + y.toString() + ' , y = ' + x.toString()
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sistemaEcuacionesLineales(3);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let perimetro = this.generarNaturales(200) + 1;

      while (perimetro % 12 != 0) {
        perimetro = this.generarNaturales(200) + 1;
      }

      let ladoMenor = perimetro / 4;
      let ladoMayor = ladoMenor * 3;

      let texto =
        'En un rectángulo de perímetro ' +
        perimetro.toString() +
        ', se sabe que su lado mayor mide el triple que el lado menor. Calcular el área del rectángulo.';
      let respuestaCorrecta = (ladoMenor * ladoMayor).toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((ladoMenor * ladoMenor).toString());
      respuestasIncorrectas.push((ladoMayor * ladoMayor).toString());
      respuestasIncorrectas.push(((ladoMenor + ladoMayor) ** 2).toString());
      respuestasIncorrectas.push(
        ((perimetro / 3) * ((perimetro / 3) * 2)).toString()
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sistemaEcuacionesLineales(4);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  funcionesLineales(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let m = this.generarEntero(15);
      let a = this.generarEntero(9);
      let b = this.generarEntero(9);

      if (m == 0) {
        return this.funcionesLineales(1);
      }

      let texto =
        'Obtener la función de la recta, cuya pendiente mide ' +
        m.toString() +
        ' unidades y pasa por el punto (' +
        a.toString() +
        ',' +
        b.toString() +
        ')';
      let respuestaCorrecta =
        'y = ' + m.toString() + 'x + ' + (b - m * a).toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        'y = ' + (-m).toString() + 'x + ' + (b - m * a).toString()
      );
      respuestasIncorrectas.push(
        'y = ' + m.toString() + 'x + ' + (-(b - m * a)).toString()
      );
      respuestasIncorrectas.push(
        'y = ' + (-m).toString() + 'x + ' + (b + m * a).toString()
      );
      respuestasIncorrectas.push(
        'y = ' + m.toString() + 'x + ' + (b + m * a).toString()
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.funcionesLineales(1);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let a = this.generarEntero(9);
      let b = this.generarEntero(9);
      let c = this.generarEntero(9);
      let d = this.generarEntero(9);

      if (
        a - c == 0 ||
        a + c == 0 ||
        (b - d) / (a - c) == 0 ||
        b - ((b + d) / (a - c)) * a == 0
      ) {
        return this.funcionesLineales(2);
      }

      let texto =
        'Obtener la función de la recta que pasa por los puntos (' +
        a.toString() +
        ',' +
        b.toString() +
        ') y (' +
        c.toString() +
        ',' +
        d.toString() +
        ')';
      let respuestaCorrecta =
        'y = ' +
        ((b - d) / (a - c)).toFixed(2) +
        'x + ' +
        (b - ((b - d) / (a - c)) * a).toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        'y = ' +
          ((b + d) / (a - c)).toFixed(2) +
          'x + ' +
          (b - ((b + d) / (a - c)) * a).toFixed(2)
      );
      respuestasIncorrectas.push(
        'y = ' +
          ((b - d) / (a + c)).toFixed(2) +
          'x + ' +
          (b - ((b - d) / (a + c)) * a).toFixed(2)
      );
      respuestasIncorrectas.push(
        'y = ' +
          ((b + d) / (a + c)).toFixed(2) +
          'x + ' +
          (b - ((b + d) / (a + c)) * a).toFixed(2)
      );
      respuestasIncorrectas.push(
        'y = ' +
          ((b - d) / (a - c)).toFixed(2) +
          'x + ' +
          (b + ((b + d) / (a - c)) * a).toFixed(2)
      );
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.funcionesLineales(2);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let a = this.generarEntero(9);
      let b = this.generarEntero(9);
      let c = this.generarEntero(9);
      let m = this.generarEntero(9);

      if (m == 0) {
        return this.funcionesLineales(3);
      }

      let texto =
        'Obtener la función que pasa por el punto (' +
        a.toString() +
        ',' +
        b.toString() +
        ') y es paralela a la función y = ' +
        m.toString() +
        'x + ' +
        c.toString();
      let respuestaCorrecta =
        'y = ' + m.toString() + 'x + ' + (b - m * a).toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        'y = ' + (-m).toString() + 'x + ' + (b - m * a).toString()
      );
      respuestasIncorrectas.push(
        'y = ' + m.toString() + 'x + ' + (-(b - m * a)).toString()
      );
      respuestasIncorrectas.push(
        'y = ' + (-m).toString() + 'x + ' + (b + m * a).toString()
      );
      respuestasIncorrectas.push(
        'y = ' + m.toString() + 'x + ' + (b + m * a).toString()
      );
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.funcionesLineales(3);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let a = this.generarNaturales(1000) + 1;
      let b = this.generarNaturales(100) + 1;
      let c = this.generarNaturales(100) + 1;

      let texto =
        'Por el alquiler de un vehículo se cobran $' +
        a.toString() +
        ' diarios, y adicionalmente se cobran $' +
        b.toString() +
        ' por kilómetro. Si en un día se recorren ' +
        c.toString() +
        'km. ¿Cuánto hay que pagar?';
      let respuestaCorrecta = '$' + (b * c + a).toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push('$' + (b * a + c).toString());
      respuestasIncorrectas.push('$' + (c * a + b).toString());
      respuestasIncorrectas.push('$' + (b * c + b).toString());
      respuestasIncorrectas.push('$' + (c * a + a).toString());
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.funcionesLineales(4);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  sectoresCirculares(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let r = this.generarNaturales(15) + 1;
      let a = this.generarNaturales(359) + 1;

      let texto =
        'En un círculo de ' +
        r.toString() +
        'cm de radio se traza un ángulo central de ' +
        a.toString() +
        '°. Calcular el área del segmento circular comprendido entra la cuerda que une a los extremos de los dos radios y su arco correspondiente.';
      let respuestaCorrecta =
        (
          (3.14 * r ** 2 * a) / 360 -
          r * (r ** 2 - (r / 2) ** 2) ** (1 / 2) * (1 / 2)
        ).toFixed(2) + 'cm²';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        (
          (3.14 * r * a) / 360 -
          r * (r ** 2 - (r / 2) ** 2) ** (1 / 2) * (1 / 2)
        ).toFixed(2) + 'cm²'
      );
      respuestasIncorrectas.push(
        (
          (3.14 * r ** 2 * a) / 360 -
          r * (r - r / 2) ** (1 / 2) * (1 / 2)
        ).toFixed(2) + 'cm²'
      );
      respuestasIncorrectas.push(
        ((3.14 * r ** 2 * a) / 360).toFixed(2) + 'cm²'
      );
      respuestasIncorrectas.push(
        (r * (r ** 2 - (r / 2) ** 2) ** (1 / 2) * (1 / 2)).toFixed(2) + 'cm²'
      );
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sectoresCirculares(1);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let r = this.generarNaturales(15) + 1;
      let a = this.generarNaturales(359) + 1;

      let texto =
        'Se tiene un círculo de radio ' +
        r.toString() +
        'cm. Calcular el valor del sector circular con un ángulo de ' +
        a.toString() +
        '°.';
      let respuestaCorrecta = ((3.14 * r ** 2 * a) / 360).toFixed(2) + 'cm²';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(((3.14 * r * a) / 360).toFixed(2) + 'cm²');
      respuestasIncorrectas.push(((r ** 2 * a) / 360).toFixed(2) + 'cm²');
      respuestasIncorrectas.push(((3.14 * r ** 2) / 360).toFixed(2) + 'cm²');
      respuestasIncorrectas.push(((3.14 * a) / 360).toFixed(2) + 'cm²');
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sectoresCirculares(2);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let angulo = this.generarNaturales(359) + 1;
      let area = this.generarNaturales(90) + 10;

      let texto =
        'El área de un sector circular de ángulo ' +
        angulo.toString() +
        '° es ' +
        area.toString() +
        'π cm². Calcular el radio.';
      let respuestaCorrecta =
        (((area * 360) / angulo) ** (1 / 2)).toFixed(2) + 'cm';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(((area * 360) / angulo).toFixed(2) + 'cm');
      respuestasIncorrectas.push(((angulo * 360) / area).toFixed(2) + 'cm');
      respuestasIncorrectas.push(
        (((angulo * 360) / area) ** (1 / 2)).toFixed(2) + 'cm'
      );
      respuestasIncorrectas.push((area / angulo).toFixed(2) + 'cm');
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sectoresCirculares(3);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let angulo = this.generarNaturales(359) + 1;
      let area = this.generarNaturales(90) + 10;

      let texto =
        'El área de un sector circular de ángulo ' +
        angulo.toString() +
        '° es ' +
        area.toString() +
        'π cm². Calcular la longitud de la circunferencia.';
      let respuestaCorrecta =
        (2 * 3.14 * ((area * 360) / angulo) ** (1 / 2)).toFixed(2) + 'cm';
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        ((2 * 3.14 * area * 360) / angulo / 360).toFixed(2) + 'cm'
      );
      respuestasIncorrectas.push(
        ((2 * 3.14 * angulo * 360) / area).toFixed(2) + 'cm'
      );
      respuestasIncorrectas.push(
        ((2 * 3.14 * ((angulo * 360) / area) ** (1 / 2)) / 360).toFixed(2) +
          'cm'
      );
      respuestasIncorrectas.push(
        (2 * 3.14 * (area / angulo)).toFixed(2) + 'cm'
      );
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.sectoresCirculares(4);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  homoteciaTales(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let razon = this.generarNaturales(5) + 1;
      let OA = this.generarNaturales(20) + 1;
      let texto =
        "Si un punto A' es homotético al punto A con razón " +
        razon.toString() +
        " y el centro de homotecia O, ¿cuál es la longitud del segmento OA' cuando OA = " +
        OA.toString() +
        'cm?';

      let respuestaCorrecta = "OA' = " + (razon * OA).toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push("OA' = " + (razon / OA).toFixed(2));
      respuestasIncorrectas.push("OA' = " + (OA / razon).toFixed(2));
      respuestasIncorrectas.push("OA' = " + (razon - OA).toFixed(2));
      respuestasIncorrectas.push("OA' = " + (razon + OA).toFixed(2));
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.homoteciaTales(1);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let a = this.generarNaturales(15) + 1;
      let b = this.generarNaturales(15) + 1;
      let c = (a ** 2 + b ** 2) ** (1 / 2);
      if (c != Math.trunc(c)) {
        return this.homoteciaTales(2);
      }
      let razon = this.generarNaturales(5) + 1;
      let texto =
        'A un triángulo rectángulo de catetos ' +
        a.toString() +
        'cm y ' +
        b.toString() +
        ' cm se le aplica una homotecia de razón ' +
        razon.toString() +
        '. ¿Cuál es el perímetro del nuevo triángulo?';

      let respuestaCorrecta = ((a + b + c) * razon).toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((a + b + c).toString());
      respuestasIncorrectas.push(
        ((a ** 2 + b ** 2 + a + b) * razon).toString()
      );
      respuestasIncorrectas.push((a ** 2 + b ** 2 + a + b).toString());
      respuestasIncorrectas.push((a + b + c + razon).toString());
      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.homoteciaTales(2);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let sombraTotal = this.generarNaturales(20) + 10;
      while (sombraTotal % 2 != 0) {
        sombraTotal = this.generarNaturales(20) + 10;
      }
      let altura1 = this.generarNaturales(15) + 1;
      while (altura1 % 2 != 0) {
        altura1 = this.generarNaturales(20) + 10;
      }
      let altura2 = this.generarNaturales(15) + 1;
      while (altura2 % 2 != 0) {
        altura2 = this.generarNaturales(20) + 10;
      }
      let texto =
        'Una torre de dos pisos proyecta una sombra de ' +
        sombraTotal.toString() +
        ' m; si el primer piso tiene una altura de ' +
        altura1.toString() +
        ' m y el segundo piso una altura de ' +
        altura2.toString() +
        ' m, ¿Cuánto mide la sombra proyectada por el segundo piso?';
      let sombra1 = (altura1 * sombraTotal) / (altura1 + altura2);
      let sombra2 = sombraTotal - sombra1;
      let error1 = (altura1 * sombraTotal) / altura1;
      let error2 = (altura1 * sombraTotal) / altura2;
      let error3 = (altura1 * sombraTotal) / sombra1;
      let error4 = (altura2 * sombraTotal) / sombra1;
      let respuestaCorrecta = sombra2.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());

      if (
        sombra2 != Math.trunc(sombra2) ||
        error1 != Math.trunc(error1) ||
        error2 != Math.trunc(error2) ||
        error3 != Math.trunc(error3) ||
        error4 != Math.trunc(error4) ||
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.homoteciaTales(3);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let sombra1 = this.generarNaturales(50) + 1;
      let altura2 = this.generarNaturales(50) + 1;
      let sombra2 = this.generarNaturales(50) + 1;

      while (sombra1 == sombra2) {
        sombra2 = this.generarNaturales(50) + 1;
      }
      let texto =
        'Calcula la altura de un árbol que proyecta una sombra de ' +
        sombra1.toString() +
        ' metros en el momento en que otro árbol que mide ' +
        altura2.toString() +
        ' metros proyecta una sombra de ' +
        sombra2.toString() +
        ' metros.';

      let altura1 = (altura2 * sombra1) / sombra2;
      let error1 = (altura2 * sombra2) / sombra1;
      let error2 = (sombra1 * sombra2) / altura2;
      let error3 = altura2 / sombra1;
      let error4 = altura2 / sombra2;
      let respuestaCorrecta = altura1.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());

      if (
        altura1 != Math.trunc(altura1) ||
        error1 != Math.trunc(error1) ||
        error2 != Math.trunc(error2) ||
        error3 != Math.trunc(error3) ||
        error4 != Math.trunc(error4) ||
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.homoteciaTales(4);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  semejanza(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let segmento = this.generarNaturales(9) + 1;
      let escala = this.generarNaturales(2) + 2;
      let texto =
        'Dado un segmento de ' +
        segmento.toString() +
        'cm, construimos otro semejante a él aplicando una escala de k = ' +
        escala.toString() +
        '. Dicho segmento medirá: ';
      let resultado = segmento * escala;
      let error1 = segmento / escala;
      let error2 = segmento + escala;
      let error3 = segmento - escala;
      let error4 = segmento ** escala;

      let respuestaCorrecta = resultado.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());
      if (
        resultado != Math.trunc(resultado) ||
        error1 != Math.trunc(error1) ||
        error2 != Math.trunc(error2) ||
        error3 != Math.trunc(error3) ||
        error4 != Math.trunc(error4) ||
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.semejanza(1);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let a = this.generarNaturales(40) + 1;
      let b = this.generarNaturales(40) + 1;

      while (b == a) {
        b = this.generarNaturales(40) + 1;
      }
      let texto =
        'En un triángulo rectángulo, una altura corta a la hipotenusa, y define dos segmentos de longitudes ' +
        a.toString() +
        ' cm y ' +
        b.toString() +
        ' cm. Halla la longitud de la altura.';
      let resultado = (a * b) ** (1 / 2);
      let error1 = a * b;
      let error2 = a + b;
      let error3 = a ** 2 + b ** 2;
      let error4 = (a + b) ** 2;

      let respuestaCorrecta = resultado.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());
      if (
        resultado != Math.trunc(resultado) ||
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.semejanza(2);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let p = this.generarNaturales(20) + 1;
      let q = this.generarNaturales(20) + 1;
      while (p == q) {
        q = this.generarNaturales(20) + 1;
      }
      let texto =
        'En un triángulo rectángulo, los dos segmentos de la hipotenusa separados por la altura, miden ' +
        p.toString() +
        ' y ' +
        q.toString() +
        '. Determina el valor del cateto menor.';

      let menor, mayor;
      let a = p * (p + q);
      let b = q * (p + q);

      if (a > b) {
        menor = b;
        mayor = a;
      } else {
        menor = a;
        mayor = b;
      }
      let resultado = menor;
      let error1 = mayor;
      let error2 = p + p * q;
      let error3 = q + q * p;
      let error4 = p * q;
      let respuestaCorrecta = resultado.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());
      if (
        resultado != Math.trunc(resultado) ||
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.semejanza(3);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let p = this.generarNaturales(15) + 1;
      let q = this.generarNaturales(15) + 1;
      while (p == q) {
        q = this.generarNaturales(15) + 1;
      }
      let texto =
        'En un triángulo rectángulo, los dos segmentos de la hipotenusa separados por la altura, miden ' +
        p.toString() +
        ' y ' +
        q.toString() +
        '. Determina el área del triángulo.';

      let resultado = p * (p + q) * q * (p + q);
      let error1 = p * q * (p + q);
      let error2 = (p * q) ** (1 / 2) * (p + q);
      let error3 = (q + q * p) * (p + q * p);
      let error4 = p * q;
      let respuestaCorrecta = resultado.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());
      if (
        resultado != Math.trunc(resultado) ||
        error2 != Math.trunc(error2) ||
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.semejanza(4);
      }
      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  analisisPoblaciones(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let a = this.generarNaturales(20) + 1;
      let b = this.generarNaturales(20) + 1;
      let c = this.generarNaturales(20) + 1;
      let d = this.generarNaturales(20) + 1;
      let e = this.generarNaturales(20) + 1;
      let total = a + b + c + d + e;
      if (
        a == b ||
        a == c ||
        a == d ||
        a == e ||
        b == c ||
        b == d ||
        b == e ||
        c == d ||
        c == e ||
        d == e ||
        total % 2 != 0
      ) {
        return this.analisisPoblaciones(1);
      }

      let texto =
        'Se hizo una encuesta en un grupo de ' +
        total.toString() +
        ' personas preguntando su color favorito, se obtuvo que ' +
        a.toString() +
        ' les gusta el color rojo, ' +
        b.toString() +
        ' les gusta el color azul, ' +
        c.toString() +
        ' prefieren el amarillo, ' +
        d.toString() +
        ' seleccionaron el verde y el resto seleccionaron el rosa. Calcule la frecuencia relativa de la gente que le gusta el azul.';

      let respuestaCorrecta = (b / total).toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((a / total).toFixed(2));
      respuestasIncorrectas.push((c / total).toFixed(2));
      respuestasIncorrectas.push((d / total).toFixed(2));
      respuestasIncorrectas.push((e / total).toFixed(2));

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let a = this.generarNaturales(20) + 1;
      let b = this.generarNaturales(20) + 1;
      let c = this.generarNaturales(20) + 1;
      let d = this.generarNaturales(20) + 1;
      let e = this.generarNaturales(20) + 1;
      let total = a + b + c + d + e;
      if (
        a == b ||
        a == c ||
        a == d ||
        a == e ||
        b == c ||
        b == d ||
        b == e ||
        c == d ||
        c == e ||
        d == e
      ) {
        return this.analisisPoblaciones(2);
      }

      let texto =
        'Se hizo una encuesta en un grupo de ' +
        total.toString() +
        ' personas preguntando su color favorito, se obtuvo que ' +
        a.toString() +
        ' les gusta el color rojo, ' +
        b.toString() +
        ' les gusta el color azul, ' +
        c.toString() +
        ' prefieren el amarillo, ' +
        d.toString() +
        ' seleccionaron el verde y el resto seleccionaron el rosa. Calcule la moda.';

      let moda;
      let noModales = [];
      if (a > b && a > c && a > d && a > e) {
        moda = a;
        noModales.push(b);
        noModales.push(c);
        noModales.push(d);
        noModales.push(e);
      } else if (b > a && b > c && b > d && b > e) {
        moda = b;
        noModales.push(a);
        noModales.push(c);
        noModales.push(d);
        noModales.push(e);
      } else if (c > a && c > b && c > d && c > e) {
        moda = c;
        noModales.push(a);
        noModales.push(b);
        noModales.push(d);
        noModales.push(e);
      } else if (d > a && d > c && d > b && d > e) {
        moda = d;
        noModales.push(a);
        noModales.push(c);
        noModales.push(b);
        noModales.push(e);
      } else {
        moda = e;
        noModales.push(a);
        noModales.push(c);
        noModales.push(b);
        noModales.push(d);
      }

      let respuestaCorrecta = moda.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(noModales[0].toString());
      respuestasIncorrectas.push(noModales[1].toString());
      respuestasIncorrectas.push(noModales[2].toString());
      respuestasIncorrectas.push(noModales[3].toString());

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let premios2 = this.generarNaturales(10) + 1;
      let premios1 = this.generarNaturales(10) + 1;
      let premios0 = this.generarNaturales(10) + 1;

      let texto =
        'En una feria se están sorteando premios, la cantidad de personas que no han obtenido premios es de ' +
        premios0.toString() +
        ', los que han obtenido un premio es de ' +
        premios1.toString() +
        ', y los que han obtenidos dos premios es de ' +
        premios2.toString() +
        '. Calcule el promedio de premios obtenidos.';
      let respuestaCorrecta = (
        (premios0 * 0 + premios1 * 1 + premios2 * 2) /
        (premios0 + premios1 + premios2)
      ).toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(
        (
          (premios0 * 0 + premios1 * 2 + premios2 * 1) /
          (premios0 + premios1 + premios2)
        ).toFixed(2)
      );
      respuestasIncorrectas.push(
        (
          (premios0 * 1 + premios1 * 0 + premios2 * 2) /
          (premios0 + premios1 + premios2)
        ).toFixed(2)
      );
      respuestasIncorrectas.push(
        (
          (premios0 * 1 + premios1 * 2 + premios2 * 0) /
          (premios0 + premios1 + premios2)
        ).toFixed(2)
      );
      respuestasIncorrectas.push(
        (
          (premios0 * 2 + premios1 * 0 + premios2 * 1) /
          (premios0 + premios1 + premios2)
        ).toFixed(2)
      );

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let premios2 = this.generarNaturales(10) + 1;
      let premios1 = this.generarNaturales(10) + 1;
      let premios0 = this.generarNaturales(10) + 1;

      let texto =
        'En una feria se están sorteando premios, la cantidad de personas que no han obtenido premios es de ' +
        premios0.toString() +
        ', los que han obtenido un premio es de ' +
        premios1.toString() +
        ', y los que han obtenidos dos premios es de ' +
        premios2.toString() +
        '. Calcule la mediana.';

      let datosObservacion = [];
      for (let i = 0; i < premios0; i++) {
        datosObservacion.push(0);
      }
      for (let i = premios0; i < premios0 + premios1; i++) {
        datosObservacion.push(1);
      }
      for (
        let i = premios1 + premios0;
        i < premios0 + premios1 + premios2;
        i++
      ) {
        datosObservacion.push(2);
      }

      let total = premios0 + premios1 + premios2;
      let mediana;
      if (total % 2 != 0) {
        mediana = datosObservacion[(total - 1) / 2];
      } else {
        mediana =
          (datosObservacion[total / 2 - 1] + datosObservacion[total / 2]) / 2;
      }
      let respuestaCorrecta = mediana.toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((mediana + 1).toFixed(2));
      respuestasIncorrectas.push((total / 2).toFixed(2));
      respuestasIncorrectas.push(
        (
          (premios0 * 0 + premios1 * 1 + premios2 * 2) /
          (premios0 + premios1 + premios2)
        ).toFixed(2)
      );
      respuestasIncorrectas.push(
        (mediana / (premios0 + premios1 + premios2)).toFixed(2)
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.analisisPoblaciones(4);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  reglasProbabilidad(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      let a = (this.generarNaturales(98) + 1) / 100;
      let b = (this.generarNaturales(98) + 1) / 100;
      while (a + b <= 1) {
        b = (this.generarNaturales(98) + 1) / 100;
      }

      let texto =
        'Sean los sucesos A y B tales que P(A ∪ B)=1 , P(A)=' +
        a.toString() +
        ' , P(B)=' +
        b.toString() +
        '. Calcule P(A ∩ B)';

      let respuestaCorrecta = (a + b - 1).toFixed(2);
      if (respuestaCorrecta == (0.0).toString()) {
        this.reglasProbabilidad(1);
      }
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((a - Number(respuestaCorrecta)).toFixed(2));
      respuestasIncorrectas.push((b - Number(respuestaCorrecta)).toFixed(2));
      respuestasIncorrectas.push((1 - Number(respuestaCorrecta)).toFixed(2));
      respuestasIncorrectas.push(
        ((this.generarNaturales(98) + 1) / 100).toFixed(2)
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.reglasProbabilidad(1);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let a = (this.generarNaturales(98) + 1) / 100;
      let b = (this.generarNaturales(98) + 1) / 100;
      let c = (this.generarNaturales(98) + 1) / 100;
      while (a + b >= 1 || c >= a || c >= b || a == b) {
        b = (this.generarNaturales(98) + 1) / 100;
        c = (this.generarNaturales(98) + 1) / 100;
      }

      let texto =
        'La probabilidad de que mañana almuerces pizza es de ' +
        a.toString() +
        ', de que almuerces papas fritas es de ' +
        b.toString() +
        ', y de que comas ambos de ' +
        c.toString() +
        '. Calcule la probabilidad de no almorzar ninguno.';
      let respuestaCorrecta = (1 - a - b + c).toFixed(2);
      if (respuestaCorrecta == (0.0).toString()) {
        this.reglasProbabilidad(2);
      }
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((a - c).toFixed(2));
      respuestasIncorrectas.push((b - c).toFixed(2));
      respuestasIncorrectas.push((1 - c).toFixed(2));
      respuestasIncorrectas.push(
        ((this.generarNaturales(98) + 1) / 100).toFixed(2)
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.reglasProbabilidad(2);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 3) {
      let a = this.generarNaturales(9) + 1;
      let b = this.generarNaturales(9) + 1;
      while (a + b >= 1 || b >= a) {
        b = this.generarNaturales(9) + 1;
      }
      let texto =
        'Una bolsa tiene ' +
        a.toString() +
        ' canicas rojas y ' +
        b.toString() +
        ' canicas verdes. si se sacan dos al azar sin reposición. ¿Cuál es la probabilidad de que ambas sean rojas?';

      let respuestaCorrecta = ((a / (a + b)) * ((a - 1) / (a + b - 1))).toFixed(
        2
      );
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(((a / (a + b)) ** 2).toFixed(2));
      respuestasIncorrectas.push(
        ((b / (a + b)) * ((b - 1) / (a + b - 1))).toFixed(2)
      );
      respuestasIncorrectas.push(((b / (a + b)) ** 2).toFixed(2));
      respuestasIncorrectas.push(
        ((a / (a + b)) * ((a - 1) / (a + b))).toFixed(2)
      );

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.reglasProbabilidad(3);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    } else if (tipo == 4) {
      let a = (this.generarNaturales(8) + 1) / 10;
      let b = (this.generarNaturales(8) + 1) / 10;
      while (a == b) {
        b = (this.generarNaturales(8) + 1) / 10;
      }
      let texto =
        'En un colegio la probabilidad de que a un estudiante le guste el ajedrez es de ' +
        a.toString() +
        ' y de que a un estudiante le gusten las películas es de ' +
        b.toString() +
        ' .Calcule la probabilidad de que a un estudiante le gusten ambos.';
      let respuestaCorrecta = (a * b).toFixed(2);
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push((a + b).toFixed(2));
      respuestasIncorrectas.push((a / b).toFixed(2));
      respuestasIncorrectas.push((a * a).toFixed(2));
      respuestasIncorrectas.push((b * b).toFixed(2));

      if (
        respuestaCorrecta == respuestasIncorrectas[0] ||
        respuestaCorrecta == respuestasIncorrectas[1] ||
        respuestaCorrecta == respuestasIncorrectas[2] ||
        respuestaCorrecta == respuestasIncorrectas[3] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[1] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[0] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[2] ||
        respuestasIncorrectas[1] == respuestasIncorrectas[3] ||
        respuestasIncorrectas[2] == respuestasIncorrectas[3]
      ) {
        return this.reglasProbabilidad(4);
      }

      let alternativas = []
      alternativas.push(respuestaCorrecta)
      alternativas.push(respuestasIncorrectas[0])
      alternativas.push(respuestasIncorrectas[1])
      alternativas.push(respuestasIncorrectas[2])
      alternativas.push(respuestasIncorrectas[3])
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
        alternativas: alternativas,
      });
      return contenidoPregunta;
    }
    return 0 as unknown as Pregunta;
  }

  comportamientoAleatorio(tipo: number): Pregunta {
    if (tipo == 0) {
      tipo = this.generarNaturales(4) + 1;
    }
    if (tipo == 1) {
      
    } else if (tipo == 2) {

    } else if (tipo == 3) {

    } else if (tipo == 4) {

    }
    return 0 as unknown as Pregunta;
  }
  
  tematica(id:string):Pregunta{
    let contenidoPregunta: Pregunta;
    switch (id){
      case 'Operatoria en los números racionales':
        contenidoPregunta = this.operatoriaRacionales(0);
        break;
      case 'Potencias':
        contenidoPregunta = this.potencias(0); 
        break;
      case 'Productos notables':
        contenidoPregunta = this.productosNotables(0);
        break;
      case 'Área de la superficie y volumen del cono':
        contenidoPregunta = this.cono(0);
      break;
      case 'Perímetro y área de sectores y segmentos circulares':
        contenidoPregunta = this.sectoresCirculares(4);
      break;
      case 'Relaciones lineales en dos variables':
        contenidoPregunta = this.funcionesLineales(0);
      break;
      case 'Sistema de ecuaciones lineales':
        contenidoPregunta = this.sistemaEcuacionesLineales(0);
      break;
      case 'Homotecia y teorema de Tales':
        contenidoPregunta = this.homoteciaTales(0);
      break;
      case 'Semejanza':
        contenidoPregunta = this.semejanza(0);
      break;
      case 'Análisis de poblaciones':
        contenidoPregunta = this.analisisPoblaciones(0);
      break;
      case 'Comportamiento aleatorio':
        contenidoPregunta = this.reglasProbabilidad(0);
      break;
      case 'Reglas de la probabilidad':
        contenidoPregunta = this.comportamientoAleatorio(1); //arreglar full
      break;
      default:
        contenidoPregunta = 0 as unknown as Pregunta;
        break;
    }
    
    return contenidoPregunta
  }
}
