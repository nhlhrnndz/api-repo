// app.js
// Base URL for API calls
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements - MUST MATCH HTML IDs EXACTLY
const jokeDisplay = document.getElementById('jokeDisplay');
const catFactDisplay = document.getElementById('catFactDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const getCatFactBtn = document.getElementById('getCatFactBtn');
const jokeForm = document.getElementById('jokeForm');
const jokeInput = document.getElementById('jokeInput');
const submissionResult = document.getElementById('submissionResult');
const resultMessage = document.getElementById('resultMessage');

// Check if elements exist (debugging)
console.log('Elements found:', {
    jokeDisplay: !!jokeDisplay,
    catFactDisplay: !!catFactDisplay,
    getJokeBtn: !!getJokeBtn,
    getCatFactBtn: !!getCatFactBtn,
    jokeForm: !!jokeForm,
    jokeInput: !!jokeInput,
    submissionResult: !!submissionResult,
    resultMessage: !!resultMessage
});

// Function to fetch and display a joke
async function fetchJoke() {
    try {
        jokeDisplay.innerHTML = '<p>Loading joke... 🤔</p>';
        getJokeBtn.classList.add('loading');
        getJokeBtn.textContent = 'Loading...';

        const response = await fetch(`${API_BASE_URL}/jokes`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let jokeText = '';
        if (data.type === 'single') {
            jokeText = data.joke;
        } else if (data.type === 'twopart') {
            jokeText = `${data.setup}\n\n${data.delivery}`;
        } else {
            jokeText = 'No joke available';
        }
        
        jokeDisplay.innerHTML = `<p style="white-space: pre-line;">${jokeText}</p>`;
        
    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeDisplay.innerHTML = `<p style="color: #dc3545;">Sorry, couldn't load a joke. Please try again!</p>`;
    } finally {
        getJokeBtn.classList.remove('loading');
        getJokeBtn.textContent = 'Get a Joke';
    }
}

// Function to fetch and display a cat fact
async function fetchCatFact() {
    try {
        catFactDisplay.innerHTML = '<p>Loading cat fact... 🐱</p>';
        getCatFactBtn.classList.add('loading');
        getCatFactBtn.textContent = 'Loading...';

        const response = await fetch(`${API_BASE_URL}/cat-facts`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        catFactDisplay.innerHTML = `<p>${data.fact}</p>`;
        
    } catch (error) {
        console.error('Error fetching cat fact:', error);
        catFactDisplay.innerHTML = `<p style="color: #dc3545;">Sorry, couldn't load a cat fact. Please try again!</p>`;
    } finally {
        getCatFactBtn.classList.remove('loading');
        getCatFactBtn.textContent = 'Get Cat Fact';
    }
}

// Function to submit a custom joke
async function submitJoke(joke) {
    try {
        const response = await fetch(`${API_BASE_URL}/jokes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ joke: joke })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        submissionResult.classList.remove('hidden', 'error');
        submissionResult.classList.add('success');
        resultMessage.textContent = `✅ ${data.message}`;
        jokeInput.value = '';
        
    } catch (error) {
        console.error('Error submitting joke:', error);
        submissionResult.classList.remove('hidden', 'success');
        submissionResult.classList.add('error');
        resultMessage.textContent = '❌ Failed to submit joke. Please try again!';
    }
}

// Event Listeners - Make sure elements exist before adding listeners
if (getJokeBtn) getJokeBtn.addEventListener('click', fetchJoke);
if (getCatFactBtn) getCatFactBtn.addEventListener('click', fetchCatFact);

if (jokeForm) {
    jokeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const joke = jokeInput.value.trim();
        
        if (joke === '') {
            submissionResult.classList.remove('hidden', 'success');
            submissionResult.classList.add('error');
            resultMessage.textContent = '⚠️ Please write a joke before submitting!';
            return;
        }
        
        submitJoke(joke);
    });
}

// Load initial data
window.addEventListener('load', () => {
    fetchJoke();
    fetchCatFact();
});