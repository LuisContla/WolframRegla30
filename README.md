# Regla 30 de Wolfram – Exploración Computacional

Este proyecto es una implementación de la **Regla 30 de Wolfram**, un autómata celular unidimensional, desarrollado como parte de una práctica académica. El objetivo es estudiar el comportamiento emergente del sistema y aproximarse a las preguntas planteadas en [The Wolfram Rule 30 Prizes](https://www.rule30prize.org/).

## Objetivos del Proyecto

- Simular la evolución de la Regla 30 desde una semilla inicial.
- Visualizar patrones generados y analizar su complejidad.
- Explorar la posibilidad de extraer información o predecir partes de la evolución del sistema.
- Contribuir, en la medida de lo posible, al análisis de las preguntas abiertas propuestas por Stephen Wolfram.

## ¿Qué es la Regla 30?

La Regla 30 es una de las 256 posibles reglas de autómatas celulares binarios unidimensionales. Fue descubierta por Stephen Wolfram y es notable por generar un comportamiento caótico a partir de reglas muy simples. Su forma más común de visualizarla es en forma de triángulo invertido donde cada fila representa una generación.

Regla de transición (binaria):

| Vecindad (izq, centro, der) | Resultado |
|-----------------------------|-----------|
| 111                         | 0         |
| 110                         | 0         |
| 101                         | 0         |
| 100                         | 1         |
| 011                         | 1         |
| 010                         | 1         |
| 001                         | 1         |
| 000                         | 0         |

Visualización Gráfica:

<img src="src/assets/Rule30Amarillo.png" alt="Condiciones de Regla 30" style="width:80%;">

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
