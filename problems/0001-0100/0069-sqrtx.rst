0069. Sqrt(x)
=============

题目信息
--------

:题号: 0069
:难度: Easy
:主题: 数学、二分查找、整数边界
:原题: `LeetCode 0069 <https://leetcode.com/problems/sqrtx/>`_
:访问状态: Available
:教学重点: 单调谓词、下取整语义、除法防溢出、闭区间二分

题目重述
--------

给定非负整数 ``x``，返回其算术平方根向下取整后的整数部分。不能调用语言提供的平方根、幂函数或浮点
近似接口完成核心计算。

题目保证 ``0 <= x <= 2^31 - 1``。返回值满足：

.. code-block:: text

   answer² <= x < (answer + 1)²

输入和输出都在 32 位有符号整数范围内。算法不修改任何外部状态。

自建示例
--------

完全平方数
~~~~~~~~~~

.. code-block:: text

   输入：x = 144
   输出：12

需要向下取整
~~~~~~~~~~~~

.. code-block:: text

   输入：x = 27
   输出：5
   解释：5² = 25 <= 27，而 6² = 36 > 27。

最小输入
~~~~~~~~

.. code-block:: text

   输入：x = 0
   输出：0

最大边界
~~~~~~~~

.. code-block:: text

   输入：x = 2147483647
   输出：46340

直接计算 ``mid * mid`` 可能超过 32 位有符号整数，因此主解法改用除法比较。

问题抽象
--------

对所有正整数 ``candidate``，谓词：

.. code-block:: text

   candidate² <= x

随 ``candidate`` 增大只会从真变为假。目标是找到使谓词为真的最大整数，也就是一个 upper-bound 形式的
二分查找。

为了避免平方溢出，在 ``candidate > 0`` 时使用等价比较：

.. code-block:: text

   candidate <= x / candidate

整数除法向下取整，但该比较与 ``candidate² <= x`` 完全等价。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 闭区间二分并用除法判定
     - ``O(log x)``
     - ``O(1)``
     - 主解法；不乘方、不使用浮点数
   * - 从 1 线性试探
     - ``O(sqrt(x))``
     - ``O(1)``
     - 正确但最大输入需要约 46340 次判断
   * - 牛顿迭代
     - 通常 ``O(log x)``
     - ``O(1)``
     - 收敛快，但整数停止条件和证明更复杂

主解法：寻找最后一个平方不超过 x 的整数
----------------------------------------

搜索区间
~~~~~~~~

当 ``x < 2`` 时答案就是 ``x``。当 ``x >= 2`` 时，答案至少为 ``1``，并且不会超过 ``x / 2``：

* ``x = 2`` 或 ``3`` 时，``x / 2 = 1``；
* 若整数答案 ``a >= 2``，则 ``x >= a²``，并且 ``a² / 2 >= a``，所以
  ``floor(x / 2) >= a``。

因此使用闭区间 ``[1, x / 2]``，并维护 ``answer`` 保存目前发现的最大可行值。

核心不变量
~~~~~~~~~~

每轮开始前：

* ``answer`` 是已经确认满足 ``answer² <= x`` 的最大候选；
* 所有小于 ``left`` 且已经排除搜索区间的候选不会优于 ``answer``；
* 所有大于 ``right`` 的候选已经证明平方大于 ``x``；
* 真正答案若尚未记录在 ``answer`` 中，就仍位于 ``[left, right]``。

取 ``mid = left + (right - left) / 2``，避免 ``left + right`` 的潜在加法溢出。

移动方向为什么安全
~~~~~~~~~~~~~~~~~~

若 ``mid <= x / mid``，则 ``mid² <= x``。``mid`` 是一个合法候选，可以更新 ``answer``；目标是寻找更大
合法值，因此只需继续搜索右半区 ``[mid + 1, right]``。

若 ``mid > x / mid``，则 ``mid² > x``。由于平方随正整数单调增加，``mid`` 以及所有更大候选都不可能
合法，可以安全令 ``right = mid - 1``。

正确性依据
~~~~~~~~~~

**谓词等价。** 搜索区间内 ``mid >= 1``，所以 ``mid² <= x`` 当且仅当 ``mid <= floor(x / mid)``。
代码中的除法比较不会改变候选集合。

**排除安全。** 合法 ``mid`` 左侧全部合法，但不会比 ``mid`` 更接近目标最大值；非法 ``mid`` 右侧全部
非法。每次移动都只删除不可能成为答案的一侧。

**返回语义。** 循环结束时 ``left > right``，所有大于 ``answer`` 的候选都已经被证明非法，``answer``
自身合法，因此它是满足平方不超过 ``x`` 的最大整数，即向下取整平方根。

**终止性。** 每轮都令 ``left`` 增加或 ``right`` 减少，闭区间长度严格缩短，有限步后结束。

复杂度
~~~~~~

* 搜索区间每轮至少缩小一半，时间复杂度为 ``O(log x)``；
* 只使用固定数量整数变量，额外空间为 ``O(1)``；
* ``mid`` 最大约为 ``2^30``，但算法不计算 ``mid * mid``；
* ``x / mid`` 始终除以正数，不存在除零；
* 返回值最大为 ``46340``，所有语言的 32 位整数都能表示。

核心语言实现
------------

C
~

.. code-block:: c

   int mySqrt(int x) {
       if (x < 2) {
           return x;
       }

       int left = 1;
       int right = x / 2;
       int answer = 1;

       while (left <= right) {
           const int mid = left + (right - left) / 2;
           if (mid <= x / mid) {
               answer = mid;
               left = mid + 1;
           } else {
               right = mid - 1;
           }
       }
       return answer;
   }

``mid`` 始终大于零，所以 ``x / mid`` 安全。全部运算保持在 ``int`` 范围内。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int mySqrt(int x) {
           if (x < 2) {
               return x;
           }

           int left = 1;
           int right = x / 2;
           int answer = 1;

           while (left <= right) {
               const int mid = left + (right - left) / 2;
               if (mid <= x / mid) {
                   answer = mid;
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
           return answer;
       }
   };

实现不依赖 ``<cmath>``，避免把浮点平方根舍入误差带入整数边界。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def mySqrt(self, x: int) -> int:
           if x < 2:
               return x

           left = 1
           right = x // 2
           answer = 1

           while left <= right:
               mid = left + (right - left) // 2
               if mid <= x // mid:
                   answer = mid
                   left = mid + 1
               else:
                   right = mid - 1

           return answer

Python 支持任意精度整数，但主实现仍使用除法比较，使算法语义与固定宽语言一致。

Java
~~~~

.. code-block:: java

   class Solution {
       public int mySqrt(int x) {
           if (x < 2) {
               return x;
           }

           int left = 1;
           int right = x / 2;
           int answer = 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (mid <= x / mid) {
                   answer = mid;
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
           return answer;
       }
   }

Java 的整数除法对非负数向零截断，与向下取整相同。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn my_sqrt(x: i32) -> i32 {
           if x < 2 {
               return x;
           }

           let mut left = 1i32;
           let mut right = x / 2;
           let mut answer = 1i32;

           while left <= right {
               let mid = left + (right - left) / 2;
               if mid <= x / mid {
                   answer = mid;
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
           answer
       }
   }

所有变量使用 ``i32``；差值 ``right - left`` 非负且不超过输入范围。

Go
~~

.. code-block:: go

   func mySqrt(x int) int {
       if x < 2 {
           return x
       }

       left := 1
       right := x / 2
       answer := 1

       for left <= right {
           mid := left + (right-left)/2
           if mid <= x/mid {
               answer = mid
               left = mid + 1
           } else {
               right = mid - 1
           }
       }
       return answer
   }

LeetCode 的 Go 运行环境中 ``int`` 至少覆盖 32 位题目输入；代码不执行可能溢出的平方。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function mySqrt(x: number): number {
       if (x < 2) {
           return x;
       }

       let left = 1;
       let right = Math.floor(x / 2);
       let answer = 1;

       while (left <= right) {
           const mid = left + Math.floor((right - left) / 2);
           const quotient = Math.floor(x / mid);
           if (mid <= quotient) {
               answer = mid;
               left = mid + 1;
           } else {
               right = mid - 1;
           }
       }
       return answer;
   }

全部值不超过 ``2^31 - 1``，远低于 ``number`` 的安全整数上限。实现不使用会强制转换到有符号 32 位的
位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MySqrt(int x) {
           if (x < 2) {
               return x;
           }

           int left = 1;
           int right = x / 2;
           int answer = 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (mid <= x / mid) {
                   answer = mid;
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
           return answer;
       }
   }

默认 ``checked`` 设置不会影响本实现，因为所有加减法都有明确范围，且没有平方乘法。

Julia
~~~~~

.. code-block:: julia

   function mySqrt(x::Int)::Int
       if x < 2
           return x
       end

       left = 1
       right = x ÷ 2
       answer = 1

       while left <= right
           mid = left + (right - left) ÷ 2
           if mid <= x ÷ mid
               answer = mid
               left = mid + 1
           else
               right = mid - 1
           end
       end
       return answer
   end

``÷`` 执行整数除法。题目输入不超过 32 位上限，常见 64 位 Julia ``Int`` 环境完整覆盖。

R
~

.. code-block:: r

   mySqrt <- function(x) {
     if (x < 2) {
       return(as.integer(x))
     }

     left <- 1
     right <- floor(x / 2)
     answer <- 1

     while (left <= right) {
       mid <- left + floor((right - left) / 2)
       quotient <- floor(x / mid)
       if (mid <= quotient) {
         answer <- mid
         left <- mid + 1
       } else {
         right <- mid - 1
       }
     }
     as.integer(answer)
   }

R 的 ``numeric`` 对不超过 ``2^31 - 1`` 的整数计算保持精确；最终答案不超过 ``46340``，转换为
``integer`` 安全。

对照解法：整数牛顿迭代
----------------------

可以从 ``estimate = x`` 开始反复计算 ``(estimate + x / estimate) / 2``，直到估计值不再下降。它通常
只需很少轮，但需要额外证明整数除法下的单调收敛、停止条件与最终下取整语义。二分查找的单调区间和
排除规则更直接，因此作为主解法。

验证计划与证据
--------------

* 固定用例覆盖 ``0``、``1``、完全平方数、非完全平方数和 ``2^31 - 1``；
* Python 与标准库 ``math.isqrt`` 对拍全部小值和大量随机 32 位非负整数；
* C、C++、Java、Go 和 TypeScript 编译并运行固定边界用例；
* C 使用严格警告、AddressSanitizer 和 UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时进行除零、整数范围和二分边界静态检查。

关键边界
--------

* ``x = 0`` 与 ``x = 1`` 在建立正数搜索区间前直接返回；
* 搜索区间内 ``mid >= 1``，除法分母始终非零；
* 不使用 ``mid * mid``，避免最大输入附近的 32 位乘法溢出；
* 返回的是向下取整结果，不是最接近整数；
* ``mid`` 使用差值写法，避免直接计算 ``left + right``。

易错点
------

* 直接比较 ``mid * mid <= x`` 可能在 C、Java 等语言中先溢出再比较；
* 找到合法 ``mid`` 后立即返回，会错过更大的合法值；
* 使用 ``right = mid`` 或 ``left = mid`` 可能让区间无法缩短；
* 把 ``x / mid`` 与浮点除法混用，会引入不必要的舍入语义；
* 忘记单独处理 ``x < 2``，可能建立空区间并返回错误初值。

本题新增知识
------------

* 把平方比较转换为除法比较以避免溢出；
* 搜索“最后一个满足单调谓词的整数”；
* 用 ``answer`` 保存闭区间二分中的最后可行值。

本题强化知识
------------

* 闭区间二分不变量与安全排除；
* 中点差值写法；
* 整数除法和下取整语义；
* 数值边界必须覆盖整条表达式。

关联题目
--------

* `0035. Search Insert Position <0035-search-insert-position.rst>`_：两题都在单调区间上使用二分；本题寻找
  最后一个满足平方上界的整数，而 0035 寻找第一个不小于目标的位置。
* `0029. Divide Two Integers <0029-divide-two-integers.rst>`_：两题都需要围绕固定宽整数设计运算顺序；
  本题用除法替代潜在溢出的平方。

最小自检
--------

#. 为什么目标可以表达为“最后一个满足谓词的整数”？
#. ``mid <= x / mid`` 为什么等价于 ``mid² <= x``？
#. 找到合法 ``mid`` 后为什么继续搜索右侧？
#. ``x < 2`` 为什么需要提前返回？
#. 本实现在哪些位置避免了整数溢出？

答案要点
~~~~~~~~

#. 所有不超过平方根的正整数形成连续前缀，目标是该前缀末端。
#. ``mid`` 为正，乘除不改变不等号方向，整数商比较保持同一真假边界。
#. 题目要求最大合法整数，更大的候选仍可能成立。
#. 此时答案就是输入本身，并且通用搜索区间会为空。
#. 中点使用差值计算，并以除法比较替代 ``mid * mid``。
