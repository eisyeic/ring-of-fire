export class Game {
  public players: string[] = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public currentPlayer: number = 0;

  constructor() {
    this.players = [];
    this.stack = this.createStack();
    this.playedCards = [];
    this.currentPlayer = 0;
  }

  public createStack(): string[] {
    let stack: string[] = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

    for (let suit of suits) {
      for (let value of values) {
        stack.push(`${suit}_${value}`);
      }
    }

    // Mischen des Stapels
    stack = this.shuffleArray(stack);
    return stack;
  }

  private shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}