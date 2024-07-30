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
  NORMAL:   '正常模式',
  SPECIAL:  '自选题模式'
})

class RecordData {
  constructor() {
    this.round = 0
    this.phase = 0
    this.roomID = 0
    this.questionID = 0
    this.masterID = 0
    this.role = ''
    this.score = 0.0
    this.weight = 0.0
  }
  
  constructor(dict) {
    this.round = dict.round
    this.phase = dict.phase
    this.roomID = dict.roomID
    this.questionID = dict.questionID
    this.masterID = dict.masterID
    this.role = dict.role
    this.score = dict.score
    this.weight = dict.weight
  }

  equals(data) {
    if (
      this.round === data.round &&
      this.phase === data.phase &&
      this.roomID === data.roomID &&
      this.questionID === data.questionID &&
      this.masterID === data.masterID &&
      this.role === data.role &&
      this.score === data.score &&
      this.weight === data.weight
    ) {
      return true
    }
    return false
  }
}

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
  RecordData,
  PlayerData,
  Tuple,
  minus
}
