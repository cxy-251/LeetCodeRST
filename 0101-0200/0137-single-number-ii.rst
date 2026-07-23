0137. Single Number II
======================

题目信息
--------

:题号: 0137
:难度: Medium
:主题: 数组、位运算、有限状态机、模计数
:原题: `LeetCode 0137 <https://leetcode.com/problems/single-number-ii/>`_
:重点: 每位模三、``ones/twos`` 状态、完整有符号 32 位

题目重述
--------

非空整数数组中恰有一个值出现一次，其余每个值恰好出现三次。在线性时间、常数额外空间内返回唯一值。

自建示例
--------

.. code-block:: text

   [6,-9,6,12,12,6,12] -> -9
   [-2147483648,7,7,7] -> -2147483648

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <cstdint>
   #include <vector>

   class Solution {
   private:
       int sorting(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           for (int i = 0; i < static_cast<int>(nums.size()); i += 3)
               if (i + 1 == static_cast<int>(nums.size()) || nums[i] != nums[i + 1]) return nums[i];
           return nums.back();
       }

       int bitCounting(const std::vector<int>& nums) {
           std::uint32_t result = 0;
           for (int bit = 0; bit < 32; ++bit) {
               int count = 0;
               for (int value : nums) count += (static_cast<std::uint32_t>(value) >> bit) & 1u;
               if (count % 3) result |= 1u << bit;
           }
           return static_cast<std::int32_t>(result);
       }

       int finiteStateMachine(const std::vector<int>& nums) {
           std::uint32_t ones = 0, twos = 0;
           for (int value : nums) {
               std::uint32_t x = static_cast<std::uint32_t>(value);
               ones = (ones ^ x) & ~twos;
               twos = (twos ^ x) & ~ones;
           }
           return static_cast<std::int32_t>(ones);
       }

   public:
       int singleNumber(std::vector<int>& nums) {
           return finiteStateMachine(nums);
       }
   };

题解
----

单个位需要什么状态
~~~~~~~~~~~~~~~~~~

某一位读到的 1 的数量只需保留模 3 余数：

.. code-block:: text

   0 -> 1 -> 2 -> 0

用 ``ones`` 表示余数 1 的位，用 ``twos`` 表示余数 2 的位；两者在同一位不会同时为 1。

状态转移
~~~~~~~~

.. code-block:: text

   ones = (ones ^ x) & ~twos
   twos = (twos ^ x) & ~ones

异或先尝试翻转当前状态，随后用另一状态的补集清除非法重叠。一个输入位连续出现三次后，``ones`` 和 ``twos`` 都回到 0。

.. list-table::
   :header-rows: 1

   * - 同一位累计次数
     - ``ones``
     - ``twos``
   * - 0
     - 0
     - 0
   * - 1
     - 1
     - 0
   * - 2
     - 0
     - 1
   * - 3
     - 0
     - 0

为什么最终 ones 是答案
~~~~~~~~~~~~~~~~~~~~~~

三次出现的值在每一位上贡献 0 或 3 个 1，模 3 后全部归零。唯一值的每个 1 位只出现一次，最终恰好保存在 ``ones`` 中。

负数与符号位
~~~~~~~~~~~~

算法对完整 32 位比特模式操作，最高位与其他位完全相同。固定宽语言直接保留补码；使用无符号中间状态可以避免移位与溢出歧义，最后再解释为有符号 32 位整数。

复杂度来源
~~~~~~~~~~

逐位计数是 ``O(32n)``，状态机是 ``O(n)``；两者额外空间均为 ``O(1)``。状态机常数更小。

九语言实现
----------

C
~

.. code-block:: c

   int singleNumber(int*nums,int n){uint32_t ones=0,twos=0;for(int i=0;i<n;i++){uint32_t x=(uint32_t)nums[i];ones=(ones^x)&~twos;twos=(twos^x)&~ones;}return(int32_t)ones;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def singleNumber(self, nums: list[int]) -> int:
           mask=(1<<32)-1; ones=twos=0
           for value in nums:
               x=value&mask; ones=((ones^x)&~twos)&mask; twos=((twos^x)&~ones)&mask
           return ones if ones < 1<<31 else ones-(1<<32)

Java
~~~~

.. code-block:: java

   class Solution {public int singleNumber(int[]nums){int ones=0,twos=0;for(int x:nums){ones=(ones^x)&~twos;twos=(twos^x)&~ones;}return ones;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn single_number(nums:Vec<i32>)->i32{let(mut ones,mut twos)=(0u32,0u32);for v in nums{let x=v as u32;ones=(ones^x)&!twos;twos=(twos^x)&!ones;}ones as i32}}

Go
~~

.. code-block:: go

   func singleNumber(nums []int)int{ones,twos:=0,0;for _,x:=range nums{ones=(ones^x)&^twos;twos=(twos^x)&^ones};return ones}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(nums:number[]):number{let ones=0,twos=0;for(const x of nums){ones=(ones^x)&~twos;twos=(twos^x)&~ones;}return ones;}

C#
~~

.. code-block:: csharp

   public class Solution {public int SingleNumber(int[]nums){int ones=0,twos=0;foreach(int x in nums){ones=(ones^x)&~twos;twos=(twos^x)&~ones;}return ones;}}

Julia
~~~~~

.. code-block:: julia

   function single_number_ii(nums)
       ones=UInt32(0);twos=UInt32(0)
       for value in nums;x=reinterpret(UInt32,Int32(value));ones=(ones⊻x)&~twos;twos=(twos⊻x)&~ones;end
       Int(reinterpret(Int32,ones))
   end

R
~

.. code-block:: r

   single_number_ii <- function(nums){bits<-numeric(32L);for(value in nums){u<-if(value<0)value+2^32 else value;for(b in 0:31)bits[[b+1L]]<-(bits[[b+1L]]+floor(u/2^b)%%2)%%3};u<-sum((bits%%3)*2^(0:31));if(u>=2^31)u-2^32 else u}