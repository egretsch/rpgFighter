var selectedChars = [];
var addDamage = 10;
var Warrior = null;
var Enemy = null;
var graveyard = [];
// ist of charascters
var characters = {
    "Frieza": {
        visual: 'assets/images/Frieza.jpg',
        healthPoints: 160,
        attackPower: 10,
        counterAttackPower: 20,
    },
    "no.17": {
        visual: 'assets/images/17.jpeg',
        healthPoints: 130,
        attackPower: 15,
        counterAttackPower: 30,
    },
    "Vagita": {
        visual: 'assets/images/vagita.jpeg',
        healthPoints: 180,
        attackPower: 7,
        counterAttackPower: 15,
    },
    "Goku": {
        visual: 'assets/images/goku.jpg',
        healthPoints: 180,
        attackPower: 15,
        counterAttackPower: 25,
    },
    "Krillen": {
        visual: 'assets/images/krilen.jpeg',
        healthPoints: 110,
        attackPower: 12,
        counterAttackPower: 20,
    }
};
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
// resets charaaters
function resetGame(message) {
    var prompt = confirm(message);

    if(prompt == true) {
        location.reload();
    }
    else {
        location.reload();
    };
};
// clears display of chaertesa
function clearDisplay() {
    $("#characterStart").html("");
    $("#yourCharacter").html("");
    $("#yourEnemy").html("");
};
// builds virw of charaater
function buildcharacterDiv(characters, character) {
    var characterDiv = $("<div>");
    // setup div to display
    characterDiv.attr(
        {
            "data-hp": characters[character].healthPoints,
            "data-ap": characters[character].attackPower,
            "data-name": character,
            "class": "col-md-2 character"
        }
    )
// cteartas charaters div
    var characterImgDiv = $("<img>");
    var characterHpName = $("<div>");
    characterImgDiv.attr(
        {
            "src": characters[character].visual,
            "class": "imgDiv"
        }
    );
    characterHpName.text(character + " HP. " + characters[character].healthPoints)
    characterDiv.append(characterHpName);
    characterDiv.append(characterImgDiv);
    return characterDiv;
};
// puts char of charaecter onpage
function characterPrint() {
    for (character in characters) {
        if (Warrior !== character && Enemy !== character && !graveyard.includes(character)) {
            var characterDiv = buildcharacterDiv(characters, character);
            $("#characterStart").append(characterDiv);    
        };
    };
};
// charaicter pirnt warrior
function warriorPrint() {
    for (character in characters) {
        if (Warrior === character) {
            var characterDiv = buildcharacterDiv(characters, character);
            $("#yourCharacter").append(characterDiv);
        };
    };
};
// pirnts as enemy
function enemyPrint() {
    for (character in characters) {
        if (Enemy === character) {
            var characterDiv = buildcharacterDiv(characters, character);
            $("#yourEnemy").append(characterDiv);
        };
    };
};
// increase warrior dameage
function attackDamageIncrease(character) {
    characters[character].attackPower = characters[character].attackPower + addDamage;
};
// lower hp
function lowerHp (character, damage) {
    characters[character].healthPoints = characters[character].healthPoints - damage;
};
// drfines status as warrior
function queueWarrior(character) {
    Warrior = character;
    updateDisplay();
};
// drfines status as enemy
function queueEnemy(character) {
    Enemy = character;
    updateDisplay();
};
// dfines charaicter location no page on click
$("#characterStart").on("click", ".character", function(){
    var character = $(this).attr('data-name');
        if (Warrior === null) {
            queueWarrior(character);
        }
        else if (Enemy === null) {
            queueEnemy(character);
        }
});
// primery game logic contoler
$("#atack").on("click", function () {
    var warrior = $("#yourCharacter div").attr("data-name");
    var enemy = $("#yourEnemy div").attr("data-name");
    if (warrior && enemy) {
        attackDamageIncrease(warrior);
        lowerHp(enemy, characters[warrior].attackPower);
        if(characters[enemy].healthPoints <= 0) {
            graveyard.push(enemy);
            Enemy = null;
            if (graveyard.length >= Object.size(characters) - 1) {
                resetGame(" !!!You saved the universe!!! ");
            };
        };
        if(Enemy !== null) {
            lowerHp(warrior, characters[enemy].counterAttackPower);
            if (characters[warrior].healthPoints <= 0) {
                resetGame(" !!!You could not save the universe!!! ")
            }
        };
        // if (!Win) {
        //     updateDisplay();
        // };
    };
})
// update display
function updateDisplay(){
    clearDisplay();
    characterPrint();
    warriorPrint();
    enemyPrint();
};

updateDisplay();
