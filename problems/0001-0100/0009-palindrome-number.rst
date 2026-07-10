0009. Palindrome Number
=======================

题目信息
--------

* 原题：`LeetCode 9 <https://leetcode.com/problems/palindrome-number/>`_
* 难度：Easy

题目重述
--------

判断一个整数从左到右与从右到左读取时是否相同。负数不是回文数；除 0 外，末尾为 0 的整数也不可能是回文数。

主解法：只反转后一半数字
------------------------

完整反转可能产生溢出，也做了不必要的工作。维护 ``reversed_half``，不断把 ``x`` 的末位弹出并追加进去，直到 ``reversed_half >= x``。偶数位回文要求两半相等；奇数位回文允许反转部分多出中间一位，因此比较 ``x == reversed_half / 10``。

循环不变量：``x`` 保存尚未移动的前半部分，``reversed_half`` 保存已经移动的后半部分且顺序反转。

正确性依据
~~~~~~~~~~

每轮恰好把原数当前最低位移动到 ``reversed_half`` 末尾。当反转部分不小于剩余部分时，至少一半数字已被处理。偶数位数的两半应完全相等；奇数位数中间数字不影响镜像关系，删除 ``reversed_half`` 的末位后再比较即可。

复杂度
~~~~~~

只处理约一半数字，时间复杂度为 ``O(log x)``，额外空间复杂度为 ``O(1)``。

C
~

.. code-block:: c

   bool isPalindrome(int x) {
       if (x < 0 || (x % 10 == 0 && x != 0)) return false;
       int reversed_half = 0;
       while (x > reversed_half) {
           reversed_half = reversed_half * 10 + x % 10;
           x /= 10;
       }
       return x == reversed_half || x == reversed_half / 10;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isPalindrome(int x) {
           if (x < 0 || (x % 10 == 0 && x != 0)) return false;
           int reversed = 0;
           while (x > reversed) { reversed = reversed * 10 + x % 10; x /= 10; }
           return x == reversed || x == reversed / 10;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isPalindrome(self, x: int) -> bool:
           if x < 0 or (x % 10 == 0 and x != 0): return False
           reversed_half = 0
           while x > reversed_half:
               reversed_half = reversed_half * 10 + x % 10
               x //= 10
           return x == reversed_half or x == reversed_half // 10

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isPalindrome(int x) {
           if (x < 0 || (x % 10 == 0 && x != 0)) return false;
           int reversed = 0;
           while (x > reversed) { reversed = reversed * 10 + x % 10; x /= 10; }
           return x == reversed || x == reversed / 10;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_palindrome(mut x: i32) -> bool {
           if x < 0 || (x % 10 == 0 && x != 0) { return false; }
           let mut reversed = 0;
           while x > reversed { reversed = reversed * 10 + x % 10; x /= 10; }
           x == reversed || x == reversed / 10
       }
   }

Go
~~

.. code-block:: go

   func isPalindrome(x int) bool {
       if x < 0 || x%10 == 0 && x != 0 { return false }
       reversed := 0
       for x > reversed { reversed = reversed*10 + x%10; x /= 10 }
       return x == reversed || x == reversed/10
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isPalindrome(x: number): boolean {
       if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
       let reversed = 0;
       while (x > reversed) { reversed = reversed * 10 + x % 10; x = Math.trunc(x / 10); }
       return x === reversed || x === Math.trunc(reversed / 10);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsPalindrome(int x) {
           if (x < 0 || (x % 10 == 0 && x != 0)) return false;
           int reversed = 0;
           while (x > reversed) { reversed = reversed * 10 + x % 10; x /= 10; }
           return x == reversed || x == reversed / 10;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function ispalindrome(x::Int)::Bool
       (x < 0 || (x % 10 == 0 && x != 0)) && return false
       reversed = 0
       while x > reversed; reversed = reversed * 10 + x % 10; x ÷= 10; end
       return x == reversed || x == reversed ÷ 10
   end

R
~

.. code-block:: r

   is_palindrome <- function(x) {
     if (x < 0 || (x %% 10 == 0 && x != 0)) return(FALSE)
     reversed <- 0
     while (x > reversed) { reversed <- reversed * 10 + x %% 10; x <- floor(x / 10) }
     x == reversed || x == floor(reversed / 10)
   }

易错点
------

* ``10``、``100`` 等末尾为 0 的非零整数必须提前排除。
* 奇数位数需要忽略中间数字。
* 只反转一半可避免 32 位溢出。

自检
----

#. 为什么负数一定不是回文数？
#. ``12321`` 停止时哪一边多出一位？
#. 为什么 ``0`` 不能被“末尾为 0”规则排除？

答案要点：负号没有右侧镜像；反转部分多出中间数字；0 本身从两端读取相同。