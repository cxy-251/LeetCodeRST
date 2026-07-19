0041. First Missing Positive
============================

题目信息
--------

:题号: 0041
:难度: Hard
:主题: 数组、原地哈希、循环置换、鸽巢原理
:原题: `LeetCode 0041 <https://leetcode.com/problems/first-missing-positive/>`_
:访问状态: Available
:教学重点: 答案范围、值到下标映射、重复值防循环、原地状态不变量

题目重述
--------

给定一个未排序整数数组，返回其中没有出现的最小正整数。

要求算法在 ``O(n)`` 时间内完成，并且只使用 ``O(1)`` 额外空间。数组可以包含负数、
零、重复值以及远大于数组长度的整数。

自建示例
--------

缺少中间值
~~~~~~~~~~

.. code-block:: text

   输入：[3, 4, -1, 1]
   输出：2

   1 已出现，2 未出现，因此答案是 2。

缺少开头值
~~~~~~~~~~

.. code-block:: text

   输入：[7, 8, 9, 11, 12]
   输出：1

   所有元素都超出有效范围，最小正整数 1 没有出现。

缺少末尾值
~~~~~~~~~~

.. code-block:: text

   输入：[1, 2, 3]
   输出：4

   长度为 3 的数组已经包含 1 至 3，因此答案是 n + 1，也就是 4。

包含重复值
~~~~~~~~~~

.. code-block:: text

   输入：[1, 1]
   输出：2

   第二个 1 不能反复与已经位于目标槽位的 1 交换。

普通混合输入
~~~~~~~~~~~~

.. code-block:: text

   输入：[1, 2, 0]
   输出：3

问题抽象
--------

设数组长度为 ``n``。答案一定落在 ``1`` 至 ``n + 1``：

* 若 ``1..n`` 中有数字缺失，答案就在这个范围内；
* 若 ``1..n`` 全部出现，最小缺失正整数只能是 ``n + 1``；
* 小于等于 0 或大于 ``n`` 的值不会影响答案。

因此可以把数组本身当作一个大小为 ``n`` 的哈希表：

.. code-block:: text

   数值 value 的目标下标 = value - 1

例如值 1 应放到下标 0，值 2 应放到下标 1。把所有有效值放到对应槽位后，从左到右寻找
第一处 ``nums[index] != index + 1``，该位置对应的正整数就是答案。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 原地循环置换
     - ``O(n)``
     - ``O(1)``
     - 主解法；用数组槽位表达值是否出现
   * - 哈希集合
     - ``O(n)``
     - ``O(n)``
     - 思路直接，不满足常数额外空间要求
   * - 排序后扫描
     - ``O(n log n)``
     - 取决于排序实现
     - 容易实现，不满足线性时间要求
   * - 正负号标记
     - ``O(n)``
     - ``O(1)``
     - 同样可行，需要先规范化无效值，状态含义更绕

主解法：把有效值放入对应槽位
------------------------------

状态含义
~~~~~~~~

扫描下标 ``index`` 时，令 ``value = nums[index]``。只有同时满足以下条件才执行交换：

.. code-block:: text

   1 <= value <= n
   nums[value - 1] != value

第一项保证 ``value - 1`` 是合法数组下标；第二项表示目标槽位中还没有相同值。

交换操作为：

.. code-block:: text

   swap(nums[index], nums[value - 1])

交换后不立即增加 ``index``。当前位置换来了一个新值，它可能仍然需要被放到自己的目标槽位。
只有当前位置的值无效，或它的目标槽位已经保存相同值时，才移动到下一个下标。

为什么必须检查目标槽位
~~~~~~~~~~~~~~~~~~~~~~

输入 ``[1, 1]`` 中，第一个 1 已经处于下标 0。扫描第二个 1 时，目标槽位也是下标 0。
若只判断值域并持续交换，两个相同值会不断互换，循环无法结束。

条件 ``nums[value - 1] != value`` 同时表达两件事：

* 目标槽位尚未正确保存 ``value`` 时，需要交换；
* 目标槽位已经保存 ``value`` 时，当前值是重复项，可以停止处理当前位置。

核心不变量
~~~~~~~~~~

外层循环每次准备增加 ``index`` 时：

* 当前槽位中的值已经不再需要交换；
* 对任何已经被放到目标槽位的有效值 ``v``，都有 ``nums[v - 1] == v``；
* 后续交换不会把正确值 ``v`` 从目标槽位移走，因为交换条件会在目标槽位等于 ``v`` 时停止；
* 数组元素的多重集合保持不变，只改变排列顺序。

终止性
~~~~~~

每次实际交换都会把当前有效值 ``value`` 放到它的唯一目标槽位 ``value - 1``。这个槽位之后
不会再把该值交换出去。数组最多只有 ``n`` 个目标槽位，因此成功放置操作总数为 ``O(n)``。
重复值通过目标槽位检查停止，不会形成交换环。

正确性依据
~~~~~~~~~~

**答案范围。** 长度为 ``n`` 的数组若没有包含 ``1..n`` 中的某个值，最小缺失正整数不超过
``n``；若全部包含，则答案为 ``n + 1``。所以忽略范围外的值是安全的。

**放置性质。** 对任意出现过的有效值 ``v``，处理到保存某个 ``v`` 的位置时：

* 若 ``nums[v - 1] != v``，算法把这个 ``v`` 交换到目标槽位；
* 若 ``nums[v - 1] == v``，目标槽位已经证明 ``v`` 出现。

所以置换结束后，值 ``v`` 在数组中出现，当且仅当 ``nums[v - 1] == v``。

**最小性。** 设第一次不匹配发生在下标 ``index``。前面所有下标 ``0..index-1`` 都满足
``nums[i] == i + 1``，因此正整数 ``1..index`` 全部出现；当前位置不等于 ``index + 1``，
根据放置性质可知 ``index + 1`` 没有出现，所以它正是最小缺失正整数。若没有不匹配，
``1..n`` 全部出现，返回 ``n + 1``。

复杂度
~~~~~~

* 外层扫描访问 ``n`` 个位置；
* 每次交换至少永久填好一个目标槽位，交换总数不超过 ``n``；
* 时间复杂度为 ``O(n)``；
* 除固定数量的变量外不分配与输入规模相关的容器，额外空间复杂度为 ``O(1)``。

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

   int firstMissingPositive(int *nums, int numsSize) {
       for (int index = 0; index < numsSize; ++index) {
           while (
               nums[index] >= 1 &&
               nums[index] <= numsSize &&
               nums[nums[index] - 1] != nums[index]
           ) {
               int target = nums[index] - 1;
               swap_int(&nums[index], &nums[target]);
           }
       }

       for (int index = 0; index < numsSize; ++index) {
           if (nums[index] != index + 1) {
               return index + 1;
           }
       }
       return numsSize + 1;
   }

必须先确认 ``nums[index]`` 位于 ``1..numsSize``，再把它减一作为下标。C 的 ``&&`` 会从
左到右短路求值，因此范围检查失败时不会访问非法下标。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int firstMissingPositive(vector<int>& nums) {
           const int size = static_cast<int>(nums.size());

           for (int index = 0; index < size; ++index) {
               while (
                   nums[index] >= 1 &&
                   nums[index] <= size &&
                   nums[nums[index] - 1] != nums[index]
               ) {
                   int target = nums[index] - 1;
                   swap(nums[index], nums[target]);
               }
           }

           for (int index = 0; index < size; ++index) {
               if (nums[index] != index + 1) {
                   return index + 1;
               }
           }
           return size + 1;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def firstMissingPositive(self, nums: list[int]) -> int:
           size = len(nums)

           for index in range(size):
               while (
                   1 <= nums[index] <= size
                   and nums[nums[index] - 1] != nums[index]
               ):
                   target = nums[index] - 1
                   nums[index], nums[target] = nums[target], nums[index]

           for index, value in enumerate(nums):
               if value != index + 1:
                   return index + 1
           return size + 1

Python 的链式比较 ``1 <= value <= size`` 只对中间表达式求值一次。这里直接读取
``nums[index]``，交换后下一轮 ``while`` 会重新读取当前位置的新值。

Java
~~~~

.. code-block:: java

   class Solution {
       public int firstMissingPositive(int[] nums) {
           int size = nums.length;

           for (int index = 0; index < size; index++) {
               while (
                   nums[index] >= 1 &&
                   nums[index] <= size &&
                   nums[nums[index] - 1] != nums[index]
               ) {
                   int target = nums[index] - 1;
                   int temporary = nums[index];
                   nums[index] = nums[target];
                   nums[target] = temporary;
               }
           }

           for (int index = 0; index < size; index++) {
               if (nums[index] != index + 1) {
                   return index + 1;
               }
           }
           return size + 1;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn first_missing_positive(mut nums: Vec<i32>) -> i32 {
           let size = nums.len();
           let mut index = 0usize;

           while index < size {
               let value = nums[index];
               if value >= 1 && (value as usize) <= size {
                   let target = value as usize - 1;
                   if nums[target] != value {
                       nums.swap(index, target);
                       // 当前槽位换入新值，继续检查同一个 index。
                       continue;
                   }
               }
               index += 1;
           }

           for (index, &value) in nums.iter().enumerate() {
               if value != index as i32 + 1 {
                   return index as i32 + 1;
               }
           }
           size as i32 + 1
       }
   }

Rust 在把 ``i32`` 转成 ``usize`` 前先检查 ``value >= 1``，避免负数转换为极大的无符号值。
``nums.swap`` 需要两个合法下标，值域检查保证 ``target < size``。

Go
~~

.. code-block:: go

   func firstMissingPositive(nums []int) int {
       size := len(nums)

       for index := 0; index < size; index++ {
           for nums[index] >= 1 &&
               nums[index] <= size &&
               nums[nums[index]-1] != nums[index] {
               target := nums[index] - 1
               nums[index], nums[target] = nums[target], nums[index]
           }
       }

       for index, value := range nums {
           if value != index+1 {
               return index + 1
           }
       }
       return size + 1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function firstMissingPositive(nums: number[]): number {
       const size = nums.length;

       for (let index = 0; index < size; index += 1) {
           while (
               nums[index] >= 1 &&
               nums[index] <= size &&
               nums[nums[index] - 1] !== nums[index]
           ) {
               const target = nums[index] - 1;
               [nums[index], nums[target]] = [nums[target], nums[index]];
           }
       }

       for (let index = 0; index < size; index += 1) {
           if (nums[index] !== index + 1) {
               return index + 1;
           }
       }
       return size + 1;
   }

题目输入是整数。JavaScript 的 ``number`` 使用浮点表示，当前约束下整数值和数组下标都可
精确表达；值域检查完成后，``nums[index] - 1`` 才能作为有效下标。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FirstMissingPositive(int[] nums) {
           int size = nums.Length;

           for (int index = 0; index < size; index++) {
               while (
                   nums[index] >= 1 &&
                   nums[index] <= size &&
                   nums[nums[index] - 1] != nums[index]
               ) {
                   int target = nums[index] - 1;
                   (nums[index], nums[target]) =
                       (nums[target], nums[index]);
               }
           }

           for (int index = 0; index < size; index++) {
               if (nums[index] != index + 1) {
                   return index + 1;
               }
           }
           return size + 1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function first_missing_positive!(nums::Vector{Int})::Int
       size = length(nums)

       for index in eachindex(nums)
           while 1 <= nums[index] <= size &&
                 nums[nums[index]] != nums[index]
               target = nums[index]
               nums[index], nums[target] = nums[target], nums[index]
           end
       end

       for index in eachindex(nums)
           if nums[index] != index
               return index
           end
       end
       size + 1
   end

Julia 数组使用一基索引，所以数值 ``value`` 的目标槽位直接是 ``nums[value]``，无需减一。
短路运算符 ``&&`` 保证只有值位于 ``1..size`` 时才访问目标槽位。

R
~

.. code-block:: r

   first_missing_positive <- function(nums) {
     size <- length(nums)

     for (index in seq_len(size)) {
       while (
         nums[index] >= 1L &&
         nums[index] <= size &&
         nums[nums[index]] != nums[index]
       ) {
         target <- nums[index]
         temporary <- nums[index]
         nums[index] <- nums[target]
         nums[target] <- temporary
       }
     }

     for (index in seq_len(size)) {
       if (nums[index] != index) {
         return(index)
       }
     }
     size + 1L
   }

R 向量使用一基索引，因此有效值可以直接作为目标位置。R 采用值语义；函数内重排的是局部
``nums``，题目只要求返回缺失值，不需要把重排后的向量返回给调用者。

关键边界与易错点
----------------

* 空数组：循环不执行，返回 1；
* 负数和零：不属于答案候选范围，不能作为目标下标；
* 大于 ``n`` 的值：同样忽略，因为答案不会超过 ``n + 1``；
* 重复值：必须检查目标槽位是否已经保存相同值，避免无限循环；
* 交换后不能立即增加下标，当前位置换入的新值可能仍需继续放置；
* 不能只交换一次；同一个位置可能连续放置多个值；
* Julia 和 R 使用一基索引，目标槽位是 ``value``；其他语言通常是 ``value - 1``；
* 原地重排会改变输入数组的顺序，调用方不能依赖原顺序保持不变。

新增与强化知识
--------------

新增
~~~~

* 鸽巢原理把答案范围限制为 ``1..n+1``；
* 原地哈希利用“值到唯一目标槽位”的映射替代额外集合；
* 循环置换中，重复值守卫同时保证终止性与状态正确性；
* 第一个槽位不匹配可以直接解释为最小缺失正整数。

强化
~~~~

* 再次使用数组作为状态容器，而不是把它只视为输入数据；
* 强化短路求值在下标安全检查中的作用；
* 强化 Julia/R 一基索引与 C 系语言零基索引之间的映射差异；
* 正确性证明需要分别覆盖答案范围、放置等价性和最小性。

关联题目
--------

* `0026. Remove Duplicates from Sorted Array
  <0026-remove-duplicates-from-sorted-array.rst>`_：同样原地修改数组，但依赖有序输入和读写指针；
* `0027. Remove Element <0027-remove-element.rst>`_：
  使用有效前缀表达结果，本题则使用值对应槽位表达出现性；
* `0031. Next Permutation <0031-next-permutation.rst>`_：
  同样通过原地交换改变排列，但目标是不同行为的字典序后继。

最小自检
--------

#. 为什么答案一定不超过 ``n + 1``？
#. 为什么值 ``value`` 的目标槽位是 ``value - 1``？
#. 条件 ``nums[nums[index] - 1] != nums[index]`` 为什么不可省略？
#. 为什么一次交换后不能立刻处理下一个下标？
#. 若置换结束后 ``nums[2] != 3``，能否断定 3 没有出现？

答案要点
~~~~~~~~

#. 若 ``1..n`` 有缺失，答案不超过 ``n``；否则答案为 ``n + 1``。
#. 零基数组中，下标 0 对应正整数 1，下标 ``value - 1`` 对应正整数 ``value``。
#. 重复值的目标槽位可能已经正确，继续交换会形成无效循环。
#. 当前槽位换入的新值可能仍在 ``1..n``，需要继续放入它自己的目标槽位。
#. 可以；出现过的有效值最终一定会占据自己的目标槽位。
