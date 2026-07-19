0009. Palindrome Number
=======================

题目信息
--------

:题号: 0009
:难度: Easy
:主题: 数学、十进制数字、回文、半反转
:原题: `LeetCode 0009 <https://leetcode.com/problems/palindrome-number/>`_
:访问状态: Available
:教学重点: 快速排除、只反转后一半、停止条件、奇数位中间数字、溢出规避

题目重述
--------

给定一个整数 ``x``，判断它的十进制表示从左向右和从右向左读取时是否相同。

负号属于表示的一部分，因此负数不是回文数。除 ``0`` 外，末位为 ``0`` 的整数也不是
回文数：若它是回文，首位也必须是 ``0``，而普通十进制整数没有前导零。

本题要求直接处理整数，不把它转换为字符串。

自建示例
--------

偶数位回文
~~~~~~~~~~

.. code-block:: text

   输入：1221
   逐步把右半部分反转到 reversed_half：1 -> 12
   剩余左半部分 x：1221 -> 122
   此时 12 == 12
   输出：true

奇数位回文
~~~~~~~~~~

.. code-block:: text

   输入：12321
   reversed_half：1 -> 12 -> 123
   剩余 x：12321 -> 1232 -> 123
   中间数字 3 不需要配对，因此比较 123 / 10 与 12
   输出：true

末尾零
~~~~~~

.. code-block:: text

   输入：120
   若从右侧读取，会得到 021；首位不可能是 0。
   输出：false

单个数字
~~~~~~~~

.. code-block:: text

   输入：7
   循环无需执行，7 / 10 == 0。
   输出：true

问题抽象
--------

回文要求左半部分与右半部分镜像相等。无需反转整个整数，只需反复从原数末尾弹出一位，
并把它压入 ``reversed_half``，直到后者的位数达到或超过剩余部分。

每轮执行：

.. math::

   digit = x \bmod 10

.. math::

   reversed\_half = reversed\_half \times 10 + digit

.. math::

   x = \left\lfloor x / 10 \right\rfloor

因为快速排除后只处理非负整数，各语言的整数除法与余数语义一致。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 只反转数字后一半
     - ``O(log x)``
     - ``O(1)``
     - 主解法；只处理一半数字，并自然规避完整反转的溢出
   * - 完整反转后比较
     - ``O(log x)``
     - ``O(1)``
     - 代码直观，但必须额外处理完整反转溢出
   * - 转换为字符串后双指针
     - ``O(log x)``
     - ``O(log x)``
     - 工程上简单，但隐藏了十进制逐位处理，并使用额外存储

主解法：只反转数字后一半
--------------------------

快速排除
~~~~~~~~

开始循环前先处理两类必然失败的输入：

* ``x < 0``：负号只在左侧出现；
* ``x != 0 && x % 10 == 0``：末位为零却没有对应的前导零。

``0`` 必须保留为回文数，因此末尾零判断不能直接写成 ``x % 10 == 0``。

状态含义
~~~~~~~~

算法维护两个非负整数：

* ``x``：尚未处理的左侧部分；
* ``reversed_half``：已经从原数右侧取出的数字，按反向顺序重新组成的整数。

例如原数 ``12321``：

.. code-block:: text

   初始：x = 12321, reversed_half = 0
   一轮：x = 1232,  reversed_half = 1
   二轮：x = 123,   reversed_half = 12
   三轮：x = 12,    reversed_half = 123

停止条件为什么是 ``x > reversed_half``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮让 ``x`` 少一位，让 ``reversed_half`` 多一位。当 ``x <= reversed_half`` 时，右侧
已经取出至少一半数字：

* 偶数位数时，两边位数相同；
* 奇数位数时，``reversed_half`` 比 ``x`` 多一位，多出的正是中间数字。

因此循环条件使用 ``x > reversed_half``。它不是在比较两半的最终大小，而是借助位数变化
判断何时已经处理到中间。

最终比较
~~~~~~~~

偶数位回文满足：

.. math::

   x = reversed\_half

奇数位回文的中间数字无需配对，它位于 ``reversed_half`` 的末位。整数除以 ``10`` 删除它：

.. math::

   x = \left\lfloor reversed\_half / 10 \right\rfloor

因此统一返回：

.. code-block:: text

   x == reversed_half 或 x == reversed_half / 10

核心不变量
~~~~~~~~~~

每轮循环开始时：

* 原始整数的尚未处理前缀保存在 ``x`` 中；
* 已处理后缀的逆序值保存在 ``reversed_half`` 中；
* 把 ``reversed_half`` 的数字再次反转并接到 ``x`` 右侧，可恢复原始数字序列；
* 每轮恰好移动一位，因此不会跳过或重复处理任何数字。

正确性依据
~~~~~~~~~~

快速排除首先删除所有不可能成为回文的负数和非零末尾零整数，同时保留 ``0``。

循环每次从 ``x`` 的末尾取出一位，并把它追加到 ``reversed_half``。由十进制位值定义，
经过 ``k`` 轮后，``reversed_half`` 恰好是原数最后 ``k`` 位的逆序，``x`` 恰好是删除这
``k`` 位后的前缀，因此不变量成立。

当 ``x <= reversed_half`` 时，右侧已取出至少一半数字。若原数位数为偶数，两部分位数
相同，回文当且仅当二者相等。若位数为奇数，``reversed_half`` 多出的最低位来自原数
中间位置，删除它后，两侧镜像部分必须相等。最终两个比较恰好覆盖这两种情况，所以算法
返回 ``true`` 当且仅当原数是回文数。

为什么不会溢出
~~~~~~~~~~~~~~

完整反转最多构造与原数位数相同的整数，可能超过 32 位范围。半反转只处理约一半数字。
对于 32 位输入，``reversed_half`` 最多约为五到六位；即使循环在交叉处多处理一位，仍远小于
32 位有符号整数上限。于是主解法无需额外溢出分支。

复杂度
~~~~~~

设输入绝对值的十进制位数为 ``d``。

* 时间复杂度：``O(d)``，等价于 ``O(log x)``，实际只处理约一半数字；
* 空间复杂度：``O(1)``，只维护固定数量的整数。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <stdbool.h>

   bool isPalindrome(int x) {
       if (x < 0 || (x != 0 && x % 10 == 0)) {
           return false;
       }

       int reversed_half = 0;
       while (x > reversed_half) {
           // 每轮把 x 的末位移动到 reversed_half 末尾。
           reversed_half = reversed_half * 10 + x % 10;
           x /= 10;
       }

       // 奇数位时，/ 10 去掉 reversed_half 中的中间数字。
       return x == reversed_half || x == reversed_half / 10;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       bool isPalindrome(int x) {
           if (x < 0 || (x != 0 && x % 10 == 0)) {
               return false;
           }

           int reversedHalf = 0;
           while (x > reversedHalf) {
               reversedHalf = reversedHalf * 10 + x % 10;
               x /= 10;
           }

           return x == reversedHalf || x == reversedHalf / 10;
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def isPalindrome(self, x: int) -> bool:
           if x < 0 or (x != 0 and x % 10 == 0):
               return False

           reversed_half = 0
           while x > reversed_half:
               reversed_half = reversed_half * 10 + x % 10
               # 此时 x 非负，// 10 等价于删除十进制末位。
               x //= 10

           return x == reversed_half or x == reversed_half // 10

Java
^^^^

.. code-block:: java

   class Solution {
       public boolean isPalindrome(int x) {
           if (x < 0 || (x != 0 && x % 10 == 0)) {
               return false;
           }

           int reversedHalf = 0;
           while (x > reversedHalf) {
               reversedHalf = reversedHalf * 10 + x % 10;
               x /= 10;
           }

           return x == reversedHalf || x == reversedHalf / 10;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn is_palindrome(mut x: i32) -> bool {
           if x < 0 || (x != 0 && x % 10 == 0) {
               return false;
           }

           let mut reversed_half = 0_i32;
           while x > reversed_half {
               reversed_half = reversed_half * 10 + x % 10;
               x /= 10;
           }

           x == reversed_half || x == reversed_half / 10
       }
   }

Go
^^

.. code-block:: go

   func isPalindrome(x int) bool {
       if x < 0 || (x != 0 && x%10 == 0) {
           return false
       }

       reversedHalf := 0
       for x > reversedHalf {
           reversedHalf = reversedHalf*10 + x%10
           x /= 10
       }

       return x == reversedHalf || x == reversedHalf/10
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function isPalindrome(x: number): boolean {
       if (x < 0 || (x !== 0 && x % 10 === 0)) {
           return false;
       }

       let reversedHalf = 0;
       while (x > reversedHalf) {
           reversedHalf = reversedHalf * 10 + x % 10;
           // number 除法会产生小数，Math.trunc 才是删除末位。
           x = Math.trunc(x / 10);
       }

       return x === reversedHalf ||
           x === Math.trunc(reversedHalf / 10);
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public bool IsPalindrome(int x) {
           if (x < 0 || (x != 0 && x % 10 == 0)) {
               return false;
           }

           int reversedHalf = 0;
           while (x > reversedHalf) {
               reversedHalf = reversedHalf * 10 + x % 10;
               x /= 10;
           }

           return x == reversedHalf || x == reversedHalf / 10;
       }
   }

Julia
^^^^^

.. code-block:: julia

   function is_palindrome(x::Int)::Bool
       if x < 0 || (x != 0 && x % 10 == 0)
           return false
       end

       reversed_half = 0
       while x > reversed_half
           reversed_half = reversed_half * 10 + x % 10
           # div 执行整数除法；输入已保证非负。
           x = div(x, 10)
       end

       return x == reversed_half || x == div(reversed_half, 10)
   end

R
^

.. code-block:: r

   isPalindrome <- function(x) {
       if (x < 0 || (x != 0 && x %% 10 == 0)) {
           return(FALSE)
       }

       reversed_half <- 0
       while (x > reversed_half) {
           reversed_half <- reversed_half * 10 + x %% 10
           # %/% 是整数商；本题输入在 32 位范围内，可由 double 精确表示。
           x <- x %/% 10
       }

       x == reversed_half || x == reversed_half %/% 10
   }

关键边界与易错点
----------------

* 忘记排除负数，会把 ``-121`` 的数字部分误判为回文；
* 把所有末位零都排除，会错误拒绝 ``0``；
* 循环条件写成固定次数，需要先计算位数，状态更复杂；
* 奇数位比较时忘记 ``reversed_half / 10``，会错误拒绝 ``121``；
* TypeScript 直接使用 ``x / 10`` 会保留小数，必须 ``Math.trunc``；
* 不要在循环中修改原始值后再尝试与完整反转比较；主解法比较的是两半状态；
* 完整反转方案若使用 32 位整数，必须额外处理溢出，半反转无需承担该风险。

新增与强化知识
--------------

新增
~~~~

* **半反转停止法**：让剩余前缀递减、已反转后缀递增，以 ``x > reversed_half`` 判断交叉点；
* **奇数位中心消除**：用 ``reversed_half / 10`` 去掉无需配对的中间数字；
* **结构性溢出规避**：通过不构造完整反转值，从算法设计层面消除溢出风险。

强化
~~~~

* 0007 的十进制“弹出末位、压入结果”再次出现，但本题只移动一半数字；
* 非负整数上的整除和余数语义在十种语言中保持一致；
* 快速排除条件必须明确保留合法特例 ``0``。

关联题目
--------

* `0005. Longest Palindromic Substring <0005-longest-palindromic-substring.rst>`_：同样利用回文
  对称性，但处理对象从整数数字变为字符串区间；
* `0007. Reverse Integer <0007-reverse-integer.rst>`_：复用逐位弹出与压入，本题通过只反转
  一半避免完整反转溢出。

最小自检
--------

#. 为什么 ``10`` 一定不是回文，而 ``0`` 是回文？
#. ``12321`` 循环结束时，为什么比较 ``x == reversed_half / 10``？
#. ``x > reversed_half`` 如何同时适用于奇数位和偶数位整数？
#. 半反转为什么不需要 0007 那样的完整溢出判断？
#. TypeScript 中为什么不能直接写 ``x = x / 10``？

答案要点
~~~~~~~~

#. 非零末位零要求不存在的前导零；``0`` 本身左右读取相同；
#. ``reversed_half`` 多出的最低位是中间数字，除以 ``10`` 后再比较镜像两侧；
#. 两个状态每轮一减一增，交叉时已经处理至少一半数字；
#. 32 位输入只构造约一半位数的反转值，不会接近 32 位上限；
#. TypeScript 的 ``number`` 除法产生浮点结果，``Math.trunc`` 才表示删除末位。
