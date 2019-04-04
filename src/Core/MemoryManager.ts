export class MemoryManager {
    /**
     * Automatically delete memory of missing creeps
     */
    public static ClearCreeps(): void {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    }
}
