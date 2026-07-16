0167. Two Sum II - Input Array Is Sorted
=========================================

题目信息
--------

:题号: 0167
:难度: Medium
:主题: 有序数组、双指针、单调排除、索引契约
:原题: `LeetCode 0167 <https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/>`_
:访问状态: Available
:教学重点: 解区间不变量、端点排除安全性、重复值、一基返回

精确契约
--------

输入 ``numbers`` 是按非递减顺序排列的整数数组，满足：

* ``2 <= numbers.length <= 30000``；
* ``-1000 <= numbers[i] <= 1000``；
* ``-1000 <= target <= 1000``；
* 恰有一组下标 ``index1 < index2`` 使两数之和等于 ``target``。

返回 ``[index1, index2]``，下标从 1 开始。两个位置必须不同，不能把同一元素使用两次。
算法不得修改输入，并要求只使用常数级额外工作空间。重复值合法；题目保证的是解的下标对唯一，
不是数组元素互不相同。

示例与反例
----------

首尾逐步收缩
~~~~~~~~~~~~

``numbers = [2,7,11,15]``、``target = 9``。初始和 ``2+15=17`` 过大，右端左移；
随后 ``2+11=13`` 仍过大，再左移得到 ``2+7=9``，返回 ``[1,2]``。

答案在两端
~~~~~~~~~~

``numbers = [2,3,4]``、``target = 6``。首尾和已经等于目标，返回 ``[1,3]``。

负数与零
~~~~~~~~

``numbers = [-1,0]``、``target = -1``，返回 ``[1,2]``。符号不会改变有序性提供的单调关系。

重复值可以组成答案
~~~~~~~~~~~~~~~~~~

``numbers = [1,1,3,5]``、``target = 2``，答案是两个不同位置 ``[1,2]``。
若把“不同下标”误写成“不同数值”，会错误拒绝该解。

错误移动方向的反例
~~~~~~~~~~~~~~~~~~

对 ``[2,7,11,15]`` 和 ``target=18``，初始 ``2+15=17`` 过小。
此时必须增大左端；若反而减小右端，会依次得到 13、9，并丢失真正答案 ``7+11``。

问题抽象与解法选择
------------------

数组有序后，固定左端 ``i`` 时，和 ``numbers[i]+numbers[j]`` 随 ``j`` 增大而不减；
固定右端 ``j`` 时，和随 ``i`` 增大而不减。二维下标对因此具有单调边界。

把两个指针放在当前候选区间两端：

* 和等于目标时直接返回；
* 和小于目标时，当前左端与区间内任何右端配对都只会更小，因此排除左端；
* 和大于目标时，当前右端与区间内任何左端配对都只会更大，因此排除右端。

每轮都能安全删除一个不可能属于答案的端点。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - 双指针单调排除
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接利用有序前提
   * - 对每个位置二分补数
     - ``O(n log n)``
     - ``O(1)``
     - 正确，但重复搜索且需要谨慎排除自身
   * - 哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 忽略了常数空间要求，也没有利用有序性
   * - 枚举全部下标对
     - ``O(n^2)``
     - ``O(1)``
     - 不满足规模要求

状态、不变量与实现映射
----------------------

维护零基指针 ``left``、``right``，始终满足 ``0 <= left < right < n``。
题目保证存在唯一答案下标对，记为 ``(p,q)``。

循环入口保持以下不变量：

#. 所有 ``i < left`` 都已被证明不能属于任何合法解；
#. 所有 ``j > right`` 都已被证明不能属于任何合法解；
#. 尚未返回时，唯一答案仍满足 ``left <= p < q <= right``；
#. 当前只读取 ``numbers[left]`` 和 ``numbers[right]``，输入保持不变。

当 ``sum < target`` 时，对任意 ``j`` 满足 ``left < j <= right``：

.. math::

   numbers[left] + numbers[j]
   \le numbers[left] + numbers[right]
   < target

所以 ``left`` 不可能参与解，可以执行 ``left += 1``。

当 ``sum > target`` 时，对任意 ``i`` 满足 ``left <= i < right``：

.. math::

   numbers[i] + numbers[right]
   \ge numbers[left] + numbers[right]
   > target

所以 ``right`` 不可能参与解，可以执行 ``right -= 1``。

这些论证只依赖非递减顺序，不依赖严格递增，因此重复值不会破坏不变量。

正确性证明
----------

引理一：和过小时排除左端是安全的
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前端点和小于目标，有序性保证当前左端与候选区间中任意其他元素的和都不超过当前端点和。
这些配对全部小于目标，所以任何合法解都不使用当前左端。左指针右移不会丢失答案。

引理二：和过大时排除右端是安全的
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前端点和大于目标，有序性保证当前右端与候选区间中任意其他元素的和都不小于当前端点和。
这些配对全部大于目标，所以任何合法解都不使用当前右端。右指针左移不会丢失答案。

引理三：循环不变量始终保持
~~~~~~~~~~~~~~~~~~~~~~~~~~

初始区间覆盖全部下标，唯一答案显然位于其中。每轮若没有返回，就由引理一或引理二删除一个
不属于任何解的端点，因此已排除区域仍然不含解，唯一答案继续保留在新闭区间中。

引理四：算法终止并返回两个不同位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮要么返回，要么令 ``right-left`` 减一。该非负整数严格下降，所以循环有限。
循环条件 ``left < right`` 保证比较和返回时使用两个不同位置。

定理：算法返回题目要求的唯一一基下标对
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根据引理三，唯一答案在算法运行期间不会被排除。有限次收缩后，算法必在答案两端同时成为
当前指针时观察到目标和并返回。实现把内部零基指针各加一，且保持左小于右，因此返回值
正是题目要求的唯一一基下标对。

复杂度与接口成本
----------------

两个指针各自只向数组内部移动，合计最多 ``n-1`` 次，时间复杂度 ``O(n)``。
核心状态只有两个指针和当前和，额外工作空间 ``O(1)``。固定返回两个整数，返回载荷也是 ``O(1)``。

当前数值范围使端点和位于 ``[-2000,2000]``，所有语言的普通整数都安全。
C 实现需要动态分配两个整数，并通过 ``returnSize`` 报告长度；成功结果由调用者释放。
分配失败返回 ``NULL`` 且保持 ``*returnSize=0``，该资源失败不属于题目输入语义。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>

   int *twoSum(
       int *numbers,
       int numbersSize,
       int target,
       int *returnSize
   ) {
       int left = 0;
       int right = numbersSize - 1;
       *returnSize = 0;

       while (left < right) {
           int sum = numbers[left] + numbers[right];
           if (sum == target) {
               int *answer = malloc(2 * sizeof(*answer));
               if (answer == NULL) {
                   return NULL;
               }
               answer[0] = left + 1;
               answer[1] = right + 1;
               *returnSize = 2;
               return answer;
           }
           if (sum < target) {
               ++left;
           } else {
               --right;
           }
       }

       return NULL;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> twoSum(
           const std::vector<int>& numbers,
           int target
       ) {
           int left = 0;
           int right = static_cast<int>(numbers.size()) - 1;

           while (left < right) {
               int sum = numbers[left] + numbers[right];
               if (sum == target) {
                   return {left + 1, right + 1};
               }
               if (sum < target) {
                   ++left;
               } else {
                   --right;
               }
           }

           return {};
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import List

   class Solution:
       def twoSum(self, numbers: List[int], target: int) -> List[int]:
           left = 0
           right = len(numbers) - 1

           while left < right:
               current_sum = numbers[left] + numbers[right]
               if current_sum == target:
                   return [left + 1, right + 1]
               if current_sum < target:
                   left += 1
               else:
                   right -= 1

           return []

Java
~~~~

.. code-block:: java

   class Solution {
       public int[] twoSum(int[] numbers, int target) {
           int left = 0;
           int right = numbers.length - 1;

           while (left < right) {
               int sum = numbers[left] + numbers[right];
               if (sum == target) {
                   return new int[] {left + 1, right + 1};
               }
               if (sum < target) {
                   ++left;
               } else {
                   --right;
               }
           }

           return new int[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn two_sum(numbers: Vec<i32>, target: i32) -> Vec<i32> {
           let mut left = 0_usize;
           let mut right = numbers.len() - 1;

           while left < right {
               let sum = numbers[left] + numbers[right];
               if sum == target {
                   return vec![left as i32 + 1, right as i32 + 1];
               }
               if sum < target {
                   left += 1;
               } else {
                   right -= 1;
               }
           }

           Vec::new()
       }
   }

Go
~~

.. code-block:: go

   func twoSum(numbers []int, target int) []int {
       left := 0
       right := len(numbers) - 1

       for left < right {
           sum := numbers[left] + numbers[right]
           if sum == target {
               return []int{left + 1, right + 1}
           }
           if sum < target {
               left++
           } else {
               right--
           }
       }

       return []int{}
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function twoSum(numbers: number[], target: number): number[] {
       let left = 0;
       let right = numbers.length - 1;

       while (left < right) {
           const sum = numbers[left] + numbers[right];
           if (sum === target) {
               return [left + 1, right + 1];
           }
           if (sum < target) {
               left += 1;
           } else {
               right -= 1;
           }
       }

       return [];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int[] TwoSum(int[] numbers, int target) {
           int left = 0;
           int right = numbers.Length - 1;

           while (left < right) {
               int sum = numbers[left] + numbers[right];
               if (sum == target) {
                   return new int[] {left + 1, right + 1};
               }
               if (sum < target) {
                   ++left;
               } else {
                   --right;
               }
           }

           return System.Array.Empty<int>();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function two_sum(numbers::Vector{Int}, target::Int)::Vector{Int}
       left = 1
       right = length(numbers)

       while left < right
           current_sum = numbers[left] + numbers[right]
           if current_sum == target
               return [left, right]
           elseif current_sum < target
               left += 1
           else
               right -= 1
           end
       end

       return Int[]
   end

R
~

.. code-block:: r

   two_sum <- function(numbers, target) {
     left <- 1L
     right <- length(numbers)

     while (left < right) {
       current_sum <- numbers[left] + numbers[right]
       if (current_sum == target) {
         return(c(left, right))
       }
       if (current_sum < target) {
         left <- left + 1L
       } else {
         right <- right - 1L
       }
     }

     integer(0L)
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试题解代码，也没有执行随机对拍、穷举、属性测试、sanitizer
或目标语言最小程序。以下结论来自端点表人工推演、单调排除证明和逐语言静态语义审查。

官方示例推演
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 输入
     - 端点变化
     - 返回
   * - ``[2,7,11,15]``，9
     - ``17 -> 13 -> 9``，连续左移右端
     - ``[1,2]``
   * - ``[2,3,4]``，6
     - 首轮 ``2+4=6``
     - ``[1,3]``
   * - ``[-1,0]``，-1
     - 两元素首轮命中
     - ``[1,2]``

重复值和错误方向
~~~~~~~~~~~~~~~~

``[1,1,3,5]``、目标 2 最终由两个不同的一值位置命中，证明实现没有跳过重复值。
``[2,7,11,15]``、目标 18 的首轮和 17 过小；左移后命中 ``7+11``，
与“过小时左端不可能参与解”的排除证明一致。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C**：``numbersSize>=2`` 使右端合法；成功时只分配两个 ``int``，写满后再设置
  ``returnSize=2``；失败与合同外无解都返回 ``NULL``，但分配失败保持长度 0。
* **C++ / Java / C#**：输入只读，返回新建的两个整数容器；内部零基转一基只发生一次。
* **Python / TypeScript**：数组未切片，指针和当前和为常数状态；返回数组固定两项。
* **Rust**：按值接收 ``Vec<i32>`` 取得所有权但不克隆或修改元素；非空长度前提支撑
  ``len()-1``，下标转 ``i32`` 远小于边界。
* **Go**：切片只读；宿主 ``int`` 即使为 32 位也能容纳当前元素、和与下标。
* **Julia / R**：内部本来就是一基下标，命中时直接返回 ``left,right``，不能再次加一；
  循环条件保证不同位置。

剩余风险
~~~~~~~~

静态审查没有确认判题机模板、各语言版本或 C 分配行为。所有实现依赖题目保证存在唯一解；
合同外无解时返回空容器或 ``NULL``，这不是题目要求的额外错误协议。

关键边界与失败方式
------------------

* 循环必须使用 ``left < right``，允许相等会把同一元素使用两次。
* 和过小时移动左端，和过大时移动右端；方向反转会删除可能答案。
* 证明只需要非递减，不需要元素互异或严格递增。
* 重复值可以构成答案，不能主动跳过相等元素。
* 返回下标从 1 开始；Julia 和 R 已是一基，其他八种实现需要加一。
* 使用哈希表虽然可以求解，却违反常数额外空间合同。
* C 只有成功分配后才能把 ``returnSize`` 设置为 2，避免失败路径谎报结果长度。

学习链与知识更新
----------------

本题把有序性转化为“每次安全删除一整行或一整列候选”的单调排除。
核心并非经验性的左右夹逼，而是两个端点不等式证明：当前和过小时左端所有配对都过小，
当前和过大时右端所有配对都过大。

新增或强化：

* 用“唯一答案仍在当前闭区间”表达双指针不变量；
* 用有序端点界证明排除安全性；
* 区分不同下标与不同数值；
* 区分核心常数状态和固定大小返回载荷；
* 可联系 `0001. Two Sum <../0001-0100/0001-two-sum.rst>`_：0001 面对无序数组使用哈希，
  本题借助有序前提把空间降为常数。

带答案自检
----------

#. **为什么和过小时可以排除左端？**

   当前右端已经是候选区间最大值；左端与任何更小或相等的右侧值配对，和都不会超过当前和，
   因而不可能达到更大的目标。

#. **为什么重复值不会破坏证明？**

   证明使用的是 ``<=`` 和 ``>=`` 的非递减关系，不要求相邻元素严格不同。

#. **为什么必须保持 ``left < right``？**

   题目要求两个不同位置；相等时计算的是同一元素两次。

#. **哪些语言不需要把下标加一？**

   Julia 和 R 的数组下标本来从 1 开始；其他实现内部使用零基指针。

#. **为什么哈希解法不适合作为主解法？**

   它需要 ``O(n)`` 额外空间，违反题目常数空间要求，也浪费了输入已经排序的强前提。
