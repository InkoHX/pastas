import { CustomTypeParser } from '../parser'

export const number: CustomTypeParser<number> = value => Number(value)
