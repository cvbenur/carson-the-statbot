export class Graph {

  protected graph: string;
  protected data: any;



  constructor(graph: string) {
    this.graph = graph;
    this.data = JSON.parse(this.graph).data;
  }



  protected toJSON(): string {
    return JSON.parse(this.graph);
  }
  protected toString(): string {
    return JSON.stringify(this.graph);
  }



  get Graph(): string {
    return this.graph;
  }
  set Graph(graph: string) {
    this.graph = graph;
  }



  get Data(): any {
    return this.data;
  }
  set Data(data: any) {
    this.data = data;
  }



  protected updateGraph(): void {
    const graph = this.Graph;
    JSON.parse(graph).data = this.Data;
    this.Graph = JSON.stringify(graph);
  }
}
