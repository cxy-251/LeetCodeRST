0188. Best Time to Buy and Sell Stock IV
=========================================

题目信息
--------

:题号: 0188. 买卖股票的最佳时机 IV
:难度: Hard
:主题: 动态规划、交易状态机、滚动数组、贪心退化
:原题: `LeetCode 0188 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/>`_
:重点: 用已完成交易数与持仓状态压缩买卖日期历史，并识别 k 足够大时的无限交易结构

题目重述
--------

给定整数 ``k`` 和每日股价数组 ``prices``。最多完成 ``k`` 笔交易，每笔交易由一次买入和
之后的一次卖出组成；卖出前必须持股，任意时刻最多持有一股。

可以少做交易或完全不交易，返回能够获得的最大利润。

自建示例
--------

.. code-block:: text

   输入：k = 2, prices = [3,2,6,5,0,3]
   输出：7

   2 买入、6 卖出获利 4；0 买入、3 卖出获利 3。

.. code-block:: text

   输入：k = 1, prices = [3,2,6,5,0,3]
   输出：4

   交易额度只有一笔，不能同时取得两段上涨收益。

.. code-block:: text

   输入：k = 10, prices = [1,2,3,4,5]
   输出：4

   交易额度已经不构成限制，整段上涨都可以收入。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   private:
       int unlimitedTransactions(
           const std::vector<int>& prices) {
           int profit = 0;
           for (int day = 1;
                day < static_cast<int>(prices.size());
                ++day) {
               profit += std::max(
                   0, prices[day] - prices[day - 1]);
           }
           return profit;
       }

       int limitedTransactions(
           int limit, const std::vector<int>& prices) {
           long long unreachable =
               std::numeric_limits<long long>::lowest() / 4;
           std::vector<long long> cash(limit + 1, unreachable);
           std::vector<long long> hold(limit + 1, unreachable);
           cash[0] = 0;

           for (int raw_price : prices) {
               long long price = raw_price;
               for (int completed = limit; completed >= 1; --completed) {
                   if (cash[completed] != unreachable) {
                       hold[completed] = std::max(
                           hold[completed],
                           cash[completed] - price);
                   }
                   if (hold[completed - 1] != unreachable) {
                       cash[completed] = std::max(
                           cash[completed],
                           hold[completed - 1] + price);
                   }
               }
               hold[0] = std::max(hold[0], cash[0] - price);
           }

           return static_cast<int>(
               *std::max_element(cash.begin(), cash.end()));
       }

   public:
       int maxProfit(int k, std::vector<int>& prices) {
           int days = static_cast<int>(prices.size());
           if (k <= 0 || days < 2) {
               return 0;
           }
           if (k >= days / 2) {
               return unlimitedTransactions(prices);
           }
           return limitedTransactions(k, prices);
       }
   };

题解
----

枚举交易区间重复了哪些未来
~~~~~~~~~~~~~~~~~~~~~~~~~~

一笔交易需要选择买入日、卖出日；多笔交易还要保证区间按时间排列且不重叠。枚举所有日期
组合会产生指数级动作序列。许多不同历史到达同一天时，其后合法选择其实只由三件事决定：
今天处理到哪里、已经完成几笔交易、当前是否持股。

过去具体在哪些日期买卖不再影响未来，只要保留该状态下能够达到的最大现金。动态规划用
这个最优值合并所有等价历史，删除对相同后缀的重复搜索。

交易数应该在何时增加
~~~~~~~~~~~~~~~~~~~~

定义处理完当前日期前缀后的状态：

``cash[t]``
   恰好完成 ``t`` 次卖出、当前空仓时的最大利润。

``hold[t]``
   恰好完成 ``t`` 次卖出、当前持有一股时的最大现金。

一笔交易在卖出时才完成。因此买入从 ``cash[t]`` 转到 ``hold[t]``，坐标不变；卖出从
``hold[t-1]`` 转到 ``cash[t]``，完成数增加一。若把买入也增加 ``t``，会把 ``k`` 错解
为动作次数，使一买一卖消耗两个额度。

状态转移只有“不操作”和“当天交易动作”：

.. code-block:: text

   hold[t] = max(旧 hold[t], 旧 cash[t] - price)
   cash[t] = max(旧 cash[t], 旧 hold[t-1] + price)   t >= 1

最多持有一股被状态结构直接保证：买入只能从空仓来，卖出只能从持股来。

不可达状态与最终答案
~~~~~~~~~~~~~~~~~~~~

处理任何价格前，只有 ``cash[0] = 0`` 合法：零次交易且空仓。正数交易状态和所有持股
状态都尚不可达，不能初始化为 0；否则算法会凭空卖出一股，或假装已经免费完成交易。

代码用安全的负无穷 ``unreachable`` 标记这些状态，并只从有限状态做加减。最终必须空仓，
但可以完成少于 ``k`` 笔交易，所以答案是所有 ``cash[t]`` 的最大值，而不是强迫返回
``cash[k]``。``cash[0] = 0`` 也保证全程下降时可以选择不交易，利润不会为负。

原地更新顺序为何从大到小
~~~~~~~~~~~~~~~~~~~~~~~~~~

状态数组跨日期滚动复用。当天对 ``completed`` 从 ``limit`` 递减到 1：

* 更新 ``hold[completed]`` 时，``cash[completed]`` 尚未被当天卖出动作改写，仍是前一天
  状态；
* 更新 ``cash[completed]`` 时，依赖的 ``hold[completed-1]`` 位于更小下标，尚未轮到，
  也仍是前一天状态；
* 当前写入的大下标不会被之后更小下标的转移读取。

最后单独更新 ``hold[0]``。因此原地数组与为每天创建 ``nextCash``、``nextHold`` 完全
等价，没有把当天新状态串联成额外交易。若从小到大更新，``hold[t-1]`` 可能已经包含当天
买入，状态时间层就会混杂。

具体状态走读
~~~~~~~~~~~~

对 ``k = 1``、价格前缀 ``[3,2,6]``：

.. code-block:: text

   日期价格  hold[0]                   cash[1]
   初始      不可达                    不可达
   3         max(不可达, 0-3) = -3    不可达
   2         max(-3, 0-2) = -2        不可达
   6         -2                        max(不可达, -2+6) = 4

``hold[0] = -2`` 表示在价格 2 买入后持股；价格 6 时卖出进入恰好一笔交易的空仓状态，
利润 4。完整示例继续扫描后，``hold[1]`` 会在第一笔交易完成后以价格 0 买入，最后卖出使
``cash[2] = 7``。

k 足够大时约束为何消失
~~~~~~~~~~~~~~~~~~~~~~

``n`` 天最多完成 ``floor(n/2)`` 笔交易，因为每笔至少需要一个买入日和一个更晚卖出日。
当 ``k >= floor(n/2)``，任何合法交易策略都不会碰到额度上限，问题退化为无限交易。

此时把每个正相邻差加入利润：

.. code-block:: text

   sum(max(0, prices[day] - prices[day-1]))

任意买入 ``i``、卖出 ``j`` 的利润等于区间相邻差之和，负差只会降低它，所以所有策略都
不可能超过全数组正差之和；把连续正差合并为一个上涨段，在段首买、段尾卖，就能达到这个
上界。上涨段数不超过 ``floor(n/2)``，当前额度足够。

这个分支既把时间从 ``O(nk)`` 降为 ``O(n)``，也避免在 ``k`` 很大时创建无意义的状态
数组。它只在交易限制确实失效时使用；小 ``k`` 无条件收集正差会超额交易。

正确性与复杂度
~~~~~~~~~~~~~~

有限分支的初始化准确描述空前缀；每个新状态穷尽“不操作、买入或卖出”的全部合法来源，
递减顺序保证来源属于前一天。归纳可知 ``cash/hold`` 始终符合定义，最终最大空仓状态就是
至多 ``k`` 笔交易的最优利润。无限分支由正差上界及上涨段可达性得到最优。

当限制有效时，时间复杂度为 ``O(nk)``、额外空间为 ``O(k)``；限制失效时，时间为
``O(n)``、额外空间为 ``O(1)``。利润状态使用 ``long long`` 和远离下界的哨兵，避免不可达
值参与减法时溢出，最后按题目返回类型转换为 ``int``。
