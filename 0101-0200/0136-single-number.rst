0136. Single Number
===================

题目信息
--------

:题号: 0136
:难度: Easy
:主题: 数组、位运算、异或、常量空间
:原题: `LeetCode 0136 <https://leetcode.com/problems/single-number/>`_
:重点: 唯一单次出现、其余恰好两次、线性时间、常量额外空间

题目重述
--------

给定非空整数数组 ``nums``，其中恰有一个元素只出现一次，其余每个元素都恰好出现两次。返回只出现一次的元素。算法必须在线性时间内完成，并且只能使用常量级额外空间。

数组长度在 ``1..3 × 10^4`` 范围内，元素值在 ``-3 × 10^4..3 × 10^4`` 范围内。

自建示例
--------

.. code-block:: text

   输入：nums = [11,-2,7,11,7]
   输出：-2
   解释：11 和 7 都各出现两次，只有 -2 出现一次。

.. code-block:: text

   输入：nums = [0,5,5]
   输出：0
   解释：5 出现两次并相互抵消，0 是唯一只出现一次的元素。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       int sorting(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           for (int i = 0; i + 1 < static_cast<int>(nums.size()); i += 2)
               if (nums[i] != nums[i + 1]) return nums[i];
           return nums.back();
       }

       int counting(const std::vector<int>& nums) {
           std::unordered_map<int,int> count;
           for (int value : nums) ++count[value];
           for (auto [value, frequency] : count) if (frequency == 1) return value;
           return 0;
       }

       int xorReduction(const std::vector<int>& nums) {
           int answer = 0;
           for (int value : nums) answer ^= value;
           return answer;
       }

   public:
       int singleNumber(std::vector<int>& nums) {
           return xorReduction(nums);
       }
   };

题解
----

异或为何适配成对出现
~~~~~~~~~~~~~~~~~~~~

固定宽机器整数逐位异或满足：

.. code-block:: text

   x ^ 0 = x
   x ^ x = 0
   x ^ y = y ^ x
   (x ^ y) ^ z = x ^ (y ^ z)

因此全部输入可在证明中任意重排，把每对相同值放在一起消成 0，最后只剩唯一值。

负数为何同样成立
~~~~~~~~~~~~~~~~

异或操作处理的是固定宽比特模式。负数的补码表示也满足相同代数性质，``x ^ x`` 仍然逐位归零，不需要单独处理符号位。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 读入值
     - 累计异或
   * - 7
     - 7
   * - -4
     - ``7 ^ -4``
   * - 9
     - ``7 ^ -4 ^ 9``
   * - 7,9
     - 两对消去，剩 -4

为什么初值 0 不会丢失答案 0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

0 是异或单位元，不是“未找到”的哨兵。唯一值为 0 时，其他成对值仍全部消去，最终自然得到 0。

复杂度来源
~~~~~~~~~~

排序为 ``O(n log n)``；哈希计数为 ``O(n)`` 空间；异或归约扫描一次，时间 ``O(n)``、额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int singleNumber(int*nums,int n){int answer=0;for(int i=0;i<n;i++)answer^=nums[i];return answer;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def singleNumber(self, nums: list[int]) -> int:
           answer=0
           for value in nums: answer ^= value
           return answer

Java
~~~~

.. code-block:: java

   class Solution {public int singleNumber(int[]nums){int answer=0;for(int value:nums)answer^=value;return answer;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn single_number(nums:Vec<i32>)->i32{nums.into_iter().fold(0,|a,x|a^x)}}

Go
~~

.. code-block:: go

   func singleNumber(nums []int)int{answer:=0;for _,value:=range nums{answer^=value};return answer}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(nums:number[]):number{let answer=0;for(const value of nums)answer^=value;return answer;}

C#
~~

.. code-block:: csharp

   public class Solution {public int SingleNumber(int[]nums){int answer=0;foreach(int value in nums)answer^=value;return answer;}}

Julia
~~~~~

.. code-block:: julia

   single_number(nums)=foldl(xor,nums;init=0)

R
~

.. code-block:: r

   single_number <- function(nums){answer<-0L;for(value in nums)answer<-bitwXor(answer,as.integer(value));answer}