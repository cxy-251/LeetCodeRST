0136. Single Number
===================

题目信息
--------

:题号: 0136
:难度: Easy
:主题: 数组、位运算、异或
:原题: `LeetCode 0136 <https://leetcode.com/problems/single-number/>`_
:访问状态: Available
:教学重点: 异或抵消、交换结合律、常量额外空间

题目重述
--------

给定一个非空整数数组，除一个元素只出现一次外，其余元素都恰好出现两次。返回只出现一次的元素。
算法不能修改输入，并要求线性时间与常量额外空间。

算法
----

把全部元素依次异或到变量 ``answer``。异或满足 ``x ^ x = 0``、``x ^ 0 = x``，并且满足交换律与
结合律。所有成对元素可以重新排列后互相抵消，最终只剩下唯一元素。

正确性
~~~~~~

循环处理完任意前缀后，``answer`` 等于该前缀全部元素的异或值。这个不变量由初始化 ``answer = 0``
和每次执行 ``answer ^= value`` 保持。扫描结束后，每个重复元素出现两次并异或为 ``0``，唯一元素只出现
一次，因此最终 ``answer`` 正是目标值。

复杂度
~~~~~~

扫描一次数组，时间 ``O(n)``；只维护一个整数，算法额外空间 ``O(1)``。TypeScript、R 等实现使用
32 位位运算，题目整数范围位于有符号 32 位域内。

核心语言实现
------------

C
~

.. code-block:: c

   int singleNumber(int *nums, int numsSize) {
       int answer = 0;
       for (int i = 0; i < numsSize; ++i) {
           answer ^= nums[i];
       }
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int singleNumber(std::vector<int>& nums) {
           int answer = 0;
           for (int value : nums) {
               answer ^= value;
           }
           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def singleNumber(self, nums: list[int]) -> int:
           answer = 0
           for value in nums:
               answer ^= value
           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int singleNumber(int[] nums) {
           int answer = 0;
           for (int value : nums) {
               answer ^= value;
           }
           return answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn single_number(nums: Vec<i32>) -> i32 {
           nums.into_iter().fold(0, |answer, value| answer ^ value)
       }
   }

Go
~~

.. code-block:: go

   func singleNumber(nums []int) int {
       answer := 0
       for _, value := range nums {
           answer ^= value
       }
       return answer
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(nums: number[]): number {
       let answer = 0;
       for (const value of nums) {
           answer ^= value;
       }
       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SingleNumber(int[] nums) {
           int answer = 0;
           foreach (int value in nums) {
               answer ^= value;
           }
           return answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function single_number(nums::Vector{Int})::Int
       answer = 0
       for value in nums
           answer = xor(answer, value)
       end
       return answer
   end

R
~

.. code-block:: r

   single_number <- function(nums) {
     answer <- 0L
     for (value in nums) {
       answer <- bitwXor(answer, as.integer(value))
     }
     answer
   }

关键边界
--------

* 单元素数组直接返回该元素；
* 唯一元素可以是负数或零；
* 不要使用集合计数，否则额外空间会变为 ``O(n)``；
* TypeScript 的位运算会把 ``number`` 转换为有符号 32 位整数，本题输入域允许这样做。

验证
----

运行两个官方示例，并补充单元素、零和负数边界；Python 与 C++ 结果一致。未执行随机对拍。

最小自检
--------

#. 为什么重复元素不需要相邻也能互相抵消？
#. 循环不变量是什么？
#. 为什么求和、排序或集合计数不满足本题的全部约束？
