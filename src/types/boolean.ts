import { PastasError } from '../error'
import { CustomTypeParser } from '../parser'

const truthy = ['true', 'yes']

const falsely = ['false', 'no']

export const boolean: CustomTypeParser<boolean> = props => {
  if (props.type === 'option') return true
  else if (truthy.includes(props.value)) return true
  else if (falsely.includes(props.value)) return false
  else
    throw new PastasError(
      'ARGUMENT_CHOOSE_ONE',
      [...truthy, ...falsely],
      props.position
    )
}
