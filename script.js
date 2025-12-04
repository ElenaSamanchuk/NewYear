document.addEventListener('DOMContentLoaded', () => {
    const game = document.querySelector('.game');
    const message = document.querySelector('.message');

    const cardImages = [
        './img/1.png',
        './img/2.png',
        './img/3.png',
        './img/4.png',
        './img/5.png',
        './img/6.png'
    ];
   
    let selectedCards = [];
    let canFlip = false;
    let gameStarted = true;
    let zoomed = false;
    const dealSound = new Audio();
    const flipSound = new Audio();
    const zoomSound = new Audio();
    dealSound.src = './sounds/dealSound.wav';
    flipSound.src = './sounds/dealSound.wav';
    zoomSound.src = './sounds/dealSound.wav';
    dealSound.volume = 0.5;
    flipSound.volume = 0.7;
    zoomSound.volume = 0.4;

       startGame();

    function startGame() {
        canFlip = true;
        game.innerHTML = ``;
        selectedCards = [];
        
      
        const shuffledCards = [...cardImages].sort(() => Math.random() - 0.5);
        
        shuffledCards.forEach((item, index) => {
            setTimeout(() => {
                createCard(item, index);
                setTimeout(() => playSound(dealSound), index * 60);
            }, index * 200);
        });
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function createCard(item, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;    
        
        const front = document.createElement('div');
        front.className = 'card-face card-front';
        
        const img = document.createElement('img');
        img.src = item;
        img.className = 'card-img';
        img.alt = 'Карта ' + (index + 1);
        
        front.appendChild(img);
        const back = document.createElement('div');
        back.className = 'card-face card-back';
        
        card.appendChild(front);
        card.appendChild(back);
        game.appendChild(card);

        card.addEventListener('click', () => { 
            if (!canFlip || !gameStarted) return; 
            
            if (card.classList.contains('flipped')) {
                toggleZoom(card);
                return;
            }
          
            
            canFlip = false;
            card.classList.add('flipped');
            toggleZoom(card);
            selectedCards.push(card);
            playSound(flipSound);
            
            setTimeout(() => {
                canFlip = true;
            }, 600);
            
            
        });
    }

    function toggleZoom(card) {
        if (card.classList.contains('zoomed')) {
            card.classList.remove('zoomed');
            zoomed = false;
        } else {
          
            document.querySelectorAll('.zoomed').forEach(c => {
                c.classList.remove('zoomed');
            });
            
            card.classList.add('zoomed');
            playSound(zoomSound);
            zoomed = true;
        }
    }

    function showMessage() {
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }
});
