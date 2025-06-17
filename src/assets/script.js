window.onload = function () {
  const canvas = document.getElementById("rule30Canvas");
  const ctx = canvas.getContext("2d");
  let rows = 80, cols = 40;
  const cellSize = 4;
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  let generationCount = 0;

  let grid = Array(rows).fill(null).map(() => Array(cols).fill(0));
  let running = false;
  let animationId;
  let currentRow = 0;
  let centerColumnHistory = []; // Guarda la historia de la columna central
  let totalExecutionTime = 0;
  let generationTimes = [];
  let simulationStartTime = null;

  const toggleBtn = document.getElementById("toggleBtn");
  const borderBehavior = document.getElementById("borderBehavior");

  // Estado inicial: solo una celda activa en el centro
  grid[0][Math.floor(cols / 2)] = 1;

  function drawGrid() {
    for (let y = 0; y <= currentRow; y++) {
      for (let x = 0; x < cols; x++) {
        ctx.fillStyle = grid[y][x] === 1 ? "black" : "white";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  function isAtBorder(row) {
    return row[0] === 1 || row[cols - 1] === 1;
  }

  function applyRule30(prevRow, invert = false) {
    const newRow = Array(cols).fill(0);
    for (let i = 0; i < cols; i++) {
      const left = prevRow[i - 1] || 0;
      const center = prevRow[i];
      const right = prevRow[i + 1] || 0;
      const pattern = (left << 2) | (center << 1) | right;
      // Regla 30 o invertida
      if (!invert) {
        newRow[i] = [0, 1, 1, 1, 1, 0, 0, 0][pattern];
      } else {
        newRow[i] = [1, 0, 0, 0, 0, 1, 1, 1][pattern]; // Invertida
      }
    }
    return newRow;
  }

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

      const genStart = performance.now();

      grid[currentRow + 1] = applyRule30(grid[currentRow], invert);
      currentRow++;
      const centerValue = grid[currentRow][Math.floor(cols / 2)];
      centerColumnHistory.push(centerValue);
      drawGrid();
      generationCount++;

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
    }
  }

  // 1. Analizar periodicidad (búsqueda de ciclos simples)

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

  function analyzePeriodicity() {
    const arr = centerColumnHistory;
    let result = "No se detectó periodicidad en la columna central.";
    for (let period = 1; period <= arr.length / 2; period++) {
      let periodic = true;
      for (let i = 0; i < arr.length - period; i++) {
        if (arr[i] !== arr[i + period]) {
          periodic = false;
          break;
        }
      }
      if (periodic) {
        result = `¡Secuencia periódica detectada con periodo ${period}!`;
        break;
      }
    }
    document.getElementById("periodicityResult").innerText = result;
  }

  // 2. Analizar frecuencia de ceros y unos
  function analyzeFrequency() {
    const arr = centerColumnHistory;
    const zeros = arr.filter(x => x === 0).length;
    const ones = arr.filter(x => x === 1).length;
    const result = `Frecuencia:\nCeros: ${zeros} (${((zeros / arr.length) * 100).toFixed(2)}%)\nUnos: ${ones} (${((ones / arr.length) * 100).toFixed(2)}%)`;
    document.getElementById("frequencyResult").innerText = result;
  }

  // 3. Analizar complejidad (tiempo de cómputo para n)
  function analyzeComplexity() {
    const input = document.getElementById("complexityInput");
    let n = parseInt(input.value);
    if (isNaN(n) || n < 1) {
      document.getElementById("complexityResult").innerText = "Por favor ingresa un número de generación válido.";
      return;
    }
    const increments = [0, 1000, 10000, 100000];
    let times = [];
    let results = "";

    increments.forEach(inc => {
      const gen = n + inc;
      let prevGrid = Array(gen).fill(0);
      prevGrid[Math.floor(prevGrid.length / 2)] = 1;
      let row = prevGrid;
      const t0 = performance.now();
      for (let i = 1; i < gen; i++) {
        row = applyRule30(row);
      }
      const t1 = performance.now();
      const elapsed = t1 - t0;
      times.push(elapsed);
      results += `Generación ${gen}: ${elapsed.toFixed(2)} ms\n`;
    });

    // Calcular factores de crecimiento
    let growth = "";
    for (let i = 1; i < times.length; i++) {
      const factor = times[i] / times[i - 1];
      growth += `Crecimiento de ${n + increments[i - 1]} a ${n + increments[i]}: x${factor.toFixed(2)}\n`;
    }

    document.getElementById("complexityResult").innerText =
      `Tiempos para calcular la celda central:\n${results}\nFactores de crecimiento:\n${growth}`;
  }

  // Función para formatear el tiempo: muestra en ms si < 1000, en segundos si >= 1000
  function formatTime(timeMs) {
    if (timeMs < 1000) {
      return `${timeMs.toFixed(2)} ms`;
    } else {
      return `${(timeMs / 1000).toFixed(4)} s`;
    }
  }

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

  document.getElementById("resetBtn").onclick = () => {
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
  };

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

  drawGrid(); // Dibujo inicial
};
