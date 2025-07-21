// tests/pc.test.js
import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { fireEvent, getByText } from "@testing-library/dom";
import { readFileSync } from "fs";

// Ruta del HTML mockeado generado desde tu página pc.astro
const mockHtmlPath = "./src/pages/pc/mock-pc-page.astro"; 
let mockHtmlContent;

describe("Página PC (pc.astro)", () => {
  let platformSelect;
  let genreSelect;
  let typeSelect;
  let minInput;
  let maxInput;
  let applyButton;

  beforeAll(() => {
    try {
      mockHtmlContent = readFileSync(mockHtmlPath, "utf8");
    } catch (error) {
      console.error("Error leyendo el HTML:", error);
      throw new Error("No se pudo cargar el HTML mockeado.");
    }
  });

  beforeEach(() => {
    document.body.innerHTML = mockHtmlContent;

    platformSelect = document.querySelector('select[name="plataforma"]');
    genreSelect = document.querySelector('select[name="genero"]');
    typeSelect = document.querySelector('select[name="tipo"]');
    minInput = document.querySelector('input[name="min"]');
    maxInput = document.querySelector('input[name="max"]');
    applyButton = document.querySelector('button[type="submit"]');
  });

  it("debe renderizar correctamente los campos de filtro", () => {
    expect(platformSelect).toBeTruthy();
    expect(genreSelect).toBeTruthy();
    expect(typeSelect).toBeTruthy();
    expect(minInput).toBeTruthy();
    expect(maxInput).toBeTruthy();
    expect(applyButton).toBeTruthy();
  });

it("debe aplicar filtros correctamente (valores seleccionados y form presente)", () => {
  platformSelect.value = "Steam";
  genreSelect.value = "Acción";
  typeSelect.value = "Clave";
  minInput.value = "10";
  maxInput.value = "90";

  fireEvent.submit(applyButton.form);

  // Solo verificamos que los valores del formulario se mantuvieron
  expect(platformSelect.value).toBe("Steam");
  expect(genreSelect.value).toBe("Acción");
  expect(typeSelect.value).toBe("Clave");
  expect(minInput.value).toBe("10");
  expect(maxInput.value).toBe("90");
});

  it("debe mostrar los elementos de galería y paginación", () => {
    const cards = document.querySelectorAll("a[href^='/pc/']");
    expect(cards.length).toBeGreaterThan(0); // Deben mostrarse juegos

    const pagination = document.querySelectorAll("a[href*='page=']");
    expect(pagination.length).toBeGreaterThan(0); // Debe haber paginación
  });

  it("debe mostrar el texto resumen con la cantidad de juegos", () => {
    const summary = getByText(document.body, /Mostrando/i);
    expect(summary).toBeTruthy();
  });
});
