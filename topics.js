const notebooks = [
  {
    title: "Dynamic programming",
    intro: "Break a problem into smaller states and reuse their answers.",
    questions: [
      ["What is a state?", "A state describes one subproblem. In the climbing-stairs problem, ways(i) is the number of ways to reach step i using moves of one or two steps."],
      ["Show the recurrence", "The last move into step i came from i − 1 or i − 2. Add those counts: ways(i) = ways(i − 1) + ways(i − 2). Start with ways(0) = 1 and ways(1) = 1."],
      ["Trace four steps", "For steps 0 through 4 the counts are 1, 1, 2, 3, 5. At step 4, three routes arrive from step 3 and two arrive from step 2. That gives five routes."]
    ]
  },
  {
    title: "Binary search",
    intro: "Find a target by repeatedly narrowing a sorted range.",
    questions: [
      ["Why sort first?", "When the middle value is smaller than the target in an ascending array, every value to its left is also smaller. Sorted order makes discarding half the range valid."],
      ["Trace a search", "Find 9 in [2, 5, 7, 9, 14]. Start at index 2: the value is 7. Search indices 3 through 4 next. The lower midpoint is index 3, which contains 9."],
      ["Time complexity", "Each comparison roughly halves the remaining range. The worst-case time is O(log n). An iterative search uses O(1) extra space."]
    ]
  },
  {
    title: "Graph traversal",
    intro: "Explore the order in which a graph reveals its vertices.",
    questions: [
      ["Compare BFS and DFS", "Breadth-first search uses a queue to visit vertices layer by layer. Depth-first search uses recursion or a stack to follow a branch before backtracking."],
      ["Trace a BFS", "Suppose A connects to B and C, and B connects to D. Starting at A and considering B before C, the queue produces the visit order A, B, C, D."],
      ["Why mark visited?", "Marking a vertex when it enters the BFS queue keeps cycles and shared neighbors from adding duplicate work. With adjacency lists, traversal takes O(V + E) time."]
    ]
  }
];
