// Kruskal's Minimum Spanning Tree Algorithm
// Time Complexity: O(E log E) or O(E log V)

class DisjointSet {
  constructor(nodes) {
    this.parent = {};
    this.rank = {};
    nodes.forEach(node => {
      this.parent[node] = node;
      this.rank[node] = 0;
    });
  }

  find(node) {
    if (this.parent[node] !== node) {
      this.parent[node] = this.find(this.parent[node]);
    }
    return this.parent[node];
  }

  union(node1, node2) {
    const root1 = this.find(node1);
    const root2 = this.find(node2);

    if (root1 !== root2) {
      if (this.rank[root1] > this.rank[root2]) {
        this.parent[root2] = root1;
      } else if (this.rank[root1] < this.rank[root2]) {
        this.parent[root1] = root2;
      } else {
        this.parent[root2] = root1;
        this.rank[root1]++;
      }
      return true;
    }
    return false;
  }
}

export function kruskalMST(nodes, edges) {
  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  const ds = new DisjointSet(nodes.map(n => n.id));
  const mst = [];
  let totalDistance = 0;
  let optimizedDistance = 0;

  // Calculate total original distance
  edges.forEach(e => totalDistance += e.weight);

  // Build MST
  for (const edge of sortedEdges) {
    if (ds.union(edge.source, edge.target)) {
      mst.push(edge);
      optimizedDistance += edge.weight;
    }
  }

  return {
    mst,
    totalDistance,
    optimizedDistance,
    distanceSaved: totalDistance - optimizedDistance
  };
}
