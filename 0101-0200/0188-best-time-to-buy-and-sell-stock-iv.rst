0188. Best Time to Buy and Sell Stock IV
=========================================

题目信息
--------

:题号: 0188
:难度: Hard
:主题: 动态规划、有限交易次数、状态机、滚动数组、贪心退化
:原题: `LeetCode 0188 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/>`_
:访问状态: Available
:教学重点: 完成卖出次数坐标、不可达状态、逆向原地更新、无限交易退化

精确契约
--------

输入整数 ``k`` 和按日期排列的价格数组 ``prices``：

* 官方输入中 ``1 <= k <= 100``；本章实现额外兼容 ``k <= 0``，直接返回 0；
* ``1 <= prices.length <= 1000``；
* ``0 <= prices[day] <= 1000``；
* 一笔交易由一次买入和之后的一次卖出组成；
* 任意时刻最多持有一股，卖出前必须已经持股；
* 最多完成 ``k`` 笔交易，也可以少做或完全不交易。

返回可获得的最大非负利润。输入数组只读。

``k`` 统计的是已经完成的卖出次数，不是买入与卖出的动作总数。一次买入不会立刻增加交易数，
只有卖出完成一笔交易时，完成数才加一。

示例与反例
----------

两天一次交易
~~~~~~~~~~~~

``k=2, prices=[2,4,1]``。三天最多完成一笔有效交易，最优是 ``2 -> 4``，利润为 2。
即使 ``k`` 更大，也没有足够日期完成更多买卖对。

两段上涨
~~~~~~~~

``k=2, prices=[3,2,6,5,0,3]``：

* 2 买入、6 卖出，利润 4；
* 0 买入、3 卖出，利润 3；
* 总利润 7。

只有一次交易额度
~~~~~~~~~~~~~~~~

同一价格序列若 ``k=1``，只能选择 ``2 -> 6``，答案为 4。不能把两段上涨都收入答案。

零交易、单日和下降序列
~~~~~~~~~~~~~~~~~~~~~~

* ``k=0``：没有合法卖出，返回 0；
* ``prices=[5]``：没有买后卖的日期对，返回 0；
* ``prices=[7,6,4,3,1]``：所有交易都会亏损，返回 0。

交易次数足够大
~~~~~~~~~~~~~~

``k=10, prices=[1,2,3,4,5]``。最多可能完成 ``floor(5/2)=2`` 笔交易，``k`` 已不构成约束。
可以把每个正相邻差都收入：``1+1+1+1=4``。

动作次数误解
~~~~~~~~~~~~

若把买入和卖出各算一笔，``k=2`` 会被错误解释为只能完成一次交易。题意中的一笔交易包含完整的一买一卖。

问题抽象与解法选择
------------------

长度为 ``n`` 的价格序列最多完成 ``floor(n/2)`` 笔非重叠交易，因为每笔交易至少占用一个买入日和一个更晚卖出日。
因此有效上限为：

.. math::

   limit = \min(k, \lfloor n/2 \rfloor)

当 ``k >= floor(n/2)`` 时，交易次数限制完全失效，问题退化为无限交易：把所有正相邻差相加即可。

当 ``k < floor(n/2)`` 时，需要动态规划。使用两个长度 ``limit+1`` 的状态数组：

``cash[t]``
   处理完当前日期前缀后，**恰好完成 t 次卖出、当前不持股** 的最大利润。

``hold[t]``
   处理完当前日期前缀后，**恰好完成 t 次卖出、当前持有一股** 的最大现金。

这里 ``hold[t]`` 表示已经完成 ``t`` 笔交易后又买入了下一股；买入本身不增加 ``t``。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 工作空间
     - 取舍
   * - 有限交易 DP + 无限交易退化
     - ``O(n * min(k,n/2))``；退化分支 ``O(n)``
     - ``O(min(k,n/2))``
     - 主解法；同时满足大 ``k`` 与小 ``k``
   * - 完整二维 DP
     - ``O(nk)``
     - ``O(nk)``
     - 状态直观，但保存全部日期没有必要
   * - 无条件收集正相邻差
     - ``O(n)``
     - ``O(1)``
     - 仅在交易次数不再约束时正确
   * - 枚举所有交易日期
     - 指数级或高次多项式
     - 取决于枚举方式
     - 无法处理当前范围

无限交易分支
------------

算法
~~~~

对每个相邻日期 ``day-1 -> day``，若价格上涨，就把差值加入答案：

.. math::

   profit = \sum_{day=1}^{n-1}\max(0, prices[day]-prices[day-1])

这等价于在每个上涨边开始前买入、结束后卖出。连续上涨可以拆成多笔相邻交易，也可以合并成一笔长交易，
利润完全相同。

正确性证明
~~~~~~~~~~

**上界。** 任意一笔从日期 ``i`` 买入、日期 ``j`` 卖出的利润为：

.. math::

   prices[j]-prices[i]
   = \sum_{d=i+1}^{j}(prices[d]-prices[d-1])

其中负差会降低总和，因此该交易利润不超过区间内所有正相邻差之和。多笔合法交易的持仓区间互不重叠，
所以其总利润不超过整个数组全部正相邻差之和。

**可达性。** 对每个正相邻差，在前一天买入、后一天卖出即可获得该差值。这些一日交易按时间顺序排列，
不会同时持有多股。由于 ``k >= floor(n/2)``，交易额度足以容纳任何可能的一日交易集合。

上界能够达到，所以正相邻差之和就是最优利润。

有限交易动态规划
----------------

初始化
~~~~~~

在尚未处理任何日期时：

* ``cash[0]=0``：零次交易且空仓的唯一合法策略是不操作；
* ``cash[t>0]=NEG``：还没有日期，不可能已经完成正数次卖出；
* 所有 ``hold[t]=NEG``：尚未买入，不可能持股。

``NEG`` 是安全的负无穷哨兵。C++ 取远离 ``long long`` 下界的值，即使按状态转移减去约束范围内的价格，
也不会发生整数溢出；不可达状态不会成为最终空仓答案。

状态转移
~~~~~~~~

设当天价格为 ``price``，旧状态来自前一天。

持股状态：

.. math::

   nextHold[t] = \max(oldHold[t], oldCash[t]-price)

来源只有两种：

* 昨天已经持股，今天不操作；
* 昨天空仓且已完成 ``t`` 次卖出，今天买入，完成卖出数仍为 ``t``。

空仓状态对 ``t>=1``：

.. math::

   nextCash[t] = \max(oldCash[t], oldHold[t-1]+price)

来源同样只有两种：

* 昨天空仓，今天不操作；
* 昨天持股且已完成 ``t-1`` 次卖出，今天卖出，完成数增加到 ``t``。

``cash[0]`` 始终为 0，因为零次卖出且空仓时最优策略是不交易。

为什么按 t 递减可以原地更新
~~~~~~~~~~~~~~~~~~~~~~~~~~

代码不分配 ``nextCash`` 和 ``nextHold``，而是在每天内部按 ``t=limit,limit-1,...,1`` 递减：

#. 先更新 ``hold[t]``，它读取尚未在当天改写的 ``cash[t]``，因此读到旧空仓状态；
#. 再更新 ``cash[t]``，它读取 ``hold[t-1]``；由于 ``t-1`` 尚未轮到，读到的仍是旧持股状态；
#. 当前轮写入的 ``hold[t]`` 和 ``cash[t]`` 不会被更小 ``t`` 的转移读取；
#. 最后单独更新 ``hold[0]``。

所以每个转移都严格使用前一日状态，没有在同一天串联“卖出后立即再买入”或“买入后立即卖出”的新状态。
这与显式前一日副本完全等价。

核心不变量
~~~~~~~~~~

处理完任意日期前缀后：

* ``cash[t]`` 等于该前缀内所有“恰好完成 ``t`` 次卖出且空仓”的合法策略最大利润；
* ``hold[t]`` 等于该前缀内所有“恰好完成 ``t`` 次卖出且持有一股”的合法策略最大现金；
* 不可达状态保持 ``NEG``；
* 每次买入只从同一 ``t`` 的空仓状态转移；
* 每次卖出只从 ``t-1`` 的持股状态进入 ``t`` 的空仓状态；
* 任意策略始终最多持有一股；
* 输入数组未被修改。

正确性证明
----------

引理一：初始化准确表示空前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空前缀中唯一合法策略是不操作，因此 ``cash[0]=0``。没有股票可买卖，所以所有持股状态和完成正数交易的空仓状态
都不可达，设置为 ``NEG`` 正确。

引理二：持股转移覆盖全部且仅有的合法来源
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑处理当天后处于 ``hold[t]`` 的任意合法最优策略。它今天要么没有操作，昨天已经处于 ``oldHold[t]``；
要么今天买入，昨天必须空仓且已经完成 ``t`` 次卖出，来源为 ``oldCash[t]-price``。

不存在第三种合法来源：卖出会变为空仓；从持股状态再次买入会违反最多持有一股。两种来源取最大，
因此 ``nextHold[t]`` 恰好满足状态定义。

引理三：空仓转移覆盖全部且仅有的合法来源
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对 ``t>=1``，处理当天后处于 ``cash[t]`` 的最优策略今天要么不操作，来源为 ``oldCash[t]``；
要么今天卖出，昨天必须持股并恰好完成 ``t-1`` 次卖出，来源为 ``oldHold[t-1]+price``。

卖出完成一笔交易，所以坐标从 ``t-1`` 增加到 ``t``。从空仓状态再次卖出不合法，
因此两种来源完整且没有非法策略。

引理四：递减原地更新与双数组转移等价
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

更新 ``t`` 时，``cash[t]`` 尚未在当天写入，所以更新 ``hold[t]`` 读取旧值。
随后 ``cash[t]`` 读取 ``hold[t-1]``；递减顺序保证下标 ``t-1`` 尚未更新。
已写入的下标 ``t`` 不会出现在之后更小下标的右侧依赖中。

因此每次读到的恰是公式中的 ``oldCash`` 和 ``oldHold``，原地写法与使用独立下一日数组逐项相同。

引理五：有限交易循环始终保持核心不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，处理日期前不变量成立。假设昨天成立，引理二与引理三证明每个新状态在全部合法来源中取最大；
引理四保证实现读取的确是昨天状态。归纳可知不变量对所有日期成立。

引理六：最终答案是至多 limit 笔交易的最大利润
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

完整策略结束时应为空仓；未卖出的股票不构成完成交易，也不能增加最终可用利润。
状态 ``cash[t]`` 分别覆盖恰好完成 ``t`` 笔交易的全部合法策略。

因此：

.. math::

   answer = \max_{0\le t\le limit} cash[t]

恰好等于至多 ``limit`` 笔交易的最大利润。由于 ``limit=min(k,floor(n/2))``，它也等于题目要求的至多 ``k`` 笔交易。

定理：算法返回最优利润
~~~~~~~~~~~~~~~~~~~~~~

若 ``k>=floor(n/2)``，无限交易分支的上界与可达性证明保证结果最优。
否则由引理五和引理六，有限交易 DP 返回至多 ``k`` 笔交易的最优利润。
两个分支覆盖全部输入，因此算法正确。

终止性
~~~~~~

无限交易分支单调扫描相邻日期。有限分支外层扫描有限个价格，内层 ``t`` 从 ``limit`` 递减到 1，
每轮严格减少，随后执行一次 ``hold[0]`` 更新。所有循环均有限终止。

复杂度与实现边界
----------------

设 ``n=prices.length``，``q=min(k,floor(n/2))``：

* 若 ``k>=floor(n/2)``，时间 ``O(n)``、额外空间 ``O(1)``；
* 否则有限分支时间 ``O(nq)``，两个状态数组空间 ``O(q)``；
* 输入只读，没有价格数组副本或路径输出；
* 官方范围内 ``q<=100``；每笔交易利润至多 1000，
  所以最终答案至多 ``100000``；
  ``cash[t]`` 是至多 ``2t`` 个价格的带符号和，``hold[t]`` 至多再减一个价格，
  因而所有可达有限状态的绝对值至多 ``201000``；
* 上述界证明 C++ 的 64 位利润状态有充足余量，最终答案可安全转换为平台 ``int``；
* C++ 只保存 ``cash`` 与 ``hold`` 两个长度为 ``q+1`` 的状态数组，输入价格数组保持不变。

十语言实现
----------

C
~

.. code-block:: c

   #include <limits.h>
   #include <stddef.h>
   #include <stdlib.h>

   static int unlimited_profit(const int *prices, int pricesSize) {
       long long total = 0;
       for (int day = 1; day < pricesSize; ++day) {
           if (prices[day] > prices[day - 1]) {
               total += (long long)prices[day] - prices[day - 1];
           }
       }
       return (int)total;
   }

   int maxProfit(int k, int *prices, int pricesSize) {
       if (k <= 0 || pricesSize < 2) {
           return 0;
       }
       if (k >= pricesSize / 2) {
           return unlimited_profit(prices, pricesSize);
       }

       const int limit = k;
       const long long neg = LLONG_MIN / 4;
       long long *cash = malloc(
           ((size_t)limit + 1U) * sizeof(*cash)
       );
       long long *hold = malloc(
           ((size_t)limit + 1U) * sizeof(*hold)
       );
       if (cash == NULL || hold == NULL) {
           free(cash);
           free(hold);
           return -1;  // 合法利润非负，-1 表示资源失败
       }

       for (int t = 0; t <= limit; ++t) {
           cash[t] = neg;
           hold[t] = neg;
       }
       cash[0] = 0;

       for (int day = 0; day < pricesSize; ++day) {
           const long long price = prices[day];
           for (int t = limit; t >= 1; --t) {
               if (cash[t] != neg) {
                   const long long buy = cash[t] - price;
                   if (buy > hold[t]) {
                       hold[t] = buy;
                   }
               }
               if (hold[t - 1] != neg) {
                   const long long sell = hold[t - 1] + price;
                   if (sell > cash[t]) {
                       cash[t] = sell;
                   }
               }
           }

           const long long first_buy = cash[0] - price;
           if (first_buy > hold[0]) {
               hold[0] = first_buy;
           }
       }

       long long answer = cash[0];
       for (int t = 1; t <= limit; ++t) {
           if (cash[t] > answer) {
               answer = cash[t];
           }
       }

       free(cash);
       free(hold);
       return (int)answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   public:
       int maxProfit(int k, const std::vector<int>& prices) {
           const int n = static_cast<int>(prices.size());
           if (k <= 0 || n < 2) {
               return 0;
           }
           if (k >= n / 2) {
               long long total = 0;
               for (int day = 1; day < n; ++day) {
                   total += std::max(0, prices[day] - prices[day - 1]);
               }
               return static_cast<int>(total);
           }

           const int limit = k;
           const long long neg = std::numeric_limits<long long>::min() / 4;
           std::vector<long long> cash(limit + 1, neg);
           std::vector<long long> hold(limit + 1, neg);
           cash[0] = 0;

           for (const int raw_price : prices) {
               const long long price = raw_price;
               for (int t = limit; t >= 1; --t) {
                   if (cash[t] != neg) {
                       hold[t] = std::max(hold[t], cash[t] - price);
                   }
                   if (hold[t - 1] != neg) {
                       cash[t] = std::max(cash[t], hold[t - 1] + price);
                   }
               }
               hold[0] = std::max(hold[0], cash[0] - price);
           }

           return static_cast<int>(
               *std::max_element(cash.begin(), cash.end())
           );
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProfit(self, k: int, prices: list[int]) -> int:
           n = len(prices)
           if k <= 0 or n < 2:
               return 0
           if k >= n // 2:
               return sum(
                   max(0, prices[day] - prices[day - 1])
                   for day in range(1, n)
               )

           limit = k
           neg = -(1 << 60)
           cash = [neg] * (limit + 1)
           hold = [neg] * (limit + 1)
           cash[0] = 0

           for price in prices:
               for completed in range(limit, 0, -1):
                   if cash[completed] != neg:
                       hold[completed] = max(
                           hold[completed],
                           cash[completed] - price,
                       )
                   if hold[completed - 1] != neg:
                       cash[completed] = max(
                           cash[completed],
                           hold[completed - 1] + price,
                       )
               hold[0] = max(hold[0], cash[0] - price)

           return max(cash)

Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class Solution {
       public int maxProfit(int k, int[] prices) {
           int n = prices.length;
           if (k <= 0 || n < 2) {
               return 0;
           }
           if (k >= n / 2) {
               long total = 0L;
               for (int day = 1; day < n; ++day) {
                   if (prices[day] > prices[day - 1]) {
                       total += (long) prices[day] - prices[day - 1];
                   }
               }
               return (int) total;
           }

           int limit = k;
           long neg = Long.MIN_VALUE / 4L;
           long[] cash = new long[limit + 1];
           long[] hold = new long[limit + 1];
           Arrays.fill(cash, neg);
           Arrays.fill(hold, neg);
           cash[0] = 0L;

           for (int rawPrice : prices) {
               long price = rawPrice;
               for (int completed = limit; completed >= 1; --completed) {
                   if (cash[completed] != neg) {
                       hold[completed] = Math.max(
                           hold[completed],
                           cash[completed] - price
                       );
                   }
                   if (hold[completed - 1] != neg) {
                       cash[completed] = Math.max(
                           cash[completed],
                           hold[completed - 1] + price
                       );
                   }
               }
               hold[0] = Math.max(hold[0], cash[0] - price);
           }

           long answer = 0L;
           for (long value : cash) {
               answer = Math.max(answer, value);
           }
           return (int) answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(k: i32, prices: Vec<i32>) -> i32 {
           let n = prices.len();
           if k <= 0 || n < 2 {
               return 0;
           }
           let limit = k as usize;
           if limit >= n / 2 {
               let mut total = 0_i64;
               for day in 1..n {
                   let difference = prices[day] - prices[day - 1];
                   if difference > 0 {
                       total += i64::from(difference);
                   }
               }
               return total as i32;
           }

           let neg = i64::MIN / 4;
           let mut cash = vec![neg; limit + 1];
           let mut hold = vec![neg; limit + 1];
           cash[0] = 0;

           for raw_price in prices {
               let price = i64::from(raw_price);
               for completed in (1..=limit).rev() {
                   if cash[completed] != neg {
                       hold[completed] = hold[completed]
                           .max(cash[completed] - price);
                   }
                   if hold[completed - 1] != neg {
                       cash[completed] = cash[completed]
                           .max(hold[completed - 1] + price);
                   }
               }
               hold[0] = hold[0].max(cash[0] - price);
           }

           *cash.iter().max().unwrap() as i32
       }
   }

Go
~~

.. code-block:: go

   func maxProfit(k int, prices []int) int {
       n := len(prices)
       if k <= 0 || n < 2 {
           return 0
       }
       if k >= n/2 {
           var total int64
           for day := 1; day < n; day++ {
               if prices[day] > prices[day-1] {
                   total += int64(prices[day] - prices[day-1])
               }
           }
           return int(total)
       }

       limit := k
       const neg int64 = -1 << 60
       cash := make([]int64, limit+1)
       hold := make([]int64, limit+1)
       for completed := 0; completed <= limit; completed++ {
           cash[completed] = neg
           hold[completed] = neg
       }
       cash[0] = 0

       for _, rawPrice := range prices {
           price := int64(rawPrice)
           for completed := limit; completed >= 1; completed-- {
               if cash[completed] != neg {
                   buy := cash[completed] - price
                   if buy > hold[completed] {
                       hold[completed] = buy
                   }
               }
               if hold[completed-1] != neg {
                   sell := hold[completed-1] + price
                   if sell > cash[completed] {
                       cash[completed] = sell
                   }
               }
           }
           buy := cash[0] - price
           if buy > hold[0] {
               hold[0] = buy
           }
       }

       answer := cash[0]
       for completed := 1; completed <= limit; completed++ {
           if cash[completed] > answer {
               answer = cash[completed]
           }
       }
       return int(answer)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(k: number, prices: number[]): number {
       const n = prices.length;
       if (k <= 0 || n < 2) {
           return 0;
       }
       if (k >= Math.floor(n / 2)) {
           let total = 0;
           for (let day = 1; day < n; day++) {
               total += Math.max(0, prices[day] - prices[day - 1]);
           }
           return total;
       }

       const limit = k;
       const cash = new Array<number>(limit + 1).fill(
           Number.NEGATIVE_INFINITY,
       );
       const hold = new Array<number>(limit + 1).fill(
           Number.NEGATIVE_INFINITY,
       );
       cash[0] = 0;

       for (const price of prices) {
           for (let completed = limit; completed >= 1; completed--) {
               hold[completed] = Math.max(
                   hold[completed],
                   cash[completed] - price,
               );
               cash[completed] = Math.max(
                   cash[completed],
                   hold[completed - 1] + price,
               );
           }
           hold[0] = Math.max(hold[0], cash[0] - price);
       }

       let answer = 0;
       for (const value of cash) {
           answer = Math.max(answer, value);
       }
       return answer;
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MaxProfit(int k, int[] prices) {
           int n = prices.Length;
           if (k <= 0 || n < 2) {
               return 0;
           }
           if (k >= n / 2) {
               long total = 0L;
               for (int day = 1; day < n; day++) {
                   total += Math.Max(0, prices[day] - prices[day - 1]);
               }
               return (int)total;
           }

           int limit = k;
           long neg = long.MinValue / 4L;
           long[] cash = new long[limit + 1];
           long[] hold = new long[limit + 1];
           Array.Fill(cash, neg);
           Array.Fill(hold, neg);
           cash[0] = 0L;

           foreach (int rawPrice in prices) {
               long price = rawPrice;
               for (int completed = limit; completed >= 1; completed--) {
                   if (cash[completed] != neg) {
                       hold[completed] = Math.Max(
                           hold[completed],
                           cash[completed] - price
                       );
                   }
                   if (hold[completed - 1] != neg) {
                       cash[completed] = Math.Max(
                           cash[completed],
                           hold[completed - 1] + price
                       );
                   }
               }
               hold[0] = Math.Max(hold[0], cash[0] - price);
           }

           long answer = 0L;
           foreach (long value in cash) {
               answer = Math.Max(answer, value);
           }
           return (int)answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_profit(k::Int, prices::Vector{Int})::Int
       n = length(prices)
       if k <= 0 || n < 2
           return 0
       end
       if k >= div(n, 2)
           total = Int64(0)
           for day in 2:n
               difference = prices[day] - prices[day - 1]
               if difference > 0
                   total += Int64(difference)
               end
           end
           return Int(total)
       end

       limit = k
       neg = div(typemin(Int64), 4)
       cash = fill(neg, limit + 1)
       hold = fill(neg, limit + 1)
       cash[1] = 0

       for raw_price in prices
           price = Int64(raw_price)
           for completed in limit:-1:1
               index = completed + 1
               if cash[index] != neg
                   hold[index] = max(
                       hold[index],
                       cash[index] - price,
                   )
               end
               previous_index = completed
               if hold[previous_index] != neg
                   cash[index] = max(
                       cash[index],
                       hold[previous_index] + price,
                   )
               end
           end
           hold[1] = max(hold[1], cash[1] - price)
       end

       return Int(maximum(cash))
   end

R
~

.. code-block:: r

   max_profit <- function(k, prices) {
     n <- length(prices)
     k <- as.integer(k)
     if (k <= 0L || n < 2L) {
       return(0)
     }
     if (k >= n %/% 2L) {
       total <- 0
       for (day in 2:n) {
         total <- total + max(0, prices[day] - prices[day - 1L])
       }
       return(total)
     }

     limit <- k
     cash <- rep(-Inf, limit + 1L)
     hold <- rep(-Inf, limit + 1L)
     cash[1L] <- 0

     for (price in prices) {
       for (completed in seq.int(limit, 1L, by = -1L)) {
         index <- completed + 1L
         if (is.finite(cash[index])) {
           hold[index] <- max(hold[index], cash[index] - price)
         }
         previous_index <- completed
         if (is.finite(hold[previous_index])) {
           cash[index] <- max(
             cash[index],
             hold[previous_index] + price
           )
         }
       }
       hold[1L] <- max(hold[1L], cash[1L] - price)
     }

     max(cash)
   }

静态审查记录
------------

本题题解代码未运行、未编译、未对拍。
完成了以下人工推演与静态语义检查：

* ``k=2, [2,4,1]``：``floor(3/2)=1``，进入无限交易分支，只收入 ``4-2=2``；
* ``k=2, [3,2,6,5,0,3]``：有限分支最终可形成 ``2->6`` 与 ``0->3``，答案 7；
* ``k=1`` 的同一序列只允许一个卖出完成坐标，最大值为 4；
* ``k=0`` 和单日数组在分配状态前直接返回 0；
* 单调上升序列在无限分支中把连续正差相加，等于首尾差；
* 单调下降序列没有正差，返回 0；

对 ``k=2, [3,2,6,5,0,3]`` 还逐日记录了有限分支状态；
每个向量按 ``t=0,1,2`` 排列：

.. list-table::
   :header-rows: 1

   * - 时刻
     - ``cash``
     - ``hold``
   * - 空前缀
     - ``[0, NEG, NEG]``
     - ``[NEG, NEG, NEG]``
   * - 价格 3 后
     - ``[0, NEG, NEG]``
     - ``[-3, NEG, NEG]``
   * - 价格 2 后
     - ``[0, -1, NEG]``
     - ``[-2, NEG, NEG]``
   * - 价格 6 后
     - ``[0, 4, NEG]``
     - ``[-2, -7, NEG]``
   * - 价格 5 后
     - ``[0, 4, -2]``
     - ``[-2, -1, NEG]``
   * - 价格 0 后
     - ``[0, 4, -1]``
     - ``[0, 4, -2]``
   * - 价格 3 后
     - ``[0, 4, 7]``
     - ``[0, 4, -2]``

表中负利润状态仍然合法，因为状态要求“恰好”完成指定次数；
最终对所有 ``cash`` 取最大，所以不会强迫采用亏损交易。

* 十语言有限分支都按交易数递减，先更新 ``hold[t]`` 再更新 ``cash[t]``；
* 固定宽语言对 ``NEG`` 做可达性检查后才加减价格，
  没有对类型最小值直接运算；
* C 只有一个公开 ``maxProfit`` 入口；两次分配、部分失败清理、正常释放和
  ``-1`` 资源错误标记逐项核对；
* C 有限分支 ``limit<=100``，每组至多分配 101 个 ``long long``，
  容量乘法在 ``size_t`` 中有界；
* Julia 使用 ``limit:-1:1``；R 仅在 ``limit>=1`` 的有限分支构造
  同方向递减 ``seq.int``；
* TypeScript 对 ``-Infinity`` 与有限价格做加减仍得到 ``-Infinity``；
  R 则在加减前检查 ``is.finite``；
* 根据 ``answer<=100000``、可达状态绝对值 ``<=201000``，逐项核对了
  平台 ``int`` 转换和 TypeScript/R 精确整数域；
* 所有实现只读价格数组，不排序、不交换、不保存交易路径。

剩余风险：十语言代码没有在目标平台实际编译或执行；
平台签名、标准库版本和资源失败行为仅完成静态核对。

边界、失败路径与易错点
----------------------

* ``k`` 表示完整交易数量，不是操作次数；
* 买入不增加 ``t``，卖出才把 ``t-1`` 推进为 ``t``；
* 最终答案必须从空仓 ``cash`` 状态取得，不能返回仍持股的 ``hold``；
* 使用“恰好 t 次”状态时，答案是所有 ``cash[0..limit]`` 的最大值，
  而不是强迫完成 ``limit`` 次；
* 不可达状态不能初始化为 0，否则会允许无成本持股或凭空完成卖出；
* 使用最小整数作为负无穷后直接减价格可能溢出；
  应使用安全哨兵并检查可达性；
* 原地更新若改成递增 ``t``，``cash[t]`` 可能读到当天刚更新的
  ``hold[t-1]``，破坏前一日语义；
* 无限交易贪心只能在 ``k>=floor(n/2)`` 时使用；
  有限小 ``k`` 不能收集所有上涨段；
* C 的 ``-1`` 是资源失败信号，不是题目输入下的合法利润。

知识更新与关联题目
------------------

本题新增：

* **完成卖出次数坐标**：买入保持 ``t``，卖出把 ``t-1`` 推进到 ``t``；
* **精确状态与不可达哨兵**：区分恰好完成不同交易数的策略集合；
* **约束失效退化**：交易额度达到物理可完成上限时，
  动态规划退化为正相邻差贪心；
* **固定宽负无穷安全**：只对可达状态执行价格加减。

本题强化：

* **正相邻差最优性**：复用 0122 的望远镜上界与上涨段可达性，
  但只在交易额度失效时启用；
* **逆序滚动更新**：延续 0115、0119、0174 的“依赖方向决定覆盖顺序”，
  本题同时保护
  ``cash[t]`` 与 ``hold[t-1]`` 两类旧状态；
* **股票数值与空策略边界**：延续 0121–0123 的非负答案基线，
  并给出当前 ``k`` 与价格范围下的答案和中间状态上界。

关联题目：

* 0121 Best Time to Buy and Sell Stock：一次交易；
* 0122 Best Time to Buy and Sell Stock II：无限交易，本题的大 ``k`` 分支；
* 0123 Best Time to Buy and Sell Stock III：固定两次交易，可把本题数组状态展开成四个阶段；
* 0309 Best Time to Buy and Sell Stock with Cooldown：在持仓/空仓状态上增加冷却约束；
* 0714 Best Time to Buy and Sell Stock with Transaction Fee：在卖出或买入转移中加入手续费。

自检问题
--------

#. 为什么最多只能完成 ``floor(n/2)`` 笔交易？
#. ``hold[t]`` 中的 ``t`` 表示什么，买入时为什么不增加？
#. 为什么有限分支必须按 ``t`` 递减原地更新？
#. 为什么最终返回所有 ``cash[t]`` 的最大值？
#. 大 ``k`` 时，任意交易利润为什么不超过对应区间正相邻差之和？
#. 为什么不能对 ``LLONG_MIN`` 直接减价格？

答案要点
~~~~~~~~

#. 每笔交易至少需要一个买入日和一个更晚卖出日，两笔交易不能共享持仓，因此最多有 ``floor(n/2)`` 对日期。
#. ``t`` 是已经完成的卖出次数；买入只开始下一段持仓，交易尚未完成。
#. ``cash[t]`` 要读取旧值，``cash[t]`` 的卖出转移要读取旧 ``hold[t-1]``；递减顺序保证两者尚未被当天改写。
#. 状态使用“恰好 t 次”，题目要求“至多 k 次”，少做交易也可能最优。
#. 一笔长交易利润等于沿途相邻差之和，去掉其中负差只会增大；所有交易区间互不重叠。
#. 类型最小值没有向下余量，继续减正数会发生有符号溢出；安全哨兵与可达性检查避免该运算。
