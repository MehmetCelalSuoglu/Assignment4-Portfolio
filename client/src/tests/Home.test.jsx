import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";

describe("App component", () => {
  it("renders the hero title on the home page", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Welcome to My Portfolio/i)
    ).toBeInTheDocument();
  });
});
