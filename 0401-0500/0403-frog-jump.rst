0403. Frog Jump
===============

题目信息
--------

:题号: 0403
:难度: Hard
:主题: 石头位置、跳跃状态、上次距离、可达性
:原题: `LeetCode 0403 <https://leetcode.com/problems/frog-jump/>`_
:重点: 起点为 0、第一跳必须为 1、后续只能跳 ``k-1``/``k``/``k+1``、每次必须落在石头上

题目重述
--------

河中的石头位置由严格递增数组 ``stones`` 给出。青蛙站在第一块石头 ``stones[0] = 0`` 上，第一次跳跃必须恰好前进 1 个单位。

若青蛙上一次跳了 ``k`` 个单位，下一次只能向前跳 ``k-1``、``k`` 或 ``k+1`` 个单位，并且实际跳跃距离必须为正。每次跳跃都必须落在数组中的某块石头上。判断青蛙能否最终到达最后一块石头。

``stones`` 的长度位于 ``[2, 2000]``，位置值位于 ``[0, 2^31-1]``，且互不相同并严格递增。青蛙不能向后跳，也不能停留在原地。

自建示例
--------

跳跃距离逐步增大：

.. code-block:: text

   输入：stones = [0, 1, 2, 4, 7, 11]
   输出：true
   解释：可以依次跳 1、1、2、3、4 个单位，落点依次为 1、2、4、7、11。

下一块石头超出可选距离：

.. code-block:: text

   输入：stones = [0, 1, 2, 3, 7]
   输出：false
   解释：到达位置 3 时，任何可行路径的上次跳跃距离都不足以让下一跳直接到达 7。

状态是“石头位置 + 上一次跳距”
--------------------------------

到达同一块石头时，上一次跳跃距离不同，下一步可选的距离也不同，不能只记录石头是否访问过。为每块石头保存能够到达它的跳距集合；从状态 ``(i, k)`` 出发，尝试 ``k-1``、``k``、``k+1`` 中的正数，并把确实存在的下一块石头加入对应集合。

第一跳是特殊约束，只有位置 1 存在时才可能开始。之后所有转移都向前查找，位置映射让“落在石头上”的判断不必扫描整个数组；若最后一块石头收到任意跳距即可成功。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool canCross(std::vector<int>& stones) {
           int n = static_cast<int>(stones.size());
           if (n == 2) return stones[1] == 1;

           std::unordered_map<int, int> index;
           for (int i = 0; i < n; ++i) index[stones[i]] = i;
           if (index.count(1) == 0) return false;

           std::vector<std::unordered_set<int>> jumps(n);
           jumps[index[1]].insert(1);
           for (int i = 1; i < n; ++i) {
               for (int last : jumps[i]) {
                   for (int delta = -1; delta <= 1; ++delta) {
                       int step = last + delta;
                       if (step <= 0) continue;
                       long long nextPosition =
                           static_cast<long long>(stones[i]) + step;
                       if (nextPosition > INT_MAX) continue;
                       auto it = index.find(
                           static_cast<int>(nextPosition));
                       if (it == index.end()) continue;
                       if (it->second == n - 1) return true;
                       jumps[it->second].insert(step);
                   }
               }
           }
           return false;
       }
   };

代码分析
--------

集合中的每个跳距都代表一条真实可达路径的状态；转移只使用上一次跳距，因此不会把不同路径错误合并。位置哈希表只接受实际存在的落点，第一跳单独初始化也避免把 ``k=0`` 当作普通状态。最坏状态数为 ``O(n^2)``，时间复杂度为 ``O(n^2)``，额外空间为 ``O(n^2)``。
