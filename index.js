let dropdown1 = document.querySelector('#dropdown1');
let dropdown2 = document.querySelector('#dropdown2');
let compareBtn = document.querySelector('#compareBtn');
let main = document.querySelector('main');


class Pokemon {
    constructor(name, imgURL, types, weight, height, stats){ //stats är en array
        this.name = name;
        this.imgURL = imgURL;
        this.types = types;
        this.weight = weight;
        this.height = height;
        this.stats = {
           hp: stats[0],
           attack: stats[1],
           defense: stats[2],
           specialAttack: stats[3],
           specialDefense: stats[4],
           speed: stats[5]
        }
    }

    static comparePokemons = (instance1, instance2) => {
        console.log('testing comparePokemons')

        let counter1 = 0; //dessa räknar vunna kategorier
        let counter2 = 0;

        let compareTraits = (trait1, trait2, className, tagType) => {
            //console.log(trait1,trait2);
            if(trait1 > trait2){
                counter1 +=1;
                //göra den texten röd i domen  
                let textToUnderline = document.querySelector(`div.pokeContainer:nth-child(1) ${tagType}.${className}`) ; // problem: denna väljer p taggar, men ibland är det ju li taggar som behövs, när man ska välja stats.
                console.log(textToUnderline);
                textToUnderline.classList.add('winnerStat');
            } else if(trait1 < trait2){
                counter2 +=1;
                //göra den texten röd i domen  
                let textToUnderline = document.querySelector(`div.pokeContainer:nth-child(2) ${tagType}.${className}`) ;
                console.log(textToUnderline);
                textToUnderline.classList.add('winnerStat');
            } else {
                console.log('they are equal')
            }
        }

        compareTraits(instance1.weight, instance2.weight, 'weight', 'p');
        compareTraits(instance1.height, instance2.height, 'height', 'p');
        compareTraits(instance1.stats.hp.base_stat, instance2.stats.hp.base_stat, 'hp', 'li'); //uppkommer problem här pga 
        compareTraits(instance1.stats.attack.base_stat, instance2.stats.attack.base_stat, 'attack', 'li');
        compareTraits(instance1.stats.defense.base_stat, instance2.stats.defense.base_stat, 'defense' , 'li'); 
        compareTraits(instance1.stats.specialAttack.base_stat, instance2.stats.specialAttack.base_stat, 'specialAttack', 'li' );
        compareTraits(instance1.stats.specialDefense.base_stat, instance2.stats.specialDefense.base_stat , 'specialDefense', 'li');
        compareTraits(instance1.stats.speed.base_stat, instance2.stats.speed.base_stat, 'speed', 'li');

        // // ta dessa två pokes, och jämför deras traits

        // if(instance1.weight > instance2.weight){
        //     counter1 +=1;
        //     //göra den texten röd i domen   
        // } else if(instance1.weight < instance2.weight) {
        //     counter2 +=1;
        // } else {
        //     console.log('they are equal weight')
        // }

        console.log(counter1 + " and " + counter2);

        if (counter1 > counter2){
             console.log(instance1.name + ' wins!')
        } else if (counter1 < counter2) {
            console.log(instance2.name + ' wins!')
        }

    }
    
};


let getData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
};

//skriva ut alla pokemons i drowndownen

//göra en fetch som hämtar en array med alla karaktärerna

let pokeIntoDropdowns = async () => { //wrappar bara för att få async
    let allPokemons = await getData('https://pokeapi.co/api/v2/pokemon?limit=151');

    //en forEach här
    let renderDropdown = (dropdownId) => {
        allPokemons.results.forEach((pokemon) => {
            //skapa nytt option
            let newOption = document.createElement('option');
            newOption.innerText = pokemon.name;
            newOption.value = pokemon.url;
            //hitta rätt url här?

            //lägg till i dropdown
            dropdownId.append(newOption);
        })
    }

    renderDropdown(dropdown1);
    renderDropdown(dropdown2);

}
pokeIntoDropdowns();



compareBtn.addEventListener('click', async () => {
    console.log('eventlistener körs');

    //hämta valda dropdown knapparna, och deras url gör till variabel som kan användas senare. 

    let selectedPokeURL1 = dropdown1.value; //detta är url
    console.log('Selected Pokemon 1 is: ' + selectedPokeURL1);

    let selectedPokeURL2 = dropdown2.value; 
    console.log('Selected Pokemon 2 is: ' + selectedPokeURL2);


    //göra en fetch och hämta de aktuella pokemonsen mha url, skapar promises
    let selectedPokeObject1 = getData(selectedPokeURL1);
    let selectedPokeObject2 = getData(selectedPokeURL2);
    
    // wrappa i ett promise all block, kör promises
    Promise.all([selectedPokeObject1, selectedPokeObject2]).then((pokemons) => {
        console.log(pokemons);
        let instanceArray = []; //denna array används senare för att jämföra pokemons

        //tömma main
        main.innerHTML = " ";

        pokemons.forEach( async (pokemon) => { //renderar ut resultatet av promisesna
                
            //skapa instans av klassen Pokemon
            let pokemonInstance = new Pokemon(pokemon.name, undefined , pokemon.types , pokemon. weight, pokemon.height, pokemon.stats); // lös bilden senare
            console.log(pokemonInstance);

            //lägg instansen av klassen i en array som senare ska användas för att jämföra dem
            instanceArray.push(pokemonInstance);
            
            //här nånstans bör jämförelsen ligga!!

            //skriv ut rätt info
            let pokeContainer = document.createElement('div');
            pokeContainer.classList.add('pokeContainer')

            //hämta bild

            // let imageData = await getData(pokemonInstance.imgURL);
            // let image = imageData;
            let imageURL = pokemon.sprites.other.dream_world.front_default;

            let image = document.createElement('img');
            image.classList.add('pokeSprite');
            image.src = imageURL;

            

            console.log('image');










            //namn
            let pokeName = document.createElement('h4');
            pokeName.innerText = pokemonInstance.name.charAt(0).toUpperCase() + pokemon.name.slice(1);;

            //types
            let pokeTypes = document.createElement('p');

            if(/*om det finns mer än en typ */ pokemonInstance.types[1]){
                pokeTypes.innerHTML = '<b>Types: </b>' + pokemonInstance.types[0].type.name + ' and '+ pokemonInstance.types[1].type.name; 
            } else {
                pokeTypes.innerText = 'Types: ' + pokemonInstance.types[0].type.name;
            };

            //weight
            let pokeWeight = document.createElement('p');
            pokeWeight.classList.add('weight');
            pokeWeight.innerHTML = '<b>Weight: </b>' + pokemonInstance.weight + ' hg';

            //height
            let pokeHeight = document.createElement('p');
            pokeHeight.classList.add('height');
            pokeHeight.innerHTML = '<b>Height: </b>' + pokemonInstance.height + ' x 10 cm';

            //stats
            let statHeading = document.createElement('p');
            statHeading.innerHTML = '<b>Stats: </b>';
            let statList = document.createElement('ul');
            statList.innerHTML = `
                <li class = 'hp'> HP: ${pokemonInstance.stats.hp.base_stat} </li>
                <li class = 'attack'> Attack: ${pokemonInstance.stats.attack.base_stat} </li>
                <li class = 'defense'> Defense: ${pokemonInstance.stats.defense.base_stat} </li>
                <li class = 'specialAttack'> Special attack: ${pokemonInstance.stats.specialAttack.base_stat} </li>
                <li class = 'specialDefense'> Special defense: ${pokemonInstance.stats.specialDefense.base_stat} </li>
                <li class = 'speed'> Speed: ${pokemonInstance.stats.speed.base_stat} </li>
            `;


            //sätt ihop
            pokeContainer.append(image);
            pokeContainer.append(pokeName);
            pokeContainer.append(pokeTypes);
            pokeContainer.append(pokeWeight);
            pokeContainer.append(pokeHeight);
            pokeContainer.append(statHeading);
            pokeContainer.append(statList);
            main.append(pokeContainer);
        }); // här slutar forEach, som skapar instanser och renderar ut dem


        //Jämföra pokemon instanser
        console.log(instanceArray);

        console.log(instanceArray[0]);
        //kör comparePokemons från Pokemon klassen
        Pokemon.comparePokemons(instanceArray[0], instanceArray[1]); 


    }); // här slutar .then som följt promise.all

   



   

});
