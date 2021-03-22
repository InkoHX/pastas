import { tokenizeArguments } from './util'

describe('tokenizeArguments', () => {
  test('空白を分割し、配列にしなければならない', () => {
    const tokenized = tokenizeArguments('A B C')

    expect(tokenized).toStrictEqual(['A', 'B', 'C'])
  })

  test('クオートで囲まれた空白は無視し、配列にしなければならない', () => {
    const tokenized = tokenizeArguments('foo "bar s" \'ms ps\'')

    expect(tokenized).toStrictEqual(['foo', '"bar s"', "'ms ps'"])
  })

  test('ダブルクオートで囲まれたブロックの中にダブルクオートが存在する場合、エスケープされたもののみ許容しなければならない', () => {
    const tokenized = tokenizeArguments(
      'foo "私の名は\\"InkoHX\\"" "\'これはエスケープしなくて良い\'"'
    )

    expect(tokenized).toStrictEqual([
      'foo',
      '"私の名は"InkoHX""',
      '"\'これはエスケープしなくて良い\'"',
    ])
  })

  test('シングルクオートで囲まれたブロックの中にシングルクオートが存在する場合、エスケープされたもののみ許容しなければならない', () => {
    const tokenized = tokenizeArguments(
      "foo '私の名前は\\'InkoHX\\'' '\"これはエスケープしなくてよい\"'"
    )

    expect(tokenized).toStrictEqual([
      'foo',
      "'私の名前は'InkoHX''",
      '\'"これはエスケープしなくてよい"\'',
    ])
  })
})
