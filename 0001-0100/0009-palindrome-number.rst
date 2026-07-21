0009. Palindrome Number
=======================

题目信息
--------

:题号: 0009
:难度: Easy
:主题: 数学、十进制数字、回文、半反转
:原题: `LeetCode 0009 <https://leetcode.com/problems/palindrome-number/>`_
:教学重点: 快速排除、完整反转与半反转、数字中点、奇偶统一比较、结构性溢出规避

题目重述
--------

给定一个整数 ``x``，判断它的十进制表示从左向右和从右向左读取时是否相同。

负号属于十进制表示的一部分，因此负数不是回文数。除 ``0`` 外，末位为 ``0`` 的整数也不是回文数：
若左右字符镜像相等，它的首位也必须为 ``0``，而普通整数表示没有前导零。

字符串比较可以直接表达回文关系，但本文的主解法直接处理整数。它只反转数字的后一半，避免构造完整
反转值。

自建示例
--------

偶数位回文在两半相等时交汇：

.. code-block:: text

   输入：x = 4554

   剩余前缀：4554 -> 455 -> 45
   反转后缀：   0 ->   4 -> 45

   最终 45 == 45，输出：true

奇数位回文会让反转后缀多出中间数字：

.. code-block:: text

   输入：x = 12321

   剩余前缀：12321 -> 1232 -> 123 -> 12
   反转后缀：    0 ->    1 ->  12 -> 123

   反转后缀末位 3 是中间数字。
   比较 12 == 123 / 10，输出：true

非回文数也会在数字中点停止：

.. code-block:: text

   输入：x = 12341

   停止时：剩余前缀 = 12，反转后缀 = 143
   12 既不等于 143，也不等于 143 / 10。
   输出：false

可以立即排除的输入：

.. code-block:: text

   x = -1221  -> false，负号没有右侧镜像
   x = 120    -> false，反转表示会以 0 开头
   x = 0      -> true，单个数字本身是回文

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   private:
       bool compareAsString(int x) {
           if (x < 0) {
               return false;
           }

           const std::string text = std::to_string(x);
           int left = 0;
           int right = static_cast<int>(text.size()) - 1;

           while (left < right) {
               if (text[left] != text[right]) {
                   return false;
               }
               ++left;
               --right;
           }
           return true;
       }

       bool reverseEntireNumber(int x) {
           if (x < 0) {
               return false;
           }

           const int original = x;
           long long reversed = 0;

           while (x > 0) {
               reversed = reversed * 10 + x % 10;
               x /= 10;
           }

           return reversed == original;
       }

       bool reverseSecondHalf(int x) {
           if (x < 0 || (x != 0 && x % 10 == 0)) {
               return false;
           }

           int reversed_half = 0;
           while (x > reversed_half) {
               const int digit = x % 10;
               reversed_half = reversed_half * 10 + digit;
               x /= 10;
           }

           // 偶数位直接比较；奇数位删除 reversed_half 中的中间数字。
           return x == reversed_half || x == reversed_half / 10;
       }

   public:
       bool isPalindrome(int x) {
           return reverseSecondHalf(x);
       }
   };

题解
----

回文关系首先表现为首尾镜像比较
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把整数转换成十进制字符串后，问题变成标准的双指针判断：``left`` 从首字符向右移动，``right`` 从末字符
向左移动，每轮比较一对镜像字符。任意一对不同即可返回 ``false``，全部镜像对相同则返回 ``true``。

``compareAsString`` 的时间复杂度是 ``O(d)``，其中 ``d`` 是十进制位数；字符串保存 ``d`` 个字符，工作空间
为 ``O(d)``。这种方法清楚展示了回文定义，却没有利用整数的十进制结构，也没有满足直接处理整数的目标。

完整反转如何把镜像比较变成整数比较
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

十进制整数的末位可以通过 ``x % 10`` 取得，删除末位可以执行 ``x /= 10``。把弹出的数字追加到另一个整数
末尾时执行：

.. math::

   reversed_{next} = 10 \cdot reversed + x \bmod 10

持续到输入被清空，就得到了完整反转值。于是非负整数是回文数，当且仅当完整反转值与原数相等。

``reverseEntireNumber`` 使用 ``long long`` 保存反转结果，避免 32 位乘十时溢出。它消除了字符串空间，却仍然
做了两件超过实际需要的工作：

* 把全部数字都移动到反转结果中；
* 为可能超过 32 位范围的完整反转值选择更宽类型。

判断回文只需要确认左右两半是否镜像相等。处理到数字中点后，剩余数字已经没有新的镜像对需要检查，因此
可以停止完整反转。

为什么负数与非零末位零可以直接排除
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

负数的十进制表示以负号开头，末尾没有对应负号，所以任何负数都不满足首尾镜像关系。

对非零整数，若末位是 ``0``，从右向左读取时第一个字符就是 ``0``。回文要求从左向右读取时第一个字符
也为 ``0``，这需要一个不存在的前导零。因此条件
``x != 0 && x % 10 == 0`` 可以直接判定为 ``false``。

``0`` 需要单独保留。它只有一个数字，左右读取结果相同，所以末位零判断必须包含 ``x != 0``。

半反转状态如何保存尚未比较的两侧
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

通过快速排除后，算法只处理末位非零的非负整数。维护两个状态：

.. code-block:: text

   x              尚未移动的原数字前缀
   reversed_half  已经从原数右侧弹出的后缀，并按反向顺序重新组成

每轮先取得 ``x`` 的末位 ``digit``，再完成：

.. math::

   reversed\_half_{next}
   = 10 \cdot reversed\_half + digit

.. math::

   x_{next} = \left\lfloor x / 10 \right\rfloor

输入前缀减少一位，反转后缀增加一位。经过 ``k`` 轮后：

* ``x`` 等于原数删除最后 ``k`` 位后的前缀；
* ``reversed_half`` 等于原数最后 ``k`` 位的逆序；
* 两个状态之间没有遗漏或重复任何十进制位。

停止条件为什么能恰好到达数字中点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环条件是 ``x > reversed_half``。它并不是提前判断两半是否相等，而是利用两个状态位数的相反变化定位
中点。

快速排除保证原数末位非零，因此第一次压入后，``reversed_half`` 不会出现前导零。此后每轮都让它增加
一个十进制位，同时让 ``x`` 删除一个十进制位。

当 ``x > reversed_half`` 仍成立时，尚未处理的前缀在数值规模上仍然长于或大于已反转后缀，右侧还没有
覆盖到数字中点。第一次出现 ``x <= reversed_half`` 时，已经移动至少一半数字：

* 偶数位整数中，两侧各包含一半数字；
* 奇数位整数中，``reversed_half`` 比左侧多包含一个中间数字。

即使两部分位数相同但 ``x`` 数值较大，循环可能再移动一位。此时 ``reversed_half`` 会比 ``x`` 多一位，
循环必然停止，最终比较仍按奇数形式删除多出的中间位。因此该条件不需要预先计算数字位数。

偶数位回文如何在两半相等时停止
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

使用 ``x = 4554``：

.. list-table::
   :header-rows: 1

   * - 轮次
     - 更新前 ``x``
     - 弹出 ``digit``
     - 更新后 ``x``
     - 更新后 ``reversed_half``
     - 是否继续
   * - 初始
     - 4554
     - —
     - 4554
     - 0
     - ``4554 > 0``
   * - 1
     - 4554
     - 4
     - 455
     - 4
     - ``455 > 4``
   * - 2
     - 455
     - 5
     - 45
     - 45
     - ``45 > 45`` 不成立

原数左半部分是 ``45``，右半部分 ``54`` 被反转为 ``45``。偶数位回文因此满足：

.. math::

   x = reversed\_half

奇数位回文为什么只需删除一个中间数字
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

使用 ``x = 12321``：

.. list-table::
   :header-rows: 1

   * - 轮次
     - 更新前 ``x``
     - 弹出 ``digit``
     - 更新后 ``x``
     - 更新后 ``reversed_half``
   * - 初始
     - 12321
     - —
     - 12321
     - 0
   * - 1
     - 12321
     - 1
     - 1232
     - 1
   * - 2
     - 1232
     - 2
     - 123
     - 12
   * - 3
     - 123
     - 3
     - 12
     - 123

停止时，``reversed_half`` 的最低位 ``3`` 来自原数中间位置。中间数字没有镜像配对要求，把它删除后，
右半部分的逆序值为 ``123 / 10 = 12``。奇数位回文因此满足：

.. math::

   x = \left\lfloor reversed\_half / 10 \right\rfloor

两个条件合并为：

.. code-block:: text

   x == reversed_half || x == reversed_half / 10

非回文数在中点如何被拒绝
~~~~~~~~~~~~~~~~~~~~~~~~

对 ``x = 12341``，状态变化为：

.. list-table::
   :header-rows: 1

   * - 轮次
     - 更新后 ``x``
     - 更新后 ``reversed_half``
   * - 1
     - 1234
     - 1
   * - 2
     - 123
     - 14
   * - 3
     - 12
     - 143

停止时 ``12 != 143``，并且 ``12 != 143 / 10``。算法只比较真正可能互为镜像的两半，不需要恢复或反转
剩余数字。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 实际处理范围
   * - 字符串双指针
     - ``O(d)``
     - ``O(d)``
     - 比较全部镜像字符
   * - 完整整数反转
     - ``O(d)``
     - ``O(1)``
     - 移动全部数字，并依赖更宽中间类型或溢出判断
   * - 后一半反转
     - ``O(d)``
     - ``O(1)``
     - 只移动到数字中点

半反转保持常数工作空间，只处理约一半数字，并从算法结构上避免完整反转溢出，因此作为标准入口和九语言
统一主解法。

为什么半反转不会构造出 32 位溢出值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

32 位正整数最多有 10 个十进制数字。``reversed_half`` 每轮增加一位，``x`` 每轮减少一位；当反转部分比
剩余部分多一位后，``x > reversed_half`` 必然不成立。

因此最多只会构造约一半数字，极端情况下在两部分同位数但 ``x`` 较大时多移动一位。对 10 位输入，
``reversed_half`` 最多包含 6 位，最大不超过 ``999999``，远小于 ``INT_MAX``。主解法无需像完整反转那样
增加乘十前溢出分支。

为什么最终比较恰好覆盖全部回文情况
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意非负且末位非零的整数，位数只有奇数或偶数两种情况。半反转循环结束时：

* 偶数位时，左右镜像部分长度相同，回文当且仅当 ``x == reversed_half``；
* 奇数位时，反转部分包含一个不需要配对的中间数字，回文当且仅当
  ``x == reversed_half / 10``。

快速排除已经正确处理负数和非零末位零；循环每轮又恰好移动一个数字。因此两个最终比较覆盖所有剩余
输入，并且只有镜像两半相等时才返回 ``true``。

复杂度来源
~~~~~~~~~~

设输入绝对值共有 ``d`` 个十进制数字。

字符串方法创建并比较 ``d`` 个字符，时间和工作空间分别为 ``O(d)``、``O(d)``。完整整数反转执行 ``d``
轮末位提取和压入，时间为 ``O(d)``，工作空间为 ``O(1)``。

半反转最多执行约 ``d / 2`` 轮，每轮进行常数次除法、取余、乘法与比较，时间仍记为 ``O(d)``，等价于
``O(log x)``；只保存 ``x`` 与 ``reversed_half`` 等固定变量，工作空间为 ``O(1)``。

九语言实现
----------

九语言统一使用半反转。快速排除后 ``x`` 为非负整数，各语言的除以 10 和取余都可以直接表示删除末位与
取得末位。TypeScript 需要使用 ``Math.trunc`` 删除十进制末位；Julia 和 R 使用各自的整数商操作。

C
~

.. code-block:: c

   #include <stdbool.h>

   bool isPalindrome(int x) {
       if (x < 0 || (x != 0 && x % 10 == 0)) {
           return false;
       }

       int reversed_half = 0;
       while (x > reversed_half) {
           const int digit = x % 10;
           reversed_half = reversed_half * 10 + digit;
           x /= 10;
       }

       return x == reversed_half || x == reversed_half / 10;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isPalindrome(self, x: int) -> bool:
           if x < 0 or (x != 0 and x % 10 == 0):
               return False

           reversed_half = 0
           while x > reversed_half:
               digit = x % 10
               reversed_half = reversed_half * 10 + digit
               x //= 10

           return x == reversed_half or x == reversed_half // 10

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isPalindrome(int x) {
           if (x < 0 || (x != 0 && x % 10 == 0)) {
               return false;
           }

           int reversedHalf = 0;
           while (x > reversedHalf) {
               int digit = x % 10;
               reversedHalf = reversedHalf * 10 + digit;
               x /= 10;
           }

           return x == reversedHalf || x == reversedHalf / 10;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_palindrome(mut x: i32) -> bool {
           if x < 0 || (x != 0 && x % 10 == 0) {
               return false;
           }

           let mut reversed_half = 0_i32;
           while x > reversed_half {
               let digit = x % 10;
               reversed_half = reversed_half * 10 + digit;
               x /= 10;
           }

           x == reversed_half || x == reversed_half / 10
       }
   }

Go
~~

.. code-block:: go

   func isPalindrome(x int) bool {
       if x < 0 || (x != 0 && x%10 == 0) {
           return false
       }

       reversedHalf := 0
       for x > reversedHalf {
           digit := x % 10
           reversedHalf = reversedHalf*10 + digit
           x /= 10
       }

       return x == reversedHalf || x == reversedHalf/10
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isPalindrome(x: number): boolean {
       if (x < 0 || (x !== 0 && x % 10 === 0)) {
           return false;
       }

       let reversedHalf = 0;
       while (x > reversedHalf) {
           const digit = x % 10;
           reversedHalf = reversedHalf * 10 + digit;
           x = Math.trunc(x / 10);
       }

       return x === reversedHalf ||
           x === Math.trunc(reversedHalf / 10);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsPalindrome(int x) {
           if (x < 0 || (x != 0 && x % 10 == 0)) {
               return false;
           }

           int reversedHalf = 0;
           while (x > reversedHalf) {
               int digit = x % 10;
               reversedHalf = reversedHalf * 10 + digit;
               x /= 10;
           }

           return x == reversedHalf || x == reversedHalf / 10;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_palindrome(x::Int)::Bool
       if x < 0 || (x != 0 && rem(x, 10) == 0)
           return false
       end

       reversed_half = 0
       while x > reversed_half
           digit = rem(x, 10)
           reversed_half = reversed_half * 10 + digit
           x = div(x, 10)
       end

       return x == reversed_half || x == div(reversed_half, 10)
   end

R
~

.. code-block:: r

   isPalindrome <- function(x) {
       if (x < 0 || (x != 0 && x %% 10 == 0)) {
           return(FALSE)
       }

       reversed_half <- 0
       while (x > reversed_half) {
           digit <- x %% 10
           reversed_half <- reversed_half * 10 + digit
           x <- x %/% 10
       }

       x == reversed_half || x == reversed_half %/% 10
   }
