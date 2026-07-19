0121. Best Time to Buy and Sell Stock
=====================================

题目信息
--------

:题号: 0121
:难度: Easy
:主题: 数组、单次交易、前缀最小值、单次扫描
:原题: `LeetCode 0121
   <https://leetcode.com/problems/best-time-to-buy-and-sell-stock/>`_
:访问状态: Available
:教学重点: 固定卖出日、前缀最低买入价、交易先后约束、零利润边界

题目重述
--------

给定按日期排列的股票价格数组 ``prices``。``prices[day]`` 表示第 ``day`` 天的价格。
最多完成一次交易：先在某一天买入一股，再在严格更晚的一天卖出。
返回能够获得的最大利润；若所有合法交易都会亏损，则返回 ``0``，表示不交易。

题目保证：

* ``1 <= len(prices) <= 100000``；
* ``0 <= prices[day] <= 10000``；
* 输入顺序就是时间顺序，算法不得排序；
* 本文实现只读输入，不修改价格数组。

自建示例
--------

存在盈利机会
~~~~~~~~~~~~

.. code-block:: text

   prices = [7, 1, 5, 3, 6, 4]

   第 1 天以 1 买入，第 4 天以 6 卖出。
   最大利润 = 6 - 1 = 5

价格持续下降
~~~~~~~~~~~~

.. code-block:: text

   prices = [7, 6, 4, 3, 1]
   输出：0

任何买入后都只能以更低价格卖出，因此最优选择是不交易。

最低价出现在最后一天
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   prices = [5, 4, 3, 2, 1]

最后一天的 ``1`` 不能作为买入价再与更早价格配对，因为卖出日必须更晚。

单元素
~~~~~~

``prices = [8]`` 时没有一对合法日期，返回 ``0``。

问题抽象
--------

需要在所有 ``buy < sell`` 的日期对中最大化：

.. code-block:: text

   prices[sell] - prices[buy]

若固定卖出日 ``sell``，最佳买入日不需要枚举全部更早日期，只需要知道卖出日前的最低价格：

.. code-block:: text

   lowest_before_sell = min(prices[0 .. sell - 1])
   best_for_sell = prices[sell] - lowest_before_sell

因此扫描到每个卖出日时，维护两个标量即可：

* ``lowest``：当前日期之前见过的最低价格；
* ``best``：已经完整考察的卖出日中最大非负利润。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 前缀最低价单次扫描
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接消除重复买入价搜索
   * - 枚举买入日和卖出日
     - ``O(n^2)``
     - ``O(1)``
     - 直观基准；重复比较同一前缀
   * - 对相邻差分使用最大子数组
     - ``O(n)``
     - ``O(1)``
     - 等价转换；本题不需要额外构造差分数组

这里 ``n`` 是价格数量。

主解法：前缀最低价单次扫描
--------------------------

状态定义与更新顺序
~~~~~~~~~~~~~~~~~~

初始化：

.. code-block:: text

   lowest = prices[0]
   best = 0

从第 ``1`` 天开始，把当前日期视为候选卖出日：

.. code-block:: text

   candidate = prices[day] - lowest
   best = max(best, candidate)
   lowest = min(lowest, prices[day])

先计算卖出候选，再把当天价格加入 ``lowest``。这个顺序让 ``lowest`` 明确只来自严格更早日期，
直接满足“先买后卖”的时间约束。

若先更新 ``lowest``，同一天买卖只会产生 ``0``，最终数值通常仍正确；本文不采用该写法，
因为它把合法日期约束隐藏在“零利润不影响答案”这一额外观察中，证明不够直接。

核心不变量
~~~~~~~~~~

处理第 ``day`` 天之前保持：

* ``lowest = min(prices[0 .. day - 1])``；
* ``best`` 等于所有 ``0 <= buy < sell < day`` 合法交易利润与 ``0`` 的最大值；
* 输入数组没有被修改。

当前日作为卖出日时，``prices[day] - lowest`` 是所有以 ``day`` 卖出的合法交易中的最大利润。
更新 ``best`` 后，所有卖出日不晚于 ``day`` 的交易都已覆盖。
最后再用当天价格更新 ``lowest``，为下一日建立新的前缀最小值。

为什么最低价格足够
~~~~~~~~~~~~~~~~~~

固定卖出价格 ``prices[day]`` 后，利润随买入价格减小而增大。
更早日期的身份、出现次数和顺序都不再影响当前卖出日，只需要其中最小值。

这个摘要不会丢失最优解：若最优交易在 ``buy`` 买入、在 ``sell`` 卖出，
扫描到 ``sell`` 时 ``lowest <= prices[buy]``。因此当前候选利润至少等于该交易利润；
同时 ``lowest`` 本身来自某个更早合法日期，所以候选也是可实现的交易。

正确性依据
~~~~~~~~~~

**初始化。** 第 0 天之前没有合法交易。令 ``lowest = prices[0]``，它是首个前缀的最低价格；
令 ``best = 0``，对应不交易。

**保持。** 假设进入第 ``day`` 轮时不变量成立。所有以 ``day`` 为卖出日的合法交易，
买入价都来自 ``prices[0 .. day - 1]``。其中最低价 ``lowest`` 产生该卖出日的最大利润，
所以 ``candidate`` 完整代表这一组交易。``best`` 与 ``candidate`` 取较大值后，
覆盖了所有卖出日不晚于 ``day`` 的合法交易。随后更新 ``lowest``，得到
``min(prices[0 .. day])``，不变量对下一轮继续成立。

**合法性。** 候选买入价只来自当前卖出日前缀，因此买入日严格早于卖出日。

**完整性。** 任意合法交易都有唯一卖出日；扫描该卖出日时，它被对应候选组覆盖。

**最优性。** ``best`` 只由合法交易利润和 ``0`` 更新，不会超过真实最优值；
每个合法交易又都被覆盖，因此最终 ``best`` 不小于真实最优值，两者相等。

**终止性。** 日期下标单调增加并在数组末尾停止。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个价格只读取常数次，时间复杂度 ``O(n)``；
* 只维护 ``lowest``、``best`` 和当前候选，算法额外空间 ``O(1)``；
* 返回一个整数，返回载荷 ``O(1)``；
* 输入数组不排序、不复制、不修改；
* 最大可能利润不超过 ``10000``，平台 ``int``、Rust ``i32`` 和 JavaScript ``number`` 都安全；
* Rust 平台签名按值接收 ``Vec<i32>``，调用边界取得所有权，函数内部仍只读元素；
* R 的循环和标量更新不修改调用者向量，额外状态保持常数规模。

核心语言实现
------------

C
~

.. code-block:: c

   int maxProfit(int *prices, int pricesSize) {
       if (pricesSize <= 1) {
           return 0;
       }

       int lowest = prices[0];
       int best = 0;

       for (int day = 1; day < pricesSize; ++day) {
           // lowest 只包含严格早于当前卖出日的价格。
           const int candidate = prices[day] - lowest;
           if (candidate > best) {
               best = candidate;
           }
           if (prices[day] < lowest) {
               lowest = prices[day];
           }
       }

       return best;
   }

C 平台接口借用 ``prices``，函数不修改数组，也不分配内存。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int maxProfit(std::vector<int>& prices) {
           int lowest = prices.front();
           int best = 0;

           for (std::size_t day = 1; day < prices.size(); ++day) {
               // 当前候选固定今天卖出，买入价来自更早前缀。
               best = std::max(best, prices[day] - lowest);
               lowest = std::min(lowest, prices[day]);
           }

           return best;
       }
   };

引用参数符合平台签名；实现只读元素，没有利用可变引用修改输入。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProfit(self, prices: list[int]) -> int:
           lowest = prices[0]
           best = 0

           for day in range(1, len(prices)):
               price = prices[day]
               # 先把今天作为卖出日，再允许它成为未来买入价。
               best = max(best, price - lowest)
               lowest = min(lowest, price)

           return best

正式实现使用下标扫描。若写成 ``for price in prices[1:]``，Python 会物化一个 ``O(n)`` 切片，
就不能继续声称完整额外空间为 ``O(1)``。

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProfit(int[] prices) {
           int lowest = prices[0];
           int best = 0;

           for (int day = 1; day < prices.length; ++day) {
               // 当前利润只与历史最低买入价有关。
               best = Math.max(best, prices[day] - lowest);
               lowest = Math.min(lowest, prices[day]);
           }

           return best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(prices: Vec<i32>) -> i32 {
           let mut lowest = prices[0];
           let mut best = 0;

           for &price in prices.iter().skip(1) {
               // 迭代器借用元素，不复制整个向量。
               best = best.max(price - lowest);
               lowest = lowest.min(price);
           }

           best
       }
   }

``prices`` 被移动进函数；``iter().skip(1)`` 只创建常数大小迭代器状态。

Go
~~

.. code-block:: go

   func maxProfit(prices []int) int {
       lowest := prices[0]
       best := 0

       for day := 1; day < len(prices); day++ {
           candidate := prices[day] - lowest
           if candidate > best {
               best = candidate
           }
           if prices[day] < lowest {
               lowest = prices[day]
           }
       }

       return best
   }

切片参数复制的是描述符，底层数组共享；实现不写元素。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(prices: number[]): number {
       let lowest = prices[0];
       let best = 0;

       for (let day = 1; day < prices.length; day += 1) {
           // number 在题目上界内保持精确整数。
           best = Math.max(best, prices[day] - lowest);
           lowest = Math.min(lowest, prices[day]);
       }

       return best;
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MaxProfit(int[] prices) {
           int lowest = prices[0];
           int best = 0;

           for (int day = 1; day < prices.Length; ++day) {
               best = Math.Max(best, prices[day] - lowest);
               lowest = Math.Min(lowest, prices[day]);
           }

           return best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_profit(prices::Vector{Int})::Int
       lowest = prices[1]
       best = 0

       for day in 2:length(prices)
           # Julia 使用一基下标；当前日先作为卖出日。
           best = max(best, prices[day] - lowest)
           lowest = min(lowest, prices[day])
       end

       return best
   end

题目保证至少一个价格。长度为 1 时 ``2:1`` 是空 ``UnitRange``，循环不会执行。

R
~

.. code-block:: r

   max_profit <- function(prices) {
     lowest <- prices[[1L]]
     best <- 0

     if (length(prices) >= 2L) {
       for (day in seq.int(2L, length(prices))) {
         price <- prices[[day]]
         best <- max(best, price - lowest)
         lowest <- min(lowest, price)
       }
     }

     best
   }

R 先判断长度再构造递增序列，避免单元素时产生 ``2:1`` 的非空反向序列。

验证计划与证据
--------------

* 固定用例覆盖单元素、持续下降、持续上升、重复最低价、零价格和普通波动；
* 独立基准枚举所有 ``buy < sell`` 日期对并与 ``0`` 取最大值；
* 随机生成合法长度和价格，比较单次扫描与二重枚举；
* 调用前后比较输入，确认十语言主实现不修改价格序列；
* Python 执行 3000 组随机对拍；
* C/C++、Java、Go、TypeScript 执行固定与 500 组随机对拍；
* C/C++ 额外通过严格警告、AddressSanitizer 和 UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时记录接口、索引、数值和循环边界静态检查。

关键边界
--------

* 买入日必须严格早于卖出日；
* 一天或持续下降时返回 ``0``，不能返回负利润；
* 最低价格出现在最后一天时不能与更早卖出日反向配对；
* 重复最低价只影响买入日期身份，不影响最大利润；
* 输入时间顺序不能排序，否则会改变交易合法性；
* Python 切片会改变空间复杂度，正式实现使用下标扫描。

易错点
------

* 把历史最高价减当前价格，计算成下跌幅度；
* 用全局最小值和全局最大值相减，忽略最小值可能出现在最大值之后；
* 初始化 ``best`` 为负数，导致无盈利时返回亏损；
* 每天重新扫描前缀最低价，使时间退化为 ``O(n^2)``；
* 声称 ``O(1)`` 空间却在 Python 中创建 ``prices[1:]``；
* 修改或排序输入后仍声称只读。

本题新增知识
------------

* 固定卖出日后，用前缀最低价压缩全部买入候选；
* 更新顺序可以直接编码“买入日严格早于卖出日”；
* ``best = 0`` 把“不交易”作为合法基线；
* 单次扫描同时完成局部候选求解和全局最优汇总。

本题强化知识
------------

* 摘要状态必须证明不会丢失最优解；
* 前缀极值是消除重复搜索的常见手段；
* 复杂度声明要包含语言级切片和输入复制；
* 数值上界应从题目约束推导，而不是依赖“通常不会溢出”。

关联题目
--------

* `0122. Best Time to Buy and Sell Stock II
  <0122-best-time-to-buy-and-sell-stock-ii.rst>`_：交易次数不限，可把所有正相邻涨幅累加；
* `0053. Maximum Subarray <../0001-0100/0053-maximum-subarray.rst>`_：在相邻差分上求最大连续和；
* `0120. Triangle <0120-triangle.rst>`_：同样用少量状态替代重复枚举。

最小自检
--------

#. 扫描到第 ``day`` 天时，``lowest`` 应包含哪些日期？
#. 为什么全局最低价减全局最高价不一定合法？
#. 持续下降时为什么答案是 ``0``？

答案要点
--------

#. 它只包含 ``0`` 到 ``day - 1`` 的价格，保证买入早于当前卖出日。
#. 全局最低价可能出现在最高价之后，违反交易时间顺序。
#. 不交易是合法选择，优于任何负利润交易。
