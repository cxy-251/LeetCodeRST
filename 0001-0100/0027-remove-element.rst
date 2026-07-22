0027. Remove Element
====================

题目信息
--------

:题号: 0027
:题名: Remove Element
:难度: Easy
:类型: Algorithms
:主题: 数组、双指针
:原题: `LeetCode 0027 <https://leetcode.com/problems/remove-element/>`_

题目重述
--------

给定整数数组 ``nums`` 和整数 ``val``，在原数组上移除所有等于 ``val`` 的元素，并返回剩余元素数量 ``k``。修改后前 ``k`` 个位置必须保存全部剩余元素，顺序可以改变；后续位置的值不作要求。

自建示例
--------

.. code-block:: text

   输入：nums = [4, 1, 4, 2, 4], val = 4
   输出：k = 2，前两项可为 [1, 2]

.. code-block:: text

   输入：nums = [1, 2, 3], val = 9
   输出：k = 3
   解释：数组中没有需要移除的元素。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int eraseMatches(std::vector<int>& nums, int val) {
           for (int i = 0; i < static_cast<int>(nums.size());) {
               if (nums[i] == val) nums.erase(nums.begin() + i);
               else ++i;
           }
           return static_cast<int>(nums.size());
       }

       int stableCompaction(std::vector<int>& nums, int val) {
           int write = 0;
           for (int read = 0; read < static_cast<int>(nums.size()); ++read) {
               if (nums[read] != val) nums[write++] = nums[read];
           }
           return write;
       }

       int replaceFromEnd(std::vector<int>& nums, int val) {
           int index = 0;
           int active = static_cast<int>(nums.size());
           while (index < active) {
               if (nums[index] == val) {
                   nums[index] = nums[active - 1];
                   --active;
               } else {
                   ++index;
               }
           }
           return active;
       }

   public:
       int removeElement(std::vector<int>& nums, int val) {
           return stableCompaction(nums, val);
       }
   };

题解
----

直接删除为什么产生重复后缀移动
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

数组中间删除会把后续元素整体左移。目标值频繁出现时，每次删除都可能移动长后缀，最坏 ``O(n^2)``。题目只要求
有效前缀，覆盖槽位即可。

稳定压缩如何把元素分为保留与丢弃
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``read`` 依次检查原数组。当前值不等于 ``val`` 时写入 ``nums[write]`` 并增加 ``write``；等于目标时不写入。
``write`` 同时表示已保留数量、有效前缀长度和下一个写入位置。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 当前值
     - 分类
     - ``write``
     - 有效前缀
   * - 3
     - 丢弃
     - 0
     - 空
   * - 1
     - 保留
     - 1
     - 1
   * - 3
     - 丢弃
     - 1
     - 1
   * - 2
     - 保留
     - 2
     - 1,2
   * - 4
     - 保留
     - 3
     - 1,2,4

为什么向前写入不会覆盖未读元素
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``write`` 只在保留元素时增加，而 ``read`` 每轮都增加，因此始终 ``write <= read``。写入位置不会位于当前读取位置
之后，未来的 ``nums[read+1:]`` 不受影响。

尾部交换何时可以减少写入
~~~~~~~~~~~~~~~~~~~~~~~~

若目标值很多且顺序不重要，可以用活动区间最后一个元素覆盖目标位置，并缩短 ``active``。覆盖进来的元素尚未检查，
所以当前下标不能立即前进。该方法每遇到目标值只写一次，但会改变保留元素顺序。

为什么稳定前缀包含全部且仅包含保留元素
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

只有不等于 ``val`` 的元素会写入，因此前缀中没有错误元素。每个原元素又被读取一次，所有不等于 ``val`` 的元素
都会按读取顺序写入，所以没有遗漏。扫描结束时 ``write`` 正是剩余数量。

复杂度来源
~~~~~~~~~~

稳定压缩与尾部交换都为 ``O(n)`` 时间、``O(1)`` 空间。稳定压缩最坏写入 ``n`` 次；尾部交换在目标值较少时未必
更优，但目标值很多时可减少保留元素搬运。直接删除最坏 ``O(n^2)``。

九语言实现
----------

C
~

.. code-block:: c

   int removeElement(int* nums, int n, int val) {
       int write=0;
       for(int read=0;read<n;++read) if(nums[read]!=val) nums[write++]=nums[read];
       return write;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeElement(self, nums: list[int], val: int) -> int:
           write = 0
           for value in nums:
               if value != val:
                   nums[write] = value
                   write += 1
           return write

Java
~~~~

.. code-block:: java

   class Solution {
       public int removeElement(int[] nums,int val){
           int write=0;for(int value:nums)if(value!=val)nums[write++]=value;return write;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_element(nums:&mut Vec<i32>,val:i32)->i32{
           let mut write=0usize;
           for read in 0..nums.len(){let value=nums[read];if value!=val{nums[write]=value;write+=1;}}
           write as i32
       }
   }

Go
~~

.. code-block:: go

   func removeElement(nums []int,val int)int{
       write:=0;for _,value:=range nums{if value!=val{nums[write]=value;write++}};return write
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeElement(nums:number[],val:number):number{
       let write=0;for(const value of nums)if(value!==val)nums[write++]=value;return write;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int RemoveElement(int[] nums,int val){
           int write=0;foreach(int value in nums)if(value!=val)nums[write++]=value;return write;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function remove_element!(nums::Vector{Int}, val::Int)
       write=0
       for value in nums
           if value != val;write+=1;nums[write]=value;end
       end
       write
   end

R
~

.. code-block:: r

   remove_element <- function(nums, val) {
       write <- 0L
       for (value in nums) if (value != val) {
           write <- write + 1L
           nums[[write]] <- value
       }
       list(k=write, nums=nums)
   }
