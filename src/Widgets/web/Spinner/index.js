import React from "react";

export default function Spinner({ size = "sm", color = "primary" }) {
  return <span className={`spinner spinner--${color} spinner--${size}`}></span>;
}
