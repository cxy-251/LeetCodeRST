0026. Remove Duplicates from Sorted Array
=========================================

题目信息
--------

:题号: 0026
:难度: Easy
:主题: 数组、双指针、原地覆盖、有序去重
:原题: `LeetCode 0026 <https://leetcode.com/problems/remove-duplicates-from-sorted-array/>`_
:访问状态: Available
:教学重点: 读写指针分工、保留区间不变量、相邻比较、有效前缀语义

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums``，在原数组中删除重复值，使每个不同值只保留
一次，并返回保留后的元素个数 ``k``。

调用者只检查 ``nums`` 的前 ``k`` 个位置；``k`` 之后的内容没有要求，不需要清零或缩短底层
数组。

自建示例
--------

普通重复
~~~~~~~~

.. code-block:: text

   输入：[1, 1, 2, 2, 3]
   返回：3
   有效前缀：[1, 2, 3]

全部相同
~~~~~~~~

.. code-block:: text

   输入：[7, 7, 7, 7]
   返回：1
   有效前缀：[7]

没有重复
~~~~~~~~

.. code-block:: text

   输入：[-3, -1, 0, 4]
   返回：4
   有效前缀：[-3, -1, 0, 4]

空数组
~~~~~~

.. code-block:: text

   输入：[]
   返回：0
   有效前缀：[]

问题抽象
--------

数组已经有序，因此相同值必然连续出现。扫描到 ``nums[fast]`` 时，只需与最近保留的值
``nums[slow - 1]`` 比较：

* 相等：当前值是重复项，跳过；
* 不相等：发现一个新值，把它写入 ``nums[slow]``，再令 ``slow += 1``。

``fast`` 负责读取原数组，``slow`` 既表示有效前缀长度，也指向下一个写入位置。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 读写双指针原地覆盖
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接利用有序性和有效前缀语义
   * - 哈希集合记录已见值
     - ``O(n)``
     - ``O(n)``
     - 忽略了输入有序条件，也不满足原地空间目标
   * - 删除重复元素并移动后缀
     - 最坏 ``O(n^2)``
     - ``O(1)``
     - 频繁移动大量元素，没有必要

主解法：读写双指针
------------------

状态含义
~~~~~~~~

对于非空数组：

* ``fast``：当前正在检查的原数组位置；
* ``slow``：当前有效前缀长度，也是下一个新值的写入位置；
* ``nums[0:slow]``：已经整理好的不重复前缀。

初始化 ``slow = 1``，因为第一个元素一定应被保留。随后从第二个元素开始扫描。

核心不变量
~~~~~~~~~~

每轮处理 ``nums[fast]`` 之前：

* ``nums[0:slow]`` 包含已扫描前缀中的所有不同值；
* 这些值保持原有升序顺序，且没有重复；
* ``nums[slow - 1]`` 是已扫描前缀中的最大值和最近保留值；
* ``slow`` 等于已扫描前缀的不同值数量。

若当前值等于 ``nums[slow - 1]``，跳过不会改变不同值集合。若不等，由于数组有序，当前值必然
大于最近保留值，是一个尚未出现的新值；把它写入 ``nums[slow]`` 后，不变量继续成立。

为什么覆盖尚未读取的元素是安全的
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

始终有 ``slow <= fast``：

* ``slow == fast`` 时是原位写回；
* ``slow < fast`` 时写入位置位于当前读取位置之前。

因此写入 ``nums[slow]`` 不会覆盖未来尚未扫描的 ``nums[fast + 1:]``，读写指针可以在同一数组
中安全工作。

正确性依据
~~~~~~~~~~

数组有序使每个值的所有副本形成连续区间。算法保留每个连续区间的第一个值，并跳过该区间中
其余相同值，所以不会重复保留同一个值。

当扫描到一个与最近保留值不同的元素时，它必然大于所有已保留值，因此是新的不同值。算法把它
追加到有效前缀，既不会漏掉不同值，也不会破坏顺序。

扫描结束后，每个不同值恰好被写入一次，``slow`` 等于不同值数量；于是前 ``slow`` 个元素正是
题目要求的去重结果。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每个元素只扫描一次，时间复杂度为 ``O(n)``；
* 固定宽度数组语言只使用两个索引，额外空间复杂度为 ``O(1)``；
* R 采用值语义，函数返回修改后的向量副本和 ``k``，算法状态仍为常数规模。

核心语言实现
------------

C
~

.. code-block:: c

   int removeDuplicates(int *nums, int numsSize) {
       if (numsSize == 0) {
           return 0;
       }

       int slow = 1;

       for (int fast = 1; fast < numsSize; ++fast) {
           if (nums[fast] != nums[slow - 1]) {
               nums[slow] = nums[fast];
               ++slow;
           }
       }

       return slow;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int removeDuplicates(std::vector<int>& nums) {
           if (nums.empty()) {
               return 0;
           }

           int slow = 1;

           for (int fast = 1;
                fast < static_cast<int>(nums.size());
                ++fast) {
               if (nums[fast] != nums[slow - 1]) {
                   nums[slow] = nums[fast];
                   ++slow;
               }
           }

           return slow;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeDuplicates(self, nums: list[int]) -> int:
           if not nums:
               return 0

           slow = 1

           for fast in range(1, len(nums)):
               if nums[fast] != nums[slow - 1]:
                   nums[slow] = nums[fast]
                   slow += 1

           return slow

Java
~~~~

.. code-block:: java

   class Solution {
       public int removeDuplicates(int[] nums) {
           if (nums.length == 0) {
               return 0;
           }

           int slow = 1;

           for (int fast = 1; fast < nums.length; ++fast) {
               if (nums[fast] != nums[slow - 1]) {
                   nums[slow] = nums[fast];
                   ++slow;
               }
           }

           return slow;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_duplicates(nums: &mut Vec<i32>) -> i32 {
           if nums.is_empty() {
               return 0;
           }

           let mut slow: usize = 1;

           for fast in 1..nums.len() {
               if nums[fast] != nums[slow - 1] {
                   nums[slow] = nums[fast];
                   slow += 1;
               }
           }

           slow as i32
       }
   }

Rust 读取 ``nums[fast]`` 得到可复制的 ``i32``，随后写入更靠前的位置；索引关系
``slow <= fast`` 保证不会影响未来读取。

Go
~~

.. code-block:: go

   func removeDuplicates(nums []int) int {
       if len(nums) == 0 {
           return 0
       }

       slow := 1

       for fast := 1; fast < len(nums); fast++ {
           if nums[fast] != nums[slow-1] {
               nums[slow] = nums[fast]
               slow++
           }
       }

       return slow
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeDuplicates(nums: number[]): number {
       if (nums.length === 0) {
           return 0;
       }

       let slow = 1;

       for (let fast = 1; fast < nums.length; fast++) {
           if (nums[fast] !== nums[slow - 1]) {
               nums[slow] = nums[fast];
               slow++;
           }
       }

       return slow;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int RemoveDuplicates(int[] nums) {
           if (nums.Length == 0) {
               return 0;
           }

           int slow = 1;

           for (int fast = 1; fast < nums.Length; ++fast) {
               if (nums[fast] != nums[slow - 1]) {
                   nums[slow] = nums[fast];
                   ++slow;
               }
           }

           return slow;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function remove_duplicates!(nums::Vector{Int})::Int
       isempty(nums) && return 0

       # slow 表示有效长度；写入 Julia 数组时需要转换为一基位置。
       slow = 1

       for fast in 2:length(nums)
           if nums[fast] != nums[slow]
               slow += 1
               nums[slow] = nums[fast]
           end
       end

       return slow
   end

Julia 中 ``slow`` 直接使用一基有效位置，所以比较 ``nums[slow]``，发现新值后先增加再写入。

R
~

.. code-block:: r

   remove_duplicates <- function(nums) {
     n <- length(nums)

     if (n == 0L) {
       return(list(k = 0L, nums = nums))
     }

     slow <- 1L

     if (n >= 2L) {
       for (fast in 2:n) {
         if (nums[[fast]] != nums[[slow]]) {
           slow <- slow + 1L
           nums[[slow]] <- nums[[fast]]
         }
       }
     }

     list(k = slow, nums = nums)
   }

R 向量采用值语义，函数返回 ``k`` 与更新后的 ``nums``。有效结果是
``result$nums[seq_len(result$k)]``。

关键边界
--------

* 空数组：返回 ``0``，不能先访问第一个元素；
* 单元素数组：返回 ``1``；
* 所有元素相同：只保留第一个；
* 没有重复：``slow`` 最终等于原长度；
* 负数、零和正数混合：算法只依赖有序性，不依赖数值范围；
* ``k`` 之后的元素：内容未定义，不应额外整理或清零。

易错点
------

* 把 ``slow`` 当成最后有效下标和有效长度混用，产生一位偏移；
* 与 ``nums[fast - 1]`` 比较后又错误修改扫描区间，破坏状态定义；
* 在空数组上初始化并访问 ``nums[0]``；
* 返回整个数组的新长度，而不是不同值数量；
* 试图删除元素并缩短数组，引入不必要的移动成本；
* 检查 ``k`` 之后的内容并误判答案错误。

新增与强化知识
--------------

新增
~~~~

* 原地数组题常用“读指针扫描、写指针压缩”的稳定覆盖模型；
* 返回长度与有效前缀共同定义结果，底层容器不必真正缩短；
* 有序性把全局去重转化为与最近保留值的局部比较。

强化
~~~~

* 0003 的滑动窗口和本题都使用两个单调索引，但职责不同；
* 写入前证明 ``slow <= fast``，可保证原地覆盖不会破坏未来输入；
* Julia、R 的一基索引需要重新解释“有效长度”和“写入位置”的关系；
* 正确性证明应明确覆盖“不重复、无遗漏、保持顺序”三项。

最小自检
--------

#. 为什么只比较 ``nums[fast]`` 与 ``nums[slow - 1]`` 就足够？
#. ``slow`` 同时表示哪两个含义？
#. 为什么覆盖 ``nums[slow]`` 不会破坏尚未读取的数据？
#. 返回 ``k = 3`` 后，调用者应该检查数组的哪一部分？
#. 对 ``[2, 2, 2]``，每轮 ``slow`` 如何变化？

答案要点
~~~~~~~~

#. 有序数组中相同值连续，最近保留值代表当前重复区间。
#. 有效前缀长度和下一个写入位置。
#. 始终有 ``slow <= fast``，写入不会越过当前读取位置。
#. 只检查前 ``3`` 个位置；其余位置没有要求。
#. 初始为 ``1``，后续元素都相同，因此始终保持 ``1``。
