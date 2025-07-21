import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getByText } from "@testing-library/dom";

// Función para renderizar HTML en JSDOM
function render(html) {
  document.body.innerHTML = html;
  return {
    container: document.body,
    getByText: (text) => getByText(document.body, text),
  };
}

describe("Página Play Station", () => {
  it("debe mostrar el título principal", () => {
    const filePath = path.join(__dirname, "../src/pages/play-station.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { getByText } = render(html);

    expect(getByText("PlayStation Universe")).toBeTruthy();
  });

  it("debe mostrar la sección de categorías destacadas", () => {
    const filePath = path.join(__dirname, "../src/pages/play-station.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { getByText } = render(html);

    expect(getByText("Categorías Destacadas")).toBeTruthy();
  });

  it("debe mostrar al menos un botón Agregar", () => {
    const filePath = path.join(__dirname, "../src/pages/play-station.astro");
    const html = fs.readFileSync(filePath, "utf-8");
    const { container } = render(html);

    const buttons = Array.from(container.querySelectorAll("button")).filter(
      (btn) => btn.textContent.includes("Agregar")
    );
    expect(buttons.length).toBeGreaterThan(0);
  });
});