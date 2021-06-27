//Move your mouse to create CONSTELLATIONS 
//Heavy load after constellaton creation.. suggest if some speed optimisations are possible after the creation of constellations by mouse..

function Emitter(width, height) {
  this.width = width;
  this.height = height;
  this.particles = [];
  this.lines = [];
}
Emitter.prototype.emit = function(x, y) {
  var p = new Particle(this, x || 0, y || 0);
  var _this = this;
  this.particles.forEach(function(val){
    _this.lines.push(new Line(_this,p,val));
  });
  this.particles.push(p);
  return this;
}
Emitter.prototype.step = function(delta) {
  this.particles.forEach(function(p){
    p.angle += Math.random() * 0.4 - 0.2;
    p.step(delta);
  });
  return this;
}
Emitter.prototype.draw = function(ctx) {
  this.lines.forEach(function(l) {
    l.draw(ctx);
  });
  return this;
}
function Particle(emitter, x, y) {
  this.x = x;
  this.y = y;
  this.emitter = emitter;
  this.angle = Math.random()*360;
}
Particle.prototype.step = function(delta) {
  var stepX = Particle.velocity*Math.cos(this.angle);
  var stepY = Particle.velocity*Math.sin(this.angle);
  this.x += stepX*delta + this.emitter.width;
  this.y += stepY*delta + this.emitter.height;
  this.x %= this.emitter.width;
  this.y %= this.emitter.height;
  return this;
}
Particle.velocity = .05;

function Line(emitter, particle1, particle2) {
  Line.maxLength = emitter.height/8;
  this.particle1 = particle1;
  this.particle2 = particle2;
}

Line.prototype.length = function() {
  var x = this.particle1.x - this.particle2.x;
  var y = this.particle1.y - this.particle2.y;
  return Math.sqrt(x*x + y*y);
}
Line.prototype.draw = function(ctx) {
  var opacity = Math.max(-1,Line.maxLength - this.length())/Line.maxLength;
  if (opacity > 0) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba('+parseInt(Math.random()*50)+','+parseInt(Math.random()*155)+','+parseInt(Math.random()*200)+',' + opacity + ')'; 
    ctx.arc(this.particle1.x,this.particle1.y,1,0,2*Math.PI);
    ctx.arc(this.particle2.x,this.particle2.y,1,0,2*Math.PI);
    ctx.stroke();
  } 
} 
var jj = 0;
window.addEventListener("DOMContentLoaded", function(){ 
  setTimeout(function(){
    var cvs = document.getElementById('cvs');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d'); 
    var emitter = new Emitter(cvs.width, cvs.height);
    for(var i = 0; i < 50; i++) {
  emitter.emit(Math.random()*cvs.width, Math.random()*cvs.height); 
    }
    Hammer(document.getElementById('cvs')).on("doubletap",{drag: false,transform: false}, function(event) {
        alert('hello!');
    });
Hammer(document.getElementById('cvs')).on(
  "tap",
  function(event)
  {
      emitter.emit(event.gesture.center.pageX, event.gesture.center.pageY);
  });
     
    $('canvas').mousemove( 
  function(e)
  { if(jj % 10 == 0)  emitter.emit(e.pageX, e.pageY);
  });
    var time = new Date().getTime();
    (function animloop(){
      requestAnimationFrame(animloop);
     jj++;
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0,cvs.width, cvs.height);
      var t = new Date().getTime();
      emitter.step(t - time);
      time = t;
      emitter.draw(ctx);
    })();
  },0);
});