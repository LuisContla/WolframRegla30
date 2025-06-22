# Regla 30 de Wolfram – Exploración Computacional

Este proyecto es una implementación interactiva de la **Regla 30 de Wolfram**, un autómata celular unidimensional, desarrollada como parte de una práctica académica. El objetivo es estudiar el comportamiento emergente del sistema y aproximarse a las preguntas planteadas en [The Wolfram Rule 30 Prizes](https://www.rule30prize.org/).

## ¿Qué es la Regla 30?

La Regla 30 es una de las 256 posibles reglas de autómatas celulares binarios unidimensionales. Fue descubierta por Stephen Wolfram y es notable por generar un comportamiento caótico a partir de reglas muy simples. Su forma más común de visualizarla es en forma de triángulo invertido donde cada fila representa una generación.

**Regla de transición (binaria):**

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

Visualización gráfica:

<img src="src/assets/Rule30Amarillo.png" alt="Condiciones de Regla 30" style="width:80%;">

## Funcionalidades principales

- **Simulación visual interactiva:**  
  Visualiza la evolución de la Regla 30 en un canvas, con una celda inicial activa en el centro.

- **Configuración dinámica:**  
  Permite modificar el número de columnas, filas y el tamaño de cada celda desde la interfaz.

- **Controles de simulación:**  
  - Iniciar, pausar y reiniciar la simulación.
  - Selección del comportamiento en los bordes (detener, continuar, invertir regla).

- **Zoom y navegación avanzada:**  
  - Zoom con botones (+, -) y con Ctrl + rueda del mouse (centrado en el cursor).
  - Botón para reiniciar el zoom.
  - Scrollbars automáticos cuando el canvas excede el área visible.
  - Navegación por arrastre con Shift + clic y mover el mouse.

- **Análisis automáticos y manuales:**  
  - **Periodicidad:** Detecta si la columna central es periódica y muestra el periodo.
  - **Frecuencia:** Calcula la proporción de ceros y unos en la columna central.
  - **Complejidad:** Mide el tiempo de cómputo para calcular la celda central en distintas generaciones.
  - Botón para ejecutar todos los análisis a la vez.

- **Contadores y métricas:**  
  - Número de generaciones.
  - Tiempo de generación, total y promedio.

## Uso

1. Ajusta el tamaño del autómata (columnas, filas, tamaño de celda) y haz clic en **Aplicar**.
2. Usa los botones para **iniciar**, **pausar** o **reiniciar** la simulación.
3. Haz zoom con los botones o con **Ctrl + rueda del mouse**. Usa **Shift + clic y arrastra** para moverte por el canvas.
4. Ejecuta los análisis desde los botones de la sección de análisis o automáticamente al finalizar la simulación.

## Créditos

Desarrollado como parte de una práctica académica en ESCOM-IPN.

## Tecnologías utilizadas

- React + Vite
- JavaScript (canvas API)
- HTML/CSS

---

Para más información, puede consultar el [Reporte del Proyecto](Wolfram_Regla_30.pdf).