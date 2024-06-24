import React from 'react'
import styles from './TableStat.module.css'
import { TableStatData } from '../../types/types'

type TableStatProps = {
    tableStat: TableStatData
    canEdit: boolean
}

const TableStat = ({ tableStat, canEdit }: TableStatProps) => {
    const [priority, setPriority] = React.useState(tableStat.priority)
    const [points, setPoints] = React.useState(tableStat.points)

    return (
        <div className={styles.stats}>
            {canEdit ? (
                <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className={styles.inputPriority}
                />
            ) : (
                <span className={styles.personPriority}>
                    {tableStat.priority}
                </span>
            )}
            {canEdit ? (
                <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className={styles.inputPoints}
                />
            ) : (
                <span className={styles.personPoints}>{tableStat.points}</span>
            )}
        </div>
    )
}

export { TableStat }
