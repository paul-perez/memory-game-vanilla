window['NS'] = window['NS'] || {};
(function(NS) {
    NS.res = NS['res'] || {};
    class Card {
        constructor(icon) {
            this.icon = icon;
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

            card.onclick = this.flip
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
                    setTimeout(() => {
                        state.first.classList.add('matched');
                        state.second.classList.add('matched');
                        delete state.first;
                        delete state.second;
                    }, 1500);

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

        render(){
            for (let idx in this.cards){
                let card = this.cards[idx];
                this.canvas.appendChild(card.render());
            }
        }
    }

    NS.game = new Game('card-table');

    
})(NS || {});