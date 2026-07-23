0080. Remove Duplicates from Sorted Array II
============================================

题目信息
--------

:题号: 0080
:难度: Medium
:主题: 有序数组、双指针、原地覆盖
:原题: `LeetCode 0080 <https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/>`_
:教学重点: 最多保留两次、有效前缀、倒数第二项判断、稳定覆盖

题目重述
--------

给定非递减数组，在原数组中整理元素，使每个不同值最多保留两次，返回有效前缀长度 ``k``。调用者只检查 ``nums[0:k]``；后续内容无要求。保留元素的相对顺序不变，额外空间为常数。

自建示例
--------

.. code-block:: text

   [0,0,0,1,1,1,1,2,3,3]
   k = 7
   有效前缀 = [0,0,1,1,2,3,3]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int segmentCounting(std::vector<int>& nums) {
           int write = 0, read = 0;
           while (read < static_cast<int>(nums.size())) {
               int value = nums[read];
               int count = 0;
               while (read < static_cast<int>(nums.size()) && nums[read] == value) {
                   ++read; ++count;
               }
               int keep = count < 2 ? count : 2;
               while (keep-- > 0) nums[write++] = value;
           }
           return write;
       }

       int explicitRunCount(std::vector<int>& nums) {
           int write = 0, run = 0;
           for (int read = 0; read < static_cast<int>(nums.size()); ++read) {
               if (read == 0 || nums[read] != nums[read - 1]) run = 1;
               else ++run;
               if (run <= 2) nums[write++] = nums[read];
           }
           return write;
       }

       int compareSecondLast(std::vector<int>& nums) {
           int write = 0;
           for (int value : nums) {
               if (write < 2 || value != nums[write - 2])
                   nums[write++] = value;
           }
           return write;
       }

   public:
       int removeDuplicates(std::vector<int>& nums) {
           return compareSecondLast(nums);
       }
   };

题解
----

有序性带来了什么
~~~~~~~~~~~~~~~~

相同值连续出现。处理当前重复段时，只需保留它的前两个副本；一旦进入更大值，旧值永远不会再次出现。因此无需哈希计数或全局集合。

读写指针保存什么
~~~~~~~~~~~~~~~~

``write`` 同时表示有效前缀长度和下一个写入位置。每轮读取当前值前，``nums[0:write]`` 已是扫描前缀按规则过滤后的稳定结果，且每个值最多出现两次。

为什么前两个元素总能保留
~~~~~~~~~~~~~~~~~~~~~~

当 ``write < 2`` 时，有效前缀不足两个元素，不可能已经保存当前值两个副本，因此直接写入。

为什么比较倒数第二项足够
~~~~~~~~~~~~~~~~~~~~~~~~

当 ``write >= 2`` 时，若 ``value == nums[write-2]``，由于有效前缀和输入都非递减，``nums[write-1]`` 也只能等于该值，所以当前值将成为第三个或更后的副本，应跳过。

若 ``value != nums[write-2]``，当前值在有效前缀末尾最多只出现一次，写入后仍满足最多两次。

.. list-table::
   :header-rows: 1

   * - 读取值
     - write 前缀
     - 动作
   * - 0
     - ``[]``
     - 保留
   * - 0
     - ``[0]``
     - 保留
   * - 第三个 0
     - ``[0,0]``
     - 与倒数第二项相同，跳过
   * - 1
     - ``[0,0]``
     - 不同，保留
   * - 第三个及后续 1
     - ``[...,1,1]``
     - 跳过

为什么覆盖不会破坏未读输入
~~~~~~~~~~~~~~~~~~~~~~~~~~

``write`` 从不超过已读取元素数量。写入位置位于当前读取位置或其左侧；当前 ``value`` 已由循环变量保存，即使覆盖当前槽也不会影响本轮，未来尚未读取位置不会被改写。

显式 run 计数与倒数第二项的关系
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``explicitRunCount`` 直接记录当前重复段内第几个副本；倒数第二项方法把这个计数隐含在有效前缀末尾，只需一次比较，代码可推广为“每值最多保留 ``limit`` 次”时比较 ``nums[write-limit]``。

为什么结果稳定且完整
~~~~~~~~~~~~~~~~~~~~

输入从左到右扫描，允许保留的副本按原顺序写入；每段恰好保留 ``min(count,2)`` 个，因此没有遗漏应保留元素，也没有多保留副本。

复杂度来源
~~~~~~~~~~

三种方法都扫描数组一次，时间 ``O(n)``。只使用下标和少量计数，额外空间 ``O(1)``；有效前缀之外的值无需清理。

九语言实现
----------

C
~

.. code-block:: c

   int removeDuplicates(int*a,int n){int write=0;for(int read=0;read<n;read++)if(write<2||a[read]!=a[write-2])a[write++]=a[read];return write;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeDuplicates(self, a: list[int]) -> int:
           write=0
           for value in a:
               if write<2 or value!=a[write-2]:a[write]=value;write+=1
           return write

Java
~~~~

.. code-block:: java

   class Solution {public int removeDuplicates(int[]a){int write=0;for(int value:a)if(write<2||value!=a[write-2])a[write++]=value;return write;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn remove_duplicates(a:&mut Vec<i32>)->i32{let mut write=0;for read in 0..a.len(){let value=a[read];if write<2||value!=a[write-2]{a[write]=value;write+=1}}write as i32}}

Go
~~

.. code-block:: go

   func removeDuplicates(a []int)int{write:=0;for _,value:=range a{if write<2||value!=a[write-2]{a[write]=value;write++}};return write}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeDuplicates(a:number[]):number{let write=0;for(const value of a)if(write<2||value!==a[write-2])a[write++]=value;return write;}

C#
~~

.. code-block:: csharp

   public class Solution {public int RemoveDuplicates(int[]a){int write=0;foreach(int value in a)if(write<2||value!=a[write-2])a[write++]=value;return write;}}

Julia
~~~~~

.. code-block:: julia

   function remove_duplicates!(a)
       write=0
       for value in a;if write<2||value!=a[write-1];write+=1;a[write]=value;end;end
       write
   end

R
~

.. code-block:: r

   remove_duplicates_twice <- function(a){write<-0L;for(value in a)if(write<2L||value!=a[[write-1L]]){write<-write+1L;a[[write]]<-value};list(k=write,nums=a)}
