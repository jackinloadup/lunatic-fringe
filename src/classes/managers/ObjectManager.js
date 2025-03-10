import { CollisionManager } from "./CollisionManager.js";

export class ObjectManager {
    static nextId = 1;

    static objects = [];
    static collidables = [];

    // TODO: Use maps for all objects in game for faster deleting and easier management?
    static projectileObjects = {};
    static nonProjectileObjects = {};

    static addObject(object, collidable = true) {
        const nextId = this.getNextObjectId();
        object.objectId = nextId;
        this.objects.push(object);

        if (CollisionManager.isProjectileLayer(object.layer)) {
            this.projectileObjects[nextId] = object;
        } else {
            this.nonProjectileObjects[nextId] = object;
        }

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

        delete this.projectileObjects[object.objectId];
        delete this.nonProjectileObjects[object.objectId];
    }

    static getNextObjectId() {
        return this.nextId++;
    }
}