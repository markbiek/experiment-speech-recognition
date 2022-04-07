import './style.css'

function out(msg) {
	const output = document.getElementById('output');

	output.innerHTML += `${msg}<br />`;
}

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const grammar = '#JSGF V1.0; grammar directions; public <direction> = left | right | up | down';
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

window.addEventListener('load', () => {
	recognition.start();
	out('Ready to receive a command.');
});

recognition.addEventListener('result', e => {
	const word = e.results[e.results.length - 1][0].transcript;

	out(`You said the word '${word.trim()}'`);
});

recognition.addEventListener('nomatch', e => {
	out("Sorry, I couldn't understand you.");
})

recognition.addEventListener('error', e => {
	out(`ERROR: ${e.error}, ${e.message}`);
})