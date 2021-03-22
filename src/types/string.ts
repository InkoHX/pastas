import { CustomTypeParser, PastasError } from '..'

export const string: CustomTypeParser<string> = props => {
  if (props.type === 'option') {
    if (props.value) return props.value
    else throw new PastasError('OPTION_VALUE_TYPE', 'string', props.name)
  }

  return props.value
}
