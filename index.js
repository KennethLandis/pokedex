'use strict'

// Gather the Pokemon from the first Generation with api call to pokeapi

async function getGen1() {
    //console.log('grabbing pokemon list');
    const promises = [];
    for (let i = 1; i < 152; i++) {
        let pokeList = `https://pokeapi.co/api/v2/pokemon/${i}`
        promises.push(fetch(pokeList).then(res => res.json()));
    }
    let results = await Promise.all(promises);
    const pokemonList = pokemonIconFormat(results);
    return pokemonList;
};

// calling pokeapi to get more details on the pokemon individually from the pokeapi

async function getPokemonInfo(currentPokemon) {
    let modalPromise = [];
    //console.log('getting Pokemon details')
    let pokeInfo = `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`;
    modalPromise.push(fetch(pokeInfo).then(res => res.json()));
    let results = await Promise.all(modalPromise);
    let modalPoke = await pokemonModalFormat(results);
    return modalPoke;
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

function pokemonModalFormat(pokeData) {
    var pokemonInfo = pokeData.map(result => {
        let pokemon = {}
        pokemon['name'] = result.name
        pokemon['id'] = result.id
        pokemon['types'] = result.types.map(type => type.type.name).join(', ')
        pokemon['stats'] = result.stats.map(stat => stat.stat.name + ':' + stat.base_stat).join(', ')
        pokemon['height'] = result.height
        pokemon['weight'] = result.weight
        return pokemon;
    });
    return pokemonInfo[0];  
}

//Generates HTML String for displaying pokedex base Icon

function generateIconHtml(currentPokemon) {
    return `<li class='icon'><img class ="icon-img" src="${currentPokemon.picture}"/> 
                <h3>${currentPokemon.id}  <button class="pokeName" value ="${currentPokemon.name}">${currentPokemon.name}</button></h3>
                <p>Types: ${currentPokemon.types}</p></li>`
};

//Generate HTML String for Modal Pokemon information
function generateModalHtml(currentPokemon) {
    return `<div class="modal-header">
    <span id="mySpan" class="close">&times;</span>
    <h2>${currentPokemon.name}</h2>
  </div>
  <div class="modal-body container">
    <img class="img-responsive" src="https://pokeres.bastionbot.org/images/pokemon/${currentPokemon.id}.png" height="200" width = "200"/>
    <p>Pokemon Types: ${currentPokemon.types}</p>
    <p>Pokemon stats: ${currentPokemon.stats}</p>
    <p>Pokemon Height: ${currentPokemon.height}</p>
    <p>Pokemon Weight: ${currentPokemon.weight}</p>
  </div>`
};

//Function for Pushing html elements into the pokelist section in the DOM for displaying Icons

function generatePokedexPage(pokemon) {
    for (let i = 0; i < pokemon.length; i++) {
        let pokeString = generateIconHtml(pokemon[i]);
        $('.pokelist').append(pokeString);
    }
};

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
          a = li[i].getElementsByTagName("button")[0];
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
//display the information in a Modal

function handleClicked() {
    var modal = document.getElementById("myModal");
    var btn = document.getElementById('pokeName');

    //Gather Target Pokemon Name and make api call to get more information
    $('.pokelist').on('click', '.pokeName', async function() {
        var tempPoke = $(this).closest('button').val();
        modal.style.display = "block";
        let pokeData = await getPokemonInfo(tempPoke);
        let pokeModalString = generateModalHtml(pokeData);
        $('.modal-content').html(pokeModalString)
    });

    $('.modal-content').on('click', '#mySpan', function() {
        modal.style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};



function handlePokedex() {
    $(render);
    $(handleClicked);
};

$(handlePokedex);
