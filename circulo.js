  <script src="circulo.js"></script>
// polygon array and number of verts
var poly = []
var n = 100 // feel free to play with this number :)

// canvas size variables
var w = 500
var h = 500

// oscillators
var chord = []
var root = 30
var major = [ 4, 5, 6 ]
var minor = [ 10, 12, 15 ]

// setup and draw functions ---

function setup() {
  createCanvas(w, h)
  strokeWeight(12)
  noFill()
  cursor(HAND)
  noStroke()
  n++ // add extra point for closing the polygon

  for (var i = 0; i < n; i++) {
    // populate regular polygon vertices given number of points n
  	var a = {
      x: (w/2) + 100*sin(map(i, 0, n-1, 0, TAU)),
      y: (h/2) + 100*cos(map(i, 0, n-1, 0, TAU))
    }
  	poly.push(a)
  }

  // initialize oscillators
  if (n < 25) {
    for (var i = 0; i < 3; i++)
    	chord[i] = new p5.TriOsc()
  } else {
    for (var i = 0; i < 3; i++)
    	chord[i] = new p5.SinOsc()
  }

  // initialize with major chord intervals
  for (var i = 0; i < chord.length; i++) {
    	chord[i].freq(major[i] * root)
        chord[i].amp(0.0)
  		chord[i].stop()
  }
}

function draw() {
  // use default blend mode for background
  blendMode(BLEND)
  background(0, 0, 0)

  // use additive blend mode to separate color channels
  blendMode(ADD)
  stroke(255, 0, 0)
  drawPoly(1000, 1000)

  stroke(0, 255, 0)
  drawPoly(1200, 1500)

  stroke(0, 0, 255)
  drawPoly(2000, 1700)

  // distort oscillatiors
  warpOsc()
}


// helper function implementations ---

function logMap(value, start1, stop1, start2, stop2) {
  // based off of linear regression + existing p5.map function

  start2 = log(start2)
  stop2 = log(stop2)

  return exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
}

function drawPoly(dx, dy) {
  // draws polygon given vertices in the poly[] array, adds mouse bias using params

  var g = 0
  if (mouseIsPressed)
    g = random(-2, 2)

  beginShape()
  for (var i = 0; i < n; i++) {
  	var bias = dist(mouseX, mouseY, poly[i].x, poly[i].y)
  	vertex(poly[i].x + dx / logMap(bias, w, 0, dx, 45) + g, poly[i].y + dy / logMap(bias, h, 0, dy, 45) + g)
  }
  endShape()
}

function warpOsc() {
  // uses max dist to determine the frequency distortion

  var bias = 0
  for (var i = 0; i < n; i++)
  	bias = max(bias, dist(mouseX, mouseY, poly[i].x, poly[i].y))

  for (var i = 0; i < chord.length; i++)
    chord[i].freq(map(bias, w, 0, major[i], minor[i]) * root)
}

function mousePressed() {
  // toggles synths on

  for (var i = 0; i < chord.length; i++) {
    chord[i].start()
    chord[i].amp(0.3, 0.5)
  }
}

function mouseReleased() {
  // toggles synths off

  for (var i = 0; i < chord.length; i++) {
    chord[i].amp(0.0, 0.05)
    chord[i].stop()
  }
}
