import Draw from './draw';
import './style.css'

function out(msg) {
	const output = document.getElementById('output');

	output.innerHTML += `${msg}<br />`;
}

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
const step = 10;
const speed = 2000;
let direction = 'right';
let startX = 0
let startY = 0;
let draw = new Draw(canvas);

function render() {
	draw.clearBox(startX, startY);

	console.log(direction);

	switch (direction) {
		case 'right':
			startX += step;
			break;
		case 'left':
			startX -= step;
			break;
		case 'up':
			startY += step;
			break;
		case 'down':
			startY -= step;
			break;
	}

	console.log(startX, startY);

	draw.box(startX, startY);
}

window.addEventListener('load', () => {
	recognition.start();
	out('Ready to receive a command.');

	const intervalId = setInterval(() => {
		render();
	}, speed);
});

recognition.addEventListener('result', e => {
	const word = e.results[e.results.length - 1][0].transcript.trim();

	if (directions.indexOf(word) >= 0) {
		direction = word;
	}

	render();

	out(`You said the word '${word}'`);

});

recognition.addEventListener('nomatch', e => {
	out("Sorry, I couldn't understand you.");
})

recognition.addEventListener('error', e => {
	out(`ERROR: ${e.error}, ${e.message}`);
})