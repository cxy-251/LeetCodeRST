0031. Next Permutation
======================

题目信息
--------

:题号: 0031
:难度: Medium
:主题: 数组、字典序、原地交换、后缀反转
:原题: `LeetCode 0031 <https://leetcode.com/problems/next-permutation/>`_
:访问状态: Available
:教学重点: 最长非递增后缀、枢轴、最小更大元素、最小化后缀、原地修改

题目重述
--------

给定一个整数数组，把它原地修改为字典序中的下一个排列。

若当前排列已经是所有排列中字典序最大的一个，就把数组改成最小排列，也就是整体升序。
不能生成并排序全部排列，额外空间应保持常数级。

字典序比较从左向右进行：首个不同位置上，数值更大的排列更大。

自建示例
--------

普通情况
~~~~~~~~

.. code-block:: text

   输入：[1, 2, 3]
   输出：[1, 3, 2]

需要调整较长后缀
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：[1, 3, 5, 4, 2]
   输出：[1, 4, 2, 3, 5]

   枢轴是 3，后缀 [5, 4, 2] 已经非递增。
   用后缀中最小的更大值 4 替换 3，再把剩余后缀改成升序。

已经最大
~~~~~~~~

.. code-block:: text

   输入：[3, 2, 1]
   输出：[1, 2, 3]

包含重复值
~~~~~~~~~~

.. code-block:: text

   输入：[1, 5, 5]
   输出：[5, 1, 5]

问题抽象
--------

为了得到“刚好更大”的排列，需要让最靠右的位置发生尽可能小的增加，并让其右侧变成可取的
最小排列。

从右向左寻找第一个满足：

.. code-block:: text

   nums[pivot] < nums[pivot + 1]

的位置 ``pivot``。它右侧的后缀一定是非递增的，而且是保持左侧前缀不变时能形成的最大排列。

若找不到 ``pivot``，整个数组非递增，当前排列已经最大，直接反转整个数组得到最小排列。

若找到 ``pivot``：

#. 在后缀中寻找最右侧且严格大于 ``nums[pivot]`` 的元素；
#. 交换它与枢轴；
#. 反转枢轴右侧后缀，使后缀变成升序。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 枢轴交换加后缀反转
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接构造严格最小的更大排列
   * - 生成全部排列后排序
     - 至少 ``O(n! × n)``
     - ``O(n! × n)``
     - 完全忽略排列的局部结构
   * - 找枢轴后排序后缀
     - ``O(n log n)``
     - 依排序实现
     - 正确但没有利用后缀已经非递增

主解法：枢轴、后继与后缀反转
----------------------------

第一步：寻找最长非递增后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~

从 ``n - 2`` 开始向左移动，只要：

.. code-block:: text

   nums[i] >= nums[i + 1]

就继续。循环结束后：

* 若 ``i < 0``，整个数组非递增；
* 否则 ``i`` 是最右侧可增加位置；
* ``nums[i + 1:n]`` 是最长非递增后缀。

为什么必须选择最右侧可增加位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

字典序首先由更靠左的位置决定。若在 ``i`` 左侧修改，得到的增量一定比保留该前缀、只修改
``i`` 更大。为了得到紧邻的后继，必须尽量保留最长左侧前缀。

第二步：选择最小的更大值
~~~~~~~~~~~~~~~~~~~~~~~~

后缀是非递增的。从右向左找到第一个满足：

.. code-block:: text

   nums[j] > nums[i]

的元素。由于从后缀最小端开始找，它是后缀中严格大于枢轴值的最小候选。

必须使用严格大于。若交换相等元素，排列不会增大；若选择更大的候选，得到的排列会跳过合法后继。

第三步：最小化后缀
~~~~~~~~~~~~~~~~~~

交换后，枢轴位置已经完成最小幅度增加。接下来要让右侧尽可能小。

原后缀非递增，交换枢轴与其中一个元素后，剩余后缀仍可通过整体反转得到非递减顺序。升序是
这些元素能形成的字典序最小排列，因此只需 ``O(n)`` 反转，无需排序。

核心不变量
~~~~~~~~~~

寻找枢轴时：

* ``nums[i + 1:n]`` 始终是非递增后缀；
* 该后缀已经是其元素可形成的最大排列；
* 尚未检查的更左位置是唯一可能让排列继续增大的区域。

反转后缀时：

* 枢轴左侧前缀和枢轴值已确定；
* 左右指针之外的后缀两端已经放到升序目标位置；
* 交换尚未处理的两端不会改变后缀元素集合。

正确性依据
~~~~~~~~~~

设 ``pivot`` 是最右侧满足 ``nums[pivot] < nums[pivot + 1]`` 的位置。其右侧后缀非递增，因此在
保持 ``nums[0:pivot]`` 不变时，当前后缀已经最大，无法只重排后缀得到更大排列。任何后继都必须
增加 ``pivot`` 或更左位置。

选择最右侧严格大于枢轴的元素，得到后缀中最小的可用更大值，所以枢轴位置的增加量最小。任何
选择更大值的排列都在枢轴位置已经更大；任何修改更左位置的排列也会更大。因此不存在字典序
介于当前排列与该枢轴选择之间的候选。

交换后把后缀改成升序，得到固定新前缀下的最小排列。于是整个结果是严格大于当前排列的最小
排列。若不存在枢轴，当前排列整体非递增并且已经最大；反转为升序正好回绕到最小排列。

复杂度
~~~~~~

设数组长度为 ``n``：

* 寻找枢轴最多扫描 ``n`` 个元素；
* 寻找交换对象最多扫描 ``n`` 个元素；
* 后缀反转最多交换 ``n / 2`` 对元素；
* 总时间复杂度为 ``O(n)``；
* 只使用若干索引和临时变量，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   static void swap_int(int *left, int *right) {
       int temporary = *left;
       *left = *right;
       *right = temporary;
   }

   void nextPermutation(int *nums, int numsSize) {
       int pivot = numsSize - 2;

       while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
           --pivot;
       }

       if (pivot >= 0) {
           int successor = numsSize - 1;

           while (nums[successor] <= nums[pivot]) {
               --successor;
           }

           swap_int(&nums[pivot], &nums[successor]);
       }

       int left = pivot + 1;
       int right = numsSize - 1;

       while (left < right) {
           swap_int(&nums[left], &nums[right]);
           ++left;
           --right;
       }
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       void nextPermutation(std::vector<int>& nums) {
           int pivot = static_cast<int>(nums.size()) - 2;

           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
               --pivot;
           }

           if (pivot >= 0) {
               int successor = static_cast<int>(nums.size()) - 1;

               while (nums[successor] <= nums[pivot]) {
                   --successor;
               }

               std::swap(nums[pivot], nums[successor]);
           }

           std::reverse(nums.begin() + pivot + 1, nums.end());
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def nextPermutation(self, nums: list[int]) -> None:
           pivot = len(nums) - 2

           while pivot >= 0 and nums[pivot] >= nums[pivot + 1]:
               pivot -= 1

           if pivot >= 0:
               successor = len(nums) - 1

               while nums[successor] <= nums[pivot]:
                   successor -= 1

               nums[pivot], nums[successor] = (
                   nums[successor],
                   nums[pivot],
               )

           left = pivot + 1
           right = len(nums) - 1

           while left < right:
               nums[left], nums[right] = nums[right], nums[left]
               left += 1
               right -= 1

Java
~~~~

.. code-block:: java

   class Solution {
       public void nextPermutation(int[] nums) {
           int pivot = nums.length - 2;

           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
               --pivot;
           }

           if (pivot >= 0) {
               int successor = nums.length - 1;

               while (nums[successor] <= nums[pivot]) {
                   --successor;
               }

               swap(nums, pivot, successor);
           }

           reverse(nums, pivot + 1, nums.length - 1);
       }

       private void swap(int[] nums, int left, int right) {
           int temporary = nums[left];
           nums[left] = nums[right];
           nums[right] = temporary;
       }

       private void reverse(int[] nums, int left, int right) {
           while (left < right) {
               swap(nums, left, right);
               ++left;
               --right;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn next_permutation(nums: &mut Vec<i32>) {
           if nums.len() < 2 {
               return;
           }

           let mut pivot = nums.len() - 2;

           while nums[pivot] >= nums[pivot + 1] {
               if pivot == 0 {
                   nums.reverse();
                   return;
               }
               pivot -= 1;
           }

           let mut successor = nums.len() - 1;
           while nums[successor] <= nums[pivot] {
               successor -= 1;
           }

           nums.swap(pivot, successor);
           nums[pivot + 1..].reverse();
       }
   }

Rust 的 ``usize`` 不能表示 ``-1``，因此在 ``pivot == 0`` 且仍然非递增时直接处理最大排列并返回。

Go
~~

.. code-block:: go

   func nextPermutation(nums []int) {
       pivot := len(nums) - 2

       for pivot >= 0 && nums[pivot] >= nums[pivot+1] {
           pivot--
       }

       if pivot >= 0 {
           successor := len(nums) - 1

           for nums[successor] <= nums[pivot] {
               successor--
           }

           nums[pivot], nums[successor] =
               nums[successor], nums[pivot]
       }

       for left, right := pivot+1, len(nums)-1;
           left < right;
           left, right = left+1, right-1 {
           nums[left], nums[right] = nums[right], nums[left]
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function nextPermutation(nums: number[]): void {
       let pivot = nums.length - 2;

       while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
           pivot--;
       }

       if (pivot >= 0) {
           let successor = nums.length - 1;

           while (nums[successor] <= nums[pivot]) {
               successor--;
           }

           [nums[pivot], nums[successor]] = [
               nums[successor],
               nums[pivot],
           ];
       }

       let left = pivot + 1;
       let right = nums.length - 1;

       while (left < right) {
           [nums[left], nums[right]] = [nums[right], nums[left]];
           left++;
           right--;
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void NextPermutation(int[] nums) {
           int pivot = nums.Length - 2;

           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
               --pivot;
           }

           if (pivot >= 0) {
               int successor = nums.Length - 1;

               while (nums[successor] <= nums[pivot]) {
                   --successor;
               }

               (nums[pivot], nums[successor]) =
                   (nums[successor], nums[pivot]);
           }

           int left = pivot + 1;
           int right = nums.Length - 1;

           while (left < right) {
               (nums[left], nums[right]) = (nums[right], nums[left]);
               ++left;
               --right;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function next_permutation!(nums::Vector{Int})
       length(nums) < 2 && return nums

       pivot = length(nums) - 1

       while pivot >= 1 && nums[pivot] >= nums[pivot + 1]
           pivot -= 1
       end

       if pivot >= 1
           successor = length(nums)

           while nums[successor] <= nums[pivot]
               successor -= 1
           end

           nums[pivot], nums[successor] =
               nums[successor], nums[pivot]
       end

       left = pivot + 1
       right = length(nums)

       while left < right
           nums[left], nums[right] = nums[right], nums[left]
           left += 1
           right -= 1
       end

       return nums
   end

Julia 的 ``pivot = 0`` 作为“未找到枢轴”的哨兵；真正访问数组前始终先检查 ``pivot >= 1``。

R
~

.. code-block:: r

   next_permutation <- function(nums) {
     n <- length(nums)

     if (n < 2L) {
       return(nums)
     }

     pivot <- n - 1L

     while (pivot >= 1L && nums[[pivot]] >= nums[[pivot + 1L]]) {
       pivot <- pivot - 1L
     }

     if (pivot >= 1L) {
       successor <- n

       while (nums[[successor]] <= nums[[pivot]]) {
         successor <- successor - 1L
       }

       temporary <- nums[[pivot]]
       nums[[pivot]] <- nums[[successor]]
       nums[[successor]] <- temporary
     }

     left <- pivot + 1L
     right <- n

     while (left < right) {
       temporary <- nums[[left]]
       nums[[left]] <- nums[[right]]
       nums[[right]] <- temporary
       left <- left + 1L
       right <- right - 1L
     }

     nums
   }

R 向量使用值语义，函数返回修改后的向量；算法步骤仍然只使用常数数量的索引和临时值。

关键边界
--------

* 数组长度为一：没有其他排列，结果不变；
* 整体非递增：不存在枢轴，反转整个数组；
* 整体升序：枢轴在倒数第二位，只交换最后两个元素；
* 包含重复值：交换对象必须严格大于枢轴，不能交换相等值；
* 后缀中有多个相同后继：选择最右侧任意一个最小更大值，反转后结果一致；
* 枢轴位于最左端：左侧前缀为空，仍使用同一流程。

易错点
------

* 从左向右寻找可增加位置，修改过早而跳过多个排列；
* 把后缀条件写成严格递减，无法正确处理重复值；
* 寻找后继时使用 ``>=``，可能交换相等元素；
* 交换后忘记把后缀变成最小升序；
* 对已经最大排列只排序一部分，而不是反转整个数组；
* Rust 使用无符号索引直接递减到负数；
* Julia、R 的一基枢轴位置与零基伪代码混用。

新增与强化知识
--------------

新增
~~~~

* 最长非递增后缀刻画了保持左侧前缀不变时的最大排列；
* 字典序直接后继由“最右可增加位置”和“最小更大后继”共同确定；
* 已知后缀单调时，反转可以替代通用排序；
* 最大排列回绕到最小排列是同一流程中“无枢轴”的自然分支。

强化
~~~~

* 0014、0028 的“首个决定性位置”思想转化为排列中的最右决定性位置；
* 双指针反转继续复用 0025 的原地后缀变换思路；
* 正确性证明需要同时证明结果更大，以及不存在介于两者之间的排列。

最小自检
--------

#. 为什么枢轴右侧必然是非递增后缀？
#. 为什么要选择后缀中最小的严格更大值？
#. 交换后为什么反转后缀就等价于把它排序成升序？
#. 输入 ``[2, 3, 3, 1]`` 时，枢轴和后继分别是什么？
#. 找不到枢轴说明了什么？

答案要点
~~~~~~~~

#. 枢轴是从右向左第一个上升位置；它右侧所有相邻对都满足前者不小于后者。
#. 枢轴位置是首个变化位置，选更大的候选会直接跳过更近的排列。
#. 原后缀非递增；交换最右侧后继后，剩余后缀仍可通过反转得到非递减最小排列。
#. 枢轴是下标 0 的值 2，最右侧严格更大值是下标 2 的 3。
#. 整个数组非递增，当前排列已经是最大排列，应回绕到整体升序。
