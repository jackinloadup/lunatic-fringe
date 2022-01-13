import { GameConfig } from "../../config/GameConfig.js";
import { QuadBlaster } from "../enemies/QuadBlaster.js";
import { EnemyBase } from "../EnemyBase.js";
import { PlayerBase } from "../PlayerBase.js";
import { PlayerShip } from "../player/PlayerShip.js";
import { Star } from "../Star.js";
import { CollisionManager } from "./CollisionManager.js";
import { GameServiceManager } from "./GameServiceManager.js";
import { Layer } from "./Layer.js";
import { NewMediaManager } from "./MediaManager.js";
import { ObjectManager } from "./ObjectManager.js";
import { GameBound, GameBoundSize } from "./GameBound.js";
import { Vector } from "../../utility/Vector.js";
import { RandomUtil } from "../../utility/RandomUtil.js";
import { Pebbles } from "../asteroids/Pebbles.js";
import { Rocko } from "../asteroids/Rocko.js";
import { Puffer } from "../enemies/Puffer.js";
import { Sludger } from "../enemies/Sludger.js";
import { Slicer } from "../enemies/Slicer.js";
import { PhotonLargePowerup } from "../powerups/PhotonLargePowerup.js";
import { SpreadShotPowerup } from "../powerups/SpreadShotPowerup.js";
import { DoublePointsPowerup } from "../powerups/DoublePointsPowerup.js";
import { ExtraFuelPowerup } from "../powerups/ExtraFuelPowerup.js";
import { ShipRepairsPowerup } from "../powerups/ShipRepairsPowerup.js";
import { SparePartsPowerup } from "../powerups/SparePartsPowerup.js";
import { InvulnerabilityPowerup } from "../powerups/InvulnerabilityPowerup.js";
import { TurboThrustPowerup } from "../powerups/TurboThrustPowerup.js";
import { DocumentManager } from "./DocumentManager.js";

export class GameManager {
    // Make some of these have constants naming convention
    static context;
    static numMessageTicks;
    static message;
    static playerShip;
    static isPaused;
    static wasPausedByKey;
    static isRunning;
    static score;
    static {
        // Need to bind animationLoop function to `this` or else we lose the `this` context when requestAnimationFrame calls the function
        this.animationLoop = this.animationLoop.bind(this);
    }

    // Variables used to run the game loop
    static SKIP_TICKS = 1000 / 60
    static MAX_FRAME_SKIP = 10
    static nextGameTick //NOTE: Should be set right before game starts so that it is as recent as possible

    static initializeGame(canvasContext) {
        this.context = canvasContext;
        this.isPaused = false;
        this.wasPausedByKey = false;
        this.isRunning = true;

        // Initialize the game service manager
        GameServiceManager.initialize(this);

        // Initalize all of the game objects
        // FUTURE TODO: Eventually all of the starting cooridinates won't be random and the object addition to the game will be more structred, once levels are added in (also won't start with powerups in world immediately)
        // Create the player
        this.playerShip = new PlayerShip(this.context.canvas.width / 2, this.context.canvas.height / 2, 0, 0);
        // Player starts with turbo thrust and invulnerability powerups
        this.playerShip.powerupStateManager.obtainPowerup(new InvulnerabilityPowerup(0, 0));
        this.playerShip.powerupStateManager.obtainPowerup(new TurboThrustPowerup(0, 0));

        // Add the background stars
        for (let i = 0; i < 600; i++) {
            let x = Math.random() * (GameBound.RIGHT - GameBound.LEFT + 1) + GameBound.LEFT;
            let y = Math.random() * (GameBound.BOTTOM - GameBound.TOP + 1) + GameBound.TOP;
            ObjectManager.addObject(new Star(x, y), false)
        }

        // Add the player base. Offset the y location by the constant from the player ship here so that it matches the offset the ship uses when docking at the base. This is so that the ship is correctly centered on the base when the game is started.
        let playerBaseLocation = new Vector(this.context.canvas.width / 2, this.context.canvas.height / 2 + this.playerShip.BASE_DOCKING_OFFSET);
        ObjectManager.addObject(new PlayerBase(playerBaseLocation.x, playerBaseLocation.y));

        // Add the enemy base
        // Since the player base is centered based on the starting canvas size (so that it is centered on the screen), base enemy base location on player base location and game bounds so that the two bases are always the same distance from each other
        // Since the GameBoundSize is half of the width and height of the game bounds, subtract that from both coordinates so the enemy base is halfway across the world in both directions (and subtract it since player position is guaranteed to be positive
        // so subtracting the GameBoundSize should make the coordinates of the enemy base still be within the GameBounds values).
        let enemyBaseLocation = playerBaseLocation.subtract(new Vector(GameBoundSize, GameBoundSize));
        ObjectManager.addObject(new EnemyBase(enemyBaseLocation.x, enemyBaseLocation.y, this.playerShip));

        // Add all enemies
        for (let i = 0; i < 6; i++) {
            let randomPosition = this.getRandomStartingPosition();
            let randomVelocity = this.getRandomStartingVelocity(2);
            ObjectManager.addObject(new Pebbles(randomPosition.x, randomPosition.y, randomVelocity.x, randomVelocity.y));
        }

        for (let i = 0; i < 3; i += 1) {
            let randomPosition = this.getRandomStartingPosition();
            let randomVelocity = this.getRandomStartingVelocity(3);
            ObjectManager.addObject(new Rocko(randomPosition.x, randomPosition.y, randomVelocity.x, randomVelocity.y));
        }

        for (let i = 0; i < 4; i += 1) {
            let randomPosition = this.getRandomStartingPosition();
            let randomVelocity = this.getRandomStartingVelocity(3);
            ObjectManager.addObject(new Sludger(randomPosition.x, randomPosition.y, randomVelocity.x, randomVelocity.y, this.playerShip));
        }

        for (let i = 0; i < 4; i += 1) {
            let randomPosition = this.getRandomStartingPosition();
            let randomVelocity = this.getRandomStartingVelocity(1);
            ObjectManager.addObject(new Puffer(randomPosition.x, randomPosition.y, randomVelocity.x, randomVelocity.y, this.playerShip));
        }
			
        for (let i = 0; i < 2; i += 1) {
            let randomPosition = this.getRandomStartingPosition();
            let randomVelocity = this.getRandomStartingVelocity(1);
            ObjectManager.addObject(new Slicer(randomPosition.x, randomPosition.y, randomVelocity.x, randomVelocity.y, this.playerShip));
        }

        for (let i = 0; i < 5; i++) {
            let randomPosition = this.getRandomStartingPosition();
            let randomVelocity = this.getRandomStartingVelocity(1);
            ObjectManager.addObject(new QuadBlaster(randomPosition.x, randomPosition.y, randomVelocity.x, randomVelocity.y, this.playerShip));
        }

        // Add all powerups
        // Note that this is temporary since when levels are implemented they powerups will not be spawned in at the start of the game
        let randomLargePhotonPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new PhotonLargePowerup(randomLargePhotonPowerupPosition.x, randomLargePhotonPowerupPosition.y));
        let randomSpreadShotPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new SpreadShotPowerup(randomSpreadShotPowerupPosition.x, randomSpreadShotPowerupPosition.y));
        let randomDoublePointsPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new DoublePointsPowerup(randomDoublePointsPowerupPosition.x, randomDoublePointsPowerupPosition.y));
        let randomExtraFuelPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new ExtraFuelPowerup(randomExtraFuelPowerupPosition.x, randomExtraFuelPowerupPosition.y));
        let randomShipRepairsPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new ShipRepairsPowerup(randomShipRepairsPowerupPosition.x, randomShipRepairsPowerupPosition.y));
        let randomInvulnerabilityPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new InvulnerabilityPowerup(randomInvulnerabilityPowerupPosition.x, randomInvulnerabilityPowerupPosition.y));
        let randomTurboThrustPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new TurboThrustPowerup(randomTurboThrustPowerupPosition.x, randomTurboThrustPowerupPosition.y));
        let randomSparePartsPowerupPosition = this.getRandomStartingPosition();
        ObjectManager.addObject(new SparePartsPowerup(randomSparePartsPowerupPosition.x, randomSparePartsPowerupPosition.y));


        // Add the player ship to the object array so it draws on top of most objects
        ObjectManager.addObject(this.playerShip);

        // Play startup sound
        NewMediaManager.Audio.StartUp.play();

        // Set the current time to be the next game tick right before the animation loop starts to make it as recent as possible
        this.nextGameTick = (new Date()).getTime();

        // Start the game by kicking off an animation loop
        this.animationLoop();
    }

    static getRandomStartingPosition() {
        return new Vector(RandomUtil.randomNumber(GameBound.LEFT, GameBound.RIGHT), RandomUtil.randomNumber(GameBound.TOP, GameBound.BOTTOM));
    }

    static getRandomStartingVelocity(maxStartingSpeed) {
        return new Vector(RandomUtil.randomNumber(-maxStartingSpeed, maxStartingSpeed), RandomUtil.randomNumber(-maxStartingSpeed, maxStartingSpeed));
    }

    static checkBounds(object) {
        if (object.x > GameBound.RIGHT) { 
            object.x = GameBound.LEFT + (object.x - GameBound.RIGHT); 
        }
        else if (object.x < GameBound.LEFT) { 
            object.x = GameBound.RIGHT - (GameBound.LEFT - object.x); 
        }
        if (object.y > GameBound.BOTTOM) { 
            object.y = GameBound.TOP + (object.y - GameBound.BOTTOM); 
        }
        else if (object.y < GameBound.TOP) { 
            object.y = GameBound.BOTTOM - (GameBound.TOP - object.y); 
        }
    }

    static displayMessage(text, ticksToShow) {
        this.numMessageTicks = ticksToShow;
        this.message = text;
        console.log("DisplayMessage called with " + text + " - " + ticksToShow);
    }

    static handleResize() {
        let oldCenterX = this.context.canvas.width / 2;
        let oldCenterY = this.context.canvas.height / 2;

        let scannerDimensions = DocumentManager.getElementDimensions('scanner');
        this.context.canvas.width = scannerDimensions.x;
        this.context.canvas.height = scannerDimensions.y;

        let diffX = this.context.canvas.width / 2 - oldCenterX;
        let diffY = this.context.canvas.height / 2 - oldCenterY;

        for (let i = 0; i < ObjectManager.objects.length; i++) {
            ObjectManager.objects[i].x += diffX;
            ObjectManager.objects[i].y += diffY;
            this.checkBounds(ObjectManager.objects[i]);
        }
    }

    static moveObject(object) {
        // PlayerShip doesn't move like other objects do
        if (object instanceof PlayerShip) {
            return;
        }

        object.x -= this.playerShip.velocityX;
        object.y -= this.playerShip.velocityY;
        this.checkBounds(object);
    }

    static updateObjects(objects) {
        // create copy of array here since some objects can be deleted or removed during these steps
        let objectsSnapshot = objects.slice(0);

        for (let i = 0; i < objectsSnapshot.length; i++) {
            // So this is here because we want to process player input before moving objects or updating states since input can affect the movement of the ship and creation of bullets
            // This probably could be handled better but will be staying this way for now.
            if (objectsSnapshot[i] instanceof PlayerShip) {
                objectsSnapshot[i].processInput();
            }
            this.moveObject(objectsSnapshot[i]);
            objectsSnapshot[i].updateState();
        }
    };

    static detectCollisions(collidables) {
        let collidablesSnapshot = collidables.slice(0);

        for (let i = 0; i < collidablesSnapshot.length; i++) {
            for (let j = i + 1; j < collidablesSnapshot.length; j++) {
                // first check to see if the layers the objects are on are allowed to collide, if not no point in doing all of the math along with it and calling handle collision on everything
                if (CollisionManager.doObjectLayersCollide(collidablesSnapshot[i], collidablesSnapshot[j]) && (Math.pow((collidablesSnapshot[j].x - collidablesSnapshot[i].x), 2) + Math.pow((collidablesSnapshot[j].y - collidablesSnapshot[i].y), 2)
                        <=
                        Math.pow((collidablesSnapshot[i].collisionRadius + collidablesSnapshot[j].collisionRadius), 2))) {
                    // This stores the velocity of the first object before handling the collision of the first object with the second object (which changes the velocity of the first object).
                    // It then stores the new velocity of the first object, sets the first object back to the old velocity and then handles collision of the second object with the first object
                    // (that way the second object reacts based on the first objects original velocity). After that it sets the velocity of the first object back to the new velocity.
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

    // FUTURE TODO: In the future when levels are implemented this should be changed so that when enemies are spawned in a counter is set
    // to keep track of current number of enemies, that way it doesn't have to iterate through all objects every time.
    static enemiesRemaining() {
        let numEnemies = 0;

        let object;
        for (let i = 0; i < ObjectManager.objects.length; i++) {
            object = ObjectManager.objects[i]
            if (CollisionManager.isEnemyLayer(object.layer) && object.layer !== Layer.ENEMY_BASE) {
                numEnemies++;
            }
        }

        return numEnemies;
    }

    // FUTURE TODO: It appears that this can be used to cause static throughout the image as well as making it darker. In the original game when you started the game it would fade in with a static effect,
    // so chances are that is what this can be used for in the future. Also could probably be adapted to work for when systems are implemented and the static that can be on screen from it
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

        this.numMessageTicks--;
        if (this.numMessageTicks > 0) {
            context.fillStyle = '#808080';
            context.font = 'bold 30px sans-serif';
            context.textBaseline = 'bottom';
            context.fillText(this.message, context.canvas.width / 2 - (((this.message.length / 2) * 30) / 2), context.canvas.height / 2 - 40);
        }
    }

    static movePlayerShipTo(x, y) {
        for (let i = 0; i < ObjectManager.objects.length; i++) {
            if (ObjectManager.objects[i] instanceof PlayerShip) continue;
            ObjectManager.objects[i].x -= x;
            ObjectManager.objects[i].y -= y;
            this.checkBounds(ObjectManager.objects[i]);
        }
    }

    static endGame() {
        this.isPaused = true;
        this.isRunning = false;
        this.displayMessage("You achieved a score of " + this.playerShip.score + " before the fringe took you", 99999999999);
        ObjectManager.removeObject(this.playerShip)
    }

    static toggleGamePaused(activatedByKey) {
        if (!this.isPaused) {
            this.pauseGame(activatedByKey);
        } else {
            this.resumeGame();
        }
    }

    static pauseGame(activatedByKey = false) {
        if(activatedByKey) {
            this.wasPausedByKey = true;
        }
        this.isPaused = true;
        console.log('Paused game, was activated by key:', activatedByKey);
    }

    static resumeGame() {
        this.isPaused = false;
        this.wasPausedByKey = false;
        this.gameLoop(true);
        this.animationLoop();
        console.log('Resumed game');
    }

    static gameLoop(resetGameTick, advanceOneFrame = false) {
        let loops = 0;
        let shouldAdvanceOneFrame = advanceOneFrame;

        if (resetGameTick === true) {
            GameManager.nextGameTick = (new Date()).getTime();
        }

        while (((new Date()).getTime() > GameManager.nextGameTick && loops < GameManager.MAX_FRAME_SKIP) || (shouldAdvanceOneFrame)) {
            this.updateObjects(ObjectManager.objects);
            this.detectCollisions(ObjectManager.collidables);
            GameManager.nextGameTick += GameManager.SKIP_TICKS;
            loops += 1;

            if (shouldAdvanceOneFrame) {
                shouldAdvanceOneFrame = false;
            }
        }

        // Even if we process 10 frames, we only want to draw once (no point in drawing older frames)
        if (loops) {
            this.drawObjects(ObjectManager.objects, this.context);
        }
    }
    
    static animationLoop() {
        // stop loop if paused
        if (this.isPaused) return;

        // Start the game loop
        this.gameLoop();
        // requestAnimationFrame is a javascript provided function, see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame for more details
        requestAnimationFrame(this.animationLoop);
    }

    static advanceOneFrame() {
        // One want to advance one frame if the game is paused, or else it doesn't really make any sense to advance one frame
        if (GameConfig.debug && this.isPaused) {
            console.log("Advancing the game one frame");
            this.gameLoop(true, true);
        }
    }
}