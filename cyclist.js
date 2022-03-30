const ACCELERATION = 2;

class Cyclist {
    constructor(ctx, levelImage, checkpoint) {
        this.ctx = ctx;
        this.levelImage = levelImage;
        this.isJumping = false;
        this.lowGravity = false;
        this.isChuting = false;
        this.x = checkpoint[0];
        this.y = checkpoint[1];
        this.topspeed = 15;
        this.initialjumpspeed = -36;
        this.closestYUnder = 320;
        this.column = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.animationImages = [cache.cyclist0, cache.cyclist1, cache.cyclist2, cache.cyclist3];
        this.animationTick = 0;
    }

    update(isChuting) {
        this.x += this.xSpeed;
        if (this.x < -40) {
            this.x = -40;
        }
        this.y += this.ySpeed;
        this.isChuting = isChuting;

        if (!this.isJumping && this.y + 80 < this.closestYUnder) {
            this.ySpeed = 0;
            this.isJumping = true;
        } else if (this.isJumping) {
            if (this.ySpeed == 0) {
                this.closestYUnder = this.levelImage.getClosestYUnder(this.x + 60, this.y + 80);
            } if (!this.lowGravity) {
                this.ySpeed += 6;
            } else {
                this.ySpeed += 1;
            } if (this.isChuting && this.ySpeed > 0) {
                this.ySpeed = 6;
            } if (this.y + 80 > this.closestYUnder) {
                this.ySpeed = 0;
                this.isJumping = false;
                this.y = this.closestYUnder - 80;
            }
        }

        if ((Math.floor(this.x + 20) / 40) != this.column) {
            this.column = Math.floor((this.x + 20) / 40);
            this.closestYUnder = this.levelImage.getClosestYUnder(this.x + 60, this.y + 80);
        }

        if (this.xSpeed > 0) {
            this.accelerate(-0.5);
        } else if (this.xSpeed < 0) {
            this.accelerate(0.5);
        }

        var blocksTouching = this.levelImage.getInteractiveBlocksTouching([this.x + 50, this.y, 20, 81]);
        var blocks = [];
        for (var i = 0; i < blocksTouching.length; i++) {
            var block = blocksTouching[i];
            if (block[0] == "t") {
                this.isJumping = true;
                if (!this.lowGravity) {
                    this.ySpeed = -48;
                } else {
                    this.ySpeed = -25;
                }
            } else {
                blocks.push(block);
            }
        }
        if (!this.isJumping) {
            this.animationTick += this.xSpeed;
        } if (this.animationTick >= 80) {
            this.animationTick = 0;
        } if (this.animationTick < 0) {
            this.animationTick += 80;
        }

        var image = this.animationImages[Math.floor(this.animationTick / 20)];
        this.ctx.drawImage(image, 40, this.y);
        if (this.isChuting && this.ySpeed > 0) {
            this.ctx.drawImage(cache.parachute, 10, this.y - 20);
        }

        return blocks;
    }

    accelerate(multiplier) {
        this.xSpeed += (ACCELERATION * multiplier);
        if (Math.abs(this.xSpeed) > this.topspeed) {
            this.xSpeed -= (ACCELERATION * multiplier);
        }
    }

    initJump() {
        this.isJumping = true;
        this.ySpeed = this.initialjumpspeed;
    }

    setTopSpeed(topSpeed) {
        this.topspeed = topSpeed;
    }

    setInitialJumpSpeed(jumpSpeed) {
        this.initialJumpSpeed = jumpSpeed;
    }

    setLowGravity() {
        this.lowGravity = true;
        this.initialjumpspeed = -20;
    }
}