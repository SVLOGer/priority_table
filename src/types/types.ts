type TableData = {
    tableName: string
    maxSlots: number
    occupiedSlots: number
    minPoints: number
    tableIndex: number
    persons: PersonData[]
}

type PersonData = {
    id: number
    name: string
    tableStats: TableStatData
}

type TableStatData = {
    priority: number
    points: number
}

export type { TableStatData, PersonData, TableData }
