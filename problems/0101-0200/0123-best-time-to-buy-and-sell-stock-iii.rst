0123. Best Time to Buy and Sell Stock III
=========================================

题目信息
--------

:题号: 0123
:难度: Hard
:主题: 数组、有限交易次数、动态规划、状态机、滚动状态
:原题: `LeetCode 0123
   <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/>`_
:访问状态: Available
:教学重点: 两次交易阶段、持仓与空仓状态、旧状态快照、常数空间压缩

题目重述
--------

给定按日期排列的股票价格数组 ``prices``。每天最多持有一股股票，可以完成至多两次交易；
每次交易都必须先买入再卖出，第二次买入只能发生在第一次卖出之后。返回能够获得的最大总利润。

题目保证：

* ``1 <= len(prices) <= 100000``；
* ``0 <= prices[day] <= 100000``；
* 可以少做于两次交易，也可以完全不交易；
* 任意时刻最多持有一股，不能让两笔交易的持仓区间重叠；
* 输入顺序就是时间顺序，本文实现只读数组。

自建示例
--------

两段独立上涨
~~~~~~~~~~~~

.. code-block:: text

   prices = [3, 3, 5, 0, 0, 3, 1, 4]

   第一次交易：0 买入，3 卖出，利润 3
   第二次交易：1 买入，4 卖出，利润 3
   输出：6

一次交易已经最优
~~~~~~~~~~~~~~~~

.. code-block:: text

   prices = [1, 2, 3, 4, 5]
   输出：4

虽然最多允许两次交易，直接从 1 持有到 5 已经达到全部上涨幅度。算法不能强迫完成第二次交易。

两次交易优于一次
~~~~~~~~~~~~~~~~

.. code-block:: text

   prices = [1, 4, 2, 7]

   一次交易最多得到 6：1 买入，7 卖出。
   两次交易得到 3 + 5 = 8：1->4，2->7。

持续下降
~~~~~~~~

``prices = [7, 6, 4, 3, 1]`` 时任何交易都会亏损，返回 ``0``。

单元素
~~~~~~

``prices = [5]`` 时没有合法卖出日，返回 ``0``。

问题抽象
--------

0121 只有一次交易，可以把历史压缩成一个前缀最低买入价；0122 交易次数不限，
可以把每个正相邻涨幅都收入答案。当前题恰好允许两次交易，既不能只记一个最低价格，
也不能无条件收集所有上涨段。

扫描到某一天后，策略只需要区分四个阶段：

.. code-block:: text

   hold1  第一次买入后，当前持有股票
   cash1  至多完成一次交易，当前不持股
   hold2  至多使用两次买入，当前持有股票
   cash2  至多完成两次交易，当前不持股

每个状态保存该阶段能够拥有的最大现金。买入会减去当天价格，卖出会加上当天价格。
状态只依赖前一天的四个值，因此完整二维 DP 可以压缩为四个标量。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 四阶段滚动状态机
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接表达两次交易上限
   * - 前缀一次交易 + 后缀一次交易
     - ``O(n)``
     - ``O(n)``
     - 分割点直观，需保存两个数组或一个数组加反向扫描
   * - 通用 ``k`` 次交易 DP
     - ``O(kn)``
     - ``O(k)`` 或 ``O(kn)``
     - 可推广到 0188；本题 ``k=2`` 可展开为四个标量
   * - 枚举两笔交易的四个日期
     - ``O(n^4)``
     - ``O(1)``
     - 只适合作为极小输入的独立基准

这里 ``n`` 是价格数量。

主解法：四阶段滚动状态机
------------------------

状态语义
~~~~~~~~

处理完某个日期前缀后：

``hold1``
   在该前缀内至多执行第一次买入、当前持有一股时的最大现金。

``cash1``
   在该前缀内至多完成一次交易、当前不持股时的最大现金。

``hold2``
   在该前缀内至多执行两次买入、当前持有一股时的最大现金。
   它允许实际只进行第一次买入，因为“至多两次”包含更少操作的策略。

``cash2``
   在该前缀内至多完成两次交易、当前不持股时的最大现金。
   它同样包含零次或一次交易，因此最终可以直接返回 ``cash2``。

这种“至多”语义避免了不可能状态哨兵。第 0 天初始化为：

.. code-block:: text

   hold1 = -prices[0]
   cash1 = 0
   hold2 = -prices[0]
   cash2 = 0

``hold2 = -prices[0]`` 不是声称已经完成第一笔交易；它表示只做一次买入的策略也属于
“至多执行两次买入且当前持股”的集合。状态集合按操作上限嵌套，保证少做交易仍然可选。

一天的四个转移
~~~~~~~~~~~~~~

设当天价格为 ``price``，旧状态来自昨天：

.. code-block:: text

   next_hold1 = max(old_hold1, -price)
   next_cash1 = max(old_cash1, old_hold1 + price)
   next_hold2 = max(old_hold2, old_cash1 - price)
   next_cash2 = max(old_cash2, old_hold2 + price)

每个状态只有两类来源：

* 保持昨天的阶段，不在今天操作；
* 从紧邻的前一阶段执行一次合法买入或卖出。

``next_hold2`` 只能从昨天的 ``cash1`` 买入，确保第二次持仓开始前已经结束第一段持仓；
``next_cash2`` 只能从昨天的 ``hold2`` 卖出，确保卖出前真实持有股票。

为什么使用旧状态快照
~~~~~~~~~~~~~~~~~~~~

代码先保存四个旧值，再统一计算新值。这样每个转移都只使用前一天状态，明确保证一天最多执行一个动作，
不会在同一轮中先卖出又立即用更新后的现金买入。

很多短代码按 ``hold1 -> cash1 -> hold2 -> cash2`` 原地更新。由于同日卖出再买入的净变化为零，
这种写法通常也得到相同最优值；它把正确性依赖在额外等价性上。本文使用快照，
让状态定义、时间边界和代码逐项一致，不需要隐藏的同日操作论证。

核心不变量
~~~~~~~~~~

处理完第 ``day`` 天后保持：

* 四个变量分别等于其状态语义覆盖的全部合法策略中的最大现金；
* ``cash1 >= 0``、``cash2 >= cash1``，因为不交易和少做交易始终保留；
* ``hold2 >= hold1``，因为第一次买入策略也属于第二持仓状态的“至多”集合；
* 所有持仓策略都只持有一股；
* 第二次持仓的来源必定先经过一次空仓状态，交易区间不会重叠；
* 输入数组未被修改。

为什么四个标量足够
~~~~~~~~~~~~~~~~~~

未来收益只取决于当前是否持股、已经使用到哪个交易阶段以及当前现金最大值。
对于处于同一阶段的两种历史策略，现金较少者在任何未来操作序列下都会始终不优于现金较多者；
因此可以安全丢弃具体买卖日期，只保留最大现金。

这是一种支配关系：相同阶段下，较大现金状态支配较小现金状态。
四个阶段已经包含决定未来合法动作的全部信息，所以摘要不会丢失最优解。

正确性依据
~~~~~~~~~~

对已处理日期数进行归纳。

**基础情况。** 只处理第 0 天时，持股状态的唯一最优选择是以 ``prices[0]`` 买入，现金为负价格；
空仓状态可以选择不交易，现金为 ``0``。由于状态使用“至多”操作次数，
同一买入策略同时属于 ``hold1`` 和 ``hold2``，四个初始化值准确。

**归纳步骤。** 假设昨天四个旧状态已经分别覆盖对应阶段的全部合法策略。
考虑今天结束时的任一最优策略：

* 若处于 ``hold1``，今天要么不操作，来源是 ``old_hold1``；要么今天第一次买入，来源是初始现金 ``0``，
  结果为 ``-price``。两者取大覆盖全部可能。
* 若处于 ``cash1``，今天要么保持空仓，来源是 ``old_cash1``；要么卖出昨天持有的第一股，
  来源是 ``old_hold1 + price``。没有其他合法方式进入该阶段。
* 若处于 ``hold2``，今天要么继续持有，来源是 ``old_hold2``；
  要么在至多一次已完成交易的空仓状态上买入，来源是 ``old_cash1 - price``。
  该来源保证第二段持仓与第一段不重叠。
* 若处于 ``cash2``，今天要么继续空仓，来源是 ``old_cash2``；要么卖出第二段持仓，
  来源是 ``old_hold2 + price``。

每个转移都在全部且仅有的合法来源中取最大值，所以新状态继续满足语义。

**合法性。** 买入转移只从空仓状态进入持仓状态，卖出转移只从持仓状态进入空仓状态；
阶段只能向右推进，最多完成两次交易，且不会同时持有两股。

**完整性。** 任意合法策略按最后一天是否操作分类，
必然落入“保持旧状态”或“执行相邻阶段的一次动作”之一，因此没有策略被遗漏。

**最优性。** 每个状态只保留合法策略的最大现金；归纳转移覆盖所有合法来源，
故 ``cash2`` 等于至多两次交易且最终空仓的最大利润。

**终止性。** 日期下标严格递增，处理完有限数组后停止。

复杂度与数值边界
~~~~~~~~~~~~~~~~

* 每天执行常数次比较和加减，时间复杂度 ``O(n)``；
* 四个旧状态和四个新状态均为常数数量，算法额外空间 ``O(1)``；
* 返回一个整数，返回载荷 ``O(1)``；
* 输入不排序、不复制、不修改，适配器没有额外物化；
* 两次交易的最大总利润不超过 ``200000``，32 位有符号整数足够；
* C、C++、Java、Rust、Go 和 C# 仍使用 64 位中间状态，使状态现金语义不依赖更窄平台整数；
* TypeScript ``number`` 在该输入域内保持精确整数；
* Julia 使用宿主 ``Int``，R 使用双精度整数精确区间，当前上界均安全。

核心语言实现
------------

C
~

.. code-block:: c

   int maxProfit(int *prices, int pricesSize) {
       if (pricesSize <= 1) {
           return 0;
       }

       long long hold1 = -((long long)prices[0]);
       long long cash1 = 0;
       long long hold2 = -((long long)prices[0]);
       long long cash2 = 0;

       for (int day = 1; day < pricesSize; ++day) {
           const long long price = prices[day];
           const long long oldHold1 = hold1;
           const long long oldCash1 = cash1;
           const long long oldHold2 = hold2;
           const long long oldCash2 = cash2;

           hold1 = oldHold1 > -price ? oldHold1 : -price;
           cash1 = oldCash1 > oldHold1 + price
               ? oldCash1
               : oldHold1 + price;
           hold2 = oldHold2 > oldCash1 - price
               ? oldHold2
               : oldCash1 - price;
           cash2 = oldCash2 > oldHold2 + price
               ? oldCash2
               : oldHold2 + price;
       }

       return (int)cash2;
   }

C 使用 ``long long`` 保存现金状态；返回前根据题目上界安全转换为 ``int``。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int maxProfit(std::vector<int>& prices) {
           if (prices.size() <= 1) {
               return 0;
           }

           long long hold1 = -static_cast<long long>(prices[0]);
           long long cash1 = 0;
           long long hold2 = hold1;
           long long cash2 = 0;

           for (std::size_t day = 1; day < prices.size(); ++day) {
               const long long price = prices[day];
               const long long oldHold1 = hold1;
               const long long oldCash1 = cash1;
               const long long oldHold2 = hold2;
               const long long oldCash2 = cash2;

               hold1 = std::max(oldHold1, -price);
               cash1 = std::max(oldCash1, oldHold1 + price);
               hold2 = std::max(oldHold2, oldCash1 - price);
               cash2 = std::max(oldCash2, oldHold2 + price);
           }

           return static_cast<int>(cash2);
       }
   };

Python
~~~~~~

Python 使用下标迭代，避免 ``prices[1:]`` 物化额外列表。

.. code-block:: python

   class Solution:
       def maxProfit(self, prices: list[int]) -> int:
           if len(prices) <= 1:
               return 0

           hold1 = -prices[0]
           cash1 = 0
           hold2 = -prices[0]
           cash2 = 0

           for day in range(1, len(prices)):
               price = prices[day]
               old_hold1 = hold1
               old_cash1 = cash1
               old_hold2 = hold2
               old_cash2 = cash2

               hold1 = max(old_hold1, -price)
               cash1 = max(old_cash1, old_hold1 + price)
               hold2 = max(old_hold2, old_cash1 - price)
               cash2 = max(old_cash2, old_hold2 + price)

           return cash2

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProfit(int[] prices) {
           if (prices.length <= 1) {
               return 0;
           }

           long hold1 = -((long)prices[0]);
           long cash1 = 0;
           long hold2 = hold1;
           long cash2 = 0;

           for (int day = 1; day < prices.length; ++day) {
               long price = prices[day];
               long oldHold1 = hold1;
               long oldCash1 = cash1;
               long oldHold2 = hold2;
               long oldCash2 = cash2;

               hold1 = Math.max(oldHold1, -price);
               cash1 = Math.max(oldCash1, oldHold1 + price);
               hold2 = Math.max(oldHold2, oldCash1 - price);
               cash2 = Math.max(oldCash2, oldHold2 + price);
           }

           return (int)cash2;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(prices: Vec<i32>) -> i32 {
           if prices.len() <= 1 {
               return 0;
           }

           let mut hold1 = -i64::from(prices[0]);
           let mut cash1 = 0_i64;
           let mut hold2 = hold1;
           let mut cash2 = 0_i64;

           for &value in prices.iter().skip(1) {
               let price = i64::from(value);
               let old_hold1 = hold1;
               let old_cash1 = cash1;
               let old_hold2 = hold2;
               let old_cash2 = cash2;

               hold1 = old_hold1.max(-price);
               cash1 = old_cash1.max(old_hold1 + price);
               hold2 = old_hold2.max(old_cash1 - price);
               cash2 = old_cash2.max(old_hold2 + price);
           }

           cash2 as i32
       }
   }

Rust 平台签名按值取得 ``Vec<i32>`` 所有权；迭代器只借用元素，不产生价格副本数组。

Go
~~

.. code-block:: go

   func maxProfit(prices []int) int {
       if len(prices) <= 1 {
           return 0
       }

       hold1 := -int64(prices[0])
       cash1 := int64(0)
       hold2 := hold1
       cash2 := int64(0)

       for day := 1; day < len(prices); day++ {
           price := int64(prices[day])
           oldHold1 := hold1
           oldCash1 := cash1
           oldHold2 := hold2
           oldCash2 := cash2

           hold1 = maxInt64(oldHold1, -price)
           cash1 = maxInt64(oldCash1, oldHold1+price)
           hold2 = maxInt64(oldHold2, oldCash1-price)
           cash2 = maxInt64(oldCash2, oldHold2+price)
       }

       return int(cash2)
   }

   func maxInt64(left int64, right int64) int64 {
       if left > right {
           return left
       }
       return right
   }

Go 单独定义 ``int64`` 比较函数，避免依赖特定版本才提供的泛型辅助 API。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(prices: number[]): number {
       if (prices.length <= 1) {
           return 0;
       }

       let hold1 = -prices[0];
       let cash1 = 0;
       let hold2 = -prices[0];
       let cash2 = 0;

       for (let day = 1; day < prices.length; day += 1) {
           const price = prices[day];
           const oldHold1 = hold1;
           const oldCash1 = cash1;
           const oldHold2 = hold2;
           const oldCash2 = cash2;

           hold1 = Math.max(oldHold1, -price);
           cash1 = Math.max(oldCash1, oldHold1 + price);
           hold2 = Math.max(oldHold2, oldCash1 - price);
           cash2 = Math.max(oldCash2, oldHold2 + price);
       }

       return cash2;
   }

当前价格和利润上界远低于 ``Number.MAX_SAFE_INTEGER``，全部加减与比较保持精确整数语义。

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MaxProfit(int[] prices) {
           if (prices.Length <= 1) {
               return 0;
           }

           long hold1 = -((long)prices[0]);
           long cash1 = 0;
           long hold2 = hold1;
           long cash2 = 0;

           for (int day = 1; day < prices.Length; ++day) {
               long price = prices[day];
               long oldHold1 = hold1;
               long oldCash1 = cash1;
               long oldHold2 = hold2;
               long oldCash2 = cash2;

               hold1 = Math.Max(oldHold1, -price);
               cash1 = Math.Max(oldCash1, oldHold1 + price);
               hold2 = Math.Max(oldHold2, oldCash1 - price);
               cash2 = Math.Max(oldCash2, oldHold2 + price);
           }

           return (int)cash2;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_profit(prices::Vector{Int})::Int
       if length(prices) <= 1
           return 0
       end

       hold1 = -prices[1]
       cash1 = 0
       hold2 = -prices[1]
       cash2 = 0

       for day in 2:length(prices)
           price = prices[day]
           old_hold1 = hold1
           old_cash1 = cash1
           old_hold2 = hold2
           old_cash2 = cash2

           hold1 = max(old_hold1, -price)
           cash1 = max(old_cash1, old_hold1 + price)
           hold2 = max(old_hold2, old_cash1 - price)
           cash2 = max(old_cash2, old_hold2 + price)
       end

       return cash2
   end

Julia 使用一基下标；只有长度至少为 2 时才进入 ``2:length(prices)``，不会构造反向或越界范围。

R
~

.. code-block:: r

   max_profit <- function(prices) {
     if (length(prices) <= 1L) {
       return(0)
     }

     hold1 <- -prices[1L]
     cash1 <- 0
     hold2 <- -prices[1L]
     cash2 <- 0

     for (day in seq.int(2L, length(prices))) {
       price <- prices[day]
       old_hold1 <- hold1
       old_cash1 <- cash1
       old_hold2 <- hold2
       old_cash2 <- cash2

       hold1 <- max(old_hold1, -price)
       cash1 <- max(old_cash1, old_hold1 + price)
       hold2 <- max(old_hold2, old_cash1 - price)
       cash2 <- max(old_cash2, old_hold2 + price)
     }

     cash2
   }

R 的输入向量不被修改；四个标量使用普通局部绑定 ``<-``，没有递归共享状态或写时复制数组更新。

前缀与后缀分解的对照
--------------------

另一种直观方法把两笔交易按分割点 ``split`` 拆开：

.. code-block:: text

   left[split]  = [0 .. split] 内最多一次交易的最大利润
   right[split] = [split .. n-1] 内最多一次交易的最大利润
   answer = max(left[split] + right[split])

左侧可以复用 0121 的前缀最低价，右侧对称维护后缀最高价。分割点允许同时属于两侧，
但一侧交易可以为空；两笔真实持仓区间仍不会重叠。该方法证明较直观，代价是 ``O(n)`` 状态数组。
四阶段状态机把所有可能分割点隐式吸收到 ``cash1`` 与 ``hold2`` 中，进一步压缩为常数空间。

验证计划与证据
--------------

* 固定用例覆盖两段上涨、单段上涨、持续下降、重复价格、单元素和零价格；
* 独立基准枚举第一笔交易的买卖日以及第二笔交易的买卖日，同时允许任一交易为空；
* 对长度 1 至 7、价格域 0 至 4 的全部 97655 个数组进行穷举对拍；
* Python 另外执行 3000 组随机数组对拍，并检查输入调用前后相等；
* C/C++、Java、Go、TypeScript 分别执行固定用例与 500 组随机对拍；
* C/C++ 使用严格警告编译并执行 AddressSanitizer、UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时执行接口、索引、数值宽度、快照顺序和输入只读静态检查；
* RST 检查标题层级、十个正式语言代码块、相对链接和 100 列硬上限。

关键边界
--------

* 单元素没有合法卖出日，四个初始化状态最终返回零；
* 持续下降时所有卖出候选不优于保留空仓，答案保持零；
* 少于两次交易是合法策略，``cash2`` 必须继承 ``cash1`` 和零交易结果；
* 第二次买入只能从旧 ``cash1`` 转移，不能从仍持股的状态直接进入；
* 四个新状态必须统一读取旧快照，不能让正文宣称跨日转移而代码使用同轮新值；
* 输入日期顺序不可排序，否则会破坏买卖时间约束。

易错点
------

* 把题目误写成恰好两次交易，导致单调上涨或短数组返回错误；
* 只记录全局最低价，无法表达第一笔交易已经结束后再寻找第二次买入；
* 直接累加所有正涨幅，实际求成了 0122 的无限交易版本；
* ``hold2`` 初始化为不安全极小值后无保护地参与加法，造成溢出；
* 原地按错误顺序更新并在证明中忽略同一天多动作语义；
* 返回 ``cash1`` 或某个持股状态，而不是最终空仓的 ``cash2``。

本题新增知识
------------

* 有限交易次数可以展开为交替的持仓与空仓阶段状态；
* “至多”状态集合允许用合法少操作策略初始化后续阶段，避免不可能值哨兵；
* 相同阶段下较大现金支配较小现金，使全部历史压缩为一个最优标量；
* 旧状态快照把一天一次动作的时间边界直接编码进实现。

本题强化知识
------------

* 0121 的前缀最低价是单次交易状态的特例；
* 0122 的正差分贪心依赖交易次数不限，不能迁移到有限上限；
* 滚动 DP 的更新方向必须由真实依赖边决定；
* 标量返回仍需区分算法状态、输入适配和返回载荷。

关联题目
--------

* `0121. Best Time to Buy and Sell Stock
  <0121-best-time-to-buy-and-sell-stock.rst>`_：一次交易的前缀最低价；
* `0122. Best Time to Buy and Sell Stock II
  <0122-best-time-to-buy-and-sell-stock-ii.rst>`_：无限交易的正涨幅贪心；
* `0188. Best Time to Buy and Sell Stock IV
  <0188-best-time-to-buy-and-sell-stock-iv.rst>`_：把四阶段推广为 ``k`` 组买卖状态。

最小自检
--------

#. ``hold2`` 为什么可以在第 0 天初始化为 ``-prices[0]``？
#. 为什么转移必须从旧 ``cash1`` 进入新 ``hold2``？
#. ``cash2`` 为什么自然包含零次和一次交易的答案？
#. 使用旧状态快照解决了什么证明边界？

答案要点
--------

#. 状态定义是“至多两次买入且持股”，只做第一次买入的策略也属于该集合。
#. 第二次持仓必须在第一段持仓结束后开始，旧 ``cash1`` 表示昨天已经空仓且至多完成一笔交易。
#. 状态集合按操作上限嵌套；保持状态允许不执行第二笔交易，初始化又保留零交易利润。
#. 所有转移严格从前一天出发，代码不会在同一天连做卖出和买入，状态语义与时间约束一致。
