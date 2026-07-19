0055. Jump Game
===============

题目信息
--------

:题号: 0055
:难度: Medium
:主题: 数组、贪心、可达前缀、单调边界
:原题: `LeetCode 0055 <https://leetcode.com/problems/jump-game/>`_
:访问状态: Available
:教学重点: 最远可达边界、不可达断点、前缀闭包、与最少跳数的区别

题目重述
--------

给定一个非负整数数组 ``nums``。位于下标 ``i`` 时，最多可以向右跳 ``nums[i]`` 步。判断能否从
下标 ``0`` 到达最后一个下标。

题目保证 ``1 <= nums.length <= 10000``，``0 <= nums[i] <= 100000``。输入数组不会被修改。
最大表达式 ``i + nums[i]`` 不超过 ``109999``，32 位有符号整数安全。

自建示例
--------

可以到达
~~~~~~~~

.. code-block:: text

   输入：[2, 3, 1, 1, 4]
   输出：true

下标 0 最远到 2；扫描下标 1 后，最远可达边界扩展到 4。

被零阻断
~~~~~~~~

.. code-block:: text

   输入：[3, 2, 1, 0, 4]
   输出：false

扫描完可达前缀 ``0..3`` 后，最远边界仍为 3，无法进入下标 4。

单元素
~~~~~~

.. code-block:: text

   输入：[0]
   输出：true

起点已经是终点。

问题抽象
--------

维护 ``farthest``：当前已经确认可达的位置中，再跳一次能够覆盖的最右下标。

扫描到下标 ``index`` 时：

* 若 ``index > farthest``，当前下标不可达；由于所有跳跃只向右，后续下标也无法被处理，答案为
  ``false``；
* 否则 ``index`` 可达，可以用 ``index + nums[index]`` 扩展 ``farthest``；
* 当 ``farthest >= n - 1``，终点已经进入可达前缀，答案为 ``true``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 最远可达边界贪心
     - ``O(n)``
     - ``O(1)``
     - 主解法；只维护可达前缀的右端
   * - 从右向左维护好位置
     - ``O(n)``
     - ``O(1)``
     - 等价贪心；反向理解较绕
   * - 动态规划可达状态
     - ``O(n²)``
     - ``O(n)``
     - 状态直接，没有利用前缀闭包
   * - 显式图搜索
     - 最坏 ``O(n²)``
     - ``O(n)``
     - 枚举大量连续出边

主解法：维护可达前缀
--------------------

核心不变量
~~~~~~~~~~

处理下标 ``index`` 之前：

* ``0..farthest`` 中的每个位置都能从起点到达；
* ``farthest`` 是已经扫描的可达位置能够覆盖的最右边界；
* 只有 ``index <= farthest`` 时，才允许使用 ``nums[index]`` 扩展边界；
* 若 ``index > farthest``，不存在任何更早可达位置能够跨过这个断点。

为什么可达集合是前缀
~~~~~~~~~~~~~~~~~~~~

若某个可达位置 ``i`` 能跳到 ``i + k``，那么它也能选择更短步数到达
``i + 1, i + 2, ..., i + k``。因此所有已知可达位置的出边并集仍是一个连续前缀，不需要记录离散
集合。

正确性依据
~~~~~~~~~~

**不变量保持。** 当 ``index <= farthest`` 时，``index`` 可达。它可以覆盖到
``index + nums[index]``，更新最大值后，新的 ``0..farthest`` 仍全部可达。

**失败判定正确。** 若 ``index > farthest``，所有更早的可达位置都已经扫描，其最大覆盖仍小于
``index``。任何后续位置的使用都要求先到达 ``index`` 或更右位置，因此不存在跨越该断点的路径。

**成功判定正确。** 当 ``farthest >= n-1`` 时，终点属于可达前缀，根据前缀不变量存在一条从起点
到终点的跳跃序列。

**终止性。** 下标单调递增，每个位置最多处理一次；提前成功或失败都会立即返回。

复杂度
~~~~~~

* 每个下标最多扫描一次，时间复杂度为 ``O(n)``；
* 只保存下标和最远边界，算法额外空间为 ``O(1)``；
* 输入数组不修改，返回值是单个布尔量。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   bool canJump(int *nums, int numsSize) {
       int farthest = 0;

       for (int index = 0; index < numsSize; ++index) {
           if (index > farthest) {
               return false;
           }

           int reach = index + nums[index];
           if (reach > farthest) {
               farthest = reach;
           }
           if (farthest >= numsSize - 1) {
               return true;
           }
       }
       return true;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       bool canJump(const std::vector<int>& nums) {
           int farthest = 0;

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               if (index > farthest) {
                   return false;
               }
               int reach = index + nums[index];
               if (reach > farthest) {
                   farthest = reach;
               }
               if (farthest >= static_cast<int>(nums.size()) - 1) {
                   return true;
               }
           }
           return true;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def canJump(self, nums: list[int]) -> bool:
           farthest = 0

           for index, jump in enumerate(nums):
               if index > farthest:
                   return False
               farthest = max(farthest, index + jump)
               if farthest >= len(nums) - 1:
                   return True

           return True

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean canJump(int[] nums) {
           int farthest = 0;

           for (int index = 0; index < nums.length; ++index) {
               if (index > farthest) {
                   return false;
               }
               farthest = Math.max(farthest, index + nums[index]);
               if (farthest >= nums.length - 1) {
                   return true;
               }
           }
           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn can_jump(nums: Vec<i32>) -> bool {
           let mut farthest = 0_usize;

           for (index, jump) in nums.iter().enumerate() {
               if index > farthest {
                   return false;
               }
               let reach = index + *jump as usize;
               farthest = farthest.max(reach);
               if farthest >= nums.len() - 1 {
                   return true;
               }
           }
           true
       }
   }

``jump`` 由题目保证非负，转换为 ``usize`` 前提明确。

Go
~~

.. code-block:: go

   func canJump(nums []int) bool {
       farthest := 0

       for index, jump := range nums {
           if index > farthest {
               return false
           }
           if index+jump > farthest {
               farthest = index + jump
           }
           if farthest >= len(nums)-1 {
               return true
           }
       }
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canJump(nums: number[]): boolean {
       let farthest = 0;

       for (let index = 0; index < nums.length; index += 1) {
           if (index > farthest) {
               return false;
           }
           farthest = Math.max(farthest, index + nums[index]);
           if (farthest >= nums.length - 1) {
               return true;
           }
       }
       return true;
   }

最大到达下标远小于 JavaScript 安全整数上限，且实现不使用 32 位位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool CanJump(int[] nums) {
           int farthest = 0;

           for (int index = 0; index < nums.Length; ++index) {
               if (index > farthest) {
                   return false;
               }
               farthest = System.Math.Max(
                   farthest,
                   index + nums[index]
               );
               if (farthest >= nums.Length - 1) {
                   return true;
               }
           }
           return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function can_jump(nums::Vector{Int})::Bool
       farthest = 0

       for index in eachindex(nums)
           position = index - 1
           if position > farthest
               return false
           end
           farthest = max(farthest, position + nums[index])
           if farthest >= length(nums) - 1
               return true
           end
       end
       true
   end

``farthest`` 保持零基算法坐标，只有访问数组时使用 Julia 的一基 ``index``。

R
~

.. code-block:: r

   can_jump <- function(nums) {
     farthest <- 0L

     for (index in seq_along(nums)) {
       position <- index - 1L
       if (position > farthest) {
         return(FALSE)
       }
       farthest <- max(farthest, position + nums[[index]])
       if (farthest >= length(nums) - 1L) {
         return(TRUE)
       }
     }
     TRUE
   }

验证计划与证据
--------------

* 固定用例覆盖可达、零阻断、单元素、连续零和一步直达；
* 随机短数组与独立 BFS 可达性实现对拍；
* 检查失败位置必须满足 ``index > farthest``；
* 检查成功时 ``farthest >= n-1``。

已完成的验证：

* **运行验证：** C、C++、Python、Java、Go、TypeScript 执行可达、断点、单元素和一步直达用例；
* **随机对拍：** Python 对长度 ``1..19`` 的随机短数组与独立 BFS 可达性实现一致；
* **编译验证：** C17 ``-Wall -Wextra -Werror``、C++17、``javac -Xlint:all``、
  TypeScript ``tsc --strict``；
* **内存验证：** C 使用 AddressSanitizer 与 UndefinedBehaviorSanitizer；
* **静态验证：** Rust、C#、Julia、R 检查非负转换、零基坐标和提前返回；
* 当前环境未安装 Rust、C#、Julia、R 运行时，因此不声称运行通过。

关键边界
--------

* ``n = 1`` 时起点就是终点，应返回 ``true``；
* 只能使用已经可达位置的跳跃长度；
* 遇到 ``index > farthest`` 立即失败；
* ``farthest`` 可以超过最后下标，它是覆盖边界，不是数组访问下标；
* 本题只判断可达性，不统计最少跳数。

易错点
------

* 无条件扫描不可达位置并使用其跳跃长度；
* 把当前数组值最大的下标当作贪心落点；
* 把 0055 与 0045 的“最少跳数”状态混用；
* 把 ``farthest`` 当作必须访问的真实下标；
* 从右向左解法中误把局部可达当作全局可达。

本题新增知识
------------

* 非负跳跃区间使可达位置形成连续前缀；
* 最远可达边界同时支持提前成功和断点失败；
* 可达性只需要维护覆盖范围，不需要记录具体路径。

本题强化知识
------------

* 0045 的 ``farthest`` 边界，但本题不维护 BFS 层和跳数；
* 0011、0042 的单调边界证明；
* 数值宽度继续由精确长度与跳跃上界推导。

关联题目
--------

* `0045. Jump Game II <0045-jump-game-ii.rst>`_：相同覆盖边界，目标改为最少跳数；
* `0053. Maximum Subarray <0053-maximum-subarray.rst>`_：线性扫描中的滚动最优状态。

最小自检
--------

#. 为什么只有 ``index <= farthest`` 时才能使用 ``nums[index]``？
#. 为什么已知可达位置组成连续前缀？
#. ``index > farthest`` 为什么能立即判定失败？
#. 本题与 0045 的状态差异是什么？
#. ``farthest`` 超过数组末尾是否有问题？

答案要点
~~~~~~~~

#. 因为不可达位置不能作为跳跃起点。
#. 每个位置允许选择不超过最大步数的任意短跳，出边覆盖连续区间。
#. 所有更早可达位置都已扫描，仍无法覆盖该下标，后续也没有入口。
#. 本题只维护可达边界；0045 还维护当前 BFS 层边界和跳数。
#. 没有问题；它只表示覆盖范围，不会用于数组访问。
