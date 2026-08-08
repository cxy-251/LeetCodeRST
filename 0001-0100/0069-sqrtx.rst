0069. Sqrt(x)
=============

题目信息
--------

:题号: 0069. x 的平方根
:难度: Easy
:主题: 数学、二分查找、牛顿迭代、整数边界
:原题: `LeetCode 0069 <https://leetcode.com/problems/sqrtx/>`_
:重点: 从逐个试探平方根，推导到单调边界二分与整数牛顿迭代

题目重述
--------

给定非负整数 ``x``，返回 ``sqrt(x)`` 向下取整后的整数。不能使用内置指数函数或运算符，
例如 ``pow(x, 0.5)``。

约束为 ``0 <= x <= 2^31 - 1``。返回值 ``r`` 必须满足：

.. code-block:: text

   r^2 <= x < (r + 1)^2

自建示例
--------

.. code-block:: text

   输入：x = 50
   输出：7

``7^2 = 49 <= 50``，而 ``8^2 = 64 > 50``，所以向下取整后得到 ``7``。

.. code-block:: text

   输入：x = 2147395600
   输出：46340

该输入恰好等于 ``46340^2``，因此返回 ``46340``。

.. code-block:: text

   输入：x = 8
   输出：2

``sqrt(8)`` 位于 ``2`` 与 ``3`` 之间，向下取整后得到 ``2``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       int linearSearch(int x) {
           if (x < 2) {
               return x;
           }

           int answer = 1;
           for (int candidate = 2;
                candidate <= x / candidate;
                ++candidate) {
               answer = candidate;
           }
           return answer;
       }

       int binaryLastTrue(int x) {
           if (x < 2) {
               return x;
           }

           int left = 1;
           int right = x / 2 + 1;
           int answer = 1;

           while (left <= right) {
               const int middle = left + (right - left) / 2;
               if (middle <= x / middle) {
                   answer = middle;
                   left = middle + 1;
               } else {
                   right = middle - 1;
               }
           }
           return answer;
       }

       int newtonIteration(int x) {
           if (x < 2) {
               return x;
           }

           long long estimate = x;
           while (estimate > x / estimate) {
               estimate = (estimate + x / estimate) / 2;
           }
           return static_cast<int>(estimate);
       }

   public:
       int mySqrt(int x) {
           return binaryLastTrue(x);
       }
   };

题解
----

逐个验证候选值
~~~~~~~~~~~~~~

向下取整平方根不是寻找一个一定满足 ``candidate^2 == x`` 的整数，而是寻找满足
``candidate^2 <= x`` 的最大整数。

``linearSearch`` 从 ``1`` 开始递增候选值。只要当前候选仍合法，就把它记录为答案；第一个不合法值之后的
所有整数平方只会更大，因此无需继续检查。

候选最多增长到 ``sqrt(x)`` 附近，时间复杂度为 ``O(sqrt(x))``。这一步直接对应定义，也揭示了可用于优化的
单调结构。

除法形式的平方判断
~~~~~~~~~~~~~~~~~~

若直接计算 ``candidate * candidate``，乘积可能超过 32 位有符号整数范围。对于正整数 ``candidate``，下面两种
判断等价：

.. code-block:: text

   candidate^2 <= x
   candidate <= x / candidate

整数除法向下取整。若 ``candidate^2 <= x``，则商至少为 ``candidate``；若平方大于 ``x``，则商必小于
``candidate``。代码因此不需要执行可能溢出的乘法。

最后真值边界
~~~~~~~~~~~~

定义谓词：

.. code-block:: text

   valid(candidate) = candidate <= x / candidate

候选值从小到大时，``valid`` 只会从 ``true`` 变为 ``false``。目标就是最后一个使谓词为真的整数，可以使用
二分查找。

当 ``middle`` 合法时，它已经是一个可行答案，同时右侧仍可能存在更大的合法值，因此记录 ``middle``，并令
``left = middle + 1``。当 ``middle`` 非法时，它及其右侧全部非法，因此令 ``right = middle - 1``。

``answer`` 始终保存已经验证过的最大合法候选。循环结束时搜索区间为空，所有更大的候选都已排除，
``answer`` 就是向下取整平方根。

搜索区间
~~~~~~~~

``x`` 为 ``0`` 或 ``1`` 时，平方根就是自身，代码直接返回。

对于 ``x >= 2``，平方根不会超过 ``x / 2 + 1``，因此二分区间可以初始化为：

.. code-block:: text

   [1, x / 2 + 1]

即使使用更宽的 ``[1, x]``，结果仍正确；较紧的右边界只减少常数级搜索范围。

边界演化
~~~~~~~~

以 ``x = 27`` 为例：

.. list-table::
   :header-rows: 1

   * - 区间
     - 中点
     - 判断
     - 更新
   * - ``[1, 14]``
     - 7
     - ``7 > 27 / 7``
     - ``right = 6``
   * - ``[1, 6]``
     - 3
     - ``3 <= 27 / 3``
     - 记录 3，``left = 4``
   * - ``[4, 6]``
     - 5
     - ``5 <= 27 / 5``
     - 记录 5，``left = 6``
   * - ``[6, 6]``
     - 6
     - ``6 > 27 / 6``
     - ``right = 5``

搜索结束后，最后一个合法候选为 ``5``。

整数牛顿迭代
~~~~~~~~~~~~

方程 ``r^2 = x`` 的牛顿更新式为：

.. code-block:: text

   next = (estimate + x / estimate) / 2

``newtonIteration`` 从 ``estimate = x`` 开始。只要 ``estimate > x / estimate``，当前估计的平方就大于 ``x``，
仍需继续缩小。

在该条件下，``x / estimate < estimate``，所以新的整数估计严格小于旧值。实数算术中的两项平均值不会低于
``sqrt(x)``；向下取整后也不会越过目标整数的下界。估计值因此从上方单调下降，最终停在
``floor(sqrt(x))``。

停止时满足 ``estimate <= x / estimate``，即 ``estimate^2 <= x``。若它还能再增加 1，牛顿序列就不会从上方
越过该更大合法整数，因此当前值正是最大合法整数。

方法关系
~~~~~~~~

线性试探按顺序检查所有候选值，直接建立“最后一个合法整数”的目标。二分查找利用合法性随候选值单调变化，
跳过大部分候选。牛顿迭代不再维护显式搜索区间，而是利用方程结构快速缩小过大的估计。

公开入口选择 ``binaryLastTrue``。它的边界不变量明确，只使用整数除法，并能稳定处理 ``2^31 - 1`` 附近的输入。

复杂度分析
~~~~~~~~~~

设输入为 ``x``：

* 线性试探时间 ``O(sqrt(x))``，额外空间 ``O(1)``；
* 二分查找时间 ``O(log x)``，额外空间 ``O(1)``；
* 牛顿迭代使用常数空间，迭代轮数不超过 ``O(log x)``，实际通常更少。

边界处理
~~~~~~~~

* ``x = 0`` 或 ``x = 1`` 时直接返回自身；
* 完全平方数会被识别为最后一个合法候选；
* 非完全平方数返回小于真实平方根的最大整数；
* 平方比较使用 ``candidate <= x / candidate``，避免 32 位乘法溢出；
* 牛顿法只在 ``x >= 2`` 时执行，因此除数 ``estimate`` 始终为正。
