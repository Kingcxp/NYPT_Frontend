const TeamType = Object.freeze({
  REPORTER: 0,
  OPPONENT: 1,
  REVIEWER: 2,
  OBSERVER: 3,
})

const QuestionType = Object.freeze({
  OPTIONAL: 'P',
  REPORTED: 'R',
  OPPOSED:  'O',
  REFUSED:  'X',
  BAN:      'B',
})

const RuleType = Object.freeze({
  CUPT:   0,
  JSYPT:  1,
})

const RoundType = Object.freeze({
  NORMAL:   'NORMAL',
  SPECIAL:  'SPECIAL'
})

class PlayerData {
  constructor() {
    this.id = 0
    this.name = ''
    this.gender = ''
  }
}

class Tuple extends Array {
  constructor(...items) {
    super(...items)
    Object.freeze(this)
  }

  equals(other) {
    if (this.length != other.length) {
      return false
    }
    for (let i = 0; i < this.length; ++i) {
      if (this[i] !== other[i]) {
        return false
      }
    }
    return true
  }
}

const minus = (A, B, cond) => {
  return A.filter(itemA => {
    return B.every(itemB => {
      return cond(itemA, itemB)
    })
  })
}

export {
  TeamType,
  QuestionType,
  RuleType,
  RoundType,
  PlayerData,
  Tuple,
  minus
}
