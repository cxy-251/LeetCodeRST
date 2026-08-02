0399. Evaluate Division
=======================

题目信息
--------

:题号: 0399
:难度: Medium
:主题: 变量比值、方程关系、查询顺序、不可推导
:原题: `LeetCode 0399 <https://leetcode.com/problems/evaluate-division/>`_
:重点: 每个方程给出有向比值、查询按输入顺序返回、已知变量自除为 1、未知变量参与时返回 -1.0

题目重述
--------

给定方程数组 ``equations`` 和对应实数数组 ``values``。若 ``equations[i] = [Ai, Bi]``，则已知 ``Ai / Bi = values[i]``。对每个查询 ``[Cj, Dj]``，根据全部已知关系计算 ``Cj / Dj``，并按查询原顺序返回结果数组。

若查询中的任一变量从未出现在已知方程中，或两个已知变量之间不存在可推导的关系，则该项返回 ``-1.0``。已知变量除以自身结果为 ``1.0``，未知变量即使两侧名称相同也返回 ``-1.0``。方程数量和查询数量均位于 ``[1, 20]``，方程值位于 ``(0, 20]``；输入保证方程相互一致，变量代表非零数值。

自建示例
--------

通过中间变量推导：

.. code-block:: text

   输入：equations = [["p","q"],["q","r"]]
         values = [4.0,0.5]
         queries = [["p","r"],["r","p"],["p","p"]]
   输出：[2.0,0.5,1.0]
   解释：p/r = (p/q)*(q/r) = 2；反向比值为 1/2；p 是已知变量，所以 p/p 为 1。

查询含未知变量：

.. code-block:: text

   输入：queries = [["p","x"],["x","x"]]
   输出：[-1.0,-1.0]
   解释：x 从未出现在任何已知方程中，两项都无法根据输入关系确定。

把比值写成带权有向图
----------------------

方程 ``A / B = v`` 可表示为边 ``A -> B`` 权重 ``v``，同时加入反向边 ``B -> A`` 权重 ``1 / v``。沿路径相乘就得到起点与终点的比值；查询时从起点深搜到终点，使用访问集合避免在环中重复走回。

查询的两个变量必须都出现在图中；已知变量自除时路径长度为零，结果为 1。每个查询单独建立访问集合，不能让前一个查询的访问状态影响后一个查询。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::unordered_map<
           std::string,
           std::vector<std::pair<std::string, double>>> graph;

       double search(const std::string& current,
                     const std::string& target,
                     std::unordered_set<std::string>& visited) {
           if (current == target) return 1.0;
           visited.insert(current);
           for (const auto& edge : graph[current]) {
               if (visited.count(edge.first) != 0) continue;
               double rest = search(edge.first, target, visited);
               if (rest >= 0.0) return edge.second * rest;
           }
           return -1.0;
       }

   public:
       std::vector<double> calcEquation(
           std::vector<std::vector<std::string>>& equations,
           std::vector<double>& values,
           std::vector<std::vector<std::string>>& queries) {
           graph.clear();
           for (int i = 0; i < static_cast<int>(equations.size()); ++i) {
               const std::string& first = equations[i][0];
               const std::string& second = equations[i][1];
               graph[first].push_back({second, values[i]});
               graph[second].push_back({first, 1.0 / values[i]});
           }

           std::vector<double> result;
           for (const auto& query : queries) {
               if (graph.count(query[0]) == 0
                   || graph.count(query[1]) == 0) {
                   result.push_back(-1.0);
                   continue;
               }
               std::unordered_set<std::string> visited;
               result.push_back(search(query[0], query[1], visited));
           }
           return result;
       }
   };

代码分析
--------

反向边保留了比值的倒数，路径上的边权相乘就是方程连乘；不可达时深搜返回 ``-1.0``，不会把失败路径的权重混入结果。设变量数为 ``V``、边数为 ``E``，每个查询最坏遍历 ``O(V+E)``，图及单次访问集合空间为 ``O(V+E)``。
