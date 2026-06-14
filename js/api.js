const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const cachePokemon = {};

async function obterPokemon(id) {
  if (cachePokemon[id]) {
    return cachePokemon[id];
  }

  const resposta = await fetch(API_URL + id);

  if (!resposta.ok) {
    throw new Error("Erro ao obter Pokémon");
  }

  const pokemon = await resposta.json();

  cachePokemon[id] = pokemon;

  return pokemon;
}

async function obterPokemonAleatorio(max = 151) {
  const id = Math.floor(Math.random() * max) + 1;
  return await obterPokemon(id);
}
