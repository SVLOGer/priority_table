function joinClassNames(...classNames: (string | null | undefined)[]) {
    return classNames.filter((x) => x).join(' ')
}

export { joinClassNames }
