var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

var W = 500,
	H = 500,
	x = 100,
	y = 100;

var particles = [],
	pOpts = {
		containerW: W,
		containerH: H
	};

var p1 = new Particle({
	containerW: W,
	containerH: H,
	x: 450,
	y: 100,
	xVelocity: -10,
	yVelocity: 20,
	color: 'blue'
});

var p2 = new Particle({
	containerW: W,
	containerH: H,
	x: 450,
	y: 400,
	xVelocity: -10,
	yVelocity: -20,
	color: 'red'
});

particles.push(p1);
particles.push(p2);

/* Add a few particles to start */
for(var i = 0; i < 2; i++) {
	particles.push(new Particle(pOpts));
}


var draw = function() {
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, W, H);
	ctx.globalCompositeOperation = "lighter";

	for (var i = 0; i< particles.length; i++) {
		var p = particles[i];
		p.draw(ctx);
		p.move();
	}
}

var update = function() {
	for (var i = 0; i< particles.length; i++) {
		var p = particles[i];
		for (var j = i + 1; j< particles.length; j++) {
			var otherP = particles[j];
			p.checkForCollision(otherP);
		}
	}
	setTimeout(update, 10);
}

setInterval(draw, 33);
update();

canvas.addEventListener("mousedown", function(e) {
	var theseOpts = {
		x: e.offsetX,
		y: e.offsetY,
		radius: 5
	};

	var newParticle = new Particle(_.extend({}, pOpts, theseOpts));
	function growParticle () {
		newParticle.draw(ctx);
		newParticle.radius += 5;
	}

	function stopGrow () {
		clearInterval(growInterval);
		particles.push(newParticle);
		this.removeEventListener("mouseup", stopGrow, false);
	}
	
	var growInterval = setInterval(growParticle, 33);
	canvas.addEventListener("mouseup", stopGrow);
});