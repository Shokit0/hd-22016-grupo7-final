import { describe, it, expect } from "vitest";
import {
  getByTestId,
  getByText,
  getByRole,
  queryAllByRole,
} from "@testing-library/dom";
import fs from "fs";
import path from "path";

function render(html) {
  document.body.innerHTML = html;
  return {
    container: document.body,
    getByTestId: (id) => getByTestId(document.body, id),
    getByText: (text) => getByText(document.body, text),
    getByRole: (...args) => getByRole(document.body, ...args),
    queryAllByRole: (...args) => queryAllByRole(document.body, ...args),
  };
}

describe("Página principal (index.astro)", () => {
  it("debe renderizar el componente <CarouselHome />", async () => {
    const filePath = path.join(__dirname, "../src/pages/index.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { getByTestId } = render(html);
    expect(getByTestId("carousel-home"));
  });

  it("debe renderizar el componente <NextGames />", async () => {
    const filePath = path.join(__dirname, "../src/pages/index.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { getByText } = render(html);
    expect(getByText("Próximos lanzamientos"));
  });

  it("debe renderizar el componente <CategoriasPlataformas />", async () => {
    const filePath = path.join(__dirname, "../src/pages/index.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { getByText } = render(html);
    expect(getByText("Juegos por Plataformas"));
  });

  it("debe contener un elemento <main>", async () => {
    const filePath = path.join(__dirname, "../src/pages/index.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { container } = render(html);
    expect(container.querySelector("main"));
  });

  it("debe contener al menos un enlace de navegación", async () => {
    const filePath = path.join(__dirname, "../src/pages/index.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { container } = render(html);
    expect(container.querySelectorAll("a").length);
  });
});
