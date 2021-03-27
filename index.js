'use strict'

// Gather the Pokemon from the first Generation with api call to pokeapi

async function getGen1() {
    console.log('grabbing pokemon list');
    const promises = [];
    for (let i = 1; i < 152; i++) {
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
    return `<li class='icon'><img src="${currentPokemon.picture}"/> <h2>${currentPokemon.id}</h2> <h3><a href="#">${currentPokemon.name}</a></h3>
    <p>Types: ${currentPokemon.types}</p></li>`
}

//Function for Pushing html elements into the pokelist section in the DOM for displaying Icons

function generatePokedexPage(pokemon) {
    for (let i = 0; i < pokemon.length; i++) {
        let pokeString = generateIconHtml(pokemon[i]);
        $('.pokelist').append(pokeString);
    }
}

// Function to generate the page in the Dom for user

async function render() {
    var pokemon = await getGen1();
    generatePokedexPage(pokemon);
    filterName();
    filterType();
};

//function to handle filtering out pokemon that do not fit into search criteria
//This is accomplished by gathering Elements from the doc and looping through list
// to then show or hide items that fit or do not fit the search query.

function filterName() {
        // Declare variables
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('species');
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName('li');
        
      
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
          a = li[i].getElementsByTagName("a")[0];
          txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
          } else {
            li[i].style.display = "none";
          }
        }
};

//Same function as above with a new form targetting elements in the list by <p>
function filterType() {
        // Declare variables
        var input, filter, ul, li, p, i, txtValue;
        input = document.getElementById('type');
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName('li');
            
          
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            p = li[i].getElementsByTagName("p")[0];
            txtValue = p.textContent || p.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            } else {
            li[i].style.display = "none";
            }
        }
};

//function to handle clicking on pokemon icon for more information
function handleClicked() {
    console.log('handling clicked pokemon');
};



function handlePokedex() {
    $(render);
    $(handleClicked);
};

$(handlePokedex);