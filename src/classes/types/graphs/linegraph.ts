import { Graph } from './graph';
import linegraph from '../../../assets/graphs/linegraph.json';

export class LineGraph extends Graph {

  constructor() {
    super(JSON.stringify(linegraph));
  }
}