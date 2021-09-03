import React from "react";
import { BsArrowRepeat } from "react-icons/bs";
import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="Spinner">
      <BsArrowRepeat className="spinning" />
    </div>
  );
}
