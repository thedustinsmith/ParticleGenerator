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
			radii = (this.radius + p2.radius) * .4;

		return ((dx*dx) + (dy * dy)) < (radii * radii);
	};

	this.checkForCollision = function (otherParticle) {
		if (this.isColliding(otherParticle)) {
			var tmpX = otherParticle.vx,
				tmpY = otherParticle.vy;

			otherParticle.vx = this.vx;
			otherParticle.vy = this.vy;
			this.vx = tmpX;
			this.vy = tmpY;
		}
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