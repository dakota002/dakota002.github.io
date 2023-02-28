import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("does nothing", () => {
  render(<App />);
  const plainElement = screen.getByText(/Working on it/i);
  expect(plainElement).toBeInTheDocument();
});
