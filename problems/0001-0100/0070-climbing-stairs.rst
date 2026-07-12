0070. Climbing Stairs
=====================

题目信息
--------

:题号: 0070
:难度: Easy
:主题: 动态规划、计数、斐波那契、滚动状态
:原题: `LeetCode 0070 <https://leetcode.com/problems/climbing-stairs/>`_
:访问状态: Available
:教学重点: 最后一步分类、两状态滚动、组合计数、32 位上界

题目重述
--------

有一段共 ``n`` 级的楼梯，从地面出发，每次只能向上走 ``1`` 级或 ``2`` 级。返回恰好到达第 ``n`` 级
的不同走法数量。不同走法由步长序列区分。

题目保证 ``1 <= n <= 45``。答案最大为 ``1836311903``，能够由 32 位有符号整数表示。函数只返回计数，
不需要枚举或保存具体步长序列。

自建示例
--------

三阶楼梯
~~~~~~~~

.. code-block:: text

   输入：n = 3
   输出：3
   解释：[1,1,1]、[1,2]、[2,1]。

五阶楼梯
~~~~~~~~

.. code-block:: text

   输入：n = 5
   输出：8

最小输入
~~~~~~~~

.. code-block:: text

   输入：n = 1
   输出：1

问题抽象
--------

记 ``ways(step)`` 为恰好到达第 ``step`` 级的走法数。任何到达 ``step`` 的走法，最后一步只可能是：

* 从 ``step - 1`` 走 ``1`` 级；
* 从 ``step - 2`` 走 ``2`` 级。

两类走法由最后一步长度区分，互不重叠且覆盖全部可能，因此：

.. code-block:: text

   ways(step) = ways(step - 1) + ways(step - 2)

基础状态为 ``ways(1) = 1``、``ways(2) = 2``。转移只依赖前两个状态，不需要保存完整数组。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 两变量滚动动态规划
     - ``O(n)``
     - ``O(1)``
     - 主解法；状态最少且跨语言稳定
   * - 记忆化递归
     - ``O(n)``
     - ``O(n)``
     - 保留递归树结构，但增加缓存和调用栈
   * - 矩阵快速幂
     - ``O(log n)``
     - ``O(1)``
     - 适合极大 ``n``，本题 ``n <= 45`` 无必要

主解法：两状态滚动动态规划
--------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

处理第 ``step`` 级之前：

* ``previous_two`` 等于 ``ways(step - 2)``；
* ``previous_one`` 等于 ``ways(step - 1)``；
* 两个变量都只统计恰好到达对应台阶的走法。

本轮计算：

.. code-block:: text

   current = previous_one + previous_two

随后把窗口向前移动：

.. code-block:: text

   previous_two = previous_one
   previous_one = current

更新顺序必须先保存 ``current``，否则覆盖旧状态后会丢失转移需要的值。

正确性依据
~~~~~~~~~~

**状态转移完整。** 任意到达第 ``step`` 级的合法走法都有唯一最后一步。最后一步为 ``1`` 时，删除它后
得到一条到达 ``step - 1`` 的走法；最后一步为 ``2`` 时，删除它后得到一条到达 ``step - 2`` 的走法。
反向追加相应步长也能从两类前缀唯一构造原走法。

**两类互斥。** 一条走法的最后一步不能同时为 ``1`` 和 ``2``，所以两类数量可以直接相加，不会重复。

**滚动状态保持。** 初始化时 ``previous_two = ways(1)``、``previous_one = ways(2)``。若循环开始时不变量
成立，``current`` 由正确转移得到 ``ways(step)``；窗口移动后，下一轮两个变量恰好对应新的前两级。

**返回正确。** 循环结束后 ``previous_one = ways(n)``。``n = 1`` 或 ``2`` 由基础状态直接返回。

**终止性。** ``step`` 从 ``3`` 单调增加到 ``n``，每轮处理一个台阶，有限步后结束。

复杂度
~~~~~~

* 循环执行 ``n - 2`` 次，每轮常数次加法与赋值，时间复杂度为 ``O(n)``；
* 只保存三个计数变量，额外空间为 ``O(1)``；
* 不保存具体走法，返回结果空间为 ``O(1)``；
* ``n <= 45`` 时最大状态为 ``ways(45) = 1836311903``，所有中间状态不超过最终状态；
* 该上界小于 ``2^31 - 1``，十语言实现的整数选择都安全。

核心语言实现
------------

C
~

.. code-block:: c

   int climbStairs(int n) {
       if (n <= 2) {
           return n;
       }

       int previous_two = 1;
       int previous_one = 2;

       for (int step = 3; step <= n; ++step) {
           const int current = previous_one + previous_two;
           previous_two = previous_one;
           previous_one = current;
       }
       return previous_one;
   }

约束保证 ``n >= 1``，基础分支直接返回正确计数。全部加法保持在 ``int`` 范围内。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int climbStairs(int n) {
           if (n <= 2) {
               return n;
           }

           int previousTwo = 1;
           int previousOne = 2;

           for (int step = 3; step <= n; ++step) {
               const int current = previousOne + previousTwo;
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   };

实现不需要容器或递归，输入和返回值都使用平台 ``int``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def climbStairs(self, n: int) -> int:
           if n <= 2:
               return n

           previous_two = 1
           previous_one = 2

           for _ in range(3, n + 1):
               previous_two, previous_one = (
                   previous_one,
                   previous_one + previous_two,
               )

           return previous_one

并行赋值先计算右侧元组，再更新两个变量，因此不会丢失旧 ``previous_one``。

Java
~~~~

.. code-block:: java

   class Solution {
       public int climbStairs(int n) {
           if (n <= 2) {
               return n;
           }

           int previousTwo = 1;
           int previousOne = 2;

           for (int step = 3; step <= n; ++step) {
               int current = previousOne + previousTwo;
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   }

最大结果小于 ``Integer.MAX_VALUE``，不会发生有符号整数回绕。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn climb_stairs(n: i32) -> i32 {
           if n <= 2 {
               return n;
           }

           let mut previous_two = 1i32;
           let mut previous_one = 2i32;

           for _step in 3..=n {
               let current = previous_one + previous_two;
               previous_two = previous_one;
               previous_one = current;
           }
           previous_one
       }
   }

``3..=n`` 只在 ``n >= 3`` 的分支中创建，不会依赖空或反向范围语义。

Go
~~

.. code-block:: go

   func climbStairs(n int) int {
       if n <= 2 {
           return n
       }

       previousTwo := 1
       previousOne := 2

       for step := 3; step <= n; step++ {
           current := previousOne + previousTwo
           previousTwo = previousOne
           previousOne = current
       }
       return previousOne
   }

题目数值上界由 32 位有符号整数覆盖，因此 Go ``int`` 在 LeetCode 支持平台上安全。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function climbStairs(n: number): number {
       if (n <= 2) {
           return n;
       }

       let previousTwo = 1;
       let previousOne = 2;

       for (let step = 3; step <= n; step += 1) {
           const current = previousOne + previousTwo;
           previousTwo = previousOne;
           previousOne = current;
       }
       return previousOne;
   }

最大结果远低于 ``number`` 的安全整数上限，且实现不使用 32 位位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int ClimbStairs(int n) {
           if (n <= 2) {
               return n;
           }

           int previousTwo = 1;
           int previousOne = 2;

           for (int step = 3; step <= n; ++step) {
               int current = previousOne + previousTwo;
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   }

所有运算都在 ``Int32`` 可表示范围内，不需要 ``long``。

Julia
~~~~~

.. code-block:: julia

   function climbStairs(n::Int)::Int
       if n <= 2
           return n
       end

       previous_two = 1
       previous_one = 2

       for _step in 3:n
           current = previous_one + previous_two
           previous_two = previous_one
           previous_one = current
       end
       return previous_one
   end

该循环只在 ``n >= 3`` 时执行；常见 64 位 ``Int`` 环境完整覆盖题目计数。

R
~

.. code-block:: r

   climbStairs <- function(n) {
     if (n <= 2L) {
       return(as.integer(n))
     }

     previous_two <- 1L
     previous_one <- 2L

     for (step in 3L:n) {
       current <- previous_one + previous_two
       previous_two <- previous_one
       previous_one <- current
     }
     previous_one
   }

``n >= 3`` 时 ``3L:n`` 是有效递增范围。最大计数小于 R 32 位 ``integer`` 上限，所以加法不会产生
``NA`` 溢出。

对照解法：组合计数
------------------

若一条走法使用 ``two_steps`` 个二级步，则还需 ``n - 2 × two_steps`` 个一级步，总步数为
``n - two_steps``。选择其中哪些位置放二级步，方案数为：

.. code-block:: text

   C(n - two_steps, two_steps)

把 ``two_steps = 0..floor(n/2)`` 的组合数相加也能得到答案。这提供了独立验证基准，但需要安全计算组合数，
跨语言实现比两状态动态规划更复杂，因此不作为主代码。

验证计划与证据
--------------

* 固定用例覆盖 ``n = 1``、``2``、普通值与最大值 ``45``；
* Python 与独立组合数公式 ``sum(C(n-k, k))`` 对拍全部 ``1..45``；
* C、C++、Java、Go 和 TypeScript 编译并运行基础、普通与最大边界用例；
* C 使用严格警告、AddressSanitizer 和 UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时进行循环范围、更新顺序和整数上界静态检查。

关键边界
--------

* ``n = 1`` 与 ``n = 2`` 是递推基础，不能统一初始化为两个零；
* 状态更新必须保留旧的 ``previous_one`` 和 ``previous_two``；
* 题目要求恰好到达 ``n``，超过目标的序列不计数；
* 最大结果接近但仍小于 32 位有符号整数上限；
* 只返回计数，不需要为全部走法分配指数级输出空间。

易错点
------

* 把基础状态写成 ``ways(0) = 0`` 后直接套递推，会让 ``ways(2)`` 计算错误；
* 先覆盖 ``previous_one`` 再计算新值，会重复使用同一状态；
* 使用朴素递归会重复展开相同子问题，时间复杂度达到指数级；
* 误以为返回计数需要保存所有步长序列；
* 在 R 中让 ``n = 1`` 进入 ``3:n``，会产生意外递减序列。

本题新增知识
------------

* 按最后一步长度划分计数集合；
* 两状态滚动表示斐波那契型递推；
* 组合数公式作为独立验证基准。

本题强化知识
------------

* 动态规划状态充分性与转移完整性；
* 计数题中的互斥分类相加；
* 返回标量与枚举输出空间的区别；
* 从输入上界推导全部中间状态宽度。

关联题目
--------

* `0062. Unique Paths <0062-unique-paths.rst>`_：两题都按最后一步来自哪个前驱划分路径集合；本题把二维
  网格压缩成只依赖前两级的一维递推。
* `0064. Minimum Path Sum <0064-minimum-path-sum.rst>`_：两题都使用滚动动态规划；0064 对前驱取最小值，
  本题对互斥前驱方案数求和。

最小自检
--------

#. 为什么到达第 ``step`` 级的走法只分成两类？
#. 两类方案为什么可以直接相加？
#. ``previous_two`` 和 ``previous_one`` 在循环开始时分别表示什么？
#. 为什么只需 ``O(1)`` 状态空间？
#. ``n = 45`` 时为什么仍可使用 32 位有符号整数？

答案要点
~~~~~~~~

#. 最后一步只能走一级或二级，没有第三种合法步长。
#. 两类由最后一步长度区分，互斥且覆盖全部走法。
#. 分别表示到达 ``step-2`` 与 ``step-1`` 的走法数。
#. 当前状态只依赖前两个状态，更早值不会再被读取。
#. 最大答案为 ``1836311903``，小于 ``2147483647``。
