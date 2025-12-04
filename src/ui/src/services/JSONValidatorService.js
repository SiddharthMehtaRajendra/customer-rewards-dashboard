import TransactionService from './TransactionService';

class JSONValidatorService {
  static verifyJSONRewardPoints(transactions) {
    let dirtyTransactionRecord = null;
    const isValidJSONCalculations = transactions?.every((transaction) => {
      const jsonRewardPoints = transaction.points;
      const jsonProductPrice = transaction.price;
      const expectedRewardPoints = TransactionService.calculatePoints(jsonProductPrice);
      if (expectedRewardPoints !== jsonRewardPoints) {
        dirtyTransactionRecord = transaction;
        return false;
      }
      return true;
    });
    return { isValidJSONCalculations, dirtyTransactionRecord };
  }
}

export default JSONValidatorService;