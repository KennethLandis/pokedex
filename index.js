'use strict'

// Gather the Pokemon from the first Generation with api call to pokeapi

async function getGen1() {
    console.log('grabbing pokemon list');
    const promises = [];
    for (let i = 1; i < 40; i++) {
        let pokeList = `https://pokeapi.co/api/v2/pokemon/${i}`
        promises.push(fetch(pokeList).then(res => res.json()));
    }
    const results = await Promise.all(promises);
    const pokemonList = pokemonIconFormat(results);
    return pokemonList;
};

// calling pokeapi to get more details on the pokemon individually from the pokeapi

function getPokemonInfo(currentPokemon) {
    console.log('getting Pokemon details')
    let pokeInfo = `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`;
    fetch(pokeInfo)
        .then(response => response.json())
        .then(responseJson => console.log(responseJson));
};

// Format the information on the Pokemon we got from the api into the values we need for Icons

function pokemonIconFormat(results) {
    var pokemonList = results.map(result => {
        let pokemon = {}
        pokemon['name'] = result.name
        pokemon['id'] = result.id
        pokemon['picture'] = result.sprites.front_default
        pokemon['types'] = result.types.map(type => type.type.name).join(', ')
        return pokemon;
    });
    return pokemonList
};

//Generates HTML String for displaying pokedex base Icon
function generateIconHtml(currentPokemon) {
    console.log(currentPokemon);
    console.log('generating string');
    return `<li> <img src="${currentPokemon.picture}"/> <h2>${currentPokemon.id}. ${currentPokemon.name}</h2>
    <p>Types: ${currentPokemon.types}<p> </li>`
}

//Function for Pushing html elements into the pokelist section in the DOM for displaying Icons
function generatePokedexPage(pokemon) {
    for (let i = 0; i < pokemon.length; i++) {
        let pokeString = generateIconHtml(pokemon[i]);
        console.log(pokeString);
        $('.pokelist').append(pokeString);
    }
}
   
async function render() {
    var pokemon = await getGen1();
    generatePokedexPage(pokemon);
};

function filter() {
    console.log('filtering pokemon');
};

function handleClicked() {
    console.log('handling clicked pokemon');
};



function handlePokedex() {
    $(render);
    $(handleClicked);
    $(filter);
};

$(handlePokedex);