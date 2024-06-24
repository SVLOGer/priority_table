import React from 'react'

type ExportTablesButtonProps = {
    dataToWrite: string
    className: string
}

const ExportHistoryButton = ({
    dataToWrite,
    className,
}: ExportTablesButtonProps) => {
    const exportToFile = () => {
        // Создаём Blob из текста
        const blob = new Blob([dataToWrite], { type: 'text/plain' })

        // Создаём URL для Blob
        const url = URL.createObjectURL(blob)

        // Создаём ссылку для скачивания файла
        const link = document.createElement('a')
        link.href = url
        link.download = 'change_history_data.txt'

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
                Экспорт истории
            </button>
        </div>
    )
}

export { ExportHistoryButton }
