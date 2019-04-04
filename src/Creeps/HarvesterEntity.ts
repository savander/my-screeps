import {Entity} from "../Contracts/Entity";

export class HarvesterEntity implements Entity {
    protected creep: Creep;
    protected structure: Structure;

    constructor(creep: Creep, structure: Structure) {
        this.creep = creep;
        this.structure = structure;
    }

    public Run(): void {
        if (this.IsFull()) {
            if (this.creep.transfer(this.structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.structure, {
                    visualizePathStyle: {
                        stroke: '#ffffff',
                    }
                });
            }
            return;
        }

        const sources = this.creep.room.find(FIND_SOURCES);
        if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            this.creep.moveTo(sources[0], {
                visualizePathStyle: {
                    stroke: '#ffaa00',
                }
            });
        }
    }

    public IsFull(): boolean {
        return this.creep.carry.energy >= this.creep.carryCapacity;
    }
}
