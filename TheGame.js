window['NS'] = window['NS'] || {};
(function(NS) {
    class Card {
        constructor(icon) {
            this.icon = icon;
        }
        destroy() {
            this.card.removeEventListener("click", this.flip);
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
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

    class Game {
        constructor(className) {
            this.canvas = document.getElementsByClassName(className)[0];
            this.cards = [];
            this.state = {};
            this.icons = [];

            for(let i=1;i<=24;i++){
                let icon = NS.res.fa()
                this.icons.push(icon);
                this.icons.push(icon);
            }     
            NS.res.shuffle(this.icons);
            for(let i=0;i<48;i++){
                this.cards.push(new Card(this.icons[i], this));
            }     
            this.render();   
        }

        render() {
            for (let idx in this.cards){
                let card = this.cards[idx];
                this.canvas.appendChild(card.render());
            }
        }

        destroy() {
            this.canvas.innerHTML = ''; 
            for (let idx in this.cards){
                let card = this.cards[idx];
                card.destroy();
             } 
        }

        clear() {
            this.canvas.innerHTML = ''; 
        }

        new_game() {
            NS.newGame();
        }

        reset() {
            NS.game.clear();
            NS.game.score(true);
            NS.game.render()
        }

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

    NS.newGame = function() {
        if (NS.game) {
            NS.game.destroy();
            NS.game.score(true);
        }
        NS.game = new Game('card-table');
    }
    
})(NS || {});