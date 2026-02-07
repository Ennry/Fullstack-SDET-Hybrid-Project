export class StateManager {
    private state: Map<string, any> = new Map()

    set(key: string, value: any): void {
        this.state.set(key, value)
        console.log(`[STATE] Set: ${key} = ${JSON.stringify(value)}`)
    }

    get(key: string): any {
        const value = this.state.get(key)
        console.log(`[STATE] Get: ${key} = ${JSON.stringify(value)}`)
        return value
    }

    has(key: string): boolean {
        return this.state.has(key)
    }

    clear(): void {
        this.state.clear()
        console.log(`[STATE] Cleared all state`)
    }

    getAll(): Record<string, any> {
        return Object.fromEntries(this.state)
    }
}

// Factory function instead of singleton — each test gets its own instance
export function createStateManager(): StateManager {
    return new StateManager()
}