function render(content) {
  let pokemon = document.getElementById("pokemon");
  pokemon.innerHTML = content;
}

async function loadCard(id) {
  let response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`);

  let card = await response.json();

  return card.data;
}

async function loadList(pokemon) {
  let response = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=name:${pokemon}`
  );

  let list = await response.json();

  return list.data;
}

async function card(id) {
  let data = await loadCard(id);
  let html = `
        <h2>${data.name}</h2>
        <div>${data.hp} HP</div>
        <img src="${data.images.small}" />
    `;

  return html;
}
async function list(query) {
  let data = await loadList(query);
  if (data.length === 0) {
    return `no results for "${query}"`;
  }
  let html = `
    <ul>
        ${data.map(listItem).join("")}
    </ul>
  `;
  return html;
}

function listItem(data) {
  let html = `<li>
    <a href="?id=${data.id}">${data.id} - ${data.name}</a>
  </li> `;

  return html;
}

function updateSearch(query) {
  let input = document.getElementById("search");
  input.setAttribute("value", query);
}

(async function () {
  let params = new URLSearchParams(document.location.search);
  let pokemonName = params.get("name");
  let pokemonId = params.get("id");

  if (pokemonId) {
    render(await card(pokemonId));
  } else if (pokemonName) {
    updateSearch(pokemonName);
    render(await list(pokemonName));
  }
})();
