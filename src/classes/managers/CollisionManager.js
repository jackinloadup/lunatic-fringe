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
                let [innerLayerName, innerLayerNumber] = enumEntries[i];
                // Fill with true values so the default is that everything collides with everything
                this.collisionMatrix[layerNumber][innerLayerNumber] = true;
            }
        }

        // Collision exceptions from the default
        // Note that the lower Layer is always the first index
        // Ex. should be this.collisionMatrix[Layer.PLAYER][layer.PUFFER] and not this.collisionMatrix[Layer.PUFFER][layer.PLAYER]

        // The player should not collide with itself or its own projectiles
        this.collisionMatrix[Layer.PLAYER][Layer.PLAYER] = false;
        this.collisionMatrix[Layer.PLAYER][Layer.PLAYER_PROJECTILE] = false;

        // Player projectiles should not collide with the player (see above), powerups, or the player base
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.PLAYER_PROJECTILE][Layer.PLAYER_BASE] = false;

        // Puffer projectiles should not collide with other puffer projectiles, puffers, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.PUFFER_PROJECTILE] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.PUFFER_PROJECTILE][Layer.ENEMY_BASE] = false;

        // Quadblaster projectiles should not collide with other quadblaster projectiles, quadblasters, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.QUAD_BLASTER_PROJECTILE] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER_PROJECTILE][Layer.ENEMY_BASE] = false;

        // Asteroids should not collide with powerups, the player base, or the enemy base (choosing to have asteroids collide with each other cause its more fun that way)
        this.collisionMatrix[Layer.ASTEROID][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.ASTEROID][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.ASTEROID][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.ASTEROID][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.ASTEROID][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.ASTEROID][Layer.ENEMY_BASE] = false;

        // Puffers should not collide with other Puffers, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.PUFFER][Layer.PUFFER] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.PUFFER][Layer.ENEMY_BASE] = false;

        // Quadblasters should not collide with other quadblasters, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.QUAD_BLASTER] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.QUAD_BLASTER][Layer.ENEMY_BASE] = false;

        // Slicers should not collide with other slicers, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.SLICER][Layer.SLICER] = false;
        this.collisionMatrix[Layer.SLICER][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.SLICER][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.SLICER][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.SLICER][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.SLICER][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.SLICER][Layer.ENEMY_BASE] = false;

        // Sludgers should not collide with other sludgers, sludger mines, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.SLUDGER][Layer.SLUDGER] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.SLUDGER][Layer.ENEMY_BASE] = false;

        // Sludger mines should not collide with other sludger mines, powerups, the player base, or the enemy base
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.SLUDGER_MINE] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.SLUDGER_MINE][Layer.ENEMY_BASE] = false;

        // Instant powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.INSTANT_POWERUP] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.INSTANT_POWERUP][Layer.ENEMY_BASE] = false;

        // Duration powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.DURATION_POWERUP] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.DURATION_POWERUP][Layer.ENEMY_BASE] = false;

        // Bullet powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.BULLET_POWERUP] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.BULLET_POWERUP][Layer.ENEMY_BASE] = false;

        // Stored powerup should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.STORED_POWERUP] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.STORED_POWERUP][Layer.ENEMY_BASE] = false;

        // The player base should not collide with anything except the player (all other false values are set above)
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.PLAYER_BASE] = false;
        this.collisionMatrix[Layer.PLAYER_BASE][Layer.ENEMY_BASE] = false;

        // The enemy base should not collide with anything except the player and player projectiles (all other false values are set above)
        this.collisionMatrix[Layer.ENEMY_BASE][Layer.ENEMY_BASE] = false;
    }

    static doObjectLayersCollide(object1, object2) {
        let layer1 = object1.layer;
        let layer2 = object2.layer;
        if (layer1 <= layer2) {
            return this.collisionMatrix[layer1][layer2];
        } else {
            return this.collisionMatrix[layer2][layer1];
        }
    }

    static isPowerupLayer(layer) {
        return layer === Layer.INSTANT_POWERUP || layer === Layer.DURATION_POWERUP || layer === Layer.BULLET_POWERUP || later === Layer.STORED_POWERUP;
    }
}