0433. Minimum Genetic Mutation
==============================

题目信息
--------

:题号: 0433
:难度: Medium
:主题: 八位基因、单字符突变、基因库、最少步数
:原题: `LeetCode 0433 <https://leetcode.com/problems/minimum-genetic-mutation/>`_
:重点: 每步恰好修改一个字符、修改后基因必须在 ``bank`` 中、字符仅限 ``A/C/G/T``、不可达返回 ``-1``

题目重述
--------

基因字符串长度固定为 8，只包含字符 ``A``、``C``、``G``、``T``。一次突变必须恰好改变一个位置的字符。给定起始基因 ``startGene``、目标基因 ``endGene`` 和合法基因库 ``bank``，返回从起点变到终点所需的最少突变次数。

除起始基因外，每次突变后得到的基因都必须存在于 ``bank`` 中；起始基因本身不要求在库中。若无法到达目标，返回 ``-1``。``bank.length`` 位于 ``[0, 10]``，其中基因互不相同；若起点和终点相同，最少突变次数为 0。

自建示例
--------

需要连续四次合法突变：

.. code-block:: text

   输入：startGene = "AAAAAAAA"
         endGene = "AAAACCCC"
         bank = ["AAAAAAAC", "AAAAAACC", "AAAAACCC", "AAAACCCC"]
   输出：4
   解释：可以按基因库给出的顺序每次把一个 A 改为 C，四个中间或最终基因都在 bank 中。

终点不在合法路径中：

.. code-block:: text

   输入：startGene = "AACCGGTT"
         endGene = "AACCGGTA"
         bank = []
   输出：-1
   解释：终点与起点只差一个字符，但突变后的基因不在 bank 中，因此该突变不合法。

基因字符串构成无权图，BFS 首次到达即最短
------------------------------------------

每个合法基因是一个图节点，相差恰好一个字符的两个基因之间有边；但只有目标字符串在 ``bank`` 中时，才允许把它作为突变后的节点。一次突变代价相同，所以从 ``startGene`` 广度优先搜索，首次到达 ``endGene`` 的层数就是最少次数。

对当前基因的每个位置尝试另外三种碱基，并用集合判断候选是否在库中、是否已经访问；起点和终点相同时在搜索前直接返回 0。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int minMutation(std::string startGene, std::string endGene,
                       std::vector<std::string>& bank) {
           if (startGene == endGene) return 0;
           std::unordered_set<std::string> available(
               bank.begin(), bank.end());
           if (available.count(endGene) == 0) return -1;

           std::queue<std::pair<std::string, int>> queue;
           queue.push({startGene, 0});
           std::unordered_set<std::string> visited = {startGene};
           const std::string genes = "ACGT";
           while (!queue.empty()) {
               auto [current, distance] = queue.front();
               queue.pop();
               for (int i = 0; i < 8; ++i) {
                   std::string next = current;
                   for (char gene : genes) {
                       if (gene == current[i]) continue;
                       next[i] = gene;
                       if (available.count(next) == 0
                           || visited.count(next) != 0) {
                           continue;
                       }
                       if (next == endGene) return distance + 1;
                       visited.insert(next);
                       queue.push({next, distance + 1});
                   }
               }
           }
           return -1;
       }
   };

代码分析
--------

BFS 按突变次数分层，访问标记避免同一基因反复入队；每个状态只尝试 ``8 * 3`` 个有限变更。时间复杂度为 ``O(B * 8 * 3)``（``B`` 为基因库规模），额外空间为 ``O(B)``。
