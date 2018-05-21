// Author: Nigel Finley. August 2016. UT BOOTCAMP HW Assignment



// 4. add the 'No enemy here' text when attack button is clicked
// 6. figure out how to implement the  'wounded' piece
// -Look at changing the font to more readable
// Add bootstrap class to change the hover state of characters
// makeimg bigger to strecth entire character and make text white





// Improvements to make
// Update the images to not show the background colors and spread across entire div
// change text color to white and bold and then overlay over the image
// change the positioning so that it flows better


// Overall game is stored in object
// game play object houses all functions  and additional variables of the game
function reset() {
    window.gameObj = {
        // intializing the attack button to false. will set it to true later on
        attackOccurred: false,
        winOccurred: false,
        lossOccurred: false,
        wounded: false,
        gameOver: false,
        jediMaster: false,
        characterArrayList: [
            // 1.  An array or object of possible characters properties would incldue 
            // name, picture, Health Points, Attack Power and counter attack power

            {
                name: 'Frieza',
                visual: 'assets/images/Frieza.jpg',
                healthPoints: 160,
                attackPower: 10,
                counterAttackPower: 20,
            },
            {
                name: '17',
                visual: 'assets/images/17.jpeg',
                healthPoints: 130,
                attackPower: 15,
                counterAttackPower: 30,
            },
            {
                name: 'Vagita',
                visual: 'assets/images/vagita.jpeg',
                healthPoints: 180,
                attackPower: 7,
                counterAttackPower: 15,
            },
            {
                name: 'Goku',
                visual: 'assets/images/goku.jpg',
                healthPoints: 180,
                attackPower: 15,
                counterAttackPower: 25,
            },
            {
                name: 'Krilen',
                visual: 'assets/images/krilen.jpeg',
                healthPoints: 110,
                attackPower: 12,
                counterAttackPower: 20,
            },
            
        ],
        // Initializes game start true
        gameStart: true,
        // initializes your character to nothing
        yourCharacter: null,
        // initializes enemy selection to nothing
        currentEnemy: null,
        // initializs your blank array of previously fought enemies. might just remove all together
        previouslyFought: [],
        // sets current attack power to null
        yourCurrentAttackPower: null,
        winOccurred: false,

        // create an array of battle sounds
        battleSoundsArray: ['assets/audio/Ki_Ball.mp3', 'assets/audio/Explosion.mp3', 'assets/audio/Effect.mp3'],
        characherSelectSound: 'assets/audio/DBZK.mp3',

        // picks at random battle sound when the attack button is pressed
        battleSoundPick: function () {
            return this.battleSoundsArray[Math.floor(Math.random() * this.battleSoundsArray.length)];
        },

    }
};


// STAGE 1: Initial Setup/ Display
$(document).ready(function () {
    reset();
    // gets the link for the theme song to be played in the background
    var audioElement = document.createElement('audio');
    audioElement.autoplay = true;
    audioElement.loop = true;
    audioElement.setAttribute('src', 'assets/audio/CHA-LA.mp3');

    // displays the modal
    $('#myModal').modal('show');

    function render() {
        // setting variables set to id tags with html elements for easy reference later
        // using the $ before variables indicates that they are jQuery objects, it doesn't affect perfermance of the variables
        var $charList = $('#characterList');
        var $enemyList = $('#enemyList');
        var $yourCharacter = $('#yourCharacter');
        var $attackText = $('#attackText');
        var $yourEnemy = $('#yourEnemy');
        var $winText = $('#attackText');
        var $lossText = $('#attackText');
        // var $wounded = $('#attackText');
        var $gameOver = $('#gameOver');
        var $jediText = $('#attackText');

        // using underscore.js to create templates that are dynamically updated
        var $charTemplate = _.template($('#characterTmpl').html());
        var $attackTemplate = _.template($('#attackTmpl').html());
        var $winTemplate = _.template($('#winTmpl').html());
        var $lossTemplate = _.template($('#lossTmpl').html());
        var $jediTemplate = _.template($('#jediTmpl').html());
        // var $woundTemplate = 

        // Haven't selected Character
        var charHtml = "";
        $yourCharacter.html("");
        $yourEnemy.html("");
        $attackText.html("");
        $gameOver.html("");

        // using a ternary operator to give true or false to the background color choice
        var listBg = gameObj.yourCharacter ? "bg-black" : "bg-white";
        // Sets the initial screen with characters to select from
        gameObj.characterArrayList.forEach(function (character, index) {
            charHtml = charHtml + $charTemplate({ index: index, background: listBg, character: character });
        });
        if (gameObj.yourCharacter) {
            $yourCharacter.html($charTemplate({ index: 0, background: 'bg-white', character: gameObj.yourCharacter }));
            // re-write in jQuery
            $enemyList.html(charHtml);
            $charList.html("");

        } else {
            $charList.html(charHtml);
            $enemyList.html("");
        }
        if (gameObj.currentEnemy) {
            $yourEnemy.html($charTemplate({ index: 0, background: 'bg-red', character: gameObj.currentEnemy }));
        }
        if (gameObj.attackOccurred) {
            $attackText.html($attackTemplate({ gameObj: gameObj }));
        }
        // added
        if (gameObj.winOccurred) {

            // Displays the win text 
            $winText.html($winTemplate({ lastOpponent: gameObj.lastOpponent }));
            // Removes the enemy character after you win.
            $('#yourEnemy').empty(gameObj.currentEnemy);
        }

        if (gameObj.lossOccurred) {
            // Displays loss text
            $lossText.html($lossTemplate({ gameObj: gameObj }));
        }
        // This runs when the enemy is wounded (hp less than zero)
        if (gameObj.wounded) {
            $('#attackText').html("You are seriously wounded. GAME OVER!");
        }
        // This runs if the user losses
        if (gameObj.gameOver) {
            // creates the reset button to start the game over
            var b = $('<button>');
            b.addClass('btn-primary waves-effect waves-light btn-lg');
            b.html('Battle Again!');
            reset();

            b.click(render);
            $('#gameOver').append(b);

        }
        if (gameObj.jediMaster) {
            // Displays final text 
            $jediText.html($jediTemplate({ lastOpponent: gameObj.lastOpponent }));
            $('#yourEnemy').empty(gameObj.currentEnemy);
            // creates the reset button to start the game over
            var b = $('<button>');
            b.addClass('btn-primary waves-effect waves-light btn-lg');
            b.html('Battle Again!');
            reset();

            b.click(render);
            $('#gameOver').append(b);

        }

    }

    //STAGE 2: Selecting your character 
    $('#characterList').on('click', '.characterContainer', function (e) {
        // pause current audio to allow for battle sounds
        audioElement.pause();
        // TODO: set the AUDIO to saberon.mp3

        // references the characterList
        var element = $(this);
        var charIndex = element.data('character-index');
        // your character was initially set as null so when your character != null this if runs
        if (!gameObj.yourCharacter) {
            // pushes your object selection into yourCharacter array
            gameObj.yourCharacter = gameObj.characterArrayList.splice(charIndex, 1)[0];
            // setting initial attack power to the value within the master object
            gameObj.yourCurrentAttackPower = gameObj.yourCharacter.attackPower;
        }
        // This renders and updates all of the html elements 
        render();
        // adds a sound to selecting character
        var $audioCharacter = document.createElement('audio');
        $audioCharacter.setAttribute('src', gameObj.characherSelectSound);
        $audioCharacter.play();
    });

    // STAGE 3: select your enemy
    $('#enemyList').on('click', '.characterContainer', function (e) {
        var element = $(this);
        var charIndex = element.data('character-index');
        // current enemy was initially set as null so when your enemy != this if runs 
        if (!gameObj.currentEnemy) {
            // creates an array that houses the enemy character
            gameObj.winOccurred = false;
            // sets the attack button to false ensuring the attack text is not displayed when selecting a new character and only after 
            // ...click attack
            gameObj.attackOccurred = false;
            gameObj.currentEnemy = gameObj.characterArrayList.splice(charIndex, 1)[0];
        }
        // This renders and updates all of the html elements 
        render();
        // adds a sound to selecting character
        var $audioCharacter = document.createElement('audio');
        $audioCharacter.setAttribute('src', gameObj.characherSelectSound);
        $audioCharacter.play();
    });

    // STAGE 4: GAME PLAY. Click on ATTACK

    $('#attackBtn').on('click', function (e) {
        // this ensure you cannot click any other characters again
        if (!gameObj.yourCharacter || !gameObj.currentEnemy) {
            $('#attackText').html('No enemy here, select an emeny to fight.')
            return;
        }

        gameObj.attackOccurred = true;

        // declaring new variables
        var yourCharacter = gameObj.yourCharacter;
        var currentEnemy = gameObj.currentEnemy;
        //increment yourAttackPower by yourCharacter.attackPower
        gameObj.yourCurrentAttackPower = gameObj.yourCurrentAttackPower + yourCharacter.attackPower;
        //decrease enemy health points by yourAttackPower state
        currentEnemy.healthPoints = currentEnemy.healthPoints - gameObj.yourCurrentAttackPower;
        //decrease your health points by enemy's counterAttackPower
        yourCharacter.healthPoints = yourCharacter.healthPoints - currentEnemy.counterAttackPower;
        console.log("enenemy health points: " + currentEnemy.healthPoints + ' your health: ' + yourCharacter.healthPoints);

        var $audioBattle = document.createElement('audio');
        $audioBattle.setAttribute('src', gameObj.battleSoundPick());
        $audioBattle.play();




        // Win scenario
        // set win variable  and loss in order to consolidate win ifs. 
        var win = (currentEnemy.healthPoints < 1 && yourCharacter.healthPoints > 1 ||
            ((yourCharacter.healthPoints < 1 && currentEnemy.healthPoints < 1) &&
                (yourCharacter.healthPoints > currentEnemy.healthPoints))
        ) ? true : false;

        var loss = (yourCharacter.healthPoints < 1 && currentEnemy.healthPoints > 1 ||
            ((yourCharacter.healthPoints < 1 && currentEnemy.healthPoints < 1) &&
                (yourCharacter.healthPoints < currentEnemy.healthPoints))
        ) ? true : false;



        // First if is only if user has defeated all of the enemies    	
        if (win) {

            console.log('healthPoints of enemy should be equal great than or eqaul to 0: ' + currentEnemy.healthPoints);
            if (gameObj.characterArrayList.length > 0) {
                console.log(gameObj.characterArrayList.length);
                gameObj.winOccurred = true;

                // need to be able to select another enemy
                gameObj.lastOpponent = gameObj.currentEnemy;
                gameObj.currentEnemy = null;
                // need to figure out how to show another error when your character points are less 0. Show error "you are seriously wounded. GAME OVER"
                // if (yourCharacter.healthPoints =< 0) {
                // 	gameObj.wounded = true;
                // 	// gameObj.winOccurred = false;

                // }

            }
            // scenario when you have defeated all characters
            else if (gameObj.characterArrayList.length == 0) {

                console.log('Final Jedi Portion ' + gameObj.characterArrayList.length);
                gameObj.lastOpponent = gameObj.currentEnemy;
                gameObj.attackOccurred = false;
                gameObj.jediMaster = true;

            }


        }
        // Loss Scenario

        else if (loss) {
            gameObj.lossOccurred = true;
            console.log('Entered the loss occurred section');
            gameObj.attackOccurred = false;
            gameObj.gameOver = true;

        }
        render();

    });



    render();

});

(function (a, d, p) {
    a.fn.backstretch = function (c, b) {
        (c === p || 0 === c.length) && a.error("No images were supplied for Backstretch");
        0 === a(d).scrollTop() && d.scrollTo(0, 0);
        return this.each(function () {
            var d = a(this),
                g = d.data("backstretch");
            if (g) {
                if ("string" == typeof c && "function" == typeof g[c]) {
                    g[c](b);
                    return
                }
                b = a.extend(g.options, b);
                g.destroy(!0)
            }
            g = new q(this, c, b);
            d.data("backstretch", g)
        })
    };
    a.backstretch = function (c, b) {
        return a("body").backstretch(c, b).data("backstretch")
    };
    a.expr[":"].backstretch = function (c) {
        return a(c).data("backstretch") !== p
    };
    a.fn.backstretch.defaults = { centeredX: !0, centeredY: !0, duration: 5E3, fade: 0 };
    var r = { left: 0, top: 0, overflow: "hidden", margin: 0, padding: 0, height: "100%", width: "100%", zIndex: -999999 },
        s = { position: "absolute", display: "none", margin: 0, padding: 0, border: "none", width: "auto", height: "auto", maxHeight: "none", maxWidth: "none", zIndex: -999999 },
        q = function (c, b, e) {
        this.options = a.extend({}, a.fn.backstretch.defaults, e || {});
            this.images = a.isArray(b) ? b : [b];
            a.each(this.images, function () { a("<img />")[0].src = this });
            this.isBody = c === document.body;
            this.$container = a(c);
            this.$root = this.isBody ? l ? a(d) : a(document) : this.$container;
            c = this.$container.children(".backstretch").first();
            this.$wrap = c.length ? c : a('<div class="backstretch"></div>').css(r).appendTo(this.$container);
            this.isBody || (c = this.$container.css("position"), b = this.$container.css("zIndex"), this.$container.css({ position: "static" === c ? "relative" : c, zIndex: "auto" === b ? 0 : b, background: "none" }), this.$wrap.css({ zIndex: -999998 }));
            this.$wrap.css({ position: this.isBody && l ? "fixed" : "absolute" });
            this.index = 0;
            this.show(this.index);
            a(d).on("resize.backstretch", a.proxy(this.resize, this)).on("orientationchange.backstretch", a.proxy(function () { this.isBody && 0 === d.pageYOffset && (d.scrollTo(0, 1), this.resize()) }, this))
        };
    q.prototype = {
        resize: function () {
            try {
                var a = { left: 0, top: 0 },
                    b = this.isBody ? this.$root.width() : this.$root.innerWidth(),
                    e = b,
                    g = this.isBody ? d.innerHeight ? d.innerHeight : this.$root.height() : this.$root.innerHeight(),
                    j = e / this.$img.data("ratio"),
                    f;
                j >= g ? (f = (j - g) / 2, this.options.centeredY && (a.top = "-" + f + "px")) : (j = g, e = j * this.$img.data("ratio"), f = (e - b) / 2, this.options.centeredX && (a.left = "-" + f + "px"));
                this.$wrap.css({ width: b, height: g }).find("img:not(.deleteable)").css({ width: e, height: j }).css(a)
            } catch (h) { }
            return this
        }, show: function (c) {
            if (!(Math.abs(c) > this.images.length - 1)) {
                var b = this,
                    e = b.$wrap.find("img").addClass("deleteable"),
                    d = { relatedTarget: b.$container[0] };
                b.$container.trigger(a.Event("backstretch.before", d), [b, c]);
                this.index = c;
                clearInterval(b.interval);
                b.$img = a("<img />").css(s).bind("load", function (f) {
                    var h = this.width || a(f.target).width();
                    f = this.height || a(f.target).height();
                    a(this).data("ratio", h / f);
                    a(this).fadeIn(b.options.speed || b.options.fade, function () {
                        e.remove();
                        b.paused || b.cycle();
                        a(["after", "show"]).each(function () { b.$container.trigger(a.Event("backstretch." + this, d), [b, c]) })
                    });
                    b.resize()
                }).appendTo(b.$wrap);
                b.$img.attr("src", b.images[c]);
                return b
            }
        }, next: function () {
            return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0)
        }, prev: function () {
            return this.show(0 === this.index ? this.images.length - 1 : this.index - 1)
        }, pause: function () {
        this.paused = !0;
            return this
        }, resume: function () {
        this.paused = !1;
            this.next();
            return this
        }, cycle: function () {
        1 < this.images.length && (clearInterval(this.interval), this.interval = setInterval(a.proxy(function () { this.paused || this.next() }, this), this.options.duration));
            return this
        }, destroy: function (c) {
            a(d).off("resize.backstretch orientationchange.backstretch");
            clearInterval(this.interval);
            c || this.$wrap.remove();
            this.$container.removeData("backstretch")
        }
    };
    var l, f = navigator.userAgent,
        m = navigator.platform,
        e = f.match(/AppleWebKit\/([0-9]+)/),
        e = !!e && e[1],
        h = f.match(/Fennec\/([0-9]+)/),
        h = !!h && h[1],
        n = f.match(/Opera Mobi\/([0-9]+)/),
        t = !!n && n[1],
        k = f.match(/MSIE ([0-9]+)/),
        k = !!k && k[1];
    l = !((-1 < m.indexOf("iPhone") || -1 < m.indexOf("iPad") || -1 < m.indexOf("iPod")) && e && 534 > e || d.operamini && "[object OperaMini]" === {}.toString.call(d.operamini) || n && 7458 > t || -1 < f.indexOf("Android") && e && 533 > e || h && 6 > h || "palmGetResource" in d && e && 534 > e || -1 < f.indexOf("MeeGo") && -1 < f.indexOf("NokiaBrowser/8.5.0") || k && 6 >= k)
})(jQuery, window);