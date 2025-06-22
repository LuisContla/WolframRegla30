import "../../src/assets/script.js";

function Wolfram() {
  return (
    <div className="contenedor-principal">
      <h1>Simulación Regla 30</h1>
      <div className="zoom-control">
        <label>Zoom:</label>
        <button id="zoomInBtn" className="zoombtn">+</button>
        <button id="zoomOutBtn" className="zoombtn">-</button>
        <button id="resetZoomBtn">Reiniciar zoom</button>
        <div className="zoom-help" style={{ background: "#f5f5f5", padding: "0.7rem", borderRadius: "8px", maxWidth: "600px" }}>
          <strong>Controles de Zoom:</strong>
          <ul style={{ textAlign: "left", margin: "0.5rem 0 0 1.5rem" }}>
            <li>
              <b>Ctrl + Rueda del mouse</b>: Zoom enfocado en el punto del cursor.
            </li>
            <li>
              <b>Shift + clic y arrastrar</b>: Mover la vista del canvas.
            </li>
          </ul>
        </div>
      </div>
      <div className="canvas-container">
        <canvas id="rule30Canvas"></canvas>
      </div>
      <div className="canvas-config">
        <label>Columnas:</label>
        <input id="colsInput" type="number" min="10" max="2000" defaultValue={1000} step={50} />
        <label>Filas:</label>
        <input id="rowsInput" type="number" min="10" max="1000" defaultValue={500} step={50} />
        <label>Celda (px):</label>
        <input id="cellSizeInput" type="number" min="1" max="15" defaultValue={1} step={1} />
        <button id="resizeCanvasBtn">Aplicar</button>
      </div>
      <div className="botones-control">
        <button id="toggleBtn">Iniciar</button>
        <button id="resetBtn">Reiniciar</button>
        <select id="borderBehavior">
          <option value="stop">Detener al tocar borde</option>
          <option value="continue">Continuar normalmente</option>
          {/* <option value="invert">Invertir regla en borde</option> */}
        </select>
      </div>
      <div className="analisis-control">
        <button id="runAllAnalysesBtn">Realizar todos los análisis</button>
        <button id="periodicityBtn">Analizar periodicidad</button>
        <button id="frequencyBtn">Analizar frecuencia</button>
        <button id="complexityBtn">Analizar complejidad</button>
        <input id="complexityInput" type="number" min="1" placeholder="Generación n" defaultValue={1000} />
      </div>
      <div className="contadores">
        <h3>Generaciones:<br /><span id="generationCounter">0</span></h3>
        <h3>Tiempo de generación:<br /><span id="generationTime">0 ms</span></h3>
        <h3>Tiempo total:<br /><span id="totalTime">0 ms</span></h3>
        <h3>Tiempo promedio:<br /><span id="averageTime">0 ms</span></h3>
      </div>
      <div className="resultados-analisis">
        <div id="periodicityResult" className="resultado-cuadro">Resultados de Periodicidad</div>
        <div id="frequencyResult" className="resultado-cuadro">Resultados de Frecuencia</div>
        <div id="complexityResult" className="resultado-cuadro">Resultados de Complejidad</div>
      </div>
    </div>
  );
}

export default Wolfram;
