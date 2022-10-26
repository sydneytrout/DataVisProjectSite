/** @format */

import { useState } from "react";
import { Link } from "react-router-dom";

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
      {/* {renderSwitch(coolState)} */}
    </>
  );
}
