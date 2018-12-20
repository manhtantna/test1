var cv = document.getElementById('myCanvas');
var c = cv.getContext('2d');
var w = c.canvas.width;
var h = c.canvas.height;

// The cannon fits snugly at the bottom left
// corner of the screen and shoots bullets.
// The game is over when the cannon is hit
// by an enemy.
function Cannon() {
  // Constants
  this.size = 30;
  // Position
  this.x = this.size / 2;
  this.y = h - this.size / 2;
  // Initial angle, this tracks the mouse soon
  this.angle = 45;
  // How many frames we have to wait to shoot
  // again, the first number is time in seconds,
  // so, if it is 0.5, that means a half a 
  // second delay
  this.reloadDelay = 0.0 * world.frames;
  
  this.draw = function() {
    var x = this.x;
    var y = this.y;
    var s = this.size;
    c.save();
    // Move to the center of the cannon
    c.translate(x, y);
    // The cannon sits on a little stand
    // half of its height and 10% its width
    c.strokeRect(-s * 0.1 / 2, 0,
                 s * 0.1, s / 2);
    // The cannon itself is two rectangles,
    // next to each other and rotated
    // through the angle
    c.rotate(-this.angle * Math.PI / 180);
    c.fillRect(-s * 0.4, -s * 0.4 / 2,
               s * 0.4, s * 0.4);
    c.fillRect(0, -s * 0.1, s * 0.5, s * 0.2);
    c.restore();
  };
  
  this.move = function() {
    // Change angle to match mouse location
    var diffX = mouse.x - this.x;
    var diffY = mouse.y - this.y;
    var dist = Math.sqrt(diffX * diffX +
                         diffY * diffY);
    var a = -Math.atan2(diffY, diffX);
    this.angle = a / Math.PI * 180;
    
    // If mouse is down and not reloading, fire
    if (isMouseDown && !this.reload) {
      // Create a bullet at the end of the
      // muzzle
      a = this.angle / 180 * Math.PI;
      var x = this.x;
      x += Math.cos(a) * this.size;
      var y = this.y;
      y -= Math.sin(a) * this.size;

      // Muzzle velocity varies based on
      // distance of the mouse from the
      // cannon
      var vStr = 0.05 * (dist + 10);
      
      // Distribute the muzzle velocity
      // across velocity in x and y
      var vx = Math.cos(a) * vStr;
      var vy = Math.sin(a) * vStr;
      
      // Finally, create a new bullet
      var bullet = new Bullet(x, y, vx, -vy);
      world.bullets.push(bullet);
      
      // Don't let us shoot again for
      // a little while
      this.reload = this.reloadDelay;
    }
    if (this.reload) { this.reload--; }
  };
}

// Enemies start at a random spot on the 
// right side and move left, either hitting 
// the cannon, going off the left side of the
// screen, or getting hit by a bullet
function Enemy() {
  // Size
  this.r = 10 + 50 * Math.random();
  this.size = this.r * 2;
  // Position
  this.x = w;
  this.y = h / 2;
  this.y += (h - this.r) / 2 * Math.random();
  // Velocity
  this.vx = -Math.random() * 6 - 1;
  this.vy = (Math.random() - 0.5) * 35;
  
  this.move = function() {
    // Adjust location by velocities
    this.x += this.vx;
    this.y += this.vy;
    var bottom = h - this.r;
    if (this.y > bottom) {
      // We hit the ground, bounce off
      // First, compute how far we have left
      // to move
      var remain = (this.y - bottom) / this.vy;
      // Move to the ground
      this.y = bottom;
      // Reverse the vertical velocity,
      // simulating a partially elastic collision
      this.vy = -Math.abs(this.vy) *
        world.bounce;
      // Move off the ground
      this.y += this.vy * remain;
    }
    // Gravity is an acceleration, so
    // it changes the velocity, and it points
    // straight down
    this.vy += world.gravity;
  };
  
  this.draw = function() {
    // Enemies are drawn as a little circle
    c.beginPath();
    c.arc(this.x, this.y, this.r,
          0, Math.PI * 2);
    c.stroke();
  };
  
  this.isOverlap = function(o2) {
    // Checks if the enemy overlaps another
    // object.  Assumes whatever is passed
    // in is an object with x, y, and size
    var o1 = this;
    var dx = o1.x - o2.x;
    var dy = o1.y - o2.y;
    var s = (o1.size + o2.size) / 2;
    var d = Math.sqrt(dx * dx + dy * dy);
    return (d <= s);
  };
  
  this.shouldDie = function() {
    return this.x + this.r < 0;
  };
}

// The cannon shoots bullets
function Bullet(x, y, vx, vy) {
  // Position
  this.x = x;
  this.y = y;
  // Velocity
  this.vx = vx;
  this.vy = vy;
  // Constants
  this.size = 2;
  this.angle = 0;
  this.va = 10;  // Angular velocity
  
  this.move = function() {
    // Adjust location by velocities
    this.x += this.vx;
    this.y += this.vy;
    // Spin the bullets
    this.angle += this.va;
    // Gravity is an acceleration, so
    // it changes the velocity, and it points
    // straight down
    this.vy += world.gravity;
  };
  
  this.draw = function() {
    // Bullets are drawn as a little spinning
    // box
    var s = this.size;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle * Math.PI / 180);
    c.fillRect(-s / 2, -s / 2, s, s);
    c.restore();
  };
  
  this.shouldDie = function() {
    return this.y > h;
  };
}

// A bullet (and anything the bullet hits) turns
// into an explosion, which is a shower of
// particles
function Explosion(source) {
  this.particles = [];
  
  this.init = function(s) {
    var num = Math.max(10, s.size / 2);
    for (var i = 0; i < num; i++) {
      // Start the explosion in the same 
      // spot as the source, and with random
      // velocities influenced by, but
      // not dominated by, the source
      var vx = 2 * s.vx * (Math.random() - 0.2);
      vx += 3 * (Math.random() - 0.5);
      var vy = 2 * s.vy * (Math.random() - 0.2);
      vy += 3 * (Math.random() - 0.5);
      var p = new Particle(s.x, s.y, vx, vy);
      this.particles.push(p);
    }
  };
  this.init(source);
  
  this.move = function() {
    var ps = this.particles;
    // Delete particles that should die
    for (var i = ps.length - 1; i >= 0; i--) {
      var p = ps[i];
      if (p.shouldDie()) {
        ps.splice(i, 1);
      }
    }
    // Move all remaining particles
    for (i = 0; i < ps.length; i++) {
      ps[i].move();
    }
  };
  
  this.draw = function() {
    var ps = this.particles;
    // Draw all particles
    for (var i = 0; i < ps.length; i++) {
      ps[i].draw();
    }
  };
  
  this.shouldDie = function() {
    return this.particles.length <= 0;
  };
}

// A particle is just a single point.
function Particle(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  // The life of a particle in number of frames.
  // Particles live for a random time (eg. 
  // from 1-3 seconds)
  this.life = 1 * world.frames;
  this.life *= Math.random() * 2 + 1;
  // Air resistance here is specific to particles
  // since they are light.
  this.airResist = 0.97;
  
  this.move = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y > h) {
      // We hit the ground, bounce off
      // First, compute how far we have left
      // to move
      var remain = (this.y - h) / this.vy;
      // Move to the ground
      this.y = h;
      // Reverse the vertical velocity,
      // simulating a partially elastic collision
      this.vy = -Math.abs(this.vy) *
        world.bounce;
      // Reduce the horizontal velocity too
      this.vx *= world.bounce;
      // Move off the ground
      this.y += this.vy * remain;
    }
    // Use gravity if we want this to look
    // like pieces
    this.vy += world.gravity;
    // Use airResist if we want this to look
    // like drifting sparks
    this.vx *= this.airResist;
    this.vy *= this.airResist;
    this.life -= 1;
  };
  
  this.draw = function() {
    c.fillRect(this.x, this.y, 1, 1);
  };
  
  this.shouldDie = function() {
    return this.life <= 0;
  };
}


// The world holds all the state of the game and
// manages moving and updating everything
function World() {
  // Constants
  this.timeStep = 50;  // In milliseconds
  this.frames = 1000 / this.timeStep;
  // Elasticity of collisions with the ground.
  // Setting to 1.0 is fully elastic, 0.0 is
  // no bounce at all (landing with a thud).
  this.bounce = 0.8;
  // Gravity is an acceleration, so it changes
  // velocity every frame.
  this.gravity = 0.5;
  // This is the odds of us spawning a new enemy
  // in a frame.  The first number is the
  // likelihood per second, so 0.6 would mean a 
  // roughly 60% chance of a new enemy every
  // second
  this.spawnChance = 0.6 / this.frames;
  this.maxDifficulty = 10;
  
  this.init = function() {
    // World state
    this.cannon = new Cannon();
    this.bullets = [];
    this.explosions = [];
    this.enemies = [];
    this.score = 0;
    this.gameOver = false;
  };

  this.update = function() {
    this.spawn();
    this.move();
    this.collide();
    this.draw();
  };

  this.spawn = function() {
    // Spawn new enemies
    var chance = world.spawnChance;
    // Make the game slowly get harder as the 
    // score gets higher, up to some maximum
    var difficulty = this.score / 1000 + 1;
    difficulty = Math.sqrt(difficulty);
    difficulty = Math.min(difficulty,
                          this.maxDifficulty);
    chance *= difficulty; 
    // Don't spawn new enemies as much if there
    // are already enemies out there, that
    // makes the game not fun since you can't
    // reload fast enough to have any ability
    // to win
    chance /= this.enemies.length + 1;
    if (Math.random() < chance) {
        this.enemies.push(new Enemy());
    }
  };

  this.move = function() {
    // Move everything
    this.cannon.move();
    var l = this.bullets.length;
    for (var i = l - 1; i >= 0; i--) {
      var b = this.bullets[i];
      if (b.shouldDie()) {
        // The bullet has hit the ground or
        // exploded or otherwise needs to die.
        // Add an explosion
        var e = new Explosion(b);
        this.explosions.push(e);
        // Delete the bullet
        this.bullets.splice(i, 1);
      } else {
        b.move();
      }
    }
    l = this.explosions.length;
    for (i = l - 1; i >= 0; i--) {
      var ex = this.explosions[i];
      if (ex.shouldDie()) {
        this.explosions.splice(i, 1);
      } else {
        ex.move();
      }
    }
    l = this.enemies.length;
    for (i = l - 1; i >= 0; i--) {
      var em = this.enemies[i];
      if (em.shouldDie()) {
        this.enemies.splice(i, 1);
      } else {
        em.move();
      }
    }
  };

  this.collide = function() {
    // Our collision detection is a little 
    // simple, it just checks if two objects
    // overlap, leaving open the possiblity that
    // fast moving objects will actually move
    // through each other in one frame. Oh well.

    // Check for collisions between bullets
    // and enemies
    var e;
    var l = this.enemies.length;
    for (var i = 0; i < l; i++) {
      e = this.enemies[i];
      var l2 = this.bullets.length;
      for (var j = 0; j < l2; j++) {
        var b = this.bullets[j];
        if (e.dead || b.dead) { continue; }
        if (e.isOverlap(b)) {
          // An enemy and bullet have collided.
          // Mark both as dead
          b.dead = true;
          e.size -= 5;
          e.r = e.size / 2;
          e.vx *= 0.9;
          if (e.size <= 10) {
            e.dead = true;
          }
          // Add an explosion
          var obj = {x: (e.x + b.x) / 2,
                     y: (e.y + b.y) / 2,
                     vx: (e.vx + b.vx) / 2,
                     vy: (e.vy + b.vy) / 2,
                     size: e.size + b.size
                    };
          var ex = new Explosion(obj);
          this.explosions.push(ex);
          // And adjust the score
          this.score += 100;
        }
      }
    }
    l = this.enemies.length;
    for (i = l - 1; i >= 0; i--) {
      if (this.enemies[i].dead) {
        this.enemies.splice(i, 1);
      }
    }
    l = this.bullets.length;
    for (i = l - 1; i >= 0; i--) {
      if (this.bullets[i].dead) {
        this.bullets.splice(i, 1);
      }
    }
    
    // Check for collisions between cannon
    // and enemies (which ends the game)
    l = this.enemies.length;
    for (i = 0; i < l; i++) {
      e = this.enemies[i];
      if (e.isOverlap(world.cannon)) {
        world.gameOver = true;
      }
    }
  };

  this.draw = function() {
    // Redraw everything
    c.clearRect(0, 0, w, h);
    this.cannon.draw();
    var l = this.bullets.length;
    for (var i = 0; i < l; i++) {
      this.bullets[i].draw();
    }
    l = this.explosions.length;
    for (i = 0; i < l; i++) {
      this.explosions[i].draw();
    }
    l = this.enemies.length;
    for (i = 0; i < l; i++) {
      this.enemies[i].draw();
    }
    // Show the score on the screen
    c.fillText('Score: ' + this.score, 
               w * 0.8, 20);
    // If the game is over, display game over
    // text
    if (this.gameOver) {
      c.save();
      c.font = '48pt sans-serif';
      c.textAlign = 'center';
      c.fillStyle = 'red';
      c.textBaseline = 'middle';
      c.fillText('GAME OVER', w / 2, h / 2);
      c.restore();
    }
  };
}

// Keep track of whether the mouse is pressed
var isMouseDown = false;
c.canvas.onmousedown = 
  function(evt) { isMouseDown = true; };
c.canvas.onmouseup = 
  function(evt) { isMouseDown = false; };

// Keep track of where the mouse is
var mouse = {x: 0, y: 0};
c.canvas.onmousemove = 
  function(evt) {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
  };

// Create the world
var world = new World();
world.init();

// Animation loop
var cmTID;
function updateAll() {
  world.update();

  // Do everything again in a little bit
  clearTimeout(cmTID);
  if (!world.gameOver) {
    cmTID = setTimeout(updateAll,
                       world.timeStep);
  }
}
updateAll();