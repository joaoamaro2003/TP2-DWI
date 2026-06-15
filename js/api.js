const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const cache = {};

async function obterPokemon(id) {
  if (cache[id]) return cache[id];

  const res = await fetch(API_URL + id);
  if (!res.ok) throw new Error("Erro API");

  const data = await res.json();
  cache[id] = data;

  return data;
}

async function obterPokemonAleatorio(max = 151) {
  const id = Math.floor(Math.random() * max) + 1;
  return await obterPokemon(id);
}
