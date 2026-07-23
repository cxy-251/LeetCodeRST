0202. Happy Number
==================

题目信息
--------

:题号: 0202
:难度: Easy
:主题: 数学、十进制数字、循环检测
:原题: `LeetCode 0202 <https://leetcode.com/problems/happy-number/>`_
:重点: 反复计算各位平方和、到达 1、非快乐序列进入循环、输入为正整数

题目重述
--------

给定一个正整数 ``n``。把当前整数的每个十进制数字分别平方后求和，用该和替代当前整数，并不断重复这个过程。若序列最终到达 ``1``，则 ``n`` 是快乐数，返回 ``true``；若序列进入一个永远不会包含 ``1`` 的循环，返回 ``false``。

``n`` 位于 ``[1, 2^31-1]``。每一轮都要处理当前整数十进制表示中的全部数字，数字 ``0`` 的平方贡献为 ``0``。题目只判断初始整数是否最终到达 1，不要求返回中间序列。

自建示例
--------

经过多轮到达 1：

.. code-block:: text

   输入：n = 7
   输出：true
   解释：7 -> 49 -> 97 -> 130 -> 10 -> 1，因此 7 是快乐数。

进入不包含 1 的循环：

.. code-block:: text

   输入：n = 3
   输出：false
   解释：序列为 3 -> 9 -> 81 -> 65 -> 61 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4，之后进入 4 开始的循环，无法到达 1。

问题抽象与解法选择
------------------

每个正整数恰好有一个后继 ``f(n)``。因此所有状态构成一个函数图：
从任意起点不断沿唯一出边前进，最终只有两种可能：

* 进入以 1 为不动点的分量；
* 进入某个不包含 1 的有向环。

关键问题是先证明状态不会无限产生互不相同、越来越大的整数。

有限状态上界
~~~~~~~~~~~~

若 ``n`` 有 ``d`` 个十进制数字，则每个数字平方最多为 ``9^2=81``，所以：

.. math::

   f(n) \le 81d

当 ``d>=4`` 时，``81d < 10^(d-1)``。而任何 ``d`` 位正整数至少为
``10^(d-1)``，因此对四位及以上整数有 ``f(n)<n``。
重复应用转移后，状态最终会降到 1000 以下。

从此以后所有状态都位于有限集合 ``{1,2,...,999}`` 中。
有限集合中的无限序列必然重复；一旦状态重复，后续也完全重复，于是形成环。

Floyd 快慢指针
~~~~~~~~~~~~~~

不必用哈希集合保存所有历史状态。维护两个状态：

* ``slow`` 每轮执行一次 ``f``；
* ``fast`` 每轮执行两次 ``f``。

若序列进入环，快指针最终会在环内追上慢指针；若序列到达 1，快指针会先变成 1。算法使用：

.. code-block:: text

   slow = n
   fast = f(n)
   while fast != 1 and slow != fast:
       slow = f(slow)
       fast = f(f(fast))
   return fast == 1

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - Floyd 快慢指针
     - 与进入环前长度和环长成正比
     - ``O(1)``
     - 主解法；无需保存历史集合
   * - 哈希集合记录访问状态
     - 同上
     - ``O(S)``
     - 更直观，但需要存储全部已见状态
   * - 依赖已知非快乐环常量
     - 通常很短
     - ``O(1)``
     - 把证明藏在魔法常量中，不作为主解法

``S`` 是实际访问的不同状态数。对于固定宽输入，它受一个很小的常数上界约束。

平方位和辅助过程
----------------

对正整数反复执行：

.. code-block:: text

   digit = n % 10
   sum += digit * digit
   n = n // 10

循环开始时保持：

* ``n`` 是尚未处理的高位前缀；
* ``sum`` 是已经移除的低位数字平方和；
* 原整数的数字集合被准确分成“已处理低位”和“尚未处理前缀”；
* 每轮恰好移除一个十进制数字。

当 ``n==0`` 时，全部数字都已处理，``sum`` 就是 ``f(original)``。

平方和不会溢出本章所选状态类型。即使输入达到 32 位正整数上界，
最多 10 个十进制数字，单次转移不超过 ``10*81=810``。

快慢指针不变量
--------------

记从起点开始的状态序列为：

.. math::

   x_0=n,\qquad x_{i+1}=f(x_i)

初始化后：

* ``slow=x_0``；
* ``fast=x_1``。

循环执行 ``t`` 轮后保持：

* ``slow=x_t``；
* ``fast=x_(2t+1)``；
* 两个指针都位于同一条确定状态序列上；
* 若 ``fast==1``，序列已经到达快乐不动点；
* 若 ``slow==fast`` 且该值不是 1，两个指针已在非快乐环中相遇。

每轮分别应用一次和两次转移，因此不变量自然推进。

正确性证明
----------

引理一：``next_state`` 正确计算十进制数字平方和
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮使用取余得到当前最低十进制数字，累加其平方，再用整数除法删除该数字。
根据辅助过程不变量，已处理与未处理数字始终无遗漏、无重复。
循环结束时所有数字恰好各贡献一次平方，因此返回 ``f(n)``。

引理二：任意正整数的状态序列最终进入有限集合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前数有 ``d>=4`` 位，则 ``f(n)<=81d<10^(d-1)<=n``，状态严格减小。
严格减小不能无限持续，所以最终状态少于 1000。之后每次转移的平方和最多
``3*81=243``；序列从此停留在有限集合内。

引理三：状态序列最终到达 1 或进入一个非 1 环
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理二，序列最终位于有限集合。无限沿确定函数前进时，鸽巢原理保证某个状态重复。
确定性保证重复状态之后的后继序列也完全相同，所以形成环。
若重复过程包含 1，因为 ``f(1)=1``，最终环就是不动点 1；
否则进入不包含 1 的环。

引理四：若序列进入环，Floyd 指针必然相遇
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设进入环前路径长度为 ``mu``，环长为 ``lambda``。当慢指针进入环后，
快指针也已在环内。每轮快指针相对慢指针多前进一步，
所以二者在环上的相对距离每轮增加 1 模 ``lambda``。
至多 ``lambda`` 轮后相对距离变为 0，二者相遇。

引理五：算法退出时 ``fast==1`` 当且仅当原数快乐
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``fast==1``，快指针沿原状态序列到达 1，因此原数按定义是快乐数。

若循环因为 ``slow==fast`` 退出且相遇值不是 1，
引理四说明二者位于同一非 1 环；确定转移会永远留在该环，
之后不可能到达 1，所以原数不是快乐数。

反过来，若原数快乐，序列最终到达 1。快指针沿同一序列前进，不会进入其他分支，
必然使 ``fast==1``；若原数不快乐，引理三、四保证指针最终在非 1 环相遇。

定理：算法准确判断快乐数
~~~~~~~~~~~~~~~~~~~~~~~~

算法只在“快指针到达 1”或“两指针在非 1 环相遇”两种完备情况退出。
由引理五，返回 ``fast==1`` 与快乐数定义完全等价，因此结果正确。

终止性
~~~~~~

由引理三，序列必然进入 1 或有限环。到达 1 时循环退出；
进入环时由引理四在有限轮内相遇退出。因此主循环必然终止。

人工推演
--------

``n=19``
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 状态
     - ``slow``
     - ``fast``
   * - 初始化
     - 19
     - 82
   * - 第 1 轮
     - 82
     - 100
   * - 第 2 轮前检查
     - 82
     - 100
   * - 第 2 轮
     - 68
     - 1

下一次检查发现 ``fast==1``，返回 ``true``。

``n=2``
~~~~~~~

快慢指针都沿 ``2 -> 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4``
前进。快指针速度是慢指针两倍，最终在该环中的某个状态相遇；
相遇值不是 1，返回 ``false``。

复杂度与语言成本
----------------

* 设进入最终环前经过 ``mu`` 个状态、环长为 ``lambda``，Floyd 时间为 ``O(mu+lambda)``；
* 对固定 32 位正整数，平方和很快进入小于 1000 的有限集合，因此实际状态数有固定上界；
* 只保存两个状态和辅助平方和，额外空间 ``O(1)``；
* C/C++/Java/Rust/Go/TypeScript/C# 的平方和使用普通整数即可，最大单次结果远低于 32 位上界；
* Python 整数任意精度，不改变算法；
* Julia 用 ``div`` 做整数除法；
* R 的数值默认是 double，输入正整数及平方和都远低于 ``2^53``，
  ``floor(value/10)`` 和 ``value %% 10`` 在该范围内精确；
* 算法不修改调用者可见输入，只更新函数局部状态。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>

   static int next_state(int value) {
       int total = 0;
       while (value > 0) {
           int digit = value % 10;
           total += digit * digit;
           value /= 10;
       }
       return total;
   }

   bool isHappy(int n) {
       int slow = n;
       int fast = next_state(n);

       while (fast != 1 && slow != fast) {
           slow = next_state(slow);
           fast = next_state(next_state(fast));
       }

       return fast == 1;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isHappy(int n) {
           int slow = n;
           int fast = nextState(n);

           while (fast != 1 && slow != fast) {
               slow = nextState(slow);
               fast = nextState(nextState(fast));
           }

           return fast == 1;
       }

   private:
       static int nextState(int value) {
           int total = 0;
           while (value > 0) {
               int digit = value % 10;
               total += digit * digit;
               value /= 10;
           }
           return total;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isHappy(self, n: int) -> bool:
           def next_state(value: int) -> int:
               total = 0
               while value > 0:
                   value, digit = divmod(value, 10)
                   total += digit * digit
               return total

           slow = n
           fast = next_state(n)
           while fast != 1 and slow != fast:
               slow = next_state(slow)
               fast = next_state(next_state(fast))
           return fast == 1

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isHappy(int n) {
           int slow = n;
           int fast = nextState(n);

           while (fast != 1 && slow != fast) {
               slow = nextState(slow);
               fast = nextState(nextState(fast));
           }

           return fast == 1;
       }

       private int nextState(int value) {
           int total = 0;
           while (value > 0) {
               int digit = value % 10;
               total += digit * digit;
               value /= 10;
           }
           return total;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_happy(n: i32) -> bool {
           fn next_state(mut value: i32) -> i32 {
               let mut total = 0;
               while value > 0 {
                   let digit = value % 10;
                   total += digit * digit;
                   value /= 10;
               }
               total
           }

           let mut slow = n;
           let mut fast = next_state(n);
           while fast != 1 && slow != fast {
               slow = next_state(slow);
               fast = next_state(next_state(fast));
           }
           fast == 1
       }
   }

Go
~~

.. code-block:: go

   func isHappy(n int) bool {
       nextState := func(value int) int {
           total := 0
           for value > 0 {
               digit := value % 10
               total += digit * digit
               value /= 10
           }
           return total
       }

       slow := n
       fast := nextState(n)
       for fast != 1 && slow != fast {
           slow = nextState(slow)
           fast = nextState(nextState(fast))
       }
       return fast == 1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isHappy(n: number): boolean {
       const nextState = (input: number): number => {
           let value = input;
           let total = 0;
           while (value > 0) {
               const digit = value % 10;
               total += digit * digit;
               value = Math.floor(value / 10);
           }
           return total;
       };

       let slow = n;
       let fast = nextState(n);
       while (fast !== 1 && slow !== fast) {
           slow = nextState(slow);
           fast = nextState(nextState(fast));
       }
       return fast === 1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsHappy(int n) {
           int slow = n;
           int fast = NextState(n);

           while (fast != 1 && slow != fast) {
               slow = NextState(slow);
               fast = NextState(NextState(fast));
           }

           return fast == 1;
       }

       private static int NextState(int value) {
           int total = 0;
           while (value > 0) {
               int digit = value % 10;
               total += digit * digit;
               value /= 10;
           }
           return total;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_happy(n::Int)::Bool
       function next_state(input::Int)::Int
           value = input
           total = 0
           while value > 0
               digit = rem(value, 10)
               total += digit * digit
               value = div(value, 10)
           end
           return total
       end

       slow = n
       fast = next_state(n)
       while fast != 1 && slow != fast
           slow = next_state(slow)
           fast = next_state(next_state(fast))
       end
       return fast == 1
   end

R
~

.. code-block:: r

   is_happy <- function(n) {
     next_state <- function(input) {
       value <- as.double(input)
       total <- 0
       while (value > 0) {
         digit <- value %% 10
         total <- total + digit * digit
         value <- floor(value / 10)
       }
       total
     }

     slow <- as.double(n)
     fast <- next_state(n)
     while (fast != 1 && slow != fast) {
       slow <- next_state(slow)
       fast <- next_state(next_state(fast))
     }
     fast == 1
   }

静态审查记录
------------

本章未运行、未编译、未对拍题解代码，只执行以下静态审查：

* 人工推演 ``19``、``2``、``1``、``7``、``100`` 与 32 位正整数边界的平方和上界；
* 把最大正整数 ``2147483647`` 的首轮平方和逐位核对为 ``260``，不超过通用上界 ``810``；
* 核对扩展输入 ``0`` 时 ``f(0)=0``，初始化即在非 1 状态相遇并返回 ``false``；
* 证明四位及以上状态严格下降，之后进入有限集合；
* 核对 Floyd 初始化为 ``slow=n``、``fast=f(n)``，每轮分别前进一步和两步；
* 核对循环退出条件同时覆盖 ``fast==1`` 与 ``slow==fast``；
* 核对十种语言都使用十进制取余和整数除法，没有误用字符转换或浮点平方根；
* 核对 JavaScript 与 R 的除法都显式向下取整；
* 核对输入只复制到局部状态，没有修改调用者数据。

剩余风险：题解未在各目标平台编译。若平台扩展为任意精度十进制整数，
有限状态证明仍成立，但固定 32 位的单次平方和上界说明需要按输入位数重新表述。

关键错误模式
------------

* 声称状态单调下降：两位或三位数可能变大，例如 ``99 -> 162``；
* 只在状态大于 1 时循环而不检测环：非快乐数永不终止；
* 快指针每轮只走一步：无法形成追赶速度差；
* 两指针相遇就返回 ``true``：它们也会在非 1 环中相遇；
* 用无界哈希集合却仍声称 ``O(1)`` 空间；
* 使用普通除法后不取整，导致十进制取位状态不再是整数。

知识更新与关联题目
------------------

* ``0141 Linked List Cycle``：Floyd 在显式链表中检测环；本题在隐式函数图中检测环；
* ``0201 Bitwise AND of Numbers Range``：固定宽数值状态与跨语言整数语义；
* 函数图中每个节点出度为 1，所以任一起点最终必然进入一个环；
* 哈希集合方案适合初学者观察序列，Floyd 方案适合训练常量空间循环检测。

自检问题与答案
--------------

问题一：为什么快乐数过程一定不会无限产生互不相同的大数？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：``d`` 位数的下一状态最多为 ``81d``。四位及以上时该值小于原数的最小可能值
``10^(d-1)``，所以状态最终降到 1000 以下；有限集合中的无限序列必然重复。

问题二：两指针相遇为什么不一定表示快乐？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：非快乐数也会进入一个环，Floyd 会在该环内相遇。
只有相遇或提前到达的值是 1 时才表示进入快乐不动点。

问题三：为什么 ``fast`` 每轮走两步？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：在环内它相对慢指针每轮多前进一步，相对距离会遍历模环长的所有位置，从而保证有限轮内追上慢指针。

问题四：辅助函数处理 ``0`` 会返回什么？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：循环不执行，返回 0。主合同输入是正整数；若扩展调用 ``isHappy(0)``，
快慢指针会在 0 相遇并返回 ``false``。
