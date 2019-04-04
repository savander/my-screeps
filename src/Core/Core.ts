import {Entity} from "../Contracts/Entity";
import {BuilderEntity} from "../Creeps/BuilderEntity";
import {CreepRoles} from "../Creeps/CreepRoles";
import {DefaultEntity} from "../Creeps/DefaultEntity";
import {HarvesterEntity} from "../Creeps/HarvesterEntity";
import {UpgraderEntity} from "../Creeps/UpgraderEntity";
import {MemoryManager} from "./MemoryManager";

export class Core {
    public static HARVESTERS_AMOUNT: number = 4;
    public static UPGRADERS_AMOUNT: number = 4;

    public Tick(): void {
        // Clear memory every tick.
        MemoryManager.ClearCreeps();

        this.CreateEntities();
        this.RunCreeps();
    }

    protected RunCreeps(): void {
        for (const creepName in Game.creeps) {
            let entity: Entity;
            const creep: Creep = Game.creeps[creepName];
            switch (creep.memory.role) {
                case CreepRoles.HARVESTER:
                    entity = new HarvesterEntity(creep, Game.spawns[creep.memory.spawner]);
                    break;
                case CreepRoles.BUILDER:
                    entity = new BuilderEntity(creep, Game.spawns[creep.memory.spawner]);
                    break;
                case CreepRoles.UPGRADER:
                    entity = new UpgraderEntity(creep, Game.spawns[creep.memory.spawner]);
                    break;
                default:
                    entity = new DefaultEntity(creep, Game.spawns[creep.memory.spawner]);
            }

            entity.Run();
        }
    }

    protected CreateEntities() {
        const spawners: StructureSpawn[] = this.FilterByStructure(STRUCTURE_SPAWN) as StructureSpawn[];
        const harvesters: Creep[] = this.FilterByRole(CreepRoles.HARVESTER);
        const harvestersRequired: number = spawners.length * Core.HARVESTERS_AMOUNT;

        const upgraders: Creep[] = this.FilterByRole(CreepRoles.UPGRADER);
        const upgradersRequired: number = spawners.length * Core.UPGRADERS_AMOUNT;

        if (harvesters.length < harvestersRequired) {
            spawners.forEach(spawner => {
                const creeps: Creep[] = this.FilterByRoleInRoom(CreepRoles.HARVESTER, spawner.room);

                if (creeps.length < Core.HARVESTERS_AMOUNT) {
                    this.SpawnEntity(spawner, {
                        role: CreepRoles.HARVESTER,
                        room: spawner.room.name,
                        spawner: spawner.name,
                        upgrading: false,
                        working: false
                    });
                }
            });
        } else if (upgraders.length < upgradersRequired) {
            spawners.forEach(spawner => {
                const creeps: Creep[] = this.FilterByRoleInRoom(CreepRoles.UPGRADER, spawner.room);

                if (creeps.length < Core.UPGRADERS_AMOUNT) {
                    this.SpawnEntity(spawner, {
                        role: CreepRoles.UPGRADER,
                        room: spawner.room.name,
                        spawner: spawner.name,
                        upgrading: false,
                        working: false
                    });
                }
            });
        }
    }

    public SpawnEntity(spawner: StructureSpawn, creepMemory: CreepMemory): ScreepsReturnCode {
        return spawner.spawnCreep(
            [MOVE, CARRY, WORK],
            creepMemory.role + '-' + Game.time + '-' + spawner.room.name,
            {memory: creepMemory});
    }

    protected FilterByRole(role: CreepRoles): Creep[] {
        return Object.values(Game.creeps).filter(creep => {
            return creep.memory.role === role;
        });
    }

    protected FilterByRoleInRoom(role: CreepRoles, room: Room): Creep[] {
        return Object.values(room.find(FIND_MY_CREEPS)).filter(creep => {
            return creep.memory.role === role;
        });
    }

    protected FilterByStructure(structureName: string): Structure[] {
        return Object.values(Game.structures).filter(structure => {
            return structure.structureType === structureName;
        });
    }
}
