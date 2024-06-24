import React from 'react'
import styles from './TextFileUploader.module.css'
import { PersonData, TableData } from '../../types/types'

const parseFileContent = (content: string): TableData[] => {
    const lines = content.split('\n').map((line) => line.trim())
    const tables: TableData[] = []
    let currentTable: TableData | null = null
    let tableIndex = 1

    lines.forEach((line) => {
        if (!line) return

        const tableMatch = line.match(/(.+)\s+-\s+(\d+)\s+места/)
        const personMatch = line.match(
            /^(.+)\s+-\s+(\d+)\s+баллов,\s+приоритет\s+(\d+),\s+id\s+(\d+)/,
        )

        if (tableMatch) {
            if (currentTable) {
                currentTable.persons.sort(
                    (a, b) => b.tableStats.points - a.tableStats.points,
                ) // Sort persons by points descending
                tables.push(currentTable)
            }

            const [_, tableName, maxSlotsStr] = tableMatch
            currentTable = {
                tableName: tableName.trim(),
                maxSlots: parseInt(maxSlotsStr, 10),
                occupiedSlots: 0, // You may initialize this based on logic
                minPoints: 0,
                tableIndex: tableIndex++,
                persons: [], // Initialize persons array
            }
        } else if (personMatch && currentTable) {
            const [_, name, pointsStr, priorityStr, idStr] = personMatch
            const person: PersonData = {
                id: parseInt(idStr, 10),
                name: name.trim(),
                tableStats: {
                    points: parseInt(pointsStr, 10),
                    priority: parseInt(priorityStr, 10),
                },
            }
            currentTable.persons.push(person)
        }
    })

    if (currentTable) {
        tables.push(currentTable)
    }

    for (const table of tables) {
        table.persons.sort((a, b) => b.tableStats.points - a.tableStats.points)
    }

    return tables
}

type TextFileUploaderProps = {
    setTables: (tables: TableData[]) => void
}

const TextFileUploader = ({ setTables }: TextFileUploaderProps) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                const parsedTables = parseFileContent(content)
                setTables(parsedTables)
            }
            reader.readAsText(file, 'UTF-8')
        }
    }

    return (
        <label>
            <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className={styles.inputFile}
            />
            <span className={styles.inputFileBtn}>Загрузить файл</span>
        </label>
    )
}

export { TextFileUploader }
