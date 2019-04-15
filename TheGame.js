/**
 * Summary: This game was created in vanilla javascript during a 4 hour plane flight during which I had no intenret access.
 * Javascript was chosen as the framework of choice simply because I did not have the internet access to download library 
 * files for jquery, bootstrap, react, etc. It was my original intention to get as far as I could in vanilla javascript, 
 * then bring in a framework to complete the job. It turns out no framework or external toolkit was needed. Advances in CSS have
 * made 3d animations quite simple and adequate for rendering the cards flipping in this game.
 * 
 * This game is excessively documented with programming concepts for educational purposes. This game uses newer 
 * features of javascipt and CSS, such as flexbox for layout, and ES6 style classes.
 *
 * Description: This is a card game commonly known as Concentration or Memory, which is a card game in which all of the cards 
 * are laid face down on a surface and two cards are flipped face up over each turn. The object of the game is to turn over 
 * pairs of matching cards. Concentration can be played with any number of players or as solitaire. It is a particularly 
 * good game for young children, though adults may find it challenging and stimulating as well.
 *
 **/

 /** 
  * Create a namespace which may be passed around between files to share game functions and state between modules
  * and for continuing game play.
  */
window['NS'] = window['NS'] || {};

/**
 * Create a function closure, for implementing lexically scoped name binding. Prevents name bleeding into the window object and 
 * encapsulates variables and classes into a logical grouping.
 */
(function(NS) {

    /**
     * 
     * (This is a new style ES6 class. Simplifies scoping, inheritance, etc.)
     * 
     * A Card is a logical unit for a card on the card table. This card object knows how to render itself, but it is up to the game
     * object to insert the object into the parent dom object. A Card also hooks up its own even handler to handle the mouse click 
     * or touch screen tap to flip itself over to reveal the hidden face of the card. It also knows how to destroy itself, unhooking event handlers as necessery, and
     * removing itself from it's parent objct in the dom.
     * 
     * A card is coupled with CSS transitions for the flipping and disappearing animations.
     * 
     * The face-down card graphics are from the open source library Font Awesome, version 4.7.0.
     * The graphics selection is completely randomized, and occurrs when the game is created, so no 
     * two games will have exaclty the same graphics on the faces of the cards.
     * 
     * The backing of each card is the CodeClubs.org logo, which is a shameless plug for the nonprofit I founded to 
     * teach children in my community computer science free of charge.
     * 
     */
    class Card {
        constructor(icon) {
            this.icon = icon;
        }

        // Remove my click handler and remove me from my parent in the dom
        destroy() {
            this.card.removeEventListener("click", this.flip);
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }

        // Render all the html elements for this item. Does not insert into the dom. The game object does that.
        render() {	

            let scene = document.createElement('div');
            let card = document.createElement('div');
            let front = document.createElement('div');
            let back = document.createElement('div');
            let icon = document.createElement('i');

            icon.classList.add('fa')
            icon.classList.add(this.icon);

            scene.classList.add('scene');
            card.classList.add('card');
            front.classList.add('face');
            back.classList.add('face');
            front.classList.add('front');
            back.classList.add('back');
            
            
            scene.appendChild(card);
            back.appendChild(icon)
            card.appendChild(front);
            card.appendChild(back);
            card.addEventListener("click", this.flip)
            this.card = card
            this.container = scene
            return scene
        }

        // handle the logic for the flipping of the cards. changes game state 
        // based on series of rules. 
        //  If this is the first card flipped, then track that in state.
        //  If this is the second card flipped, then compare to first.
        //  If the card icons match, then increment score and make cards disappear.
        //  If the card icons do not match, then flip the cards back over.
        flip(e)  { 
            let state = NS.game.state;
            if (this.classList.contains('matched')) return;
            if (state.second) return;
            if (state.first == this) return;
            if (this.classList.contains('flip')) {
                this.classList.remove('flip');
            } else {
                this.classList.add('flip');
            }
            if (state.first) {
                state.second = this;
                if (state.first.innerHTML == state.second.innerHTML) {
                    NS.game.score();
                    setTimeout(() => {
                        state.first.classList.remove('flip');
                        state.second.classList.remove('flip');
                        state.first.classList.add('matched');
                        state.second.classList.add('matched');
                        delete state.first;
                        delete state.second;
                    }, 1000);
                } else {
                    setTimeout(() => {
                        state.first.classList.remove('flip');
                        state.second.classList.remove('flip');
                        delete state.first;
                        delete state.second;
                    }, 1500);
                }
            } else {
                state.first = this;
            }
          }
    }

    /**
     * Summary. Game class tracks game state and is a container fo the card objects.
     * Game object utility functions fot reset the game, render the game into the dom,
     *  handle the score, and destroy the game as nexesseary.
     */
    class Game {

        // create a new game by creating new cards and randomizng the icons displayed on the faces of the cards.
        constructor(className) {
            this.canvas = document.getElementsByClassName(className)[0];
            this.cards = [];
            this.state = {};
            this.icons = [];

            // Get random font awesome icon for each pair of cards.
            for(let i=1;i<=12;i++){
                let icon = NS.res.fa()
                this.icons.push(icon);
                this.icons.push(icon);
            }     
            // shuffle the pairs so they appear in random order.
            NS.res.shuffle(this.icons);
            for(let i=0;i<24;i++){
                this.cards.push(new Card(this.icons[i], this));
            }     
            this.render();   
        }

        // render all the cards onto the game board. 
        render() {
            for (let idx in this.cards){
                let card = this.cards[idx];
                this.canvas.appendChild(card.render());
            }
        }

        // destroy the game by destroying all the cards and clearing the screen.
        destroy() {
            this.canvas.innerHTML = ''; 
            for (let idx in this.cards){
                let card = this.cards[idx];
                card.destroy();
             } 
        }

        // clear the game baord of all cards. (visual only)
        clear() {
            this.canvas.innerHTML = ''; 
        }

        // reset the game. set score to zero. keep same cards and layout. 
        reset() {
            NS.game.clear();
            NS.game.score(true);
            NS.game.render()
        }

        // increment the score or reset it to 0 if argument is true.
        score(reset) {
            let score = document.getElementsByClassName('score')[0];
            if (reset) {
                score.innerHTML = '0';
            } else {
                console.log(score);
                score.innerHTML = parseInt(score.innerHTML) + 1;
            }
        }
    }

    NS.game = new Game('card-table');

    /**
     * Utility function that can be called from the HTML button.
     */
    NS.newGame = function() {
        if (NS.game) {
            NS.game.destroy();
            NS.game.score(true);
        }
        NS.game = new Game('card-table');
    }

    /**
     * Utility function that can be called from the HTML button.
     * Resets the game using the current cards and layout. Repaints the screen with the cards all face down and 
     * resets the score to 0. This does not reshuffle the cards or use new images.
     */
    NS.reset = function() {
        if (NS.game) {
            NS.game.reset();
        }
    }
    
})(NS || {});