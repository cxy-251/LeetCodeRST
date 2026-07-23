0026. Remove Duplicates from Sorted Array
=========================================

题目信息
--------

:题号: 0026
:难度: Easy
:主题: 数组、双指针、原地修改
:原题: `LeetCode 0026 <https://leetcode.com/problems/remove-duplicates-from-sorted-array/>`_
:重点: 非递减数组、每个值只保留一次、有效前缀、常量额外空间

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums``，在原数组中删除重复值的逻辑影响，使每个不同数值只在开头的有效区域中出现一次，并返回不同数值的数量 ``k``。

处理完成后，``nums`` 的前 ``k`` 个位置必须按原顺序保存全部不同值；下标 ``k`` 及其后的内容不作要求。不得另行分配用于保存完整结果的数组，额外空间应为 ``O(1)``。

``nums`` 的长度位于 ``[1, 3 * 10^4]``，每个元素位于 ``[-100, 100]``。

自建示例
--------

多段重复值：

.. code-block:: text

   输入：nums = [-2, -2, -1, -1, -1, 3, 3, 5]
   输出：k = 4，nums 的前 4 个元素为 [-2, -1, 3, 5]
   解释：数组中共有四个不同值；第 4 个位置之后的内容无需检查。

没有重复值：

.. code-block:: text

   输入：nums = [0, 2, 4, 7]
   输出：k = 4，nums 的前 4 个元素为 [0, 2, 4, 7]
   解释：所有元素都不同，有效前缀就是整个数组。

所有值相同：

.. code-block:: text

   输入：nums = [6, 6, 6, 6]
   输出：k = 1，nums 的第一个元素为 6
   解释：数值 6 只保留一次。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int eraseDuplicates(std::vector<int>& nums) {
           for (int i = 1; i < static_cast<int>(nums.size());) {
               if (nums[i] == nums[i - 1]) nums.erase(nums.begin() + i);
               else ++i;
           }
           return static_cast<int>(nums.size());
       }

       int copyDistinct(std::vector<int>& nums) {
           if (nums.empty()) return 0;
           std::vector<int> distinct{nums[0]};
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] != distinct.back()) distinct.push_back(nums[i]);
           }
           for (int i = 0; i < static_cast<int>(distinct.size()); ++i) nums[i] = distinct[i];
           return static_cast<int>(distinct.size());
       }

       int twoPointers(std::vector<int>& nums) {
           if (nums.empty()) return 0;
           int write = 1;
           for (int read = 1; read < static_cast<int>(nums.size()); ++read) {
               if (nums[read] != nums[write - 1]) {
                   nums[write] = nums[read];
                   ++write;
               }
           }
           return write;
       }

   public:
       int removeDuplicates(std::vector<int>& nums) {
           return twoPointers(nums);
       }
   };

题解
----

直接删除为什么可能反复移动后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

数组中间删除一个元素需要把后续槽位整体左移。重复值很多时，每次 ``erase`` 都移动长后缀，最坏时间达到
``O(n^2)``。题目只要求正确的有效前缀，无需真的缩短数组。

有序性如何把全局去重变成相邻段判断
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

非递减数组中，相同值必然形成连续区间。扫描当前值时，只需与最近保留值比较：相等表示仍在同一重复段；不等表示
进入一个从未保留的新值段。

读写指针分别保存什么
~~~~~~~~~~~~~~~~~~~~

``read`` 遍历原始元素；``write`` 既是有效前缀长度，也是下一个新值的写入位置。非空数组的第一个值必然保留，
所以初始 ``write = 1``。发现 ``nums[read] != nums[write-1]`` 时写入并增加 ``write``。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``read`` 值
     - 最近保留值
     - 动作
     - 有效前缀
   * - 1
     - 1
     - 跳过
     - 1
   * - 2
     - 1
     - 写入
     - 1,2
   * - 2
     - 2
     - 跳过
     - 1,2
   * - 4
     - 2
     - 写入
     - 1,2,4
   * - 5
     - 4
     - 写入
     - 1,2,4,5

为什么向前覆盖不会破坏未来读取
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

始终有 ``write <= read``。写入位置要么等于当前读取位置，要么位于它之前，从不覆盖 ``read+1`` 之后尚未扫描的
元素。因此读写指针可以安全共用同一数组。

为什么每个不同值恰好保留一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个连续值段的第一个元素与最近保留值不同，会被写入；该段其余元素都相等，会被跳过。所有值段按原顺序扫描，
所以既不漏掉不同值，也不会重复保留。扫描结束时 ``write`` 正好等于值段数量。

复杂度来源
~~~~~~~~~~

双指针读取每个元素一次，时间 ``O(n)``，额外空间 ``O(1)``。额外数组方法时间 ``O(n)``、空间 ``O(n)``；直接
删除最坏 ``O(n^2)``。

九语言实现
----------

C
~

.. code-block:: c

   int removeDuplicates(int* nums, int n) {
       if (n == 0) return 0;
       int write = 1;
       for (int read = 1; read < n; ++read)
           if (nums[read] != nums[write - 1]) nums[write++] = nums[read];
       return write;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeDuplicates(self, nums: list[int]) -> int:
           if not nums: return 0
           write = 1
           for read in range(1, len(nums)):
               if nums[read] != nums[write - 1]:
                   nums[write] = nums[read]; write += 1
           return write

Java
~~~~

.. code-block:: java

   class Solution {
       public int removeDuplicates(int[] nums) {
           if (nums.length==0) return 0;
           int write=1;
           for(int read=1;read<nums.length;read++) if(nums[read]!=nums[write-1]) nums[write++]=nums[read];
           return write;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_duplicates(nums: &mut Vec<i32>) -> i32 {
           if nums.is_empty(){return 0}
           let mut write=1usize;
           for read in 1..nums.len(){if nums[read]!=nums[write-1]{nums[write]=nums[read];write+=1;}}
           write as i32
       }
   }

Go
~~

.. code-block:: go

   func removeDuplicates(nums []int) int {
       if len(nums)==0{return 0};write:=1
       for read:=1;read<len(nums);read++{if nums[read]!=nums[write-1]{nums[write]=nums[read];write++}}
       return write
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeDuplicates(nums:number[]):number{
       if(nums.length===0)return 0;let write=1;
       for(let read=1;read<nums.length;read++)if(nums[read]!==nums[write-1])nums[write++]=nums[read];
       return write;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int RemoveDuplicates(int[] nums) {
           if(nums.Length==0)return 0;int write=1;
           for(int read=1;read<nums.Length;read++)if(nums[read]!=nums[write-1])nums[write++]=nums[read];
           return write;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function remove_duplicates!(nums::Vector{Int})
       isempty(nums) && return 0
       write=1
       for read in 2:length(nums)
           if nums[read]!=nums[write];write+=1;nums[write]=nums[read];end
       end
       write
   end

R
~

.. code-block:: r

   remove_duplicates <- function(nums) {
       n <- length(nums); if (n == 0L) return(list(k=0L, nums=nums))
       write <- 1L
       if (n >= 2L) for (read in 2:n) if (nums[[read]] != nums[[write]]) {
           write <- write + 1L; nums[[write]] <- nums[[read]]
       }
       list(k=write, nums=nums)
   }