0035. Search Insert Position
============================

题目信息
--------

:题号: 0035
:难度: Easy
:主题: 数组、二分查找、插入位置、lower bound
:原题: `LeetCode 0035 <https://leetcode.com/problems/search-insert-position/>`_
:访问状态: Available
:教学重点: 第一个大于等于目标的位置、半开区间、不命中也返回边界、末尾插入

题目重述
--------

给定一个严格递增的整数数组 ``nums`` 和目标值 ``target``：

* 若目标已经存在，返回它的零基下标；
* 若目标不存在，返回把它插入后仍保持数组递增的下标。

要求使用 ``O(log n)`` 时间复杂度。

自建示例
--------

目标已存在
~~~~~~~~~~

.. code-block:: text

   nums = [1, 3, 5, 8]
   target = 5
   返回 2

插入数组中间
~~~~~~~~~~~~

.. code-block:: text

   nums = [1, 3, 5, 8]
   target = 4
   返回 2

插入数组开头
~~~~~~~~~~~~

.. code-block:: text

   nums = [2, 4, 6]
   target = 1
   返回 0

插入数组末尾
~~~~~~~~~~~~

.. code-block:: text

   nums = [2, 4, 6]
   target = 9
   返回 3

空数组
~~~~~~

.. code-block:: text

   nums = []
   target = 7
   返回 0

问题抽象
--------

题目要求的位置正是：

.. code-block:: text

   第一个满足 nums[index] >= target 的下标

若不存在这样的元素，答案是 ``n``，表示插入到数组末尾。

这就是 0034 中的 ``lower_bound(target)``。目标存在时，由于数组严格递增，第一个大于等于目标
的位置就是目标下标；目标不存在时，该位置左右满足：

.. code-block:: text

   左侧所有值 < target
   当前位置及右侧所有值 > target

因此把目标插在这个边界上可以保持递增顺序。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 半开区间 lower bound
     - ``O(log n)``
     - ``O(1)``
     - 主解法；存在与不存在使用同一个返回语义
   * - 普通二分命中后单独推导插入点
     - ``O(log n)``
     - ``O(1)``
     - 可行，但分支比直接寻找边界更多
   * - 从左到右扫描
     - ``O(n)``
     - ``O(1)``
     - 未满足对数复杂度要求

主解法：寻找第一个大于等于目标的位置
------------------------------------

状态含义
~~~~~~~~

维护半开区间 ``[left, right)``，初始为 ``[0, n)``：

* 所有下标小于 ``left`` 的元素都严格小于 ``target``；
* 所有下标大于等于 ``right`` 的元素都大于等于 ``target``；
* 正确插入边界始终位于 ``[left, right]``；
* ``right`` 可以等于 ``n``，表示答案可能在数组末尾之后。

区间更新
~~~~~~~~

取 ``mid = left + (right - left) / 2``：

* 若 ``nums[mid] < target``，中点及其左侧都应位于插入点左边，令 ``left = mid + 1``；
* 否则中点已经可以作为插入位置，但可能还有更早位置，令 ``right = mid``。

当 ``left == right`` 时，左侧全部小于目标，当前位置及右侧全部大于等于目标，因此 ``left``
就是答案。

为什么不需要单独检查命中
~~~~~~~~~~~~~~~~~~~~~~~~

本题的返回值不是“找到则返回，否则返回失败”，而是始终返回边界位置。目标存在时，边界自然停在
目标位置；目标不存在时，边界自然停在插入位置。二者完全使用同一个循环和返回语句。

核心不变量
~~~~~~~~~~

每轮开始时：

* ``[0, left)`` 中所有元素都小于目标；
* ``[right, n)`` 中所有元素都大于等于目标；
* 第一个大于等于目标的位置没有被排除；
* 搜索区间长度为 ``right - left``，每轮严格缩小。

正确性依据
~~~~~~~~~~

若 ``nums[mid] < target``，由于数组严格递增，所有下标不超过 ``mid`` 的元素都小于目标，因此
它们不可能是第一个大于等于目标的位置，移动 ``left`` 是安全的。

若 ``nums[mid] >= target``，中点满足边界条件，但更左位置可能也满足，因此不能排除中点，只把
``right`` 收缩到 ``mid``。两种更新都保持不变量。

循环结束时 ``left == right``。根据不变量，左侧所有元素小于目标，右侧从该位置开始所有元素
大于等于目标，因此该位置是唯一正确插入边界。目标存在时它就是目标下标；不存在时插入该位置
仍保持数组严格递增。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每轮把候选区间缩小约一半，时间复杂度为 ``O(log n)``；
* 只使用两个边界和一个中点，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int searchInsert(int *nums, int numsSize, int target) {
       int left = 0;
       int right = numsSize;

       while (left < right) {
           int mid = left + (right - left) / 2;

           if (nums[mid] < target) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return left;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int searchInsert(
           const std::vector<int>& nums,
           int target
       ) {
           int left = 0;
           int right = static_cast<int>(nums.size());

           while (left < right) {
               int mid = left + (right - left) / 2;

               if (nums[mid] < target) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchInsert(self, nums: list[int], target: int) -> int:
           left = 0
           right = len(nums)

           while left < right:
               mid = left + (right - left) // 2

               if nums[mid] < target:
                   left = mid + 1
               else:
                   right = mid

           return left

Java
~~~~

.. code-block:: java

   class Solution {
       public int searchInsert(int[] nums, int target) {
           int left = 0;
           int right = nums.length;

           while (left < right) {
               int mid = left + (right - left) / 2;

               if (nums[mid] < target) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search_insert(nums: Vec<i32>, target: i32) -> i32 {
           let mut left: usize = 0;
           let mut right: usize = nums.len();

           while left < right {
               let mid = left + (right - left) / 2;

               if nums[mid] < target {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           left as i32
       }
   }

半开区间从不需要 ``-1``，因此 Rust 可以全程使用 ``usize``，最终再转换为题目要求的 ``i32``。

Go
~~

.. code-block:: go

   func searchInsert(nums []int, target int) int {
       left, right := 0, len(nums)

       for left < right {
           mid := left + (right-left)/2

           if nums[mid] < target {
               left = mid + 1
           } else {
               right = mid
           }
       }

       return left
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchInsert(nums: number[], target: number): number {
       let left = 0;
       let right = nums.length;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);

           if (nums[mid] < target) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return left;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SearchInsert(int[] nums, int target) {
           int left = 0;
           int right = nums.Length;

           while (left < right) {
               int mid = left + (right - left) / 2;

               if (nums[mid] < target) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_insert(nums::Vector{Int}, target::Int)::Int
       left = 1
       right = length(nums) + 1

       while left < right
           mid = left + (right - left) ÷ 2

           if nums[mid] < target
               left = mid + 1
           else
               right = mid
           end
       end

       return left - 1  # 一基插入位置转换为零基下标。
   end

当答案是一基末尾插入位置 ``n + 1`` 时，减一后恰好得到零基答案 ``n``。

R
~

.. code-block:: r

   search_insert <- function(nums, target) {
     left <- 1L
     right <- length(nums) + 1L

     while (left < right) {
       mid <- left + (right - left) %/% 2L

       if (nums[[mid]] < target) {
         left <- mid + 1L
       } else {
         right <- mid
       }
     }

     left - 1L
   }

R 与 Julia 相同，内部维护一基半开边界，对外返回零基插入下标。

关键边界
--------

* 空数组：初始 ``left == right == 0``，直接返回 0；
* 目标小于首元素：边界收敛到 0；
* 目标大于尾元素：所有元素都被归入左侧，返回 ``n``；
* 目标等于某个元素：收敛到该元素位置；
* 单元素数组：根据比较结果返回 0 或 1；
* 数组严格递增：目标存在时位置唯一，不需要处理重复值右边界。

易错点
------

* 把 ``right`` 初始化为 ``n - 1``，却仍使用半开区间更新 ``right = mid``；
* 遇到 ``nums[mid] == target`` 立即返回虽然正确，却掩盖了 lower bound 的统一边界语义；
* 使用 ``left <= right`` 配合 ``right = mid``，在单元素区间可能死循环；
* 目标大于所有元素时返回 ``n - 1``，忘记末尾插入位置是 ``n``；
* Julia/R 内部一基位置直接返回，导致结果整体多一。

新增与强化知识
--------------

新增
~~~~

* “查找已有值”和“寻找插入位置”可以统一为第一个满足单调谓词的位置；
* 二分返回值可以是数组之外的边界 ``n``，不一定是有效元素下标；
* 题目语义直接对应 lower bound 时，不需要额外命中分支。

强化
~~~~

* 复用 0034 的 lower bound，并去掉 upper bound 与存在性验证；
* 继续区分闭区间命中搜索和半开区间边界搜索；
* 通过不变量解释比较符号，而不是机械记忆模板。

最小自检
--------

#. 本题寻找的单调边界是什么？
#. 为什么目标存在时不需要单独返回命中位置？
#. 为什么 ``right`` 可以取 ``nums.length``？
#. ``nums = [2, 4, 6]``、``target = 7`` 时，边界如何收敛？
#. ``while left < right`` 与 ``right = mid`` 为什么能够终止？

答案要点
~~~~~~~~

#. 第一个满足 ``nums[index] >= target`` 的位置。
#. 目标位置本身就是第一个大于等于目标的位置。
#. 答案可能是末尾插入位置 ``n``。
#. 所有中点值都小于目标，``left`` 最终推进到 3。
#. 每轮 ``mid < right``，令 ``right = mid`` 会缩短区间；另一分支令 ``left = mid + 1`` 也会缩短。
