/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "zh-CN";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}
/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;
    if (user_said.toLowerCase().includes("Ni hao") && user_said.toLowerCase().includes("Ni jiao shen me?") && state === "initial") {
      response = "Wan mei tu";
    } else if (user_said.toLowerCase().includes("Ni hao") && state === "initial") {
      response = "Gun gun gun";
      state = "initial"
    } else if (user_said.toLowerCase().includes("Ni jiao shen me ming zi?") && state === "initial") {
      response = "Wan mei tu";
      state = "initial"
    } else if (user_said.toLowerCase().includes("Bai bai")) {
      response = "Ni gei wo hui lai";
      state = "initial"
    } else {
      response = "ni ta ma shuo shen me";
    }
    return response;
  }
/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 
  setEyeColor("green");

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'zh-CN';
  u.volume = 0.5 //between 0.1
  u.pitch = 1.0 //between 0 and 2
  u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Ting-Ting"; })[0]; //pick a voice

  u.onend = function () {


      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
