class RuleInterface {
  getOptionalQuestionIDList(
    repTeamRecordDataList,
    oppTeamRecordDataList,
    usedQuestionIDList,
    questionIDLibList,
    roundType
  ) {
    throw new Error("Method not implemented.")
  }

  _getOptionalQuestionIDList(
    questionIDList,
    repQRecordList,
    oppQRecordList,
    banRuleList
  ) {
    throw new Error("Method not implemented.")
  }

  getValidPlayerIDList(
    roundPlayerRecordList,
    teamRecordDataList,
    playerDataList
  ) {
    throw new Error("Method not implemented.")
  }

  getScore(scoreList) {
    throw new Error("Method not implemented.")
  }

  getRepScoreWeight(teamRecordDataList, isRefuse) {
    throw new Error("Method not implemented.")
  }

  getOppScoreWeight() {
    throw new Error("Method not implemented.")
  }

  getRevScoreWeight() {
    throw new Error("Method not implemented.")
  }
}
export default RuleInterface
