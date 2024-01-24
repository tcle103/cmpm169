// sketch.js - makes interactive dolphin pendulum toy!
// Author: Tien Le
// Date: 1/24/23

// globals n stuff
var originx = 200;
var originy = 180;
var angle = 90;
var angle1 = 270;
var radius = 100;
var dir = 1; // 1 is counterclockwise, -1 is clockwise
var counter = 0;

// class that holds info for each dolphin - stores angle, speed
class Dolphin {
  constructor(angle) {
    this.angle = angle;
    this.speed = 0;
  }
  // updates the circular movement of the dolphin
  update() {
    let circlex = originx+cos(this.angle)*radius;
    let circley = originy+sin(this.angle)*radius;
  
    // transform technique but square rotation "follows" path
    // rotation is just equal to angle of circle
  
    push();
    translate(circlex, circley);
    rotate(this.angle);
  
    dolphin();
    pop();
    
    
    // controls spinning part - increments or decrements angle based
    // on the dir var (direction)
    // also includes easing - increasing speed at certain angle regions
    // this part only controls motion when speed > 0.2 - conditions for
    // pendulum beginning to stop
    if (dir == 1) {
      this.angle -= this.speed;
      if (abs(this.angle) > 220 && abs(this.angle) < 320 && this.speed > 0.2) {
        this.angle -= 1;
        if (abs(this.angle) > 230 && abs(this.angle) < 310) {
          this.angle -= 1;
        }
      }
      if (abs(this.angle) > 40 && abs(this.angle) < 140 && this.speed > 0.2) {
        this.angle -= 1;
        if (abs(this.angle) > 50 && abs(this.angle) < 130) {
          this.angle -= 1;
        }
      }
    }
    else if (dir == -1) {
      this.angle += this.speed;
      if (abs(this.angle) > 220 && abs(this.angle) < 320 && this.speed > 0.2) {
        this.angle += 1.5;
        if (abs(this.angle) > 230 && abs(this.angle) < 310) {
          this.angle += 1.5;
        }
      }
      if (abs(this.angle) > 40 && abs(this.angle) < 140 && this.speed > 0.2) {
        this.angle += 1.5;
        if (abs(this.angle) > 50 && abs(this.angle) < 130) {
          this.angle += 1.5;
        }
      }
    }
    
    // ensures angle stays within values used for region detection
    // 0-360 for counterclockwise, -360-0 for clockwise
    if (dir == 1 && this.angle < -360) {
      this.angle += 360;
    }
    else if (dir == -1 && this.angle > 360){
      this.angle -= 360;
    }
    
    // rounds angle to first decimal point to
    // help decrease desync
    this.angle = round(this.angle, 1);
    
  }
}

// initializes canvas, sets angle mode to degrees,
// sets frame rate, and initializes dolphins
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  frameRate(30);
  
  d1 = new Dolphin(90);
  d2 = new Dolphin(270);
}

// draws a dolphin!
function dolphin() {
  noStroke();
  push();
  // tbh idk why rotate this way but it works
  rotate(180);
  
  // stick
  fill("#5f8dd3");
  push();
  translate(97, 0);
  rect(0, 0, 6, 100);
  pop();
  
  // body
  fill("#aaccff");
  arc(100, 100, 120, 100, 0, 180, CHORD);
  
  // upper flipper
  push();
  translate(30, 110);
  rotate(350);
  ellipse(0, 0, 40, 17);
  pop();
  
  // lower flipper
  push();
  translate(30, 102);
  rotate(380);
  ellipse(0, 0, 40, 17);
  pop();
  
  
  // beak
  push();
  translate(152, 108);
  ellipse(0, 0, 40,17);
  pop();
  
  // dorsal fin
  push();
  translate(80, 145);
  rotate(330);
  ellipse(0, 0, 40, 20);
  pop();
  
  // pectoral fin
  push();
  translate(100, 102);
  rotate(410);
  ellipse(0, 0, 40, 20);
  pop();
  
  // eye
  fill("#5f8dd3");
  push();
  translate(145, 116);
  circle(0, 0, 7);
  pop();
  
  
  
  // reset scale
  pop();
}

// animation loopy bit
function draw() {
  background(256);
  
  d1.update();
  d2.update();
  
  //console.log(d1.speed, d2.speed);
  //console.log(d1.angle, d2.angle);
  //console.log(d1.angle, -dir*180 + d1.angle);
  
  // corrects any desync in d2.angle
  if ((abs(d2.angle) - abs(-dir*180+d1.angle)) > 0.2) {
    d2.angle = -dir*180 + d1.angle;
  }
  
  // reduces speed over time (should reduce by 1 every 2 seconds)
  if ((frameCount - counter) > 12 && d1.speed > 0.2) {
    counter = frameCount;
    d1.speed -= 0.2;
    d2.speed -= 0.2;
    d1.speed = round(d1.speed, 1);
    d2.speed = round(d2.speed, 1);
    if (d1.speed < 0.2) {
      d1.speed = 0.2;
      d2.speed = 0.2;
    }
  }

  // motion end conditions - brings dolphins back to equilibrium
  if (d1.speed <= 0.2 && d2.speed <= 0.2) {
      if (abs(d1.angle) > 240 && abs(d1.angle) < 270) {
        d1.speed = 0;
        d2.speed = 0;
        if (abs(d1.angle) < 270) {
          d1.angle += (-dir)*0.2;
        }
        if (abs(d2.angle) < 90) {
          d2.angle += (-dir)*0.2;
        }
      } 
      if (abs(d1.angle) > 60 && abs(d1.angle) < 90) {
        d1.speed = 0;
        d2.speed = 0;
        if (abs(d1.angle) < 90) {
          d1.angle += (-dir)*0.2;
        }
        if (abs(d2.angle) < 270) {
          d2.angle += (-dir)*0.2;
        }
      }
    }
  
  
  
  
  // draw the rest of the pendulum
  noStroke();
  fill("#5f8dd3");
  circle(originx, originy, 30);
  
  fill("#374845");
  circle(originx, originy, 20);
  rect(originx-4, originy, 8, 200);
  rect(60, 368, 280, 20);
  
  stroke("#374845");
  strokeWeight(8);
  noFill();
  triangle(100, 380, originx, originy, 300, 380);
  
}

// controls interactivity stuff w/ click events!
function mousePressed() {
  //console.log(mouseY);
  if (mouseX <= 200) {
    dir = -1;
  }
  else {
    dir = 1;
  }
  
  let strength = map(mouseY, 0, 400, 1, 6);
  if (d1.speed+strength <= 30) {
    d1.speed += strength;
    d2.speed += strength;
  }
  else {
    d1.speed = 30;
    d2.speed = 30;
  }
  
}
