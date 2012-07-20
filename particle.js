function Particle (o) {
	var opts = _.extend({}, Particle.defaultOpts, o),
		H = opts.containerH,
		W = opts.containerW;

	this.x = parseInt(opts.x || (Math.random() * W), 10);
	this.y = parseInt(opts.y || (Math.random() * H), 10);
	this.vx = parseInt(opts.xVelocity || (Math.random() * 20 - 10), 10);
	this.vy = parseInt(opts.yVelocity || (Math.random() * 20 - 10), 10);
	this.radius = parseInt(opts.radius || (Math.random() * 15 + 15), 10);

	var r = Math.random() * 255>>0,
		g = Math.random() * 255>>0,
		b = Math.random() * 255>>0;
	this.color = opts.color || "rgba(" + r + ", " + g + ", " + b + ", 0.5)";

	this.draw = function(context) {

		context.beginPath();

		var gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, this.color);
		gradient.addColorStop(1, "black");

		context.fillStyle = gradient;
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fill();
	};

	this.move = function() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x < -50) this.x = W + 50;
		if (this.y < -50) this.y = H + 50;
		if (this.x > W + 50) this.x = -50;
		if (this.y > H + 50) this.y = -50;
	};

	this.isColliding = function (p2) {
		var dx = this.x - p2.x,
			dy = this.y - p2.y,
			radii = (this.radius + p2.radius) * .6;

		return ((dx*dx) + (dy * dy)) < (radii * radii);
	};

	function elasticCollision(m1, m2, v1, v2) {
		return (((m1 - m2) /  (m1 + m2)) * v1) + (((2 * m2) / (m1 + m2)) * v2);
	}

	this.checkForCollision = function (otherParticle) {
		if (!this.isColliding(otherParticle)) {
			return; 
		}

		var mass1 = this.radius,
			mass2 = otherParticle.radius,
			xv1 = this.vx,
			yv1 = this.vy,
			xv2 = otherParticle.vx,
			yv2 = otherParticle.vy;


		var xvelocity1after = elasticCollision(mass1, mass2, xv1, xv2); // (((mass1 - mass2) / (mass1 + mass2)) * xvelocity1) + (((2 * mass2)/ (mass1 + mass2)) * xvelocity2),
			xvelocity2after = elasticCollision(mass2, mass1, xv2, xv1); // (((mass2 - mass1) / (mass1 + mass2)) * xvelocity2) + (((2 * mass1)/ (mass1 + mass2)) * xvelocity1),
			yvelocity1after = elasticCollision(mass1, mass2, yv1, yv2); // (((mass1 - mass2) / (mass1 + mass2)) * yvelocity1) + (((2 * mass2)/ (mass1 + mass2)) * yvelocity2),
			yvelocity2after = elasticCollision(mass2, mass1, yv2, yv1); //(((mass2 - mass1) / (mass1 + mass2)) * yvelocity2) + (((2 * mass1)/ (mass1 + mass2)) * yvelocity1);

		this.vx = xvelocity1after;
		this.vy = yvelocity1after;
		otherParticle.vx = xvelocity2after;
		otherParticle.vy = yvelocity2after;

		console.log("doing collisiong stuff", xv1, xvelocity1after, yv1, yvelocity1after, xv2, xvelocity2after, yv2, yvelocity2after);
/*
		var tmpX = otherParticle.vx,
			tmpY = otherParticle.vy,
			massRatio = this.radius / otherParticle.radius;

		otherParticle.vx = this.vx;
		otherParticle.vy = this.vy;

		this.vx =  tmpX;// * massRatio;
		this.vy = tmpY;// * massRatio;
		//this.vx = tmpX;
		//this.vy = tmpY;
		*/
	};

	this.reverse = function () {
		this.vx = this.vx * -1;
		this.vy = this.vy * -1;
	}
}

Particle.defaultOpts = {
	containerW: 500,
	containerH: 500
};