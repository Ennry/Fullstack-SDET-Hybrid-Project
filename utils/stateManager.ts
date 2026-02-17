export class StateManager {
    private state: Map<string, unknown> = new Map()

    set(key: string, value: unknown): void {
        this.state.set(key, value)
        console.log(`[STATE] Set: ${key} = ${JSON.stringify(value)}`)
    }

    get<T = unknown>(key: string): T {
        const value = this.state.get(key)
        console.log(`[STATE] Get: ${key} = ${JSON.stringify(value)}`)
        return value as T
    }

    has(key: string): boolean {
        return this.state.has(key)
    }

    clear(): void {
        this.state.clear()
        console.log(`[STATE] Cleared all state`)
    }

    getAll(): Record<string, unknown> {
        return Object.fromEntries(this.state)
    }
}

export function createStateManager(): StateManager {
    return new StateManager()
}
