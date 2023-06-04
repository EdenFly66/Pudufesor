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
      let unidades = this.generarNaturales(3);
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

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
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

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
      });
      console.log(contenidoPregunta);
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
      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
      });
      console.log(contenidoPregunta);
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

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
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
      let exp1 = this.generarNaturales(6);
      let exp2 = this.generarNaturales(6);
      let exp3 = this.generarNaturales(6);
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
      let resultado = base ** (exp1 + exp2 - exp3);
      let respuestaCorrecta = resultado.toString();
      //cálculo de errores
      let respuestasIncorrectas: Array<string> = [];
      let error1 = base ** (exp1 + exp2 + exp3);
      let error2 = base ** (exp1 - exp2 - exp3);
      let error3 = base ** (exp1 - exp2 + exp3);
      let error4 = base ** (-exp1 + exp2 - exp3);

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

      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
      });
      return contenidoPregunta;
    } else if (tipo == 2) {
      let base = this.generarNaturales(3);
      if (base <= 1) {
        return this.potencias(2);
      }
      let exp1 = this.generarEntero(5);
      let exp2 = this.generarEntero(5);
      let exp3 = this.generarEntero(5);

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

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
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

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
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

      let resultado = base ** expCorrecto;
      let error1 = base ** expE1;
      let error2 = base ** expE2;
      let error3 = base ** expE3;
      let error4 = base ** expE4;

      if (
        resultado < 0.9 ||
        error1 < 0.9 ||
        error2 < 0.9 ||
        error3 < 0.9 ||
        error4 < 0.9
      ) {
        return this.potencias(4);
      }
      let respuestaCorrecta = resultado.toString();
      let respuestasIncorrectas: Array<string> = [];
      respuestasIncorrectas.push(error1.toString());
      respuestasIncorrectas.push(error2.toString());
      respuestasIncorrectas.push(error3.toString());
      respuestasIncorrectas.push(error4.toString());

      let contenidoPregunta: Pregunta = Object.assign({
        enunciado: texto,
        respuestaCorrecta: respuestaCorrecta,
        respuestasIncorrectas: respuestasIncorrectas,
      });
      return contenidoPregunta;
    } else {
      return 0 as unknown as Pregunta;
    }
  }

  productosNotables(tipo: number): Pregunta{
    return 0 as unknown as Pregunta;
  }
}
