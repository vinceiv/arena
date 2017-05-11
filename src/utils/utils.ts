export class utils {
  private static instance: utils;
  private constructor() {}
  static getInstance() {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new utils();
    }
    return this.instance;
  }
  public getDifference(lhs:number, rhs:number): number{
    return (lhs > rhs)? lhs-rhs : rhs-lhs
  }
}
