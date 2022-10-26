/** @format */

import { useState } from "react";
import { Home } from "./Home";
import { Projects } from "./Projects";
import { Resume } from "./Resume";
import { Blog } from "./Blog";

function renderSwitch(coolState) {
  switch (coolState) {
    case 3:
      return <Home />;
    case 0:
      return <Projects />;
    case 1:
      return <Resume />;
    case 2:
      return <Blog />;
  }
}

export function MenuBar({ currentState = 3 }) {
  const [coolState, setCoolState] = useState(currentState);
  console.log(currentState);
  return (
    <>
      <div className="bg-orange-300 flex flex-row">
        <div className=" bg-orange-300 basis-3/4 py-2 pl-4 ">
          <p className="">Clemson Grade Distributions, Visualized</p>
        </div>
        <div className=" bg-orange-300 basis-1/4">
          <div className="flex flex-row justify-end">
            <div>
              <button
                onClick={() => setCoolState(3)}
                className={
                  coolState === 3
                    ? "bg-purple-300 py-2 px-8"
                    : " hover:bg-purple-300 transition duration-300 ease-in-out py-2 px-8"
                }
              >
                Me
              </button>
            </div>
            <div>
              <button
                onClick={() => setCoolState(0)}
                className={
                  coolState === 0
                    ? "bg-purple-300 py-2 px-8"
                    : " hover:bg-purple-300 transition duration-300 ease-in-out py-2 px-8"
                }
              >
                When
              </button>
            </div>
            <div>
              <button
                onClick={() => setCoolState(1)}
                className={
                  coolState === 1
                    ? "bg-purple-300 py-2 px-8"
                    : " hover:bg-purple-300 transition duration-300 ease-in-out py-2 px-8"
                }
              >
                Button
              </button>
            </div>
            <div>
              <button
                onClick={() => setCoolState(2)}
                className={
                  coolState === 2
                    ? "bg-purple-300 py-2 px-8"
                    : " hover:bg-purple-300 transition duration-300 ease-in-out py-2 px-8"
                }
              >
                Button
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderSwitch(coolState)}
    </>
  );
}
