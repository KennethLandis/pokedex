'use strict'

function getGen1() {
    console.log('grabbing pokemon list');
    let pokeList = 'https://pokeapi.co/api/v2/pokemon/?limit=1'
    fetch(pokeList)
        .then(response => response.json())
        .then(responseJson => generateList(responseJson))    
};

function getPokemonInfo(currentPokemon) {
    //console.log(currentPokemon);
    console.log('getting Pokemon details')
    let pokeInfo = `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`;
    fetch(pokeInfo)
        .then(response => response.json())
        .then(responseJson => displayPokemonElement(responseJson));
};

function generateList(responseJson) {
    console.log('generating pokedex list');
    console.log(responseJson);
    for (let i = 0; i < responseJson.results.length; i ++) {
        console.log(responseJson.results[i].name);
        getPokemonInfo(responseJson.results[i].name);
    };
};

function generateListElement(currentPokemon) {
    return `<li> <img src="${currentPokemon.sprites.front_default}"/> <p>${currentPokemon.id}</p>
    <h3>${currentPokemon.name}</h3> <p>`
};

function displayPokemonElement(currentPokemon) {
    var pokeString = generateListElement(currentPokemon);
    $('.pokelist').html(pokeString);
};

function render() {
    console.log('rendering page');
    $(getGen1);
};

function filter() {
    console.log('filtering pokemon');
}

function handleClicked() {
    console.log('handling clicked pokemon');
};



function handlePokedex() {
    $(render);
    $(handleClicked);
    $(filter);
};

$(handlePokedex);