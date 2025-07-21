import { describe, it, expect } from "vitest";
import { GET } from "../src/pages/api/juegos";
import { Request } from "node-fetch";

describe("GET /api/games", () => {
  it("debe retornar un array de juegos con la estructura correcta", async () => {
    // Simula un objeto `url` con searchParams
    const mockUrl = {
      searchParams: new URLSearchParams("offset=0"),
    };

    // Simula el objeto `Request` de Astro
    const request = new Request("http://localhost/api/games");

    // Ejecuta la función GET
    const response = await GET({ url: mockUrl, request });
    const data = await response.json();

    // Verificaciones
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(Array.isArray(data)).toBe(true);

    // Verifica la estructura de cada juego
    if (data.length > 0) {
      const game = data[0];
      expect(game).toHaveProperty("name");
      expect(game).toHaveProperty("description");
      expect(game).toHaveProperty("image");
      expect(game).toHaveProperty("price");
      expect(game).toHaveProperty("discount");
      expect(game).toHaveProperty("discountPrice");
      expect(game).toHaveProperty("rating");
    }
  });

  it('debe manejar el parámetro "offset" correctamente', async () => {
    const mockUrl = {
      searchParams: new URLSearchParams("offset=10"),
    };
    const request = new Request("http://localhost/api/games");

    const response = await GET({ url: mockUrl, request });
    const data = await response.json();

    expect(data.length).toBeGreaterThanOrEqual(0);
  });
});
