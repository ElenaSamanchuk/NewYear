document.addEventListener('DOMContentLoaded', () => {
    const game = document.querySelector('.game');
    const message = document.querySelector('.message');
    const overlay = document.querySelector('.overlay');
    
    const cardImages = [
        './img/1.png',
        './img/2.png',
        './img/3.png',
        './img/4.png',
        './img/5.png',
        './img/6.png'
    ];
    
    const promoCodes = [
        'NEWYEAR2025',
        'MAGIC2025',
        'LUCKY2025',
        'WINTER2025',
        'GIFT2025',
        'HAPPY2025'
    ];
    
    let selectedCards = [];
    let canFlip = true;
    let gameStarted = true;
    let zoomedCard = null;
    
    const dealSound = new Audio();
    const flipSound = new Audio();
    const zoomSound = new Audio();
    
    dealSound.src = './sounds/dealSound.wav';
    flipSound.src = './sounds/flipSound.wav';
    zoomSound.src = './sounds/zoomSound.wav';
    
    dealSound.volume = 0.5;
    flipSound.volume = 0.7;
    zoomSound.volume = 0.4;

    startGame();

    function startGame() {
        canFlip = true;
        game.innerHTML = '';
        selectedCards = [];

        const shuffledCards = [...cardImages].sort(() => Math.random() - 0.5);
        const shuffledPromos = [...promoCodes].sort(() => Math.random() - 0.5);
        
        shuffledCards.forEach((item, index) => {
            setTimeout(() => {
                createCard(item, index, shuffledPromos[index]);
                setTimeout(() => playSound(dealSound), index * 60);
            }, index * 200);
        });
    }

    function playSound(sound) {
        if (!sound.src.includes('undefined')) {
            sound.currentTime = 0;
            sound.play().catch(() => {
            });
        }
    }

    function createCard(item, index, promoCode) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.dataset.promo = promoCode;
        
        const front = document.createElement('div');
        front.className = 'card-face card-front';
        
        const img = document.createElement('img');
        img.src = item;
        img.className = 'card-img';
        img.alt = 'Карта предсказания ' + (index + 1);
        img.draggable = false;
        
        front.appendChild(img);
        
        const back = document.createElement('div');
        back.className = 'card-face card-back';
        
        card.appendChild(front);
        card.appendChild(back);
        game.appendChild(card);

        card.addEventListener('click', (e) => { 
            e.stopPropagation();
            
            if (!canFlip || !gameStarted) return; 
            
            if (card.classList.contains('flipped')) {
                toggleZoom(card);
                return;
            }
            
            canFlip = false;
            card.classList.add('flipped');
            playSound(flipSound);
            
            setTimeout(() => {
                toggleZoom(card);
                canFlip = true;
            }, 600);
            
            selectedCards.push(card);
        });
    }

    function toggleZoom(card) {
        if (card.classList.contains('zoomed')) {
            closeZoom();
        } else {
            openZoom(card);
        }
    }

    function openZoom(card) {
        if (zoomedCard && zoomedCard !== card) {
            zoomedCard.classList.remove('zoomed');
        }
        
        card.classList.add('zoomed');
        overlay.classList.add('active');
        playSound(zoomSound);
        zoomedCard = card;
        
        card.addEventListener('contextmenu', handlePromoCode);
    }

    function closeZoom() {
        if (zoomedCard) {
            zoomedCard.classList.remove('zoomed');
            zoomedCard.removeEventListener('contextmenu', handlePromoCode);
            zoomedCard = null;
        }
        overlay.classList.remove('active');
    }

    function handlePromoCode(e) {
        e.preventDefault();
        const card = e.currentTarget;
        const promo = card.dataset.promo;
        
        if (promo) {
            navigator.clipboard.writeText(promo).then(() => {
                showMessage(`Промокод ${promo} скопирован!`);
            }).catch(() => {
                showMessage(`Промокод: ${promo}`);
            });
        }
    }

    function showMessage(text = 'Скопировано!') {
        message.textContent = text;
        message.classList.add('show');
        setTimeout(() => {
            message.classList.remove('show');
        }, 2000);
    }

    overlay.addEventListener('click', () => {
        closeZoom();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && zoomedCard) {
            closeZoom();
        }
    });

    document.addEventListener('click', (e) => {
        if (zoomedCard && !e.target.closest('.card')) {
            closeZoom();
        }
    });
});
