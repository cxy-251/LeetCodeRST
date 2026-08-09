0204. Count Primes
==================

题目信息
--------

:题号: 0204. 计数质数
:难度: Medium
:主题: 数论、质数、埃拉托斯特尼筛法
:原题: `LeetCode 0204 <https://leetcode.com/problems/count-primes/>`_
:重点: 统计严格小于 n 的质数，用一个质数一次性排除它的全部倍数

题目重述
--------

给定非负整数 ``n``，返回严格小于 ``n`` 的质数数量。质数是大于 ``1`` 且只有 ``1`` 和自身
两个正因数的整数；``0``、``1`` 都不是质数。统计范围是半开区间 ``[0, n)``，所以即使
``n`` 本身是质数，也不能计入答案。

输入满足 ``0 <= n <= 5 * 10^6``。函数只返回数量，不需要返回质数列表，也不修改输入。

自建示例
--------

上界本身不参与统计：

.. code-block:: text

   输入：n = 12
   输出：5
   解释：2、3、5、7、11 小于 12；12 不在统计范围内。

最小的非零答案：

.. code-block:: text

   输入：n = 3
   输出：1
   解释：严格小于 3 的质数只有 2。

空范围和只有非质数的范围：

.. code-block:: text

   输入：n = 0 或 n = 2
   输出：0

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int countPrimes(int n) {
           return countBySieve(n);
       }

   private:
       bool isPrimeByTrialDivision(int value) {
           if (value < 2) return false;

           for (int factor = 2; factor <= (value - 1) / factor; ++factor) {
               if (value % factor == 0) return false;
           }
           return true;
       }

       int countByTrialDivision(int n) {
           int count = 0;
           for (int value = 2; value < n; ++value) {
               if (isPrimeByTrialDivision(value)) ++count;
           }
           return count;
       }

       int countBySieve(int n) {
           if (n <= 2) return 0;

           std::vector<bool> composite(n, false);
           composite[0] = composite[1] = true;

           for (int prime = 2; prime <= (n - 1) / prime; ++prime) {
               if (composite[prime]) continue;

               for (long long multiple = 1LL * prime * prime;
                    multiple < n;
                    multiple += prime) {
                   composite[static_cast<int>(multiple)] = true;
               }
           }

           int count = 0;
           for (int value = 2; value < n; ++value) {
               if (!composite[value]) ++count;
           }
           return count;
       }
   };

题解
----

逐个判质数的直接搜索
~~~~~~~~~~~~~~~~~~~~~~

最直接的办法把每个候选 ``value`` 单独判断：尝试用 ``2`` 到
``sqrt(value)`` 的整数去除它，只要找到一个因数就判定为合数；若一直没有整除，才是质数。
``countByTrialDivision`` 正是这条基线。只检查到平方根是安全的，因为若 ``value = a*b``，
两个因子不可能都大于 ``sqrt(value)``。

这条方法对单个数没有多余判断，但对整个范围重复使用了相同信息。例如知道 2 是质数后，
``4、6、8、10`` 等所有偶数都已经可以一次排除，试除法却仍会分别检查它们。若对每个候选
独立试除，时间约为 ``O(n sqrt(n))``，大量工作来自重复确认“这是某个已知质数的倍数”。

筛法把一次因数发现扩散到所有倍数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把 ``0..n-1`` 的每个整数当作一个索引，维护 ``composite[x]`` 表示 ``x`` 是否已经被证明为
合数。扫描到候选 ``prime`` 时：

* 若它已经标记，它是某个更小质数的倍数，不需要再次负责排除倍数；
* 若它未标记，它就是质数；
* 用这个质数把范围内所有倍数标记为合数。

这一次不再对每个候选重新寻找因数，而是让一个已确认质数的知识复用于整列倍数。扫描结束后，
仍未标记的 ``2..n-1`` 索引正是质数，最后只需计数。

为什么从 ``prime * prime`` 开始
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``prime`` 的 ``2 * prime``、``3 * prime`` 等较小倍数不会漏掉，但会重复工作。设某个倍数为
``prime * factor`` 且 ``factor < prime``；``factor`` 若大于 1，至少有一个质因子不超过
``factor``，这个更小质因子在此前扫描时已经标记了该倍数。

因此 ``prime`` 可能第一次负责的最小倍数是 ``prime * prime``。从这里开始按步长 ``prime``，
既不漏掉需要标记的合数，又跳过了已由更小质因子处理过的前缀。

为什么外层只需到平方根
~~~~~~~~~~~~~~~~~~~~~~~~

若 ``x < n`` 是合数，令 ``prime`` 为它的最小质因子，则
``prime * prime <= x < n``。所以每个合数都能在某个 ``prime`` 满足
``prime * prime < n`` 时被标记；更大的候选不可能是某个尚未发现合数因子的必要起点。

代码使用 ``prime <= (n - 1) / prime`` 表达 ``prime * prime <= n - 1``，避免先计算平方。内层
倍数使用 ``long long``，让“先算平方再比较 ``n``”的中间乘法也有明确的宽度。

筛数组不变量
~~~~~~~~~~~~

外层准备处理 ``prime`` 时保持：

* 已标记的索引确实都有一个因子，质数不会被错误标记；
* 小于 ``prime * prime`` 的合数已经被某个更小质数处理；
* ``composite[0]``、``composite[1]`` 始终为真，不参与最终计数；
* 尚未标记且大于等于 2 的 ``prime`` 没有更小质因子，因此可以作为新的筛因子。

若当前 ``prime`` 已标记，直接跳过不会丢失工作，因为标记它的更小质因子也已经覆盖了它的
倍数。若未标记，从平方开始标记的每个数都含有因子 ``prime``，所以只会删除合数；结合每个
合数的最小质因子界限，循环结束后没有合数残留。

状态走读
~~~~~~~~

以 ``n = 20`` 为例，数组索引只到 19：

.. list-table::
   :header-rows: 1

   * - 候选 prime
     - 动作
     - 新增标记
   * - 2
     - 从 4 开始每隔 2 标记
     - 4、6、8、10、12、14、16、18
   * - 3
     - 从 9 开始每隔 3 标记
     - 9、15（12、18 已被标记）
   * - 4
     - 已标记，跳过
     - 无
   * - 5
     - ``5 * 5 >= 20``，外层停止
     - 无

最后未标记的 ``2、3、5、7、11、13、17、19`` 共 8 个。注意 ``20`` 从未作为数组中的候选，
这正是严格小于 ``n`` 的边界。

代码分析
~~~~~~~~

公共入口调用 ``countBySieve``；``countByTrialDivision`` 和它的辅助函数保留为对照，展示从
“每个候选独立找因数”到“一个质数批量删除倍数”的工作变化。

``n <= 2`` 的分支先处理空范围，避免在不存在有效候选时访问筛数组。``composite`` 的下标与
整数值直接对应，因此 ``composite[0]``、``composite[1]`` 的初始化表达了题目的非质数定义。
外层遇到已标记候选就跳过；未标记候选从平方开始，内层每次只增加一个质数步长。

最终循环重新扫描 ``2..n-1`` 并统计未标记项。筛数组保存的是“是否合数”的证明，不是质数列表；
因此结果只需一个计数器，输入 ``n`` 也保持不变。

复杂度与边界
~~~~~~~~~~~~

试除基线对每个候选重复检查因子，时间约为 ``O(n sqrt(n))``，额外空间 ``O(1)``。埃氏筛的
总标记量是各质数倒数之和，时间复杂度为 ``O(n log log n)``，最后的计数扫描为 ``O(n)``，
不改变总量级；筛数组占用 ``O(n)`` 空间。

``n = 0``、``1``、``2`` 时严格小于 ``n`` 的范围没有质数，直接返回 0。``n`` 本身即使是质数
也不进入数组索引；外层平方条件和内层 ``multiple < n`` 共同保持半开区间边界。输入上界使
筛数组规模可控，代码不修改调用者数据。
