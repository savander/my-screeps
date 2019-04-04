import {Entity} from "../Contracts/Entity";

export class DefaultEntity implements Entity {
    protected creep: Creep;
    protected structure: Structure;

    constructor(creep: Creep, structure: Structure) {
        this.creep = creep;
        this.structure = structure;
    }

    public Run(): void {
        //
    }
}
