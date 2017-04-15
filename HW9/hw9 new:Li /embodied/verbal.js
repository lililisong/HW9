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

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;
    if (user_said.toLowerCase().includes("\u4F60\u597D") && user_said.toLowerCase().includes("\u4F60\u53EB\u4EC0\u4E48\u540D\u5B57\uFF1F") && state === "initial") {
      response = "\u5B8C\u7F8E\u79C3";
    } else if (user_said.toLowerCase().includes("\u4F60\u597D") && state === "initial") {
      response = "\u597D\u4F60\u5988";
      state = "initial"
    } else if (user_said.toLowerCase().includes("\u4F60\u53EB\u4EC0\u4E48\u540D\u5B57") && state === "initial") {
      response = "\u5B8C\u7F8E\u79C3";
      state = "initial"
    } else if (user_said.toLowerCase().includes("\u62DC\u62DC")) {
      response = "\u6EDA";
      state = "initial"
    } else {
      response = "\u4F60\u4ED6\u5988\u8BF4\u4EC0\u4E48";
    }
    return response;
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
  u.pitch = 2.0 //between 0 and 2
  u.rate = 5.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Ting-Ting";})[0]; //pick a voice

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
