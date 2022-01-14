const model_url =
    'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let freq;
var predictedNote;
var notesList;
getNotesList()
console.log(notesList)
predictNote()
let img;
let angle;
let digitalFont;
function preload() {
  digitalFont = loadFont('res/DS-DIGII.TTF')
}

function setup() {
  let cnv = createCanvas(400, 400);
  angleMode(DEGREES);
  audioContext = getAudioContext();
  audioContext.suspend();
  mic = new p5.AudioIn();
  mic.start(listening);
}


function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    if (frequency) {
      freq = frequency;
      predictNote()
      console.log(predictedNote)
    }
    pitch.getPitch(gotPitch);
  }
}

function getNotesList(){
  var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  var octave = 0
  notesList = []
  for (var i = 21; i <= 108; i++){
    note_freq = 440 * 2 ** ((i-69)/12);
    if(i%12 == 0){octave+=1}
    notesList.push({"midi_n": i, "note": notes[i%12], "octave": octave, "freq": note_freq, "diff":0} )
  }
}

function predictNote(){
  let t_array = notesList.map(
      item => { return Math.abs(item["freq"] - freq)}
  )
  let diff_array = notesList.map(
      item => { return (item["freq"] - freq)}
  )
  let min = Math.min.apply(null, t_array)
  let index = t_array.indexOf(min)
  predictedNote = notesList[index]
  diff=diff_array[index]
  if(predictedNote){
    predictedNote.diff = -diff
  }
}

function listening(){
  console.log("listening");
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded(){
  console.log("model loaded!");
  pitch.getPitch(gotPitch);
}

function drawText(){
  fill(50)
  textFont(digitalFont)
  textAlign(CENTER, CENTER)
  if(freq){
    if(predictedNote.note.length >1){
      textSize(200)
      text(predictedNote.note, width/2, height/2)
      textSize(100)
      textAlign(LEFT, BOTTOM)
      text(predictedNote.octave, width/2+100, height/2)
    }else{
      textSize(200)
      text(predictedNote.note, width/2-30, height/2)
      textSize(100)
      textAlign(LEFT, BOTTOM)
      text(predictedNote.octave, width/2+50-30, height/2)
    }
  }
}

function drawTuner(){
  textSize(50)
  textFont("Arial")
  textAlign(CENTER, CENTER)
  if(freq){
    text(freq.toFixed(2), width/2, height/2-150)
  }
  if(predictedNote){
    fill(255)
    rect(width/2+int(predictedNote.diff)*10, height, 5, -80) //тюнер
  }
  fill(255,0,0)
  if(predictedNote && Math.abs(int(predictedNote.diff))<int(freq)*0.001){
    fill(0, 255, 0)
  }
  rect(width/2-5, height, 10, -100) //палка

}

function draw() {
  background(5)
  noStroke()
  drawText()
  drawTuner()

}

function mousePressed() {
  userStartAudio();
}
