import { PersonData, TableData } from '../types/types'

function findMaxPriority(tables: TableData[]) {
    const sortTables: TableData[] = tables.map((table) => ({
        ...table,
        persons: [...table.persons].sort(
            (a, b) => b.tableStats.priority - a.tableStats.priority,
        ),
    }))
    let maxPriority = 1

    for (const table of sortTables) {
        if (table.persons[0].tableStats.priority === 5) {
            return 5
        }
        if (table.persons[0].tableStats.priority > maxPriority) {
            maxPriority = table.persons[0].tableStats.priority
        }
    }

    return maxPriority
}

function rateSelection(tables: TableData[], priority: number) {
    let curHistory = ''

    tables.map((table: TableData) => {
        table.persons.map((person: PersonData) => {
            if (
                person.tableStats.priority === priority &&
                table.minPoints <= person.tableStats.points &&
                table.occupiedSlots < table.maxSlots &&
                table.persons.findIndex(
                    (thisPerson: PersonData) => thisPerson.id === person.id,
                ) < table.maxSlots
            ) {
                table.occupiedSlots++
                tables.map((curTable: TableData) => {
                    if (curTable.tableIndex !== table.tableIndex) {
                        if (
                            curTable.persons.findIndex(
                                (thisPerson: PersonData) =>
                                    thisPerson.id === person.id,
                            ) > 0
                        ) {
                            curHistory += `${person.name} удален из ${curTable.tableName}\n`
                        }

                        curTable.persons = curTable.persons.filter(
                            (curPerson: PersonData) =>
                                curPerson.id !== person.id ||
                                (curPerson.id === person.id &&
                                    curPerson.tableStats.priority <
                                        person.tableStats.priority),
                        )
                    }
                })
            }
        })
    })

    return curHistory
}

function deleteDuplicates(tables: TableData[], priority: number) {
    tables.map((table: TableData) => {
        table.persons.map((person: PersonData) => {
            if (
                person.tableStats.priority === priority &&
                table.minPoints <= person.tableStats.points &&
                table.persons.findIndex(
                    (thisPerson: PersonData) => thisPerson.id === person.id,
                ) < table.maxSlots
            ) {
                tables.map((curTable: TableData) => {
                    if (curTable.tableIndex !== table.tableIndex) {
                        curTable.persons = curTable.persons.filter(
                            (curPerson: PersonData) =>
                                curPerson.id !== person.id ||
                                (curPerson.id === person.id &&
                                    curPerson.tableStats.priority <
                                        person.tableStats.priority),
                        )
                    }
                })
            }
        })
    })
}

function setMinPoints(tables: TableData[]) {
    for (const table of tables) {
        table.minPoints =
            table.persons[table.occupiedSlots - 1].tableStats.points
    }
}

function rateSelections(
    tables: TableData[],
    history: string,
    setHistory: (history: string) => void,
) {
    const maxPriority = findMaxPriority(tables)
    for (let priority = 1; priority <= maxPriority; priority++) {
        for (let curPriority = priority; curPriority >= 1; curPriority--) {
            history += rateSelection(tables, curPriority)
        }
    }

    setHistory(history)

    const maxSortPriority = findMaxPriority(tables)
    for (let priority = 1; priority <= maxSortPriority; priority++) {
        deleteDuplicates(tables, priority)
    }

    setMinPoints(tables)

    return tables
}

export { rateSelections }
