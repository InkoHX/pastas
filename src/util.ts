export const tokenizeArguments = (input: string) => {
  const args: string[] = []

  let index: number = 0
  let blocking: "'" | '"' | null = null

  for (const value of input.trim()) {
    if (value === '"' || value === "'") {
      const currentArg = args[index]

      if (currentArg && currentArg.endsWith('\\'))
        args[index] = currentArg.slice(0, -1)
      else if (blocking === value) blocking = null
      else blocking = value
    }

    if (!blocking && value === ' ') {
      index++

      continue
    }

    if (!args[index]) args[index] = value
    else args[index] += value
  }

  return args
}
