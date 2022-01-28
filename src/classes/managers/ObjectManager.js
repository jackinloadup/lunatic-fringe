export class ObjectManager {
    static objects = [];
    static collidables = [];

    static addObject(object, collidable = true) {
        this.objects.push(object);
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
}