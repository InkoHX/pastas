import {
  pastasRegExp,
  PastasRegExpOptionKeyOnlyGroup,
  PastasRegExpOptionQuoteGroup,
} from './utils'

export interface CustomTypeParserFlagProps {
  type: 'option'
  name: string
  value?: string
}

export interface CustomTypeParserArgumentProps {
  type: 'argument'
  value: string
  position: number
}

export type CustomTypeParserProps =
  | CustomTypeParserFlagProps
  | CustomTypeParserArgumentProps
export type CustomTypeParser<T = any> = (
  param: Readonly<CustomTypeParserProps>
) => T

type Argument<T extends ReadonlyArray<CustomTypeParser>> = {
  [K in keyof T]: T[K] extends CustomTypeParser<infer R> ? R : never
}

type Option<
  T extends Record<string, CustomTypeParser | keyof T | undefined>
> = {
  [K in keyof T]: T[K] extends CustomTypeParser<infer R> ? R : T[K]
}

type OmitOptionAliasKeys<T> = T extends Record<string, infer V>
  ? V extends keyof T
    ? V
    : never
  : never

const IGNORE_ARGUMENT = Symbol('PASTAS_IGNORE_ARGUMENT')
const UNKNOWN_ALIAS = Symbol('PASTAS_UNKNOWN_ALIAS')

export function pastas<A extends ReadonlyArray<CustomTypeParser>>(
  source: string,
  args: A
): [Argument<A>]
export function pastas<
  A extends ReadonlyArray<CustomTypeParser>,
  O extends Record<string, CustomTypeParser | keyof O | undefined>
>(
  source: string,
  args: A,
  options: O
): [Argument<A>, Pick<Option<O>, OmitOptionAliasKeys<O>>]
export function pastas<
  A extends ReadonlyArray<CustomTypeParser>,
  O extends Record<string, CustomTypeParser | keyof O | undefined>
>(
  source: string,
  args: A,
  options?: O
): [Argument<A>] | [Argument<A>, Pick<Option<O>, OmitOptionAliasKeys<O>>] {
  const parsedArgs = (source
    .replace(pastasRegExp.option.key.value.doubleQuote, '')
    .replace(pastasRegExp.option.key.value.singleQuote, '')
    .replace(pastasRegExp.option.key.value.noQuote, '')
    .replace(pastasRegExp.option.key.only, '')
    .trim()
    .split(' ')
    .filter(sourceArg => sourceArg)
    .map((sourceArg, index) =>
      typeof args[index] === 'function'
        ? (args[index] as CustomTypeParser)({
            type: 'argument',
            value: sourceArg,
            position: index,
          })
        : IGNORE_ARGUMENT
    )
    .filter(value => value !== IGNORE_ARGUMENT) as unknown) as Argument<A>

  if (!options) return [parsedArgs]

  const entriesOptions = Object.entries(options)
  const replacedAlias: {
    [key: string]: CustomTypeParser | typeof UNKNOWN_ALIAS
  } = {
    ...options,
    ...Object.fromEntries(
      entriesOptions
        .filter(([_key, value]) => typeof value === 'string')
        .map(([key, value]) =>
          typeof value === 'string' && typeof options[value] === 'function'
            ? [key, options[value]]
            : [key, UNKNOWN_ALIAS]
        )
    ),
  }

  const parsedOptions = new Map<string, any>()
  const withValueOptions = [
    source.matchAll(pastasRegExp.option.key.value.doubleQuote),
    source.matchAll(pastasRegExp.option.key.value.singleQuote),
    source.matchAll(pastasRegExp.option.key.value.noQuote),
  ]

  for (const iter of withValueOptions) {
    for (const { groups } of iter) {
      if (!groups) continue
      const {
        name,
        value,
      } = (groups as unknown) as PastasRegExpOptionQuoteGroup
      const originalOptionName =
        entriesOptions.find(([_key, value]) => value === name)?.[0] ?? name

      if (parsedOptions.has(originalOptionName)) continue

      const optionParser = replacedAlias[name]

      console.log(optionParser, originalOptionName, name, value)

      if (!optionParser) continue
      if (optionParser === UNKNOWN_ALIAS)
        throw new Error('不明なエイリアスが割り当てられています。')

      const result = optionParser({
        type: 'option',
        name: originalOptionName,
        value,
      })
      parsedOptions.set(originalOptionName, result)
    }
  }

  for (const { groups } of source.matchAll(pastasRegExp.option.key.only)) {
    if (!groups) continue
    const { name } = (groups as unknown) as PastasRegExpOptionKeyOnlyGroup
    const originalOptionName =
      entriesOptions.find(([_key, value]) => value === name)?.[0] ?? name

    if (parsedOptions.has(originalOptionName)) continue

    const optionParser = replacedAlias[name]

    if (!optionParser) continue
    if (optionParser === UNKNOWN_ALIAS)
      throw new Error('不明なエイリアスが割り当てられています。')

    const result = optionParser({ type: 'option', name: originalOptionName })
    parsedOptions.set(originalOptionName, result)
  }

  return [
    parsedArgs,
    Object.fromEntries(parsedOptions) as Pick<
      Option<O>,
      OmitOptionAliasKeys<O>
    >,
  ]
}
