(function(ns){
    let filename = 'file://G:/Team Drives/CodeClubs.org/Administration/CodeClubs.png';
    class Card {
        constructor(img) {
            this.img = img;
        }
        generateHTML() {
            return '<span><img src="'+this.img+'"></span>'
        }
        
        render() {	

            let scene = document.createElement('div');
            let card = document.createElement('div');
            let front = document.createElement('div');
            let back = document.createElement('div');

            scene.classList.add('scene');
            card.classList.add('card');
            front.classList.add('face');
            back.classList.add('face');
            front.classList.add('front');
            back.classList.add('back');

            //let i = document.createElement('img');
            //i.src = filename
            
            scene.appendChild(card);
            card.appendChild(front);
            card.appendChild(back);
            //back.appendChild(i);

            card.onclick = function(e) { 
              if (this.classList.contains('flip')) {
                  this.classList.remove('flip');
              } else {
                  this.classList.add('flip');
              }
            }
            return scene
        }
    }

    class Canvas {
        constructor(className) {
           this.canvas = document.getElementsByClassName(className)[0];
           this.cards = [];
           for(let i=1;i<=48;i++){
               this.cards.push(new Card(filename));
           }        
        }

        render(){
            for (let idx in this.cards){
                let card = this.cards[idx];
                this.canvas.appendChild(card.render());
            }
        }
        refresh(){}
        layout(){}
        paint(){}
        onResize(){}
    }
 
    
    class Game {
        constructor(className) {
	  this.canvas = new Canvas(className);
          this.canvas.render();
        }
    }
    g = new Game('card-table');
    
    console.log(g);

   
})({});