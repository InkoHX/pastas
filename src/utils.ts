export interface PastasRegExpOptionQuoteGroup {
  name: string
  value: string
}

export interface PastasRegExpOptionKeyOnlyGroup {
  name: string
}

export const pastasRegExp = {
  option: {
    key: {
      only: /--?(?<name>[\w\d]+)/g,
      value: {
        noQuote: /--?(?<name>[\w\d]+)\s(?<value>[\d\w]+)/g,
        doubleQuote: /--?(?<name>[\w\d]+)[=|\s]"(?<value>(?:[^"\\]|\\.)+)"/g,
        singleQuote: /--?(?<name>[\w\d]+)[=|\s]'(?<value>(?:[^'\\]|\\.)+)'/g
      }
    }
  }
} as const
