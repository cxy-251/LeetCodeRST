0332. Reconstruct Itinerary
===========================

题目信息
--------

:题号: 0332
:难度: Hard
:主题: 有向机票、多重边、完整行程、字典序
:原题: `LeetCode 0332 <https://leetcode.com/problems/reconstruct-itinerary/>`_
:重点: 行程固定从 JFK 开始、每张机票恰好使用一次、重复机票分别计数、多个答案取字典序最小

题目重述
--------

给定机票数组 ``tickets``，每张机票 ``[from, to]`` 表示一次从 ``from`` 到 ``to`` 的有向航程。重建一条从 ``"JFK"`` 出发的行程，使输入中的每一张机票都恰好使用一次。

返回依次经过的机场代码数组，其长度应为 ``tickets.length + 1``。若存在多条能够使用全部机票的行程，返回按机场序列比较时字典序最小的一条。机票数量位于 ``[1, 300]``，机场代码均由三个大写英文字母组成；相同起点和终点的机票可能重复出现，并且每一张都必须单独使用。题目保证至少存在一个合法行程。

自建示例
--------

不能只选择当前字典序最小的目的地：

.. code-block:: text

   输入：tickets = [["JFK","A"], ["JFK","B"], ["B","JFK"]]
   输出：["JFK", "B", "JFK", "A"]
   解释：若第一步前往 A，之后没有机票可以返回并使用剩余两张；唯一能完整使用所有机票的行程必须先前往 B。

存在重复机票：

.. code-block:: text

   输入：tickets = [["JFK","A"], ["JFK","A"], ["A","JFK"]]
   输出：["JFK", "A", "JFK", "A"]
   解释：两张 JFK 到 A 的机票是两个独立输入项，行程必须把它们都使用一次。

欧拉路径要在回溯位置插入机场
------------------------------

把机场看作顶点、机票看作有向边，问题就是从 ``JFK`` 出发使用每条边恰好一次的欧拉路径。不能简单地每次选择字典序最小的下一站：这条边可能是某个回路的入口，过早使用另一条边会把剩余边留在无法返回的位置。

Hierholzer 思路在深搜中始终取当前机场的最小目的地并消耗一张机票；当某个机场已经没有未使用的边时，把它加入答案的尾部。这个“后序加入”会把必须先走完的回路放到正确的中间位置。最后将后序得到的机场序列反转。相同起点和终点的机票用多重集合保存，每次只删除一个实例。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::map<std::string, std::multiset<std::string>> graph;
       std::vector<std::string> route;

       void visit(const std::string& from) {
           auto& destinations = graph[from];
           while (!destinations.empty()) {
               auto it = destinations.begin();
               std::string to = *it;
               destinations.erase(it);
               visit(to);
           }
           route.push_back(from);
       }

   public:
       std::vector<std::string> findItinerary(
           std::vector<std::vector<std::string>>& tickets) {
           graph.clear();
           route.clear();
           for (const auto& ticket : tickets) {
               graph[ticket[0]].insert(ticket[1]);
           }

           visit("JFK");
           std::reverse(route.begin(), route.end());
           return route;
       }
   };

代码分析
--------

每张机票在递归前从多重集合中删除一次，因此不会重复使用；后序加入保证即使当前最小目的地属于回路，也能在回路完成后把起点放回正确位置。多重集合的最小元素提供字典序选择，题目保证存在完整行程，所以反转后的长度应为机票数加一。设机票数为 ``E``，时间复杂度为 ``O(E log E)``，递归与图存储空间为 ``O(E)``。
