/*  Example Player Model class
*   every game would have a unique player class.
*/
export class playerModel {

  private x: number;
  private y: number;
  private scale: 1;
  private skin: 1;
  private name: string;
  private health: number;
  private score: number;

  /* TypeScript is a superset of JS and which is not a strongly typed language
  *  so in this case we set the paramater to an optional, if the obj is valid
  *  it's attributes are set, if not default values are set.
  */
  constructor(player?: playerModel){
    this.x = player && player.x || 0;
    this.y = player && player.y || 0;
    this.name = player && player.name || "TheOneWithNoName";
    this.health = player && player.health || 100;
    this.score = player && player.score || 0;
  }
  /* Getter & Setter Methods
  *  Example
  */
  public getUserName(): string{
    return this.name;
  }

  public getScore(): number{
    return this.score;
  }
}
