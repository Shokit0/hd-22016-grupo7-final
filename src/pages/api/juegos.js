
export async function GET({ url }) {
  const API_KEY = "bc17595ddec715af83ebb599e618a600a48ba27a";
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  // Construye URL absoluta para el fetch
  const apiUrl = new URL(
    `https://www.giantbomb.com/api/games/?api_key=${API_KEY}&format=json&filter=original_release_date:2025-06-05|2030-01-01&sort=original_release_date:asc&offset=${offset}`
  );

  const response = await fetch(apiUrl);
  const data = await response.json();
  
  const juegos = data.results.map(game => ({
    name: game.name || "Sin título",
    description: game.deck || "Descripción no disponible",
    image: game.image?.original_url || "/placeholder.jpg",
    price: Math.floor(Math.random() * 40) + 30,
    discount: [10, 15, 20][Math.floor(Math.random() * 3)] + "%",
    discountPrice: Math.floor(Math.random() * 30) + 20,
    rating: Math.floor(Math.random() * 3) + 3
  }));

  return new Response(JSON.stringify(juegos), {
    headers: { 'Content-Type': 'application/json' }
  });
}