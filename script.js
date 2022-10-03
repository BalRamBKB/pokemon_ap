
function AppViewModel() {
    this.selectedPokemon = ko.observable();
    this.pokemons = ko.observableArray();
    this.selectedIndex = 0;
    this.handleCheckPokemonInfo = function(pokemon, index){
        var self = this;
        self.selectedPokemon(pokemon);
        self.selectedIndex=index;
    }
    this.handlePreviousSelection = function(data,event){
        console.log('prrevioo');
        event.preventDefault();
        var self = this;
        self.selectedIndex = self.selectedIndex > 0 ? self.selectedIndex -1 : self.selectedIndex;
        self.selectedPokemon(self.pokemons()[self.selectedIndex]);
    }

    this.handleNextSelection = function(data, event){
        event.preventDefault();
        var self = this;
        self.selectedIndex = self.selectedIndex < this.pokemons().length-1 ? self.selectedIndex+1:self.selectedIndex;
        self.selectedPokemon(self.pokemons()[self.selectedIndex]);
        
    }


   // api url
const api_url =
"https://pokeapi.co/api/v2/pokemon";

// Defining async function
var pokemonData = [];
var types = [];
var selectedTypeElements = [];
var selectedType =[];
this.getapi= async function(url) {
    var self = this;
// Storing response
const response = await fetch(url);
var data = await response.json();
console.log(data);
var urls = data.results;
Promise.all(urls.map(u => fetch(u.url))).then(responses =>
    Promise.all(responses.map(res => res.json()))
).then(texts => {
    console.log(texts);
    pokemonData = texts.map((pokemon, index) => {
        var _types = pokemon.types.map((type) => {
            return type.type.name;
        })
        types = types.concat(_types);
        return {
            'displayName': pokemon.name,
            'primaryImg': pokemon.sprites.other.dream_world.front_default,
            "types": _types,
            "info" : pokemon,
            "rank" : ('' + index++).padStart(3,0)
        }
    });

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


    types = types.filter(onlyUnique);
    console.log(types)
    self.pokemons(pokemonData);
    show(pokemonData);
})
}
this.getapi(api_url);


function show(pokemonData) {

console.log('typesssssssss', types)
let selectType = '';
for (let pokemonType of types) {
    if(selectedType.indexOf(pokemonType) > -1) {
        selectType += `
        <div class="form-check">
      <input onchange="handleTypeSelection()" type="checkbox" class="form-check-input" id="${pokemonType}" name="option1" value="${pokemonType}" checked/>
      <label class="form-check-label" for="${pokemonType}">${pokemonType}</label>
    </div>
        `;
    }else{
        selectType += `
        <div class="form-check">
      <input onchange="handleTypeSelection()" type="checkbox" class="form-check-input" id="${pokemonType}" name="option1" value="${pokemonType}"/>
      <label class="form-check-label" for="${pokemonType}">${pokemonType}</label>
    </div>
        `;
    }
   
}
document.getElementById("type").innerHTML = selectType;


}

// ==============================================================

async function handleTypeSelection() {
selectedTypeElements = document.querySelectorAll('#type .form-check-input:checked');

selectedType = [];
if(!selectedTypeElements.length){
    show(pokemonData);
    return;
}
for (let j = 0; j < selectedTypeElements.length; j++) {
    selectedType.push(selectedTypeElements[j].value);
}

let filterData = pokemonData.filter(function (pokemon) {
    let _types = pokemon.types;
    let match = false;
    for (var i = 0; i < _types.length; i++) {
        if (selectedType.indexOf(_types[i]) > -1) {
            match = true;
            break;
        }
    }
    return match === true;
})

show(filterData);

}

async function handleGenderSelection() {
var genders = document.querySelectorAll('#gender .form-check-input:checked');
var genderValue = [];
for (let i = 0; i < genders.length; i++) {
    genderValue.push(genders[i].value);
}
if (!genderValue.length) {
    show(pokemonData);
    return;
}
var getGenderUrl = [];
const response = await fetch('https://pokeapi.co/api/v2/gender');
var data = await response.json();
for (var i = 0; i < data.results.length; i++) {
    if (genderValue.indexOf(data.results[i].name) > -1) {
        getGenderUrl.push(data.results[i].url);
        break;
    }
}
Promise.all(getGenderUrl.map(u => fetch(u))).then(responses =>
    Promise.all(responses.map(res => res.json()))
).then(texts => {


    var pokemon_species_details = [];
    texts.forEach(function (genderResult) {
        genderResult.pokemon_species_details.forEach((pokemon) => {
            pokemon_species_details.push(pokemon.pokemon_species.name);
        })
    })
    var filterData = pokemonData.filter((pokemon) => {
        return pokemon_species_details.indexOf(pokemon.displayName) > -1;
    })

    console.log('filter', filterData);
    show(filterData);
})

}
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
