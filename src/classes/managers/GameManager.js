import { GameConfig } from "../../config/gameConfig.js";
import { AiGameObject } from "../AiGameObject.js";
import { QuadBlaster } from "../enemies/QuadBlaster.js";
import { EnemyBase } from "../EnemyBase.js";
import { PlayerBase } from "../PlayerBase.js";
import { PlayerShip } from "../PlayerShip.js";
import { Star } from "../Star.js";
import { NewMediaManager } from "./NewMediaManager.js";

export class GameManager {
    // Make some of these have constants naming convention
    // TODO: Redo this class, I hate how everything is static when really the manager should provide static services but have a non-static class underneath
    static context;
    static objects;
    static collidables;
    static GameBounds = {
        LEFT: -2000,
        TOP: -2000,
        RIGHT: 2000,
        BOTTOM: 2000
    };
    // TODO: Improve this? Don't really need two variables for keeping track of time, just subtract until 0?
    static numMessageTicks;
    static numMessageTicksMax;
    static message;
    static playerShip;
    static isPaused;
    static isRunning;
    static score;

    static initializeGame(canvasContext) {
        this.context = canvasContext;
        this.objects = [];
        this.collidables = [];
        this.isPaused = false;
        this.isRunning = true;

        // Initalize all of the game objects
        // TODO: Eventually all of the starting cooridinates won't be random and the object addition to the game will be more structred, once levels are added in (also won't start with powerups in world immediately)
        // Create the player
        this.playerShip = new PlayerShip(this.context.canvas.width / 2, this.context.canvas.height / 2, 0, 0);

        // Add the background stars
        for (let i = 0; i < 600; i++) {
            let x = Math.random() * (this.GameBounds.RIGHT - this.GameBounds.LEFT + 1) + this.GameBounds.LEFT;
            let y = Math.random() * (this.GameBounds.BOTTOM - this.GameBounds.TOP + 1) + this.GameBounds.TOP;
            this.addObject(new Star(x, y), false)
        }

        // Add the player base
        // TODO: Fix this? Currently player base location is based on canvas width, but enemy base is not. So in theory different window sizes mean the base is difference distances from each other....
        this.playerShip = new PlayerBase(this.context.canvas.width / 2, this.context.canvas.height / 2);

        // Add the enemy base
        this.addObject(new EnemyBase(-1000, -1000, this.playerShip));

        // Add all enemies
            // for (i = 0; i < 6; i += 1) {
            //     this.addObject(new Pebbles(GameBounds));
            // }

            // for (i = 0; i < 3; i += 1) {
            //     this.addObject(new Rocko(GameBounds));
            // }

            // for (i = 0; i < 4; i += 1) {
            //     this.addObject(new Sludger(GameBounds, game.PlayerShip));
            // }

            // for (i = 0; i < 4; i += 1) {
            //     this.addObject(new Puffer(GameBounds, game.PlayerShip));
            // }
			
			// for (i = 0; i < 2; i += 1) {
			// 	this.addObject(new Slicer(GameBounds, game.PlayerShip));
			// }

			// for (i = 0; i < 3; i += 1) {
				// this.addObject(new SludgerMine(GameBounds, game.PlayerShip));
			// }

        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (this.GameBounds.RIGHT - this.GameBounds.LEFT + 1) + this.GameBounds.LEFT;
            let y = Math.random() * (this.GameBounds.BOTTOM - this.GameBounds.TOP + 1) + this.GameBounds.TOP;
            // TODO: Change this. This is only temporary anyways but it is irking the hell out of me.
            let velocityX = (Math.random() - Math.random()) * 1;
            let velocityY = (Math.random() - Math.random()) * 1
            this.addObject(new QuadBlaster(x, y, velocityX, velocityY, this.playerShip));
        }

        // Add all powerups
            // this.addObject(new PhotonLargePowerup(GameBounds));
            // this.addObject(new SpreadShotPowerup(GameBounds));
            // this.addObject(new DoublePointsPowerup(GameBounds));
            // this.addObject(new ExtraFuelPowerup(GameBounds));
            // this.addObject(new ShipRepairsPowerup(GameBounds));
            // this.addObject(new InvulnerabilityPowerup(GameBounds));
            // this.addObject(new TurboThrustPowerup(GameBounds));
            // this.addObject(new SparePartsPowerup(GameBounds));


        // Add the player ship to the object array so it draws on top of most objects
        this.addObject(this.playerShip);

        // Play startup sound
        NewMediaManager.Audio.StartUp.play();

        // Start the game by kicking off an animation loop
        this.animationLoop();
    }

    static addObject(object, collidable = true) {
        this.objects.push(objects);
        if (collidable) {
            this.collidables.push(object);
        }
    }

    static removeObject(object) {
        for(let i = this.objects.length; i >= 0; i--) {
            if (this.objects[i] === object) {
                this.objects.splice(i, 1);
                break;
            }
        }

        for(let i = this.collidables.length; i >= 0; i--) {
            if (this.collidables[i] === object) {
                this.collidables.splice(i, 1);
                break;
            }
        }
    }

    static checkBounds(object) {
        if (object.x > GameBounds.RIGHT) { 
            object.x = GameBounds.LEFT + (object.x - GameBounds.RIGHT); 
        }
        else if (object.x < GameBounds.LEFT) { 
            object.x = GameBounds.RIGHT - (GameBounds.LEFT - object.x); 
        }
        if (object.y > GameBounds.BBOTTOMottom) { 
            object.y = GameBounds.TOP + (object.y - GameBounds.BOTTOM); 
        }
        else if (object.Y < GameBounds.TOP) { 
            object.y = GameBounds.BOTTOM - (GameBounds.TOP - object.y); 
        }
    }

    static displayMessage(text, ticksToShow) {
        this.numMessageTicks = 0;
        this.numMessageTicksMax = ticksToShow;
        this.message = text;
        log("DisplayMessage called with " + text + " - " + ticksToShow);
    }

    static handleResize() {
        let oldCenterX = this.context.canvas.width / 2;
        let oldCenterY = this.context.canvas.height / 2;

        this.context.canvas.width = window.innerWidth;
        this.context.canvas.height = window.innerHeight;

        let diffX = this.context.canvas.width / 2 - oldCenterX;
        let diffY = this.context.canvas.height / 2 - oldCenterY;

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].x += diffX;
            this.objects[i].y += diffY;
            this.checkBounds(this.objects[i]);
        }
    }

    static moveObject(object) {
        // TODO: Should this check be here?
        // PlayerShip doesn't move like other objects do
        if (object instanceof PlayerShip) {
            return;
        }

        object.x -= playerShip.velocityX;
        object.y -= playerShip.velocityY;
        this.checkBounds(object);
    }

    static updateObjects(objects) {
        for (let i = 0; i < objects.length; i++) {
            // TODO: Remove process input call here, should be part of PlayerShip update state
            objects[i].processInput(Key);
            this.moveObject(objects[i]);
            objects[i].updateState();
        }
    };

    static detectCollisions(collidables) {
        let collidablesSnapshot = collidables.slice(0);

        for (let i = 0; i < collidablesSnapshot.length; i++) {
            for (let j = i + 1; j < collidablesSnapshot.length; j++) {
                if (Math.pow((collidablesSnapshot[j].x - collidablesSnapshot[i].x), 2) + Math.pow((collidablesSnapshot[j].y - collidablesSnapshot[i].y), 2)
                        <=
                        (collidablesSnapshot[i].collisionRadius + collidablesSnapshot[j].collisionRadius) * (collidablesSnapshot[i].collisionRadius + collidablesSnapshot[j].collisionRadius)) {
                    // TODO: Review this. I am not entirely sure what is all going on here, there is probably a more efficient way to go through the collidables array for collisions
                    let oldVelX = collidablesSnapshot[i].velocityX;
                    let oldVelY = collidablesSnapshot[i].velocityY;
                    collidablesSnapshot[i].handleCollision(collidablesSnapshot[j]);
                    let newVelX = collidablesSnapshot[i].velocityX;
                    let newVelY = collidablesSnapshot[i].velocityY;
                    collidablesSnapshot[i].velocityX = oldVelX;
                    collidablesSnapshot[i].velocityY = oldVelY;
                    collidablesSnapshot[j].handleCollision(collidablesSnapshot[i]);
                    collidablesSnapshot[i].velocityX = newVelX;
                    collidablesSnapshot[i].velocityY = newVelY;
                }
            }
        }
    };

    static enemiesRemaining() {
        let numEnemies = 0;

        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i] instanceof AiGameObject && !(this.objects[i] instanceof EnemyBase)) {
                numEnemies++;
            }
        }

        return numEnemies;
    }

    // TODO: What is this used for? Could this be used to cause the static effect on the radar when that is added in?
    static staticEffect(percentWorking) {
        let pixels = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
        let pixelData = pixels.data;
        for (let i = 0, n = pixelData.length; i < n; i += 4) {
            //var grayscale = pixelData[i  ] * .3 + pixelData[i+1] * .59 + pixelData[i+2] * .11;
            //pixelData[i  ] = grayscale;   // red
            //pixelData[i+1] = grayscale;   // green
            //pixelData[i+2] = grayscale;   // blue
            pixelData[i + 3] = Math.random() * (255 * (percentWorking / 100))// alpha
        }
        this.context.putImageData(pixels, 0, 0);
    };

    static drawObjects(objects, context) {
        // Clear canvas for drawing a new scene
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        if(GameConfig.debug) {
            context.save();
            let x = context.canvas.width - 100;
            let y = context.canvas.height - 100;
            
            // 0,90, and 180 degrees for frame of reference for drawing (in the order RGB)
            context.beginPath();
            context.strokeStyle = "red";
            context.moveTo(x, y);
            context.lineTo(x + 80 * Math.cos(0), y + 80 * Math.sin(0));
            context.stroke();
            
            context.beginPath();
            context.strokeStyle = "green";
            context.moveTo(x, y);
            context.lineTo(x + 80 * Math.cos(Math.PI/2), y + 80 * Math.sin(Math.PI/2));
            context.stroke();
            
            context.beginPath();
            context.strokeStyle = "blue";
            context.moveTo(x, y);
            context.lineTo(x + 80 * Math.cos(Math.PI), y + 80 * Math.sin(Math.PI));
            context.stroke();
            
            context.restore();
        }

        for (let i = 0; i < objects.length; i++) {
            // Only draw the objects if they are within the viewing window
            if (objects[i].x + objects[i].width > 0 &&
                    objects[i].x - objects[i].width < context.canvas.width &&
                    objects[i].y + objects[i].height > 0 &&
                    objects[i].y - objects[i].height < context.canvas.height) {
                context.save();
                objects[i].draw(context);
                context.restore();
            }
        }

        this.numMessageTicks++;
        if (this.numMessageTicks < this.numMessageTicksMax) {
            context.fillStyle = '#808080';
            context.font = 'bold 30px sans-serif';
            context.textBaseline = 'bottom';
            context.fillText(this.message, context.canvas.width / 2 - (((this.message.length / 2) * 30) / 2), context.canvas.height / 2 - 40);
        }
    }

    static movePlayerShipTo(x, y) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i] instanceof PlayerShip) continue;
            this.objects[i].x -= x;
            this.objects[i].y -= y;
            checkBounds(this.objects[i]);
        }
    }

    static endGame() {
        this.isPaused = true;
        this.isRunning = false;
        this.displayMessage("You achieved a score of " + score + " before the fringe took you", 99999999999);
        this.removeObject(this.playerShip)
    }

    static pauseGame() {
        if (!this.isPaused) {
            this.isPaused = true;
            console.log('paused')
        }
    }

    static resumeGame() {
        if (this.isPaused) {
            this.isPaused = false;
            this.gameLoop(true);
            this.animationLoop();
            console.log('resume')
        }
    }

    // TODO: Figure out what the hell is going on here and make it a real function or leave a comment explaining why it is an IIFE
    static gameLoop = (function () {
        let loops = 0, skipTicks = 1000 / 60, maxFrameSkip = 10, nextGameTick = (new Date()).getTime();

        return function (resetGameTick) {
            loops = 0;

            if (resetGameTick === true) {
                nextGameTick = (new Date()).getTime();
            }

            while ((new Date()).getTime() > nextGameTick && loops < maxFrameSkip) {
                updateObjects(objects);
                detectCollisions(collidables);
                nextGameTick += skipTicks;
                loops += 1;
            }

            if (loops) {
                drawObjects(objects, context);
            }
        };
    } ());

    static animationLoop() {
        // stop loop if paused
      if (this.isPaused) return;

      // Start the game loop
      this.gameLoop();
      // requestAnimationFrame is a javascript provided function, see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame for more details
      requestAnimationFrame(animationLoop);
    }
}