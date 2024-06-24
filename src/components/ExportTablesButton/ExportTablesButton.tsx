import React from 'react'
import { PersonData, TableData } from '../../types/types'

type ExportTablesButtonProps = {
    tables: TableData[]
    className: string
}

const ExportTablesButton = ({ tables, className }: ExportTablesButtonProps) => {
    const exportToFile = () => {
        const dataToWrite = tables
            .map((table) => {
                let tableString = `${table.tableName} - ${table.maxSlots} места, проходной балл ${table.minPoints}\n`
                table.persons.forEach((person) => {
                    if (
                        table.persons.findIndex(
                            (thisPerson: PersonData) =>
                                thisPerson.id === person.id,
                        ) < table.maxSlots
                    ) {
                        tableString += `${person.name} - ${person.tableStats.points} баллов, приоритет ${person.tableStats.priority}, id ${person.id}\n`
                    }
                })
                return tableString
            })
            .join('\n')

        // Создаём Blob из текста
        const blob = new Blob([dataToWrite], { type: 'text/plain' })

        // Создаём URL для Blob
        const url = URL.createObjectURL(blob)

        // Создаём ссылку для скачивания файла
        const link = document.createElement('a')
        link.href = url
        link.download = 'tables_data.txt'

        // Добавляем ссылку на страницу и эмулируем клик для скачивания файла
        document.body.appendChild(link)
        link.click()

        // Удаляем ссылку со страницы после скачивания
        document.body.removeChild(link)

        // Освобождаем URL объекта Blob
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <button onClick={exportToFile} className={className}>
                Экспорт таблиц
            </button>
        </div>
    )
}

export { ExportTablesButton }
