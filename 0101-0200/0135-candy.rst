0135. Candy
===========

题目信息
--------

:题号: 0135. 分发糖果
:难度: Hard
:主题: 贪心、双向扫描、局部约束、状态压缩
:原题: `LeetCode 0135 <https://leetcode.com/problems/candy/>`_
:重点: 将每个孩子来自左右邻居的要求拆成两个最小下界，逐点取最大值，再滚动压缩一个方向

题目重述
--------

一列孩子按顺序给出评分 ``ratings``。每个孩子至少得到一颗糖；若某个孩子评分严格高于相邻孩子，他得到的
糖也必须严格更多。相邻评分相等时没有大小关系。返回满足所有相邻约束的最少糖果总数。

自建示例
--------

* ``ratings = [1, 3, 2, 2, 1]``：最小分配为 ``[1, 2, 1, 2, 1]``，总数 ``7``；
* ``ratings = [1, 2, 3, 2, 1]``：山峰需要分配 ``[1, 2, 3, 2, 1]``，总数 ``9``；
* ``ratings = [5, 5, 5]``：相等评分不产生额外约束，每人一颗，总数 ``3``；
* ``ratings = [4]``：只有一个孩子，返回 ``1``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <numeric>
   #include <vector>

   class Solution {
   private:
       int repeatedlyRepairConstraints(const std::vector<int>& ratings) {
           const int childCount = static_cast<int>(ratings.size());
           std::vector<int> candies(childCount, 1);
           bool changed = true;

           while (changed) {
               changed = false;
               for (int index = 0; index + 1 < childCount; ++index) {
                   if (ratings[index] > ratings[index + 1] &&
                       candies[index] <= candies[index + 1]) {
                       candies[index] = candies[index + 1] + 1;
                       changed = true;
                   }
                   if (ratings[index] < ratings[index + 1] &&
                       candies[index] >= candies[index + 1]) {
                       candies[index + 1] = candies[index] + 1;
                       changed = true;
                   }
               }
           }
           return std::accumulate(candies.begin(), candies.end(), 0);
       }

       int twoDirectionalArrays(const std::vector<int>& ratings) {
           const int childCount = static_cast<int>(ratings.size());
           std::vector<int> fromLeft(childCount, 1);
           std::vector<int> fromRight(childCount, 1);

           for (int index = 1; index < childCount; ++index) {
               if (ratings[index] > ratings[index - 1]) {
                   fromLeft[index] = fromLeft[index - 1] + 1;
               }
           }
           for (int index = childCount - 2; index >= 0; --index) {
               if (ratings[index] > ratings[index + 1]) {
                   fromRight[index] = fromRight[index + 1] + 1;
               }
           }

           int total = 0;
           for (int index = 0; index < childCount; ++index) {
               total += std::max(fromLeft[index], fromRight[index]);
           }
           return total;
       }

       int oneArrayAndRollingRight(const std::vector<int>& ratings) {
           const int childCount = static_cast<int>(ratings.size());
           std::vector<int> fromLeft(childCount, 1);
           for (int index = 1; index < childCount; ++index) {
               if (ratings[index] > ratings[index - 1]) {
                   fromLeft[index] = fromLeft[index - 1] + 1;
               }
           }

           int rightRequirement = 1;
           int total = fromLeft[childCount - 1];
           for (int index = childCount - 2; index >= 0; --index) {
               if (ratings[index] > ratings[index + 1]) {
                   ++rightRequirement;
               } else {
                   rightRequirement = 1;
               }
               total += std::max(fromLeft[index], rightRequirement);
           }
           return total;
       }

   public:
       int candy(std::vector<int>& ratings) {
           return oneArrayAndRollingRight(ratings);
       }
   };

题解
----

原始做法：从全一分配反复修补
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

先给每人一颗，再扫描每对相邻孩子：高评分者若没有更多糖，就把他的糖数提高到低评分者加一。持续扫描到
没有变化，最终一定满足约束。``repeatedlyRepairConstraints`` 只会增加糖数，并且每次只增加到当前约束
要求的最低值，因此它能作为直觉正确的基线。

瓶颈是约束会沿长坡传播。对严格递减评分，左到右扫描先修补靠左位置后，右侧变化又会迫使前面在下一轮继续
增加；同一位置可能被访问和修改多次，最坏需要 ``O(n^2)`` 工作。问题不是局部规则难检查，而是一个扫描
方向无法让两侧依赖都处于已知状态。

把一条双向规则拆成两个单向下界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个孩子可能同时受到左右邻居约束。先只考虑左邻居，定义 ``fromLeft[i]`` 为满足以下条件的最少糖数：

* 每人至少一颗；
* 若 ``ratings[i] > ratings[i-1]``，则当前位置比左侧多一颗。

从左向右时依赖已经算好，所以严格上升就取前一值加一，否则回到一。类似地，``fromRight[i]`` 从右向左
计算，只负责评分高于右邻居的约束。相等评分在该方向没有“更多”要求，必须重置为一，不能让前一段坡度
跨过平台传播。

为何逐点取最大值而不是相加
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法分配都必须同时不小于左右两个下界，所以位置 ``i`` 至少需要
``max(fromLeft[i], fromRight[i])``。反过来，取这个最大值后：若评分高于左邻居，``fromLeft`` 保证当前值
大于左侧最终值所需的左向链长度；若评分高于右邻居，``fromRight`` 对称保证。两个方向的全部约束因此同时
成立。

这个逐点下界本身可行，所以不只是必要下界，也是全局最小分配。相加会重复计算同一颗糖：在山峰
``[1, 2, 3, 2, 1]`` 中，峰值左右要求都是三颗，满足两侧只需三颗，不是六颗。

具体走读平台与山峰
~~~~~~~~~~~~~~~~~~

对 ``ratings = [1, 3, 2, 2, 1]``：

.. list-table::
   :header-rows: 1

   * - 评分
     - 左向下界
     - 右向下界
     - 最终取值
   * - ``1``
     - ``1``
     - ``1``
     - ``1``
   * - ``3``
     - ``2``
     - ``2``
     - ``2``
   * - ``2``
     - ``1``
     - ``1``
     - ``1``
   * - ``2``
     - ``1``
     - ``2``
     - ``2``
   * - ``1``
     - ``1``
     - ``1``
     - ``1``

中间两个评分相等的 ``2`` 之间没有糖数关系，所以第一段下降在平台处结束；右侧那个 ``2`` 只因高于末尾
``1`` 才需要两颗。

右向数组怎样压缩为一个变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合并答案时本来就要从右向左。计算 ``fromRight[i]`` 只依赖刚算出的 ``fromRight[i+1]``，而更右侧状态在
加入总和后不会再次使用，所以整张右向数组可以压缩为 ``rightRequirement``。严格下降时加一，否则重置为
一，再与已保存的 ``fromLeft[i]`` 取最大值。

最后一个孩子没有右邻居，右向下界为一；代码先把他的左向值加入 ``total``，再从倒数第二个位置开始滚动。
这避免访问越界，也覆盖单元素数组：循环不执行，结果就是一。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用左向数组加滚动右状态，时间 ``O(n)``、空间 ``O(n)``。双数组方案同为线性时间，但使用两份
``O(n)`` 状态，保留它是为了直接展示两个独立下界；滚动版本进一步删除右数组。反复修补只需一个糖果数组，
却可能花 ``O(n^2)`` 时间，因此仅作为原始搜索方式。返回结果按题目约束可用 ``int`` 表示。
