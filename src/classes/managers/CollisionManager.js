import { Layer } from "./Layer.js";

export class CollisionManager {
    static collisionMatrix;
    static {
        this.collisionMatrix = [];

        let enumEntries = Object.entries(Layer);
        for(let i = 0; i < enumEntries.length; i++) {
            let [layerName, layerNumber] = enumEntries[i];
            this.collisionMatrix[layerNumber] = [];

            for (let j = 0; j <= i; j++) {
                let [innerLayerName, innerLayerNumber] = enumEntries[j];
                // Fill with true values so the default is that everything collides with everything
                this.collisionMatrix[layerNumber][innerLayerNumber] = true;
            }
        }

        // Collision exceptions from the default
        // Note that the lower Layer is always the second index
        // Ex. should be this.collisionMatrix[Layer.PUFFER][layer.PLAYER] and not this.collisionMatrix[Layer.PLAYER][layer.PUFFER]

        // PLAYER: 0,
        // PLAYER_PROJECTILE: 1,
        // PUFFER_PROJECTILE: 2,
        // QUAD_BLASTER_PROJECTILE: 3,
        // ASTEROID: 4,
        // PUFFER: 5,
        // QUAD_BLASTER: 6,
        // SLICER: 7,
        // SLUDGER: 8,
        // SLUDGER_MINE: 9,
        // HAMMERHEAD: 10,
        // HAMMERHEAD_WEAPON: 11,
        // INSTANT_POWERUP: 12,
        // DURATION_POWERUP: 13,
        // BULLET_POWERUP: 14,
        // STORED_POWERUP: 15,
        // PLAYER_BASE: 16,
        // ENEMY_BASE: 17,
        // ENEMY_BASE_PHOTON: 18

        // The player should not collide with itself or its own projectiles
        this.collisionMatrix[Layer.PLAYER][Layer.PLAYER] = false;
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.PLAYER] = false;

        // Player projectiles should not collide with the player (see above), powerups, or the player base, or the enemy base photons
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.PLAYER_PROJECTILE] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.PLAYER_PROJECTILE] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.PLAYER_PROJECTILE] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.PLAYER_PROJECTILE] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.PLAYER_PROJECTILE] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.PLAYER_PROJECTILE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.PLAYER_PROJECTILE] = false;

        // Puffer projectiles should not collide with other puffer projectiles, puffers, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.PUFFER_PROJECTILE] = false;

        // Quadblaster projectiles should not collide with other quadblaster projectiles, quadblasters, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.QUAD_BLASTER_PROJECTILE] = false;

        // Asteroids should not collide with powerups, the player base, or the enemy base (choosing to have asteroids collide with each other cause its more fun that way)
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.ASTEROID] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.ASTEROID] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.ASTEROID] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.ASTEROID] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.ASTEROID] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.ASTEROID] = false;

        // Puffers should not collide with other Puffers, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.PUFFER][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.PUFFER] = false;

        // Quadblasters should not collide with other quadblasters, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.QUAD_BLASTER] = false;

        // Slicers should not collide with other slicers, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.SLICER][Layer.SLICER] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.SLICER] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.SLICER] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.SLICER] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.SLICER] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.SLICER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.SLICER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.SLICER] = false;

        // Sludgers should not collide with other sludgers, sludger mines, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.SLUDGER][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.SLUDGER] = false;

        // Sludger mines should not collide with other sludger mines, powerups, the player base, or the enemy base (specifically ARE destroyed from the enemy base photon)
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.SLUDGER_MINE] = false;

        // Hammerhead should not collide with other hammerheads, other hammerhead weapons, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.HAMMERHEAD][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.HAMMERHEAD_WEAPON][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.HAMMERHEAD] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.HAMMERHEAD] = false;

        //Hammerhead weapon should not collide with other hammerhead weapons, powerups, the player base, the enemy base, or the enemy base photon
        this.collisionMatrix[Layer.HAMMERHEAD_WEAPON][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.HAMMERHEAD_WEAPON] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.HAMMERHEAD_WEAPON] = false;

        // Instant powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.INSTANT_POWERUP] = false;

        // Duration powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.DURATION_POWERUP] = false;

        // Bullet powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.BULLET_POWERUP] = false;

        // Stored powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.STORED_POWERUP] = false;

        // The player base should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.PLAYER_BASE] = false;

        // The enemy base should not collide with anything except the player and player projectiles (all other false values are set above)
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.ENEMY_BASE] = false;
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.ENEMY_BASE] = false;

        // The enemy base photon should not collide with itself
        this.collisionMatrix[Layer.ENEMY_BASE_PHOTON][Layer.ENEMY_BASE_PHOTON] = false;
    }

    static doObjectLayersCollide(object1, object2) {
        let layer1 = object1.layer;
        let layer2 = object2.layer;
        if (layer1 <= layer2) {
            return this.collisionMatrix[layer2][layer1];
        } else {
            return this.collisionMatrix[layer1][layer2];
        }
    }

    static isProjectileLayer(layer) {
        return layer === Layer.PLAYER_PROJECTILE || layer === Layer.PUFFER_PROJECTILE || layer === Layer.QUAD_BLASTER_PROJECTILE || layer === Layer.HAMMERHEAD_WEAPON || layer === Layer.ENEMY_BASE_PHOTON;
    }

    static isPowerupLayer(layer) {
        return layer === Layer.INSTANT_POWERUP || layer === Layer.DURATION_POWERUP || layer === Layer.BULLET_POWERUP || layer === Layer.STORED_POWERUP;
    }

    static isEnemyLayer(layer) {
        return layer === Layer.HAMMERHEAD || layer === Layer.PUFFER || layer === Layer.QUAD_BLASTER || layer === Layer.SLICER  || layer === Layer.SLUDGER || layer === Layer.SLUDGER_MINE || layer === Layer.ENEMY_BASE;
    }
}