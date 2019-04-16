## Memory Game in Vanilla JS

Go straight to the game in Github Pages:

https://paul-perez.github.io/memory-game-vanilla/TheGame.htm

### Summary

This game was created in vanilla JavaScript during a plane flight during which I had no internet access.

JavaScript was chosen as the framework simply because I did not have the internet access to download library files for JQuery, Bootstrap, React, etc. It was my original intent to get as far as I could in vanilla JavaScript, then bring in a framework to complete the job. It turns out no framework or external toolkit was needed. Advances in CSS have made 3D animations quite simple and adequate for rendering the cards flipping in this game. The only external dependency is font awesome for icons on the faces of the cards.

This game is documented with explanations of programming concepts for educational purposes. This game uses newer features of JavaScript and CSS, such as flexbox for layout, and ES6 style classes.

The backing of each card is the CodeClubs.org logo, which is a shameless plug for the nonprofit I founded to teach children in my community computer science free of charge.

### Description: 

This is a card game commonly known as Concentration or Memory, which is a card game in which all of the cards are laid face down on a surface and two cards are flipped face up over each turn. The object of the game is to turn over pairs of matching cards. Concentration can be played with any number of players or as solitaire. It is a particularly good game for young children, though adults may find it challenging and stimulating as well.

(This is a new style ES6 class. Simplifies scoping, inheritance, etc.)

**Class Card** 

A Card is a logical unit for a card on the card table. This card object knows how to render itself, but it is up to the game
object to insert the object into the parent DOM object. A Card also hooks up its own even handler to handle the mouse click 
or touch screen tap to flip itself over to reveal the hidden face of the card. It also knows how to destroy itself, unhooking event handlers as necessary, and
removing itself from it's parent object in the DOM.

A card is coupled with CSS transitions for the flipping and disappearing animations.

The face-down card graphics are from the open source library Font Awesome, version 4.7.0.
The graphics selection is completely randomized, and occurs when the game is created, so no 
two games will have exactly the same graphics on the faces of the cards.

**Class Game** 

Game class tracks game state and is a container for the card objects. Also defines some utility functions to reset the game, render the game into the DOM, handle game state such as score and track flipped cards, and destroy the game as necessary.

