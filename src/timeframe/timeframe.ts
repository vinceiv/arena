import { stateModel } from '../models/stateModel';

export class timeframe {

  private _MAXSNAPS: number;

  // Possible options
  constructor(Opts?: {_MAXSNAPS: number}){
    this._MAXSNAPS = Opts && Opts._MAXSNAPS || 10;
  }
}
