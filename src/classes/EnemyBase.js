import { AiGameObject } from "./AiGameObject.js";
import { Layer } from "./managers/Layer.js";
import { LevelManager } from "./managers/LevelManager.js";
import { MediaManager } from "./managers/MediaManager.js";
import { RandomUtil } from "../utility/RandomUtil.js";
import { ObjectManager } from "./managers/ObjectManager.js";
import { QuadBlaster } from "./enemies/QuadBlaster.js";
import { Vector } from "../utility/Vector.js";
import { Sludger } from "./enemies/Sludger.js";
import { Puffer } from "./enemies/Puffer.js";
import { Slicer } from "./enemies/Slicer.js";

export class EnemyBase extends AiGameObject {
    constructor(xLocation, yLocation, playerShip) {
        /**
         * The width, height, angle (which doesn't really apply), sprite, velocityX, velocityY, collisionRadius, and mass are always the same for an EnemyBase.
         */
        super(xLocation, yLocation, Layer.ENEMY_BASE, 62, 60, 0, MediaManager.Sprites.EnemyBase, 0, 0, 28, 100000000, playerShip, 200);

        this.ticksUntilNextEnemySpawn = 60 * 5;
        this.MAX_SPAWN_RATE = 6 * 60;
        this.MIN_SPAWN_RATE = 2 * 60;
    }

    handleCollision(otherObject) {
        // The EnemyBase should not do anything when other objects collide with it (including the Player), it is unmovable and indestructible
        return;
    }

    updateState() {
        this.ticksUntilNextEnemySpawn--;

        if (this.ticksUntilNextEnemySpawn <= 0 && LevelManager.spawnStack.length !== 0) {
            // Spawn in another enemy
            let enemyToSpawn = LevelManager.spawnStack.pop();

            // Start at a random point somewhere inside of the enemy base. This isn't super important but a slightly random location
            // could allow for some variability in the movement of enemies when they first spawn.
            // Instead of spawning in a random square by randomizing x and y, spawn in a random circle area by randomizing angle and radius
            // Also don't spawn too close to the edge of the enemy base so it looks like the enemy "comes out" of the base, hence the random radius between 0 and 40
            let randomAngle = RandomUtil.randomNumber(0, 2 * Math.PI);
            let randomLocationRadius = RandomUtil.randomNumber(0, 40);
            let startingPosition = new Vector(randomLocationRadius * Math.cos(randomAngle) + this.x, randomLocationRadius * Math.sin(randomAngle) + this.y);

            // starting velocity is in the same direction as starting position, so use the same angle
            if (enemyToSpawn === Layer.QUAD_BLASTER) {
                this.log('spawning QuadBlaster');
                let randomSpeed = RandomUtil.randomNumber(QuadBlaster.MAX_SPEED/2, QuadBlaster.MAX_SPEED);
                let startingVelocity = new Vector(randomSpeed * Math.cos(randomAngle), randomSpeed * Math.sin(randomAngle));
                ObjectManager.addObject(new QuadBlaster(startingPosition.x, startingPosition.y, startingVelocity.x, startingVelocity.y, this.playerShipReference));
            } else if (enemyToSpawn === Layer.SLUDGER) {
                this.log('spawning Sludger');
                let randomSpeed = RandomUtil.randomNumber(Sludger.MAX_SPEED/2, Sludger.MAX_SPEED);
                let startingVelocity = new Vector(randomSpeed * Math.cos(randomAngle), randomSpeed * Math.sin(randomAngle));
                ObjectManager.addObject(new Sludger(startingPosition.x, startingPosition.y, startingVelocity.x, startingVelocity.y, this.playerShipReference));
            } else if (enemyToSpawn === Layer.PUFFER) {
                this.log('spawning Puffer');
                let randomSpeed = RandomUtil.randomNumber(Puffer.MAX_SPEED/2, Puffer.MAX_SPEED);
                let startingVelocity = new Vector(randomSpeed * Math.cos(randomAngle), randomSpeed * Math.sin(randomAngle));
                ObjectManager.addObject(new Puffer(startingPosition.x, startingPosition.y, startingVelocity.x, startingVelocity.y, randomAngle, this.playerShipReference));
            } else if (enemyToSpawn === Layer.SLICER) {
                this.log('spawning Slicer');
                let randomSpeed = RandomUtil.randomNumber(Slicer.MAX_SPEED/2, Slicer.MAX_SPEED);
                let startingVelocity = new Vector(randomSpeed * Math.cos(randomAngle), randomSpeed * Math.sin(randomAngle));
                ObjectManager.addObject(new Slicer(startingPosition.x, startingPosition.y, startingVelocity.x, startingVelocity.y, randomAngle, this.playerShipReference));
            }

            this.ticksUntilNextEnemySpawn = RandomUtil.randomNumber(this.MIN_SPAWN_RATE, this.MAX_SPAWN_RATE);
        }

        // FUTURE TODO: Fire bullets towards player if player is nearby, also handle spawning more enemies
    }
}