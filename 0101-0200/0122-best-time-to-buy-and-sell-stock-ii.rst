0122. Best Time to Buy and Sell Stock II
========================================

题目信息
--------

:题号: 0122
:难度: Medium
:主题: 数组、多次交易、贪心、相邻差分
:原题: `LeetCode 0122
   <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/>`_
:访问状态: Available
:教学重点: 正涨幅累加、区间利润拆分、可实现性构造、交易不重叠

题目重述
--------

给定按日期排列的股票价格数组 ``prices``。可以完成任意多次交易，
每次交易都要先买入一股再卖出；任意时刻最多持有一股，不能同时参与两笔尚未结束的交易。
返回能够获得的最大总利润。

题目允许同一天卖出后再次买入。连续上涨区间也可以合并成一次从谷底到峰顶的交易，
因此正文不依赖同日重复操作来获得额外利润。

题目保证：

* ``1 <= len(prices) <= 100000``；
* ``0 <= prices[day] <= 10000``；
* 可以选择不交易，最低利润为 ``0``；
* 输入顺序是时间顺序，本文实现只读数组。

自建示例
--------

多段上涨
~~~~~~~~

.. code-block:: text

   prices = [7, 1, 5, 3, 6, 4]

   交易一：1 买入，5 卖出，利润 4
   交易二：3 买入，6 卖出，利润 3
   总利润：7

持续上涨
~~~~~~~~

.. code-block:: text

   prices = [1, 2, 3, 4, 5]

   1 买入、5 卖出的利润为 4。
   相邻涨幅 1 + 1 + 1 + 1 也等于 4。

持续下降
~~~~~~~~

``prices = [7, 6, 4, 3, 1]`` 没有正涨幅，返回 ``0``。

平台期
~~~~~~

.. code-block:: text

   prices = [2, 2, 3, 3, 1, 1, 4]
   正涨幅：2 -> 3 为 1，1 -> 4 为 3
   输出：4

价格相等的相邻边利润为 ``0``，加入或忽略都不改变答案。

问题抽象
--------

定义相邻变化：

.. code-block:: text

   delta[day] = prices[day] - prices[day - 1]

任意一次从 ``buy`` 到 ``sell`` 的交易利润可以望远镜展开：

.. code-block:: text

   prices[sell] - prices[buy]
     = delta[buy + 1] + delta[buy + 2] + ... + delta[sell]

区间中的负变化会降低这笔交易的利润。由于交易次数不限，可以在下降前卖出、下降后重新买入，
把负变化从收益中移除。因此候选答案是所有正相邻变化之和：

.. code-block:: text

   profit = sum(max(0, prices[day] - prices[day - 1]))

这不是只看一天的局部猜测。需要同时证明：

* 任何合法交易组合的利润都不会超过正变化总和；
* 正变化总和能够由一组不重叠交易真实实现。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 累加全部正相邻涨幅
     - ``O(n)``
     - ``O(1)``
     - 主解法；利用交易次数不限
   * - ``cash`` / ``hold`` 两状态 DP
     - ``O(n)``
     - ``O(1)``
     - 通用模型；可推广到手续费、冷冻期和交易上限
   * - 枚举所有交易区间组合
     - 指数级
     - 与递归深度相关
     - 重复比较同一价格变化

这里 ``n`` 是价格数量。

主解法：累加全部正相邻涨幅
--------------------------

扫描状态
~~~~~~~~

初始化 ``profit = 0``。从第 1 天开始计算相邻变化：

.. code-block:: text

   rise = prices[day] - prices[day - 1]
   if rise > 0:
       profit += rise

扫描到第 ``day`` 天后保持：

* ``profit`` 等于前 ``day + 1`` 个价格中全部正相邻变化之和；
* 这个数等于该前缀能够获得的最大合法交易利润；
* 输入价格保持原顺序且未被修改。

上界证明：任何策略都不能更多
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑任意一组合法、不重叠的交易。每笔 ``[buy, sell]`` 利润都等于该区间内相邻变化之和。
把全部交易区间展开后：

* 每个相邻边最多属于一笔交易，因为持仓区间不能重叠；
* 负变化和零变化不会让总和超过只保留正变化的结果；
* 未被交易覆盖的正变化加入全局正变化总和后，只会使上界更大。

因此任意策略利润都不超过全部正相邻变化之和。

构造证明：正变化总和能够实现
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把价格序列划分为最大严格上涨段。每段从局部谷底买入，在该段最后一个峰顶卖出。
一段 ``prices[left] < prices[left + 1] < ... < prices[right]`` 的交易利润为：

.. code-block:: text

   prices[right] - prices[left]
     = sum(prices[day] - prices[day - 1], day = left + 1 .. right)

它正好等于该上涨段内所有正相邻变化之和。不同最大上涨段之间至少存在一次不上涨，
交易区间互不重叠，所以所有上涨段都可以依次执行。

也可以把连续上涨的每条正边视为一天交易：前一天买入、当天卖出。
相邻正边共享端点时，把它们合并为同一上涨段即可，不需要同时持有两股。

为什么 0121 的最低价状态不再适用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

0121 只允许一次交易，必须选一个连续持仓区间，因此要保留该区间之前的最低买入价。
本题允许在每次下降前结束持仓，下降后重新开始。全局最低价到某个峰值只描述其中一笔交易，
会遗漏后续独立上涨段。

两状态 DP 如何折叠成贪心
~~~~~~~~~~~~~~~~~~~~~~~~

通用无限交易 DP 可以定义：

.. code-block:: text

   cash = 当前不持股的最大利润
   hold = 当前持有一股的最大利润

   next_cash = max(cash, hold + price)
   next_hold = max(hold, cash - price)

无手续费、无冷冻期、无交易次数上限时，每个正相邻变化都可以安全兑现，
上述状态转移的最终 ``cash`` 与正变化累加相等。贪心直接删除了对当前题不必要的持仓状态，
代码更短，证明依靠上界与构造闭合。

正确性依据
~~~~~~~~~~

**合法性。** 构造中的每个最大上涨段只持有一股，先买后卖；各段按时间顺序互不重叠。

**上界。** 任意合法策略展开为相邻变化后，每条边最多计入一次。删除非正变化不会减小利润，
所以策略利润不超过所有正变化之和。

**可实现性。** 每个最大上涨段的一次交易等于该段正变化之和，全部段交易之和等于算法结果。

**最优性。** 算法结果既是所有策略的上界，又能由合法策略实现，因此就是最大利润。

**完整性。** 每条正相邻变化属于唯一最大上涨段，构造不会遗漏或重复计算。

**终止性。** 日期下标每轮增加一，最终到达数组末尾。

复杂度与数值边界
~~~~~~~~~~~~~~~~

* 扫描 ``n - 1`` 条相邻边，时间复杂度 ``O(n)``；
* 只维护 ``profit`` 和当前变化，算法额外空间 ``O(1)``；
* 返回单个整数，返回载荷 ``O(1)``；
* 输入不复制、不排序、不修改；
* 每次盈利交易最多赚 ``10000``，最多约有 ``floor(n / 2)`` 个独立上涨段；
* 最大总利润不超过 ``500000000``，适合 32 位有符号整数；
* TypeScript ``number`` 在该范围内是精确整数；
* Rust 按值取得向量所有权，其他主要平台接口借用或共享数组，但都只读元素。

核心语言实现
------------

C
~

.. code-block:: c

   int maxProfit(int *prices, int pricesSize) {
       int profit = 0;

       for (int day = 1; day < pricesSize; ++day) {
           const int rise = prices[day] - prices[day - 1];
           if (rise > 0) {
               // 每条正边都属于某个可实现的上涨交易段。
               profit += rise;
           }
       }

       return profit;
   }

函数只读 ``prices``，不需要为单元素输入设置特殊分支，循环自然为空。

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int maxProfit(std::vector<int>& prices) {
           int profit = 0;

           for (std::size_t day = 1; day < prices.size(); ++day) {
               const int rise = prices[day] - prices[day - 1];
               if (rise > 0) {
                   profit += rise;
               }
           }

           return profit;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProfit(self, prices: list[int]) -> int:
           profit = 0

           for day in range(1, len(prices)):
               rise = prices[day] - prices[day - 1]
               if rise > 0:
                   # 下降边被交易边界隔开，不进入收益。
                   profit += rise

           return profit

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProfit(int[] prices) {
           int profit = 0;

           for (int day = 1; day < prices.length; ++day) {
               int rise = prices[day] - prices[day - 1];
               if (rise > 0) {
                   profit += rise;
               }
           }

           return profit;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(prices: Vec<i32>) -> i32 {
           let mut profit = 0;

           for pair in prices.windows(2) {
               let rise = pair[1] - pair[0];
               if rise > 0 {
                   // windows(2) 借用相邻切片，不物化差分数组。
                   profit += rise;
               }
           }

           profit
       }
   }

``windows(2)`` 在单元素向量上产生空迭代器，额外状态为常数规模。

Go
~~

.. code-block:: go

   func maxProfit(prices []int) int {
       profit := 0

       for day := 1; day < len(prices); day++ {
           rise := prices[day] - prices[day-1]
           if rise > 0 {
               profit += rise
           }
       }

       return profit
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(prices: number[]): number {
       let profit = 0;

       for (let day = 1; day < prices.length; day += 1) {
           const rise = prices[day] - prices[day - 1];
           if (rise > 0) {
               profit += rise;
           }
       }

       return profit;
   }

``number`` 不需要位运算；避免使用会把值强制转换为 32 位的技巧。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxProfit(int[] prices) {
           int profit = 0;

           for (int day = 1; day < prices.Length; ++day) {
               int rise = prices[day] - prices[day - 1];
               if (rise > 0) {
                   profit += rise;
               }
           }

           return profit;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_profit(prices::Vector{Int})::Int
       profit = 0

       for day in 2:length(prices)
           rise = prices[day] - prices[day - 1]
           if rise > 0
               profit += rise
           end
       end

       return profit
   end

长度为 1 时 ``2:1`` 为空 ``UnitRange``，不会访问越界位置。

R
~

.. code-block:: r

   max_profit <- function(prices) {
     profit <- 0

     if (length(prices) >= 2L) {
       for (day in seq.int(2L, length(prices))) {
         rise <- prices[[day]] - prices[[day - 1L]]
         if (rise > 0) {
           profit <- profit + rise
         }
       }
     }

     profit
   }

R 显式保护单元素边界，再构造递增日期序列；标量重绑定不会修改输入向量。

验证计划与证据
--------------

* 固定用例覆盖单元素、持续上涨、持续下降、平台期、多段上涨和交替 ``0/10000``；
* 独立基准使用 ``cash`` / ``hold`` 两状态 DP，不复用正差分贪心；
* 对小数组额外枚举买入、卖出或跳过的全部合法动作序列；
* 随机生成合法价格，比较贪心、状态 DP 和小规模穷举；
* 调用前后比较输入，确认主实现不修改价格序列；
* Python 执行 3000 组随机对拍；
* C/C++、Java、Go、TypeScript 执行固定与 500 组随机对拍；
* C/C++ 通过严格警告、AddressSanitizer 和 UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时记录接口、相邻下标、循环边界和数值上界静态检查。

关键边界
--------

* 任意时刻最多持有一股，交易区间不能重叠；
* 连续上涨可以拆成多条正边，也可以合并为一次谷底到峰顶交易；
* 下降和持平边不贡献正利润；
* 单元素没有相邻边，答案为 ``0``；
* 价格时间顺序不能排序；
* 总利润上界需要按多次交易重新推导，不能沿用 0121 的 ``10000`` 上界。

易错点
------

* 仍然只寻找一次最低买入和最高卖出，遗漏后续上涨段；
* 把所有相邻变化都累加，导致下降边抵消已经可以锁定的利润；
* 对每个局部峰谷使用越界的 ``day + 1`` 判断；
* 同时维护持仓和正差分两套状态，却没有证明两者一致；
* 声称可以买卖无限股，忽略“最多持有一股”；
* 使用排序后差值，破坏时间和交易区间。

本题新增知识
------------

* 任意交易区间利润可以望远镜展开为相邻变化之和；
* 交易次数不限时，负变化可以通过结束持仓从收益中删除；
* 贪心正确性可以由“全局上界 + 合法构造”闭合；
* 最大上涨段把逐日正边合并成不重叠真实交易。

本题强化知识
------------

* 局部选择需要证明不会与全局约束冲突；
* 相邻差分可以揭示区间收益的可加结构；
* 一维状态 DP 在约束简化后可能折叠为更直接的贪心；
* 数值上界随交易次数变化，需要独立计算。

关联题目
--------

* `0121. Best Time to Buy and Sell Stock
  <0121-best-time-to-buy-and-sell-stock.rst>`_：最多一次交易，使用前缀最低买入价；
* `0123. Best Time to Buy and Sell Stock III
  <0123-best-time-to-buy-and-sell-stock-iii.rst>`_：最多两次交易，需要恢复交易阶段状态；
* `0053. Maximum Subarray <../0001-0100/0053-maximum-subarray.rst>`_：
  连续区间与相邻差分的另一种组合方式。

最小自检
--------

#. 为什么一笔从 ``buy`` 到 ``sell`` 的利润可以拆成相邻变化？
#. 为什么只累加正变化仍满足最多持有一股？
#. 0121 的前缀最低价为什么会漏掉本题答案？

答案要点
--------

#. 中间价格逐项相消，只剩 ``prices[sell] - prices[buy]``。
#. 把连续正变化合并成最大上涨段，每段只执行一笔先买后卖交易，区间互不重叠。
#. 一次交易状态只能选择一个持仓区间，本题可以在下降前卖出并在之后重新买入。
