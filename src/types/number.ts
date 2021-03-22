import { PastasError } from '../error'
import { CustomTypeParser } from '../parser'

export const number: CustomTypeParser<number> = props => {
  const number = Number(props.value)

  if (Number.isNaN(number)) {
    if (props.type === 'argument')
      throw new PastasError('ARGUMENT_TYPE', 'number', props.position)
    if (props.type === 'option')
      throw new PastasError('OPTION_VALUE_TYPE', 'number', props.name)
  }

  return number
}
