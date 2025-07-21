// tests/xbox.test.js
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from "vitest";
import { fireEvent, getByText } from "@testing-library/dom";
import { readFileSync } from 'fs'; 

const mockHtmlPath = './src/pages/xbox/mock-xbox-page.astro'; 

// Variable para almacenar el HTML leído
let mockXboxRenderedHtml;

describe("Página de Xbox (xbox.astro)", () => {
  let originalLocationSearch;
  let originalLocationHref;
  let applyFiltersButton;
  let minPriceInput;
  let maxPriceInput;
  let priceRange;

  // Leer el HTML una sola vez antes de que todos los tests se ejecuten
  beforeAll(() => {
    try {
        // La ruta es relativa al directorio de ejecución, que suele ser la raíz del proyecto
        mockXboxRenderedHtml = readFileSync(mockHtmlPath, 'utf8');
    } catch (error) {
        console.error("Error al leer el archivo HTML mockeado:", error);
        throw new Error("No se pudo cargar el HTML mockeado para los tests.");
    }
  });

  beforeEach(() => {
    // Guarda los valores originales de window.location para restaurarlos después
    originalLocationSearch = window.location.search;
    originalLocationHref = window.location.href;

    // Mockea window.location para que Vitest pueda simular cambios en la URL
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      search: originalLocationSearch,
      href: 'http://localhost:3000/',
      set search(value) {
        this._search = value;
      },
      get search() {
        return this._search;
      },
      _search: originalLocationSearch
    });

    // Carga el HTML mockeado en el cuerpo del documento JSDOM.
    document.body.innerHTML = mockXboxRenderedHtml;

    // --- Obtener elementos y adjuntar listeners aquí (excepto toggleButton, que va en su test) ---
    applyFiltersButton = document.getElementById("apply-filters-button");
    minPriceInput = document.getElementById('min-price');
    maxPriceInput = document.getElementById('max-price');
    priceRange = document.getElementById('price-range');

    // Función applyFiltersHandler
    const applyFiltersHandler = function() {
        const newSearchParams = new URLSearchParams();
        const typeCheckboxes = document.querySelectorAll('input[name="type"]:checked');
        const selectedTypes = Array.from(typeCheckboxes).map(cb => cb.value);
        if (selectedTypes.length > 0) {
            newSearchParams.set("type", selectedTypes.join(","));
        }
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
        if (selectedCategories.length > 0) {
            newSearchParams.set("category", selectedCategories.join(","));
        }
        
        if (minPriceInput && maxPriceInput) {
            const minPrice = minPriceInput.value;
            const maxPrice = maxPriceInput.value;
            if (minPrice !== "0") {
                newSearchParams.set("minPrice", minPrice);
            }
            if (maxPrice !== "100") {
                newSearchParams.set("maxPrice", maxPrice);
            }
        }
        
        newSearchParams.set("page", "1");
        window.location.search = newSearchParams.toString();
    };

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFiltersHandler);
    }

    // Lógica de sincronización de precios
    if (minPriceInput && maxPriceInput && priceRange) {
        maxPriceInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
                priceRange.value = val.toString(); 
            }
        });

        priceRange.addEventListener('input', (e) => {
            maxPriceInput.value = e.target.value;
        });
    }

    // Lógica del botón de favoritos (delegación de eventos)
    if (!window.__xboxGameCardClickListenerRegistered) {
        window.__xboxGameCardClickListenerRegistered = true;
        document.addEventListener("click", function (e) {
            const button = e.target.closest("button.favorite-btn");
            if (!button) return;
            e.stopPropagation();
            e.preventDefault();
            const id = button.getAttribute("data-id");
            const icon = document.getElementById("icon-" + id);
            if (!icon) return;
            if (icon.classList.contains("text-gray-400")) {
                icon.classList.remove("text-gray-400");
                icon.classList.add("text-red-500");
            } else {
                icon.classList.remove("text-red-500");
                icon.classList.add("text-gray-400");
            }
        });
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'location', {
        writable: true,
        value: {
            ...window.location,
            search: originalLocationSearch,
            href: originalLocationHref
        }
    });
    window.__xboxGameCardClickListenerRegistered = false; 
  });

  // --- Tests de la página de Xbox ---

  it("debe renderizar el título correcto de la página", () => {
    expect(document.title).toBe("G2A - Xbox");
  });

  it("debe contener las secciones principales de filtros y contenido", () => {
    expect(document.body.querySelector("aside")).toBeTruthy();
    expect(document.body.querySelector("main")).toBeTruthy();
    expect(getByText(document.body, "Tipo")).toBeTruthy(); 
    expect(getByText(document.body, "Categorías")).toBeTruthy();
    expect(getByText(document.body, "Precio")).toBeTruthy();
  });

  it("el botón 'Mostrar más' debe alternar la visibilidad de las categorías extra", () => {
    const toggleButton = document.getElementById("toggle-categories-button");
    const extraCategories = document.querySelectorAll(".extra-category");
    
    expect(toggleButton).toBeTruthy(); 

    const toggleCategoriesHandler = function() {
        const extras = document.querySelectorAll(".extra-category");
        extras.forEach((el) => el.classList.toggle("hidden"));

        const currentToggleButton = document.getElementById("toggle-categories-button");

        if (currentToggleButton && typeof currentToggleButton.textContent === 'string') {
            if (currentToggleButton.textContent.trim() === "Mostrar más") {
                currentToggleButton.textContent = "Mostrar menos";
            } else {
                currentToggleButton.textContent = "Mostrar más";
            }
        } else {
            console.error("Error dentro del handler: currentToggleButton es nulo/indefinido o textContent no es una cadena!", currentToggleButton);
        }
    };

    toggleButton.addEventListener('click', toggleCategoriesHandler);

    extraCategories.forEach(cat => expect(cat.classList.contains("hidden")).toBe(true));
    expect(toggleButton.textContent.trim()).toBe("Mostrar más"); 

    fireEvent.click(toggleButton);

    extraCategories.forEach(cat => expect(cat.classList.contains("hidden")).toBe(false));
    expect(toggleButton.textContent.trim()).toBe("Mostrar menos"); 

    fireEvent.click(toggleButton);

    extraCategories.forEach(cat => expect(cat.classList.contains("hidden")).toBe(true));
    expect(toggleButton.textContent.trim()).toBe("Mostrar más"); 
  });

  it("el botón 'Aplicar Filtros' debe construir la URL de búsqueda correctamente", () => {
    const claveCheckbox = document.querySelector('input[name="type"][value="Clave"]');
    const rolCheckbox = document.querySelector('input[name="category"][value="Rol"]');

    fireEvent.click(claveCheckbox);
    fireEvent.click(rolCheckbox);
    fireEvent.change(minPriceInput, { target: { value: "10" } });
    fireEvent.change(maxPriceInput, { target: { value: "90" } });

    fireEvent.click(applyFiltersButton);

    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get("type")).toBe("Clave");
    expect(searchParams.get("category")).toBe("Rol");
    expect(searchParams.get("minPrice")).toBe("10");
    expect(searchParams.get("maxPrice")).toBe("90");
    expect(searchParams.get("page")).toBe("1");
  });

  it("el botón de favoritos debe cambiar su color al hacer clic", () => {
    const favoriteButton = document.querySelector('button.favorite-btn[data-id="baldurs-gate-3"]');
    const favoriteIcon = document.getElementById("icon-baldurs-gate-3");

    expect(favoriteButton).toBeTruthy();
    expect(favoriteIcon).toBeTruthy();

    expect(favoriteIcon.classList.contains("text-gray-400")).toBe(true);
    expect(favoriteIcon.classList.contains("text-red-500")).toBe(false);

    fireEvent.click(favoriteButton);
    expect(favoriteIcon.classList.contains("text-gray-400")).toBe(false);
    expect(favoriteIcon.classList.contains("text-red-500")).toBe(true);

    fireEvent.click(favoriteButton);
    expect(favoriteIcon.classList.contains("text-gray-400")).toBe(true);
    expect(favoriteIcon.classList.contains("text-red-500")).toBe(false);
  });

  it("el clic en el botón de favoritos no debe propagarse a la tarjeta de juego", () => {
    const favoriteButton = document.querySelector('button.favorite-btn[data-id="baldurs-gate-3"]');
    const gameCardLink = document.querySelector('a[href="/xbox/baldurs-gate-3"]');

    expect(favoriteButton).toBeTruthy();
    expect(gameCardLink).toBeTruthy();

    const linkClickSpy = vi.spyOn(gameCardLink, 'click');

    fireEvent.click(favoriteButton);

    expect(linkClickSpy).not.toHaveBeenCalled();

    linkClickSpy.mockRestore();
  });

  it("el input max-price y el slider de rango deben sincronizarse", () => {
    expect(minPriceInput).toBeTruthy();
    expect(maxPriceInput).toBeTruthy();
    expect(priceRange).toBeTruthy();

    fireEvent.input(maxPriceInput, { target: { value: "75" } });
    expect(priceRange.value).toBe("75");

    fireEvent.input(priceRange, { target: { value: "50" } });
    expect(maxPriceInput.value).toBe("50");
  });
});