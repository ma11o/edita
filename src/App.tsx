import React, { useReducer } from "react";
import reducer, { initialState } from "./domains/Layer/reducer";
import { Canvas } from "./components/Canvas";
import { Navi } from "./components/Navi";
import CanvasContext from "./components/context";
import "semantic-ui-css/semantic.min.css";
import "./assets/style.css";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CanvasContext.Provider value={[state, dispatch]}>
      <Navi />
      <Canvas />
    </CanvasContext.Provider>
  );
}

export default App;
