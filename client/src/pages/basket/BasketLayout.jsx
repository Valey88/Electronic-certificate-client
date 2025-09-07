import React from "react";
import Basket from "./components/Basket";
import RightBar from "./components/RightBar";

export default function BasketLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col-reverse lg:flex-row justify-between gap-8">
        <Basket />
        <RightBar />
      </div>
    </div>
  );
}
