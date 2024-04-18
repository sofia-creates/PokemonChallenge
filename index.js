let dropdown1 = document.querySelector('#dropdown1');
let dropdown2 = document.querySelector('#dropdown2');
let compareBtn = document.querySelector('#compareBtn');
let main = document.querySelector('main');
let battleArena = document.querySelector('#battleArena');


class Pokemon {
    constructor(name, imgURL, types, weight, height, stats, moves){ //stats är en array
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
        this.moves = moves;
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
                let textToUnderline = document.querySelector(`div.pokeContainer:nth-child(1) ${tagType}.${className}`) ; 
                console.log(textToUnderline);
                textToUnderline.classList.add('winnerStat');
            } else if(trait1 < trait2){
                counter2 +=1;
                //göra den texten understruken i domen  
                let textToUnderline = document.querySelector(`div.pokeContainer:nth-child(2) ${tagType}.${className}`) ;
                console.log(textToUnderline);
                textToUnderline.classList.add('winnerStat');
            } else {
                console.log('they are equal')
            }
        }

        compareTraits(instance1.weight, instance2.weight, 'weight', 'p');
        compareTraits(instance1.height, instance2.height, 'height', 'p');
        compareTraits(instance1.stats.hp.base_stat, instance2.stats.hp.base_stat, 'hp', 'li'); 
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

    } //slut på comparePokemons

    //battle
    static battle = async (instance1, instance2) => {
        //välja den snabbaste pokemonen till att börja attackera
        console.log('battle is run');
        //skapa plats i domen för att skriva ut
        let attackPoke;
        let defendingPoke;
        let poke1Speed = JSON.stringify(instance1.stats.speed.base_stat);
        let poke2Speed = JSON.stringify(instance2.stats.speed.base_stat);
        console.log(`Pokemon nr 1 has the speed: ${poke1Speed}  and pokemon 2 has: ${poke2Speed}`)
        if(poke1Speed > poke2Speed){
            attackPoke = instance1;
            defendingPoke = instance2;
            console.log(`attacking poke is: ${JSON.stringify(attackPoke.name)} and defending poke is: ${JSON.stringify(defendingPoke.name)}`);
        } else if (poke1Speed < poke2Speed){
            attackPoke = instance2;
            defendingPoke = instance1;
            console.log(`attacking poke is: ${JSON.stringify(attackPoke.name)} and defending poke is: ${JSON.stringify(defendingPoke.name)}`);
        } else {
            //randomisera vem som börjar
            let array = [instance1, instance2];
            let index = Math.floor(Math.random() * 2);
            attackPoke = array[index]; 
            defendingPoke = array[(index + 1) % 2];
            console.log(`The pokemons are equally fast, the chosen index is ${index} and attackPoke is ${JSON.stringify(attackPoke.name)} while defendingPoke is: ${JSON.stringify(defendingPoke.name)}` );
        }
        console.log('decided attackPoke, newAttack not yet run');
        //fight fight fight!!!
        let newAttack = async () => {
            console.log('newAttack is run');
            let damage = (attackPoke.stats.attack.base_stat + attackPoke.stats.specialAttack.base_stat) - (defendingPoke.stats.defense.base_stat + defendingPoke.stats.specialDefense.base_stat) *0.8;

            if(damage<10){
                damage =10;
            }
            console.log('damage is: ' + damage);
            console.log('Before attack defending hp is: ' + defendingPoke.stats.hp.base_stat);
            defendingPoke.stats.hp.base_stat -= damage; 

            console.log('After attack: ' + defendingPoke.stats.hp.base_stat);

            console.log(JSON.stringify(attackPoke.moves[0].move.name));
            console.log(`${attackPoke.name} used ${attackPoke.moves[0].move.name} and did ${damage} damage.  ${defendingPoke.name} remaining HP is: ${defendingPoke.stats.hp.base_stat}`);

            battleArena.innerHTML += `<p>${attackPoke.name.charAt(0).toUpperCase() + attackPoke.name.slice(1)} used ${attackPoke.moves[0].move.name} and did ${damage} damage.  ${defendingPoke.name.charAt(0).toUpperCase() + defendingPoke.name.slice(1)} remaining HP is: ${defendingPoke.stats.hp.base_stat} </p>`


            //byt attackPoke med defendingPoke
            let swapPoke = () => {
                let temp = attackPoke;
                attackPoke = defendingPoke;
                defendingPoke = temp;
            }

            swapPoke();
        }

        battleArena.innerHTML = `
        <h3>Battle is ON!</h3>
        `;

        //newAttack();
        while(instance1.stats.hp.base_stat > 0 &&instance2.stats.hp.base_stat > 0){ //medans båda pokes hp INTE är noll eller mindre, gör detta
            console.log('while loop is run')
            await newAttack();
        }

        let winningPoke;
        
        if(instance2.stats.hp.base_stat <= 0){
            // console.log(`instans 2 är mindre än eller lika med 0`);
            winningPoke = instance1;
        } else if(instance1.stats.hp.base_stat <= 0){
            // console.log(`instans 2 är mindre än eller lika med 0`);
            winningPoke = instance2;
        } else {
            console.log('den har hoppat över två ifs')
        }


        console.log(`The winner of the battle is: ${winningPoke.name}`);
        battleArena.innerHTML += `
        <h4>And the winner is... ${winningPoke.name.toUpperCase()} !!! </h4>
        `;


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
            let pokemonInstance = new Pokemon(pokemon.name, undefined , pokemon.types , pokemon. weight, pokemon.height, pokemon.stats, pokemon.moves); // lös bilden senare
            console.log(pokemonInstance);

            //lägg instansen av klassen i en array som senare ska användas för att jämföra dem
            instanceArray.push(pokemonInstance);

            //skriv ut rätt info
            let pokeContainer = document.createElement('div');
            pokeContainer.classList.add('pokeContainer')

            //hämta bild

            let imageURL = pokemon.sprites.other.dream_world.front_default;

            let image = document.createElement('img');
            image.classList.add('pokeSprite');
            image.src = imageURL;

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


        //Battle
        Pokemon.battle(instanceArray[0], instanceArray[1]);

    }); // här slutar .then som följt promise.all

}); // Slut på compareBtns eventlistener


//Battle

// let battleBtn = document.querySelector('#battleBtn');

// battleBtn.addEventListener('click', ()=>{

// })