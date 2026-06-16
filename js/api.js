const API_URL = "https://pokeapi.co/api/v2/pokemon/";

// Cache para evitar pedidos repetidos à API
const cache = {};

async function obterPokemon(id) {
  // Verifica se o Pokémon já está em cache
  if (cache[id]) return cache[id];

  const res = await fetch(API_URL + id);

  if (!res.ok) {
    throw new Error("Erro API");
  }

  const data = await res.json();

  // Guarda o Pokémon em cache
  cache[id] = data;

  return data;
}

async function obterPokemonAleatorio(max = 151) {
  // Gera um ID aleatório
  const id = Math.floor(Math.random() * max) + 1;

  return await obterPokemon(id);
}
