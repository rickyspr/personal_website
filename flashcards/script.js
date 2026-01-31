let currentCategory = [];
let activeDeck = [];
let currentCardIndex = 0;

const cardElement = document.getElementById('card');
const feedbackBtns = document.getElementById('feedback-controls');
const cardsLeftText = document.getElementById('cards-left');
const finishScreen = document.getElementById('finish-screen');

async function startTraining(category) {
    try {
        const response = await fetch(`data/${category}.txt`);
        if (!response.ok) throw new Error("Fil saknas");
        const text = await response.text();
        
        currentCategory = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.includes(';'))
            .map(line => {
                const [q, a] = line.split(';');
                return { q: q.trim(), a: a.trim() };
            });

        document.getElementById('home-screen').style.display = 'none';
        document.getElementById('training-screen').style.display = 'flex';
        resetRound();
    } catch (e) {
        alert("Kunde inte ladda kategorin. Kör du via Live Server?");
    }
}

function goHome() {
    document.getElementById('home-screen').style.display = 'flex';
    document.getElementById('training-screen').style.display = 'none';
    finishScreen.style.display = 'none';
}

function resetRound() {
    finishScreen.style.display = 'none';
    activeDeck = [...currentCategory];
    if (document.getElementById('randomToggle').checked) {
        activeDeck.sort(() => Math.random() - 0.5);
    }
    currentCardIndex = 0;
    showNextCard();
}

function showNextCard() {
    cardElement.classList.remove('flipped');
    feedbackBtns.style.visibility = 'hidden';
    cardsLeftText.innerText = activeDeck.length;

    if (activeDeck.length === 0) {
        finishScreen.style.display = 'flex';
        return;
    }
    updateCardDisplay();
}

function updateCardDisplay() {
    const cardData = activeDeck[currentCardIndex];
    const startWithAnswer = document.getElementById('sideToggle').checked;

    const frontText = startWithAnswer ? cardData.a : cardData.q;
    const backText = startWithAnswer ? cardData.q : cardData.a;

    const frontEl = document.getElementById('frontText');
    const backEl = document.getElementById('backText');

    frontEl.innerHTML = frontText;
    backEl.innerHTML = backText;

    // Dynamisk fontstorlek
    adjustFontSize(frontEl, frontText);
    adjustFontSize(backEl, backText);

    document.getElementById('frontLabel').innerText = startWithAnswer ? "Svar" : "Fråga";
    document.getElementById('backLabel').innerText = startWithAnswer ? "Fråga" : "Svar";

    renderMath();
}

function adjustFontSize(element, text) {
    const cardFace = element.parentElement;
    if (text.length > 350) {
        cardFace.style.fontSize = "0.9rem";
    } else if (text.length > 150) {
        cardFace.style.fontSize = "1.1rem";
    } else {
        cardFace.style.fontSize = "1.5rem";
    }
}

function renderMath() {
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

function handleFeedback(isRight) {
    if (isRight) {
        activeDeck.splice(currentCardIndex, 1);
    } else {
        currentCardIndex++;
    }
    if (currentCardIndex >= activeDeck.length) currentCardIndex = 0;
    showNextCard();
}

// MODAL LOGIK
function openModal() { document.getElementById('custom-modal').style.display = 'block'; }
function closeModal() { document.getElementById('custom-modal').style.display = 'none'; }
function saveCustomSet() {
    const data = document.getElementById('custom-data').value;
    const lines = data.split('\n').filter(l => l.includes(';'));
    if (lines.length === 0) return alert("Använd formatet Fråga;Svar");
    
    currentCategory = lines.map(l => {
        const [q, a] = l.split(';');
        return { q: q.trim(), a: a.trim() };
    });
    
    closeModal();
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('training-screen').style.display = 'flex';
    resetRound();
}

document.getElementById('cardContainer').addEventListener('click', () => {
    cardElement.classList.toggle('flipped');
    feedbackBtns.style.visibility = 'visible';
});