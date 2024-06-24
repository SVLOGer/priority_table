import React, { useState } from 'react'
import styles from './Table.module.css'
import { Person } from '../Person/Person'
import { PersonData, TableStatData, TableData } from '../../types/types'
import { joinClassNames } from '../../functions/joinClassNames'

type TableProps = {
    table: TableData
    addPerson: (
        personName: string,
        personStats: TableStatData,
        tableIndex: number,
        isCreatPersonWarning: boolean,
    ) => void
    updateTable: (tableIndex: number, updatedTable: TableData) => void
    setOpenDuplicatePopup: (state: boolean) => void
    setDuplicateData: (person: PersonData) => void
    deleteTable: (tableIndex: number) => void
}

const Table = ({
    table,
    addPerson,
    updateTable,
    setOpenDuplicatePopup,
    setDuplicateData,
    deleteTable,
}: TableProps) => {
    const [personName, setPersonName] = useState('')
    const [priority, setPriority] = useState(0)
    const [points, setPoints] = useState(0)
    const [isCreatPersonWarning, setIsCreatPersonWarning] = useState(false)

    const updatePersonOnTable = (updatePerson: PersonData) => {
        const updatedTable = {
            ...table,
            persons: table.persons.map((person) => {
                if (person.name === updatePerson.name) {
                    person = updatePerson
                }

                return person
            }),
        }
        updateTable(table.tableIndex, updatedTable)
    }

    const updatePersons = (persons: PersonData[]) => {
        const updatedTable = { ...table, persons }
        updateTable(table.tableIndex, updatedTable)
    }

    const deletePerson = (deletedPerson: PersonData) => {
        const updatedPersons = table.persons.filter(
            (person) => person.id !== deletedPerson.id,
        )
        updatePersons(updatedPersons ? updatedPersons : [])
    }

    return (
        <div className={styles.table}>
            <div className={styles.tableHeader}>
                <span>
                    {table.tableName} (Количество мест: {table.maxSlots},
                    Необходимо баллов: {table.minPoints})
                </span>
                <button
                    className={styles.button}
                    onClick={() => deleteTable(table.tableIndex)}
                >
                    Удалить
                </button>
            </div>
            <div
                className={
                    table.persons.length > 0
                        ? styles.columnTitles
                        : styles.hidden
                }
            >
                <span className={styles.columnName}>Name</span>
                <span className={styles.columnPriority}>Priority</span>
                <span className={styles.columnPoints}>Points</span>
            </div>
            <div
                className={joinClassNames(
                    styles.persons,
                    table.persons.length > 0 ? styles.tableBorder : '',
                )}
            >
                {table.persons.map((person, index) => (
                    <Person
                        key={index}
                        person={person}
                        updatePersonOnTable={updatePersonOnTable}
                        setOpenDuplicatePopup={setOpenDuplicatePopup}
                        setDuplicateData={setDuplicateData}
                        className={
                            table.maxSlots > index &&
                            table.minPoints <= person.tableStats.points
                                ? styles.green
                                : styles.red
                        }
                        deletePerson={deletePerson}
                    />
                ))}
            </div>
            <div className={styles.addPerson}>
                <input
                    type="text"
                    placeholder="Enter person name"
                    onChange={(e) => setPersonName(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="number"
                    max={5}
                    min={0}
                    placeholder="Enter priority"
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className={styles.input}
                />
                <input
                    type="number"
                    min={0}
                    placeholder="Enter points"
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className={styles.input}
                />
                <div>
                    {isCreatPersonWarning && (
                        <span
                            className={joinClassNames(
                                styles.warning,
                                styles.createWarning,
                            )}
                        >
                            Введите все данные
                        </span>
                    )}
                    <button
                        className={styles.button}
                        onClick={() => {
                            if (
                                personName.length > 0 &&
                                priority > 0 &&
                                points > 0
                            ) {
                                addPerson(
                                    personName,
                                    {
                                        priority,
                                        points,
                                    },
                                    table.tableIndex,
                                    isCreatPersonWarning,
                                )
                                setIsCreatPersonWarning(false)
                            } else {
                                setIsCreatPersonWarning(true)
                            }
                        }}
                    >
                        Add Person
                    </button>
                </div>
            </div>
        </div>
    )
}

export { Table }
