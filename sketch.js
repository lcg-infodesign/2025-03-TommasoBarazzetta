let table;
let img;
let volcanoes = [];

// Margine superiore riservato al titolo
let topMargin = 100; 
let scaleFactor;     

function preload() {
  table = loadTable("volcanoes-2025-10-27-Es.3-Original-Data.csv", "csv", "header");
  img = loadImage('sfondo.mappamondo.2.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Calcola la zona disponibile
  let drawableHeight = height - topMargin;
  let drawableWidth = width;
  
  scaleFactor = 0.9; 
  
  // carica i dati dei vulcani
  for (let r = 0; r < table.getRowCount(); r++) {
    let latitude = table.getNum(r, "Latitude");
    let longitude = table.getNum(r, "Longitude");

    // Coord originali basate sulla mappa piena
    let myX = map(longitude, -180, 180, 30, width - 30);
    let myY = map(latitude, 90, -87, 15, height - 15);

    volcanoes.push({ myX, myY, latitude, longitude, 
                     name: table.getString(r, "Volcano Name"),
                     location: table.getString(r, "Country") });
  }
}

function draw() {
  background(255);

  // traslazione e scaling
  push();
  translate(width / 2, topMargin + (height - topMargin) / 2); // centro nell’area utile
  scale(scaleFactor);
  translate(-width / 2, -(height - topMargin) / 2);

  // Disegno immagine ridimensionata 
  let imgRatio = 50 / 40;
  let canvasRatio = width / (height - topMargin);

  let newWidth, newHeight;
  if (imgRatio > canvasRatio) {
    newHeight = height - topMargin;
    newWidth = imgRatio * newHeight;
  } else {
    newWidth = width;
    newHeight = width / imgRatio;
  }

  let x = (width - newWidth) / 2;
  let y = (height - topMargin - newHeight) / 2 + topMargin / 2;
  image(img, x, y, newWidth, newHeight);

  //  Disegno vulcani 
  let hoveredVolcano = null;
  for (let v of volcanoes) {
    fill(0, 0, 255);
    noStroke();
    triangle(v.myX, v.myY, v.myX + 4, v.myY - 6, v.myX + 8, v.myY);

    let scaledMouseX = (mouseX - width / 2) / scaleFactor + width / 2;
    let scaledMouseY = (mouseY - (topMargin + (height - topMargin) / 2)) / scaleFactor + (height - topMargin) / 2;

    if (dist(scaledMouseX, scaledMouseY, v.myX, v.myY) < 6) {
      hoveredVolcano = v;
    }
  }

  if (hoveredVolcano) {
    drawTooltip(hoveredVolcano.name, hoveredVolcano.location, hoveredVolcano.myX, hoveredVolcano.myY);
  }

  pop();

  // Fascia per titolo/legenda 
  fill(255);
  noStroke();
  rect(0, 0, width, topMargin);
  fill(0,0,200);
  textAlign(LEFT, CENTER);
  textSize(40);
  textStyle(BOLD)
  textFont('Times New Roman')
  text("MAPPA DEI VULCANI ATTIVI", width/19 , topMargin / 2);

  fill(0,100,100)
  textAlign(RIGHT)
  textSize(17)
  textStyle(NORMAL)
  textAlign(LEFT, CENTER);
  textFont('sans-serif')
  text("Passando con il mouse sui triangoli blu, che indicano la posizione approssimativa del vulcano sulla mappa, è possibile sapere il nome del vulcano e la sua ubicazione", 75,80)
}

function drawTooltip(name, location, x, y) {
  let textContent = name + "\n" + location;
  textSize(15);
  let padding = 8;
  let w = max(textWidth(name), textWidth(location)) + padding * 2;
  let h = 45;

  fill(0, 150);
  rect(x + 10, y - 10, w, h, 5);

  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  text(textContent, x + 14, y - 6);
}
