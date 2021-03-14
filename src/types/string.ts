import { PastasMissingOptionValueError } from '../error'
import { CustomTypeParser } from '../parser'

export const string: CustomTypeParser<string> = props => {
  if (props.type === 'option') {
    if (props.value) return props.value
    else
      throw new PastasMissingOptionValueError(
        `The option "${props.name}" must be passed as a string value.`
      )
  }

  return props.value
}
