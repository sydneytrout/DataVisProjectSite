/** @format */
import { MenuBar } from "./Menubar";
export function Home() {
  return (
    <>
      <div className="flex justify-center content-center pt-24 py-6">
        <div className="bg-stone-100 border-4 border-stone-100 content-center w-9/12 rounded-lg shadow-lg py-12 px-24">
          <h1 className="text-3xl flex content-start ">Project Description</h1>
          <br />
          <p className="">
            Visualization of Clemson University's grade distributions for the
            past 10 years. This project was created using React, D3, and
            TailwindCSS. {"<-"} that was written by an AI
          </p>
        </div>
      </div>
    </>
  );
}
