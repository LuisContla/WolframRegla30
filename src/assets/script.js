window.onload = function () {
  /// [Configuración principal/Elementos y variables principales]
  const canvas = document.getElementById("rule30Canvas");
  const ctx = canvas.getContext("2d");
  const canvasContainer = document.querySelector(".canvas-container");
  const toggleBtn = document.getElementById("toggleBtn");
  const borderBehavior = document.getElementById("borderBehavior");

  /// [Configuración principal/Parámetros de la simulación]
  let rows = 50, cols = 100, cellSize = 10;
  let grid = Array(rows).fill(null).map(() => Array(cols).fill(0));
  let running = false, animationId, currentRow = 0;
  let centerColumnHistory = []; // Guarda la historia de la columna central
  let totalExecutionTime = 0, generationTimes = [], simulationStartTime = null;
  let generationCount = 0;

  /// [Configuración principal/Parámetros de zoom y navegación]
  let zoom = 1;
  const minZoom = 0.5, maxZoom = 8, zoomStep = 0.25;
  let isDragging = false, dragStartX = 0, dragStartY = 0, scrollStartX = 0, scrollStartY = 0;

  // Inicializa el grid con una sola celda activa en el centro
  grid[0][Math.floor(cols / 2)] = 1;

  /// [Dibujo de Canvas/Función para dibujar el autómata en el canvas]
  function drawGrid() {
    // Ajusta el tamaño real del canvas según el zoom
    canvas.width = cols * cellSize * zoom;
    canvas.height = rows * cellSize * zoom;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(zoom, zoom);
    for (let y = 0; y <= currentRow; y++) {
      for (let x = 0; x < cols; x++) {
        ctx.fillStyle = grid[y][x] === 1 ? "black" : "white";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform after drawing
  }

  /// [Dibujo de Canvas/Redimensiona el canvas y reinicia la simulación]
  function resizeCanvas(newCols, newRows, newCellSize) {
    cols = newCols;
    rows = newRows;
    cellSize = newCellSize;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    resetSimulation();
  }

  /// [Dibujo de Canvas/Verifica si la fila actual toca los bordes]
  function isAtBorder(row) {
    return row[0] === 1 || row[cols - 1] === 1;
  }

  /// [Regla 30/Aplica la Regla 30 (o invertida) para generar la siguiente fila]
  function applyRule30(prevRow, invert = false) {
    const newRow = Array(cols).fill(0);
    for (let i = 0; i < cols; i++) {
      const left = prevRow[i - 1] || 0;
      const center = prevRow[i];
      const right = prevRow[i + 1] || 0;
      const pattern = (left << 2) | (center << 1) | right;
      if (!invert) {
        newRow[i] = [0, 1, 1, 1, 1, 0, 0, 0][pattern];
      } else {
        newRow[i] = [1, 0, 0, 0, 0, 1, 1, 1][pattern]; // Invertida
      }
    }
    return newRow;
  }

  /// [Regla 30/Avanza una generación en la simulación]
  function step() {
    if (currentRow < rows - 1) {
      let invert = false;
      if (isAtBorder(grid[currentRow])) {
        if (borderBehavior.value === "stop") {
          running = false;
          toggleBtn.innerText = "Iniciar";
          return;
        }
        if (borderBehavior.value === "invert") {
          invert = true;
        }
      }

      // Medición de tiempo de generación
      const genStart = performance.now();

      grid[currentRow + 1] = applyRule30(grid[currentRow], invert);
      currentRow++;
      const centerValue = grid[currentRow][Math.floor(cols / 2)];
      centerColumnHistory.push(centerValue);
      drawGrid();
      generationCount++;

      // Actualización de tiempos y contadores
      const genEnd = performance.now();
      const genTime = genEnd - genStart;
      generationTimes.push(genTime);

      totalExecutionTime = performance.now() - simulationStartTime;
      const avgTime = generationTimes.reduce((a, b) => a + b, 0) / generationTimes.length;

      document.getElementById("generationCounter").innerText = generationCount;
      document.getElementById("generationTime").innerText = formatTime(genTime);
      document.getElementById("totalTime").innerText = formatTime(totalExecutionTime);
      document.getElementById("averageTime").innerText = formatTime(avgTime);

      animationId = requestAnimationFrame(step);
    } else {
      running = false;
      toggleBtn.innerText = "Iniciar";
      runAllAnalyses(); // Ejecuta los análisis al terminar
    }
  }

  /// [Regla 30/Reinicia la simulación y limpia los contadores]
  function resetSimulation() {
    cancelAnimationFrame(animationId);
    running = false;
    toggleBtn.innerText = "Iniciar";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid = Array(rows).fill(null).map(() => Array(cols).fill(0));
    grid[0][Math.floor(cols / 2)] = 1;
    currentRow = 0;
    generationCount = 0;
    centerColumnHistory = [];
    generationTimes = [];
    totalExecutionTime = 0;
    simulationStartTime = null;
    document.getElementById("generationCounter").innerText = generationCount;
    document.getElementById("generationTime").innerText = "0 ms";
    document.getElementById("totalTime").innerText = "0 ms";
    document.getElementById("averageTime").innerText = "0 ms";
    drawGrid();
  }

  /// [Análisis Preguntas/Análisis de periodicidad]

  /*
    ¿Qué es un periodo en una secuencia?
    ------------------------------------
    Un periodo 'p' es un número entero tal que la secuencia se repite cada 'p' pasos.
    Es decir, para toda posición i, arr[i] == arr[i + p].
  
    ¿Cuáles son los posibles periodos?
    ----------------------------------
    - Son todos los enteros desde 1 hasta la mitad de la longitud de la secuencia (arr.length / 2).
    - No se buscan periodos mayores porque no cabrían al menos dos repeticiones completas en la secuencia.
  
    ¿Cómo se prueba cada periodo?
    -----------------------------
    - Para cada posible periodo p, se compara cada elemento arr[i] con arr[i + p] para todos los i posibles.
    - Si todos los pares coinciden para ese p, la secuencia es periódica con periodo p.
  
    Ejemplo:
    --------
    Secuencia: [1, 0, 1, 0, 1, 0]
    - Si pruebas periodo 2:
      arr[0] == arr[2] == arr[4] (todos 1)
      arr[1] == arr[3] == arr[5] (todos 0)
      => Coincide, la secuencia es periódica con periodo 2.
  
    En resumen:
    -----------
    La función busca si la secuencia de la columna central se repite exactamente cada cierto número de generaciones,
    probando todos los posibles periodos razonables.
  */

  // Busca si la secuencia de la columna central se repite con algún periodo.
  // Si encuentra un periodo, lo reporta; si no, indica que no hay periodicidad.
  function analyzePeriodicity() {
    const arr = centerColumnHistory;
    let result = "No se detectó periodicidad en la columna central.";
    // Probar todos los posibles periodos desde 1 hasta la mitad de la longitud de la secuencia
    for (let period = 1; period <= arr.length / 2; period++) {
      let periodic = true;
      // Compara cada elemento con el que está a 'period' posiciones adelante
      for (let i = 0; i < arr.length - period; i++) {
        if (arr[i] !== arr[i + period]) {
          periodic = false;
          break;
        }
      }
      // Si se mantiene la periodicidad, reporta el periodo encontrado
      if (periodic) {
        result = `¡Secuencia periódica detectada con periodo ${period}!`;
        break;
      }
    }
    document.getElementById("periodicityResult").innerText = result;
  }

  /// [Análisis Preguntas/Análisis de frecuencia de ceros y unos]
  // Cuenta cuántos ceros y unos hay en la columna central y calcula su porcentaje.
  function analyzeFrequency() {
    const arr = centerColumnHistory;
    const zeros = arr.filter(x => x === 0).length;
    const ones = arr.filter(x => x === 1).length;
    // Calcula el porcentaje de ceros y unos respecto al total
    const result = `Frecuencia:\nCeros: ${zeros} (${((zeros / arr.length) * 100).toFixed(2)}%)\nUnos: ${ones} (${((ones / arr.length) * 100).toFixed(2)}%)`;
    document.getElementById("frequencyResult").innerText = result;
  }

  /// [Análisis Preguntas/Análisis de complejidad (tiempo de cómputo para n)]
  // Mide el tiempo que tarda en calcular la celda central para varias generaciones grandes.
  // También calcula el factor de crecimiento del tiempo conforme aumenta la generación.
  function analyzeComplexity() {
    const input = document.getElementById("complexityInput");
    let n = parseInt(input.value);
    if (isNaN(n) || n < 1) {
      document.getElementById("complexityResult").innerText = "Por favor ingresa un número de generación válido.";
      return;
    }
    // Prueba con n, n+1000, n+10000, n+100000 generaciones
    const increments = [0, 1000, 10000, 100000];
    let times = [];
    let results = "";

    increments.forEach(inc => {
      const gen = n + inc;
      // Inicializa una fila con una sola celda activa en el centro
      let prevGrid = Array(gen).fill(0);
      prevGrid[Math.floor(prevGrid.length / 2)] = 1;
      let row = prevGrid;
      // Mide el tiempo de cómputo para llegar a la generación 'gen'
      const t0 = performance.now();
      for (let i = 1; i < gen; i++) {
        row = applyRule30(row);
      }
      const t1 = performance.now();
      const elapsed = t1 - t0;
      times.push(elapsed);
      results += `Generación ${gen}: ${elapsed.toFixed(2)} ms\n`;
    });

    // Calcula el factor de crecimiento del tiempo entre cada incremento
    let growth = "";
    for (let i = 1; i < times.length; i++) {
      const factor = times[i] / times[i - 1];
      growth += `Crecimiento de ${n + increments[i - 1]} a ${n + increments[i]}: x${factor.toFixed(2)}\n`;
    }

    document.getElementById("complexityResult").innerText =
      `Tiempos para calcular la celda central:\n${results}\nFactores de crecimiento:\n${growth}`;
  }

  /// [Análisis Preguntas/Ejecuta todos los análisis]
  function runAllAnalyses() {
    analyzePeriodicity();
    analyzeFrequency();
    analyzeComplexity();
  }

  // --- Formatea el tiempo para mostrar en ms o segundos ---
  function formatTime(timeMs) {
    if (timeMs < 1000) {
      return `${timeMs.toFixed(2)} ms`;
    } else {
      return `${(timeMs / 1000).toFixed(4)} s`;
    }
  }

  /// [Eventos de control de la simulación]

  toggleBtn.onclick = () => {
    if (!running) {
      running = true;
      toggleBtn.innerText = "Pausar";
      if (!simulationStartTime) simulationStartTime = performance.now();
      animationId = requestAnimationFrame(step);
    } else {
      running = false;
      toggleBtn.innerText = "Iniciar";
      cancelAnimationFrame(animationId);
    }
  };

  document.getElementById("periodicityBtn").onclick = analyzePeriodicity;
  document.getElementById("frequencyBtn").onclick = analyzeFrequency;
  document.getElementById("complexityBtn").onclick = analyzeComplexity;
  document.getElementById("resetBtn").onclick = resetSimulation;
  document.getElementById("runAllAnalysesBtn").onclick = runAllAnalyses;

  document.getElementById("resizeCanvasBtn").onclick = () => {
    const newCols = parseInt(document.getElementById("colsInput").value);
    const newRows = parseInt(document.getElementById("rowsInput").value);
    const newCellSize = parseInt(document.getElementById("cellSizeInput").value);
    resizeCanvas(newCols, newRows, newCellSize);
  };

  /// [Zoom/Navegación y zoom con scroll]
  canvas.addEventListener("wheel", function (e) {
    if (!e.ctrlKey) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    // Posición del mouse relativa al canvas-container (incluyendo scroll actual)
    const mouseX = e.clientX - rect.left + canvasContainer.scrollLeft;
    const mouseY = e.clientY - rect.top + canvasContainer.scrollTop;

    // Posición lógica en el canvas antes del zoom
    const logicalX = mouseX / zoom;
    const logicalY = mouseY / zoom;

    // Calcula el nuevo zoom
    let newZoom = zoom + (e.deltaY < 0 ? zoomStep : -zoomStep);
    newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    if (newZoom === zoom) return;

    // Aplica el nuevo zoom y redibuja
    zoom = newZoom;
    drawGrid();

    // Ajusta el scroll para mantener el punto bajo el mouse
    canvasContainer.scrollLeft = (logicalX * zoom) - (e.clientX - rect.left);
    canvasContainer.scrollTop = (logicalY * zoom) - (e.clientY - rect.top);
  }, { passive: false });

  // --- Navegación por arrastre con Shift + clic ---
  canvasContainer.addEventListener("mousedown", function (e) {
    if (e.shiftKey) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      scrollStartX = canvasContainer.scrollLeft;
      scrollStartY = canvasContainer.scrollTop;
      canvasContainer.style.cursor = "grab";
      e.preventDefault();
    }
  });

  /// [Zoom/Controles de zoom]
  document.getElementById("zoomInBtn").onclick = () => {
    if (zoom < maxZoom) {
      zoom += zoomStep;
      drawGrid();
    }
  };
  document.getElementById("zoomOutBtn").onclick = () => {
    if (zoom > minZoom) {
      zoom -= zoomStep;
      drawGrid();
    }
  };
  document.getElementById("resetZoomBtn").onclick = () => {
    zoom = 1;
    drawGrid();
  };

  /// [Dibujo interactivo/Navegación por arrastre]
  window.addEventListener("mousemove", function (e) {
    if (isDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      canvasContainer.scrollLeft = scrollStartX - dx;
      canvasContainer.scrollTop = scrollStartY - dy;
    }
  });

  window.addEventListener("mouseup", function () {
    if (isDragging) {
      isDragging = false;
      canvasContainer.style.cursor = "";
    }
  });

  // --- Dibuja el estado inicial ---
  drawGrid();
};