import {Entity} from "../Contracts/Entity";

export class UpgraderEntity implements Entity {
    protected creep: Creep;
    protected structure: Structure;

    constructor(creep: Creep, structure: Structure) {
        this.creep = creep;
        this.structure = structure;
    }

    public Run(): void {
        if (this.creep.memory.upgrading && this.creep.carry.energy === 0) {
            this.creep.memory.upgrading = false;
        }
        if (!this.creep.memory.upgrading && this.creep.carry.energy === this.creep.carryCapacity) {
            this.creep.memory.upgrading = true;
        }

        if (this.creep.memory.upgrading) {
            const controller = this.creep.room.controller;
            if (!controller) {
                // Coś tu trzeba robić, jeśli nie ma controllera. HMMM
                return;
            }

            if (this.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(controller, {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                })
            }
        } else {
            const sources = this.creep.room.find(FIND_SOURCES);
            if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        }
    }
}
