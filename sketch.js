let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let speech = new p5.Speech(); 
let inputText = '';
let outputText = '';

let continuous = true; 
let interim = false; 
speechRec.start(continuous, interim);

let mobileWidth = 300; 
let mobileHeight = 535; 
let padding = 20; 

let messageY = 0;

let spokenTexts = [];
let phoneImg;

function preload() {
  phoneImg = loadImage('mobile.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  fill(255);
  image(phoneImg, (windowWidth - 1.3*mobileWidth) / 2 , (windowHeight - 1.25*mobileHeight) / 2, 1.3*mobileWidth, 1.25*mobileHeight);
  fill(0);
  textSize(16);
  textAlign(CENTER); 
  text("Ask Siri to set up an alert for rainy weather", windowWidth / 2, (windowHeight - mobileHeight) / 2 - 4*padding);
  textAlign(LEFT);
  if (inputText !== '') {
    let y = drawText(inputText, (windowWidth - mobileWidth) / 2 + padding, messageY, LEFT, color(0, 0, 255));
    if (outputText !== '') {
      drawText(outputText, (windowWidth + mobileWidth) / 2 - padding, y + 50, RIGHT, color(0, 255, 0));
      speakText(outputText); 
    }
  }
  if (messageY < (windowHeight - mobileHeight) / 2 + padding + 50) {
    messageY += 5;
  }
}

function gotSpeech() {
  if (speechRec.resultValue) {
    inputText = 'You : Can you set an alert for rainy weather?';
    setTimeout(function(){ 
      outputText = "Sorry, I don't quite get that. Could you try a simpler word?";
      setTimeout(function(){ location.reload(); }, 13000);
    }, 3000);
  }
}

function drawText(txt, x, y, align, col) {
  textAlign(align);
  let words = txt.split(' ');
  let line = '';
  let startY = y;
  let lines = [];
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = textWidth(testLine);
    if (testWidth > mobileWidth - 2 * padding && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
      y += textAscent() + textDescent();
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  fill(255); 
  let rectWidth = min(textWidth(txt) + padding, mobileWidth - 2 * padding);
  let rectX = align === LEFT ? x - padding / 2 : x - rectWidth + padding / 2;
  rect(rectX, startY - textAscent() - padding / 2, rectWidth, y - startY + textAscent() + textDescent() + padding, 10); 
  fill(col);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, startY + i * (textAscent() + textDescent())); 
  }
  return y;
}


function speakText(txt) {
  if (!txt.startsWith("You:") && !spokenTexts.includes(txt)) {
    speech.speak(txt);
    spokenTexts.push(txt);
  }
}
