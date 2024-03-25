export class OperationResponse {
  transactionId: string;
  coins: number;
  constructor(transactionId: string, coins: number) {
    this.transactionId = transactionId;
    this.coins = coins;
  }
}
