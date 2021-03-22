export interface CustomTypeParserOptionProps {
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
  | CustomTypeParserOptionProps
  | CustomTypeParserArgumentProps
export type CustomTypeParser<T = any> = (
  param: Readonly<CustomTypeParserProps>
) => T

type Argument<T extends ReadonlyArray<CustomTypeParser>> = {
  [K in keyof T]: T[K] extends CustomTypeParser<infer R> ? R : never
}

type Option<T extends Record<string, CustomTypeParser | keyof T>> = {
  [K in keyof T]?: T[K] extends CustomTypeParser<infer R> ? R : T[K]
}

type OptionAliasKeys<
  T extends Record<string, CustomTypeParser | keyof T | string>
> = {
  [K in keyof T]: T[K] extends keyof T | string ? K : never
}[keyof T]

export function pastas<A extends ReadonlyArray<CustomTypeParser>>(
  source: string,
  args: A
): [Argument<A>]
export function pastas<
  A extends ReadonlyArray<CustomTypeParser>,
  O extends Record<
    string,
    CustomTypeParser | Exclude<keyof O, OptionAliasKeys<O>>
  >
>(
  source: string,
  args: A,
  options: O
): [Argument<A>, Omit<Option<O>, OptionAliasKeys<O>>]
export function pastas<
  A extends ReadonlyArray<CustomTypeParser>,
  O extends Record<
    string,
    CustomTypeParser | Exclude<keyof O, OptionAliasKeys<O>>
  >
>(
  source: string,
  args: A,
  options?: O
): [Argument<A>] | [Argument<A>, Omit<Option<O>, OptionAliasKeys<O>>] {
  // TODO
}
