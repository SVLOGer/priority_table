import React, { useState } from 'react'
import styles from './Person.module.css'
import { TableStat } from '../TableStat/TableStat'
import { PersonData } from '../../types/types'
import { joinClassNames } from '../../functions/joinClassNames'

type PersonProps = {
    person: PersonData
    updatePersonOnTable: (person: PersonData) => void
    setOpenDuplicatePopup: (state: boolean) => void
    setDuplicateData: (person: PersonData) => void
    className: string
    deletePerson: (person: PersonData) => void
}

const Person = ({
    person,
    updatePersonOnTable,
    setOpenDuplicatePopup,
    setDuplicateData,
    className,
    deletePerson,
}: PersonProps) => {
    const [canEdit, setCanEdit] = useState(false)
    const [name, setName] = useState(person.name)

    return (
        <div className={styles.person}>
            <div className={joinClassNames(styles.personInfo, className)}>
                {canEdit ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputName}
                    />
                ) : (
                    <span className={styles.personName}>{person.name}</span>
                )}
                <TableStat tableStat={person.tableStats} canEdit={canEdit} />
            </div>
            {canEdit ? (
                <button
                    className={styles.button}
                    onClick={() => {
                        setCanEdit(false)
                        updatePersonOnTable(person)
                    }}
                >
                    Save
                </button>
            ) : (
                <button
                    className={styles.button}
                    onClick={() => setCanEdit(true)}
                >
                    Изменить
                </button>
            )}
            <button
                className={styles.button}
                onClick={() => {
                    setOpenDuplicatePopup(true)
                    setDuplicateData(person)
                }}
            >
                Дублировать
            </button>
            <button
                className={styles.button}
                onClick={() => {
                    deletePerson(person)
                }}
            >
                Удалить
            </button>
        </div>
    )
}

export { Person }
