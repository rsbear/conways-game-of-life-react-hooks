import React, { FC, useState, useCallback, useRef } from "react";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import produce from "immer";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const App: FC = () => {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            // compute number of neighbors
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              // check bounds
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            // check condition, determines if cell is 1, 0, or nothing
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    // simulate
    setTimeout(runSimulation, 500);
  }, []);

  return (
    <div css={mainStyle}>
      <div css={infoContainer}>
        <h1>Conway's Game of Life</h1>
        <p>
          Select any squares, and include some neighboring ones. Hit start and
          watch it compute.
        </p>
        <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
          Read more
        </a>
        <button
          css={runButton}
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {!running ? "Start" : "Stop"}
        </button>
      </div>
      <div css={gridContainer}>
        {grid.map((rows, i: number) =>
          rows.map((col, k: number) => (
            <div
              key={`${i}_${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px rgba(80, 120, 160, .2)"
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;

const mainStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #242a35;
  display: flex;
  overflow-x: hidden;
  color: rgba(255, 255, 255, 0.7);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;
const infoContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 80px;

  h1 {
    font-weight: 600;
    /* color: rgba(120, 190, 240, 0.9); */
    color: white;
  }

  p {
    line-height: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  a {
    color: #c9b5f2;
    margin: 20px 0;
    text-transform: uppercase;
  }
`;
const gridContainer = css`
  justify-self: flex-end;
  padding-right: 10px;
  margin-left: auto;
  display: grid;
  grid-template-columns: repeat(${numCols}, 20px);
  grid-gap: 0px;
  margin-bottom: auto;
`;
const runButton = css`
  outline: none;
  height: 42px;
  border-radius: 21px;
  border: solid 1px dodgerblue;
  background-color: dodgerblue;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", "sans-serif";
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 500;
  color: white;
`;
