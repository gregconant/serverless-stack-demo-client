import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "./Spinner";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
    >
      {isLoading && <Spinner />}
      {props.children}
    </Button>
  );
}
