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
 * pairs of matching cards. This game can be played with any number of players or as solitaire.
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
     * object to insert the object into the parent DOM object. A Card also hooks up its own even handler to handle the mouse click 
     * or touch screen tap to flip itself over to reveal the hidden face of the card. It also knows how to destroy itself, unhooking event handlers as necessery, and
     * removing itself from it's parent objct in the DOM.
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

        // The icon is a font-awesome icon.
        constructor(icon) {
            this.icon = icon;
        }

        // Remove my click handler and remove object from my parent in the DOM.
        destroy() {
            this.card.removeEventListener("click", this.flip);
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }

        // Render all the html elements for this item. Does not insert into the DOM- the Game class does that.
        // @returns the container object for DOM insertion.
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

        // Handle the main logic for game play. As the name suggestions, handles the 
        // flipping of the cards, but also updates game state based on series of rules. 
        //  * If this is the first card flipped, then track that in state.
        //  * If this is the second card flipped, then compare to first.
        //  * If the card icons match, then increment score and make cards disappear.
        //  * If the card icons do not match, then flip the cards back over.
        flip(e)  { 
            let state = NS.game.state;

            // Track game state by keeping track of the cards that are flipped over. 

            // Ignore any cards that have already been matched. (They are hidden but remain in DOM to keep space filled.)
            if (this.classList.contains('matched')) return;
            // Prevent extra clicks while two cards are face up.
            if (state.second) return;
            // Ignore clicks on card that is already face up.
            if (state.first == this) return;
            // toggle flip class, which triggers flip animation in CSS.
            if (this.classList.contains('flip')) {
                this.classList.remove('flip');
            } else {
                this.classList.add('flip');
            }
            if (state.first) {
                // ONLY evaluate rules when two cards are face up.
                state.second = this;
                if (state.first.innerHTML == state.second.innerHTML) {
                    // A pair was discovered! Update the score and 
                    // make the pair disappear.
                    NS.game.score();
                    setTimeout(() => {
                        state.first.classList.remove('flip');
                        state.second.classList.remove('flip');
                        state.first.classList.add('matched');
                        state.second.classList.add('matched');
                        delete state.first;
                        delete state.second;
                    }, 1000);
                    // IF This was the last pair on the board, present a message to the user.
                    if (NS.game.getScore()==12){
                        setTimeout(() => {
                            // A nicely styled overlay is needed here, but we have to draw the line on time/enhancements somewhere! 
                            alert("Game complete. Press New Game to start a new game!")
                        }, 1200);
                    }
                } else {
                    // A pair was not found. Flip the cards over and allow the user to try again.
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

 
    // Game class tracks game state and is a container for the card objects.
    // Also defines some utility functions to reset the game, render the game into the DOM,
    // handle game state such as score and track flipped cards, and destroy the game as necesseary.
    class Game {

        // Create a new game by creating new cards and randomizng the icons displayed on the faces of the cards.
        constructor(className) {
            this.canvas = document.getElementsByClassName(className)[0];
            this.cards = [];
            this.state = {};
            this.icons = [];

            // Get random font awesome icon for each pair of cards. No two games will have same icons.
            for(let i=1;i<=12;i++){
                let icon = NS.res.fa() // From resources.js
                this.icons.push(icon);
                this.icons.push(icon);
            }     
            // Shuffle the pairs so they appear in random order. for simpler game play, comment out following line
            // and all pairs will render side by side. (This can be useful for testing.)
            NS.res.shuffle(this.icons); // From resources.js
            for(let i=0;i<24;i++){
                this.cards.push(new Card(this.icons[i], this));
            }     
            this.render();   
        }

        // Render all the cards onto the game board. Modifies the DOM. 
        render() {
            for (let idx in this.cards){
                let card = this.cards[idx];
                this.canvas.appendChild(card.render());
            }
        }

        // Destroy the game by destroying all the cards and clearing the screen.
        destroy() {
            this.canvas.innerHTML = ''; 
            for (let idx in this.cards){
                let card = this.cards[idx];
                card.destroy();
             } 
        }

        // Clear the game baord of all cards. (visual only)
        clear() {
            this.canvas.innerHTML = ''; 
        }

        // Reset the game. Set score to zero. Keep *same* cards and layout. 
        reset() {
            NS.game.clear();
            NS.game.score(true);
            NS.game.render()
        }

        // Helper function. Increment the score, or reset it to 0 if argument is true.
        score(reset) {
            let score = document.getElementsByClassName('score')[0];
            if (reset) {
                score.innerHTML = '0';
            } else {
                console.log(score);
                score.innerHTML = parseInt(score.innerHTML) + 1;
            }
        }

        // Retrieve value from DOM and convert to int.
        getScore(){
            let score = document.getElementsByClassName('score')[0];
            return parseInt(score.innerHTML);
        }
    }

    NS.game = new Game('card-table'); //Initialize a new game when page loads. 

    // Utility function that can be called from the HTML button.
    // Destroy old game and create a new game.
    NS.newGame = function() {
        if (NS.game) {
            NS.game.destroy();
            NS.game.score(true);
        }
        NS.game = new Game('card-table');
    }

    // Utility function that can be called from the HTML button.
    // Resets the game using the current cards and layout. Repaints the screen with the cards all face down and 
    // resets the score to 0. This does not reshuffle the cards or use new images.
    NS.reset = function() {
        if (NS.game) {
            NS.game.reset();
        }
    }
    
})(NS || {});
