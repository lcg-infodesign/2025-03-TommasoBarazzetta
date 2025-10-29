let table;
let img;
let volcanoes = [];


function preload() {
  // put preload code here
  table = loadTable("volcanoes-2025-10-27-Es.3-Original-Data.csv", "csv", "header");
  img = loadImage('sfondo.mappamondo.2.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // put setup code here
 
  for (let r = 0; r < table.getRowCount(); r++) {
    let latitude = table.getNum(r, "Latitude");
    let longitude = table.getNum(r, "Longitude");
    let myX = map(longitude, -180, 180, 30, width-30);
    let myY = map(latitude, 90, -90, 15, height-15);
    let name = table.getString(r, "Volcano Name");
    let location = table.getString(r, "Country");
    volcanoes.push({ myX, myY, name, location });
  }

}

function draw() {
  // put drawing code here

  let imgRatio = img.width / img.height;
  let canvasRatio = width / height ;

  let newWidth, newHeight;

  if (imgRatio > canvasRatio) {
    // L'immagine è più larga → adatta l'altezza
    newHeight = height;
    newWidth = imgRatio * height;
  } else {
    // L'immagine è più alta → adatta la larghezza
    newWidth = width;
    newHeight = width / imgRatio;
  }

  // Centra l'immagine
  let x = (width - newWidth) / 2;
  let y = (height - newHeight) / 2;

  image(img, x, y, newWidth, newHeight);


   let hoveredVolcano = null;

  // Prima disegna tutti i vulcani
  for (let v of volcanoes) {
    fill(0, 0, 255);
    noStroke();
    triangle(v.myX, v.myY, v.myX+4, v.myY-6, v.myX+8, v.myY);

    // Controlla se il mouse è sopra
    if (dist(mouseX, mouseY, v.myX, v.myY) < 6) {
      hoveredVolcano = v;
    }
  }

  // Poi disegna il tooltip SOLO se il mouse è sopra un vulcano
  if (hoveredVolcano) {
    drawTooltip(hoveredVolcano.name, hoveredVolcano.location, hoveredVolcano.myX, hoveredVolcano.myY);
  }
}

function drawTooltip(name, location, x, y) {
  let textContent = name + "\n" + location;
  textSize(15);
  let padding = 8;
  let w = textWidth(name) + padding * 2;
  let w2 = textWidth(location) + padding * 2;
  if (w2 > w) {
    w = w2;
  }
  let h = 45;

  fill(0, 150);
  rect(x + 10, y - 10, w, h, 5);

  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  text(textContent, x + 14, y - 6);



}
