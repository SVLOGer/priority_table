import React, { useState } from 'react'
import styles from './App.module.css'
import { Table } from './components/Table/Table'
import { PersonData, TableStatData, TableData } from './types/types'
import close_button from './icons/close.svg'
import { rateSelections } from './functions/rateSelections'
import { TextFileUploader } from './components/TextFileUploader/TextFileUploader'
import { ExportTablesButton } from './components/ExportTablesButton/ExportTablesButton'
import { ExportHistoryButton } from './components/ExportHistoryButton/ExportHistoryButton'
import { joinClassNames } from './functions/joinClassNames'

const App = () => {
    document.title = 'Dynamic Tables'
    const [tableName, setTableName] = useState('')
    const [maxSlots, setMaxSlots] = useState(0)
    const [minPoints, setMinPoints] = useState(0)
    const [id, setId] = useState(0)
    const [openDuplicatePopup, setOpenDuplicatePopup] = useState(false)
    const [duplicateData, setDuplicateData] = useState<PersonData>()
    const [duplicateTableName, setDuplicateTableName] = useState('')
    const [duplicatePoints, setDuplicatePoints] = useState(0)
    const [duplicatePriority, setDuplicatePriority] = useState(0)
    const [noValidTable, setNoValidTable] = useState(false)
    const [noValidPerson, setNoValidPerson] = useState(false)
    const [history, setHistory] = useState('')
    const [isCreatTableWarning, setIsCreatTableWarning] = useState(false)

    const [tables, setTables] = useState<TableData[]>([])

    const createTable = (
        tableName: string,
        maxSlots: number,
        minPoints: number,
    ) => {
        if (tableName.length > 0 && maxSlots > 0 && minPoints > 0) {
            setTables((prevTables) => {
                return [
                    ...prevTables,
                    {
                        tableName,
                        maxSlots,
                        occupiedSlots: 0,
                        minPoints,
                        persons: [],
                        tableIndex: prevTables.length,
                    },
                ]
            })
            setMinPoints(0)
            setMaxSlots(0)
            setTableName('')
            setIsCreatTableWarning(false)
        } else {
            setIsCreatTableWarning(true)
        }
    }

    const updateTable = (tableIndex: number, updatedTable: TableData) => {
        setTables((prevTables) => {
            const updatedTables = [...prevTables]
            updatedTables[tableIndex] = updatedTable
            return updatedTables
        })
    }

    const addPerson = (
        personName: string,
        personStats: TableStatData,
        tableIndex: number,
        isCreatPersonWarning: boolean,
    ) => {
        if (!isCreatPersonWarning) {
            setTables((prevTables) => {
                const newPerson = {
                    id: id,
                    name: personName,
                    tableStats: personStats,
                }
                const updatedTables = [...prevTables]
                updatedTables[tableIndex].persons = [
                    ...updatedTables[tableIndex].persons,
                    newPerson,
                ].sort((a, b) => b.tableStats.points - a.tableStats.points)
                setId(newPerson.id + 1)
                return updatedTables
            })
        }
    }

    const duplicatePerson = () => {
        if (
            tables.find((table) => table.tableName === duplicateTableName) &&
            duplicateData
        ) {
            tables.map((table) => {
                if (table.tableName === duplicateTableName) {
                    if (
                        !table.persons.find(
                            (person) => person.id === duplicateData.id,
                        )
                    ) {
                        const updatedPersons = [
                            ...table.persons,
                            {
                                id: duplicateData.id,
                                name: duplicateData.name,
                                tableStats: {
                                    priority: duplicatePriority,
                                    points: duplicatePoints,
                                },
                            },
                        ].sort(
                            (a, b) => b.tableStats.points - a.tableStats.points,
                        )
                        setOpenDuplicatePopup(false)
                        setNoValidTable(false)
                        setNoValidPerson(false)
                        return {
                            ...table,
                            persons: updatedPersons,
                        }
                    } else {
                        setNoValidPerson(true)
                        setNoValidTable(false)
                    }
                }
            })
        } else {
            setNoValidTable(true)
            setNoValidPerson(false)
        }
    }

    const deleteTable = (tableIndex: number) => {
        const updatedTables = tables.filter(
            (table) => table.tableIndex !== tableIndex,
        )
        setTables(updatedTables)
    }

    return (
        <>
            {openDuplicatePopup && duplicateData ? (
                <div className={styles.popupPage}>
                    <div className={styles.popup}>
                        <img
                            src={close_button}
                            className={styles.closeButton}
                            onClick={() => {
                                setOpenDuplicatePopup(false)
                            }}
                        />
                        <h1>{duplicateData.name}</h1>
                        <div className={styles.field}>
                            <span>Название таблицы</span>
                            <input
                                placeholder={'Введите название таблицы'}
                                value={duplicateTableName}
                                onChange={(e) =>
                                    setDuplicateTableName(e.target.value)
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <span>Приоритет</span>
                            <input
                                type={'number'}
                                placeholder={'Введите приоритет'}
                                value={duplicatePriority}
                                onChange={(e) =>
                                    setDuplicatePriority(Number(e.target.value))
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <span>Баллы</span>
                            <input
                                type={'number'}
                                placeholder={'Введите баллы'}
                                value={duplicatePoints}
                                onChange={(e) =>
                                    setDuplicatePoints(Number(e.target.value))
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <button
                                className={styles.button}
                                onClick={duplicatePerson}
                            >
                                Дублировать
                            </button>
                            {noValidTable && (
                                <span className={styles.warning}>
                                    Такой таблицы не существует
                                </span>
                            )}
                            {noValidPerson && (
                                <span className={styles.warning}>
                                    Такой человек уже существует в таблице
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.tablePage}>
                    <div className={styles.header}>
                        <span>Dynamic Tables</span>
                        <input
                            type="text"
                            placeholder="Enter table name"
                            onChange={(e) => setTableName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Enter max slots"
                            onChange={(e) =>
                                setMaxSlots(Number(e.target.value))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Enter min points"
                            onChange={(e) =>
                                setMinPoints(Number(e.target.value))
                            }
                        />
                        <div>
                            {isCreatTableWarning && (
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
                                onClick={() =>
                                    createTable(tableName, maxSlots, minPoints)
                                }
                            >
                                Создать таблицу
                            </button>
                        </div>
                        <button
                            className={styles.button}
                            onClick={() =>
                                setTables(
                                    rateSelections(
                                        [...tables],
                                        history,
                                        setHistory,
                                    ),
                                )
                            }
                        >
                            Провести отбор
                        </button>
                        <TextFileUploader setTables={setTables} />
                        <ExportTablesButton
                            tables={tables}
                            className={styles.button}
                        />
                        <ExportHistoryButton
                            dataToWrite={history}
                            className={styles.button}
                        />
                    </div>
                    <div className={styles.tables}>
                        {tables.map((table, index) => (
                            <Table
                                key={index}
                                table={table}
                                addPerson={addPerson}
                                updateTable={updateTable}
                                setOpenDuplicatePopup={setOpenDuplicatePopup}
                                setDuplicateData={setDuplicateData}
                                deleteTable={deleteTable}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default App
