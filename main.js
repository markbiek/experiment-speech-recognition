import Draw from './draw';
import './style.css'


const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const directions = ['left', 'right', 'up', 'down', 'left'];
const grammar = `#JSGF V1.0; grammar directions; public <direction> = ${directions.join(' | ')}`;
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const canvas = document.getElementById('canvas');
let step = 10;
let speed = 1000;
let direction = 'right';
let prevDirection = 'right';
let startX = 0
let startY = 0;
let endX = startX + step;
let endY = startY;
let draw = new Draw(canvas);
let intervalId = null;

function out(msg, type = 'info') {
	const output = document.getElementById('output');

	output.innerHTML += `<span class="msg ${type}">&mdash; ${msg}</span><br />`;
}

function start() {
	step = parseInt(document.getElementById('step').value);
	speed = parseInt(document.getElementById('speed').value);

	intervalId = setInterval(() => {
		render();
	}, speed);
}

function stop() {
	if (intervalId) {
		clearInterval(intervalId);
	}
}

function render() {
	//draw.clear();

	const changed = prevDirection != direction;
	let changeIncrease = 0;

	if (changed) {
		console.log(`Changing from ${direction} to ${prevDirection}`);
		prevDirection = direction;
	}

	switch (direction) {
		case 'right':
			if (changed) {
				endY = startY;
			}

			startX = endX;
			endX += step;

			if (endX == startX) {
				endX += step;
			}
			break;
		case 'left':
			if (changed) {
				endY = startY;
			}

			startX -= endX;
			endX -= step;

			if (endX == startX) {
				endX += step;
			}
			break;
		case 'up':
			if (changed) {
				endX = startX;
			}

			startY += step;
			endY += step;

			if (endY == startY) {
				endY += step;
			}
			break;
		case 'down':
			if (changed) {
				endX = startX;
			}

			startY -= step;
			endY -= step;

			if (endY == startY) {
				endY += step;
			}
			break;
	}

	console.log(`direction: (${startX}, ${startY}) (${endX}, ${endY})`);

	draw.ln(startX, startY, endX, endY);
}

window.addEventListener('load', () => {

	document.getElementById('start-recognition').addEventListener('click', e => {
		e.preventDefault();

		recognition.start();
	});
});

recognition.addEventListener('result', e => {
	let ok = false;
	const word = e.results[e.results.length - 1][0].transcript.trim();

	if (directions.indexOf(word) >= 0) {
		direction = word;
		ok = true;
	}

	if (word === 'clear') {
		draw.clear();
	}

	if (word === 'start') {
		start();
		ok = true;
	}

	if (word === 'stop') {
		stop();
		ok = true;
	}

	out(`You said the word '${word}'`);

	if (ok) {
		render();
	}
});

recognition.addEventListener('nomatch', e => {
	out("Sorry, I couldn't understand you.");
});

recognition.addEventListener('error', e => {
	out(`ERROR: ${e.error}, ${e.message}`, 'error');
});

recognition.addEventListener('start', e => {
	out("Started listening. Say 'start' to begin drawing.");
})

recognition.addEventListener('end', e => {
	stop();
	out('ERROR: Speech recognition service disconnected, please refresh.', 'error');
})