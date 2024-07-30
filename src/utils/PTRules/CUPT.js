import RuleInterface from "./RuleInterface"
import { TeamType, QuestionType, RoundType, Tuple, minus } from "./Typedef"


class CUPTRule extends RuleInterface {
  static get questionCount() {
    return 5
  }
  static get playerMasterTimesIn1RoundConfig() {
    return 2
  }
  static get playerMasterTimesIn1MatchConfig() {
    return 5
  }
  static get playerRepTimesIn1MatchConfig() {
    return 3
  }
  static get maxRefuseQuestionCount() {
    return 5
  }

  constructor() {
    this.banRuleListConfig = [
      Tuple(TeamType.REPORTER, QuestionType.REFUSED),
      Tuple(TeamType.REPORTER, QuestionType.REPORTED),
      Tuple(TeamType.OPPONENT, QuestionType.OPPOSED),
      Tuple(TeamType.OPPONENT, QuestionType.REPORTED)
    ]
    this.specialBanRuleListConfig = [
      Tuple(TeamType.REPORTER, QuestionType.REPORTED)
    ]
  }

  /**
   * 获取当前对局的可选赛题
   *
   * 当前的比赛赛题禁选规则为：
   *
   * 【不可解锁规则】：
   *
   * 在同一轮对抗赛中，题目只能被陈述一次。
   *
   * 【可解锁规则】：
   *
   * 1. 正方作为正方拒绝过的题目
   * 2. 正方作为正方拒绝过的题目
   * 3. 反方作为反方挑战过的题目
   * 4. 反方作为正方陈述过的题目
   *
   *
   * @param {Array} repTeamRecordDataList 正方队伍比赛记录
   * @param {Array} oppTeamRecordDataList 反方队伍比赛记录
   * @param {Array} usedQuestionIDList 当前比赛轮次中已用的赛题
   * @param {Array} questionIDLibList 赛题库
   * @param {Number} roundType 本轮比赛类型 普通轮次或自选题轮次
   * @return {Array} 赛题编号列表 包含了当前对局中的全部可选题
   */
  getOptionalQuestionIDList(
    repTeamRecordDataList,
    oppTeamRecordDataList,
    usedQuestionIDList,
    questionIDLibList,
    roundType
  ) {
    if (questionIDLibList.length > this.questionCount) {
      let tempQuestionIDLibList = minus(
        questionIDLibList,
        usedQuestionIDList,
        (itemA, itemB) => { return !itemA.equals(itemB) }
      )
      let repQRecordSet = new Set(repTeamRecordDataList.map(
        it => { return Tuple(it.questionID, Tuple(TeamType.REPORTER, it.role)) }
      ))
      let oppQRecordSet = new Set(oppTeamRecordDataList.map(
        it => { return Tuple(it.questionID, Tuple(TeamType.OPPONENT, it.role)) }
      ))
      let banRuleList = this.banRuleListConfig
      switch (roundType) {
        case RoundType.SPECIAL:
          return this._getOptionalQuestionIDList(
            tempQuestionIDLibList,
            repQRecordSet,
            oppQRecordSet,
            this.specialBanRuleListConfig
          )
        case RoundType.NORMAL:
          let optionalQuestionIDList = new Array()
          do {
            optionalQuestionIDList = this._getOptionalQuestionIDList(
              tempQuestionIDLibList,
              repQRecordSet,
              oppQRecordSet,
              banRuleList
            )
            banRuleList.pop()
          } while (optionalQuestionIDList.length < this.questionCount)
          return optionalQuestionIDList
      }
    } else {
      return questionIDLibList
    }
  }

  /**
   * 获取当前可选题的题号列表
   *
   * @param {Array} questionIDList 题号列表
   * @param {Set} repQRecordList 正方已比赛的题目记录
   * @param {Set} oppQRecordList 反方已比赛的题目记录
   * @param {List} banRuleList 题目禁选规则
   * @return 当前禁选规则下的可选题号列表
   */
  _getOptionalQuestionIDList(
    questionIDList,
    repQRecordList,
    oppQRecordList,
    banRuleList
  ) {
    let repBanQuestionIDList = repQRecordList.filter(
      it => {
        return banRuleList.some(
          item => { return item.equals(it[1]) }
        )
      }
    ).map(
      it => { return it[0] }
    )
    let oppBanQuestionIDList = oppQRecordList.filter(
      it => {
        return banRuleList.some(
          item => { return item.equals(it[1]) }
        )
      }
    ).map(
      it => { return it[0] }
    )
    return minus(
      minus(
        questionIDList,
        repBanQuestionIDList,
        (itemA, itemB) => { return !itemA.equals(itemB) }
      ),
      oppBanQuestionIDList,
      (itemA, itemB) => { return !itemA.equals(itemB) }
    )
  }

  /**
   * 获取当前对局的可上场队员
   *
   * 当前队员禁上场规则为：
   *
   * 1. 在每轮比赛中，每个队员最多只能主控2次
   * 2. 在整个比赛中，每个队员最多只能主控5次
   * 3. 在整个比赛中，每个队员最多只能正方陈述3次
   *
   * @param {Array} roundPlayerRecordList 当前比赛轮次中上场主控的队员记录
   * @param {Array} teamRecordDataList 队伍比赛记录
   * @param {Array} playerDataList 队伍的队员列表
   * @return 当前可主控队员 包含了此队伍的当前可上场主控的全部队员
   */
  getValidPlayerIDList(
    roundPlayerRecordList,
    teamRecordDataList,
    playerDataList
  ) {
    return playerDataList.filter(
      playerData => {
        return roundPlayerRecordList.filter(
          it => { return it == playerData.id }
        ).length < this.playerMasterTimesIn1RoundConfig
      }
    ).filter(
      playerData => {
        return teamRecordDataList.filter(
          it => { return ['R', 'O', 'V'].includes(it.role) }
        ).filter(
          it => { return it.masterID == playerData.id }
        ).length < this.playerMasterTimesIn1MatchConfig
      }
    ).filter(
      playerData => {
        return teamRecordDataList.filter(
          it => { return it.masterID == playerData.id && it.role == 'R' }
        ).length < this.playerRepTimesIn1MatchConfig
      }
    ).map(
      it => { return it.id }
    )
  }

  /**
   * 获取本阶段的得分
   *
   * 5裁判 -> ((最高分 + 最低分) / 2 + 其他分数求和) / (裁判数 -1 )
   * 7裁判 -> 去掉一个最高分，去掉一个最低分，再取平均分
   *
   * @param {Array} scoreList 分数列表 传入各裁判打分
   * @return 分数 获取最后的统计分数
   */
  getScore(scoreList) {
    let sortedScoreList = scoreList.toSorted()
    let minScore = sortedScoreList[0]
    let maxScore = sortedScoreList[sortedScoreList.length - 1]
    let sum = 0
    sortedScoreList.forEach(it => {
      sum += it
    })
    switch (scoreList.length) {
      case 5:
        return (sum - (minScore + maxScore) / 2.0) / (sortedScoreList.length - 1.0)
      case 7:
        return (sum - (minScore + maxScore)) / (sortedScoreList.length - 2.0)
      default:
        return sum / sortedScoreList.length
    }
  }

  /**
   * Get rep score weight
   *
   * CUPT规则 最多拒绝5题，每多拒一题，扣0.2正方系数
   *
   * @param {Array} teamRecordDataList 队伍比赛记录
   * @param {boolean} isRefuse 是否拒题
   * @return 正方计分权重
   */
  getRepScoreWeight(teamRecordDataList, isRefuse) {
    let oldRepScoreWeightList = teamRecordDataList.filter(
      it => { return ['R', 'X'].includes(it.role) }
    ).map(
      it => { return it.weight }
    )
    if (oldRepScoreWeightList.length === 0) {
      return 3.0
    } else {
      let oldRepScoreWeight = oldRepScoreWeightList.reduce((a, b) => { return a < b ? a : b })
      let refusedQuestionCount = teamRecordDataList.filter(
        it => { return it.role == 'X' }
      ).length
      return (isRefuse && refusedQuestionCount >= this.maxRefuseQuestionCount)
        ? oldRepScoreWeight - 0.2 : oldRepScoreWeight
    }
  }

  getOppScoreWeight() {
    return 2.0
  }

  getRevScoreWeight() {
    return 1.0
  }
}
export default CUPTRule
