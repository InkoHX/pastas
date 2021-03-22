interface Messages {
  MISSING_ARGUMENT: (count: number) => string
  ARGUMENT_TYPE: (type: string, position: number) => string
  ARGUMENT_CHOOSE_ONE: (list: Array<string>, position: number) => string
  OPTION_VALUE_TYPE: (type: string, optionName: string) => string
  UNKNOWN_ALIAS: (aliasName: string, originalName: string) => string
}

const messages: Readonly<Messages> = {
  MISSING_ARGUMENT: count => `${count} argument is missing.`,
  ARGUMENT_TYPE: (type, position) =>
    `The ${position} argument must be a ${type}.`,
  ARGUMENT_CHOOSE_ONE: (list, position) =>
    `The ${position} argument must be one of ${list.join(', ')}.`,
  OPTION_VALUE_TYPE: (type, optionName) =>
    `Option "${optionName}" needs to be passed a ${type}.`,
  UNKNOWN_ALIAS: (aliasName, originalName) =>
    `The option "${originalName}" is assigned the alias "${aliasName}", but that option is not registered.`,
}

export class PastasError<K extends keyof Messages> extends Error {
  public constructor(
    type: K,
    ...args: Messages[K] extends (...args: infer P) => string ? P : []
  ) {
    super()

    this.name = 'PastasError'
    this.message = typeof (messages[type] as (...args: any[]) => string)(
      ...args
    )
  }
}
