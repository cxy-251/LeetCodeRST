1502. Can Make Arithmetic Progression From Sequence
===================================================

题目信息
--------

:题号: 1502
:难度: Easy
:主题: 数组、全排列、排序、等差数列、位置映射
:原题: `LeetCode 1502 <https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/>`_
:重点: 从枚举全部排列，推导到排序后的唯一候选，再利用最小值和最大值直接验证目标位置

题目重述
--------

给定一个长度为 ``n`` 的整数数组 ``arr``。可以任意调整元素顺序，但每个元素必须且只能使用一次。

判断是否存在一个重排后的数组 ``b`` 和一个固定整数 ``d``，使所有 ``1 <= i < n`` 都满足：

.. code-block:: text

   b[i] - b[i - 1] = d

只需返回是否存在这样的排列，不需要返回具体排列。公差 ``d`` 可以为正数、负数或 ``0``。

约束为 ``2 <= arr.length <= 1000``、``-10^6 <= arr[i] <= 10^6``。

自建示例
--------

.. code-block:: text

   输入：arr = [3,5,1]
   输出：true

排序后得到 ``[1,3,5]``，相邻差都为 ``2``。

.. code-block:: text

   输入：arr = [1,2,4]
   输出：false

排序后相邻差分别为 ``1`` 和 ``2``，不存在其他顺序能够形成等差数列。

.. code-block:: text

   输入：arr = [7,7,7]
   输出：true

所有元素相同，公差为 ``0``。

.. code-block:: text

   输入：arr = [1,1,3]
   输出：false

跨度为 ``2``，长度为 ``3``，目标公差为 ``1``；数值 ``2`` 缺失，而位置 ``0`` 被重复占用。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool isArithmetic(const std::vector<int>& nums) {
           const long long difference =
               static_cast<long long>(nums[1]) - nums[0];

           for (int i = 2; i < static_cast<int>(nums.size()); ++i) {
               const long long currentDifference =
                   static_cast<long long>(nums[i]) - nums[i - 1];
               if (currentDifference != difference) return false;
           }
           return true;
       }

       bool enumeratePermutations(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           do {
               if (isArithmetic(nums)) return true;
           } while (std::next_permutation(nums.begin(), nums.end()));
           return false;
       }

       bool sortAndCheck(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           return isArithmetic(nums);
       }

       bool validatePositions(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           const auto [minimumIt, maximumIt] =
               std::minmax_element(nums.begin(), nums.end());

           const long long minimum = *minimumIt;
           const long long maximum = *maximumIt;
           const long long span = maximum - minimum;

           if (span == 0) return true;
           if (span % (n - 1) != 0) return false;

           const long long difference = span / (n - 1);
           std::vector<char> occupied(n, false);

           for (int value : nums) {
               const long long offset =
                   static_cast<long long>(value) - minimum;
               if (offset % difference != 0) return false;

               const long long index = offset / difference;
               if (index < 0 || index >= n || occupied[index]) {
                   return false;
               }
               occupied[index] = true;
           }
           return true;
       }

   public:
       bool canMakeArithmeticProgression(std::vector<int>& arr) {
           return sortAndCheck(arr);
       }
   };

题解
----

从全排列开始
~~~~~~~~~~~~

题目允许任意重排，最直接的方法是枚举全部排列。对每个排列，用前两个元素确定公差，再检查后续相邻差。
只要一个排列通过检查即可返回 ``true``。

``enumeratePermutations`` 先排序，再用 ``next_permutation`` 按字典序生成所有不同排列。这个方法不会遗漏任何
可能顺序，但最多需要检查 ``n!`` 个排列，每次检查又需要 ``O(n)`` 时间，无法处理 ``n = 1000``。

瓶颈不在相邻差检查，而在于尚未利用等差数列对顺序的限制。

有序候选
~~~~~~~~

若某个合法排列的公差 ``d < 0``，把排列反转后便得到公差 ``-d > 0`` 的合法排列。因此只要答案存在，就一定
存在一个公差非负的合法排列。

公差非负时，序列必然按非递减顺序排列。数组排序后恰好得到全部元素唯一的非递减顺序，所以所有排列候选可以
压缩为一个：

.. code-block:: text

   sort(arr)

排序结果是等差数列时，原数组显然可以重排成功；排序结果不是等差数列时，也不存在另一个非递减候选能够改变
相邻差。

相邻差不变量
~~~~~~~~~~~~

设排序后的数组为 ``nums``，第一对元素确定目标公差：

.. code-block:: text

   difference = nums[1] - nums[0]

扫描到下标 ``i`` 前，已经确认 ``nums[0..i-1]`` 的全部相邻差都等于 ``difference``。当前只需检查：

.. code-block:: text

   nums[i] - nums[i-1] == difference

检查通过后，不变量扩展到 ``i``；任意一次失败都说明排序后的唯一候选不合法，可以立即返回 ``false``。

``sortAndCheck`` 因而把阶乘级排列搜索降为一次排序和一次线性扫描。公开入口调用这一实现，因为代码短、状态少，
并且在题目规模下已经足够高效。按值接收副本也避免修改调用者传入的数组。

位置映射
~~~~~~~~

还可以继续消除排序。长度为 ``n`` 的等差数列一旦确定最小值 ``minimum`` 和最大值 ``maximum``，公差只能是：

.. code-block:: text

   difference = (maximum - minimum) / (n - 1)

若跨度不能被 ``n - 1`` 整除，就不存在整数公差。公差确定后，任意元素 ``value`` 的目标下标也唯一确定：

.. code-block:: text

   index = (value - minimum) / difference

因此 ``validatePositions`` 对每个元素检查三件事：偏移量能被公差整除、目标下标位于 ``[0,n-1]``、目标位置
尚未被其他元素占用。全部元素都通过时，恰好填满等差数列的全部位置。

重复与零公差
~~~~~~~~~~~~

当 ``maximum == minimum`` 时，所有元素相同，公差为 ``0``，结果直接为 ``true``。这一步必须在取模和除法前
处理，避免除以零。

当公差非零时，不同下标对应不同数值。若两个输入元素映射到同一个位置，说明出现了不允许的重复，同时必然有
另一个目标值缺失，立即返回 ``false``。

排序方法通过不一致的相邻差发现同一问题；位置映射则通过整除失败或位置冲突发现问题。两种方法验证的是同一个
等差结构。

三种方法的关系
~~~~~~~~~~~~~~

全排列方法不知道合法顺序，只能尝试所有候选。排序方法证明非递减顺序是唯一候选，删除了排列搜索。位置映射
进一步证明每个元素的目标位置都能直接计算，又删除了排序。

优化过程依次压缩的是：

.. code-block:: text

   全部排列 -> 唯一有序排列 -> 每个值的唯一目标位置

复杂度分析
~~~~~~~~~~

``enumeratePermutations`` 最坏检查 ``n!`` 个排列，每次检查 ``O(n)``，时间为 ``O(n! · n)``；排列数组副本
占用 ``O(n)``，排序调用栈通常为 ``O(log n)``。

``sortAndCheck`` 的排序时间为 ``O(n log n)``，扫描时间为 ``O(n)``；数组副本占用 ``O(n)``。公开入口使用
这一实现，且不修改输入。

``validatePositions`` 两次线性扫描即可完成验证，时间为 ``O(n)``，位置数组占用 ``O(n)``。

边界处理
~~~~~~~~

长度为 ``2`` 时，任意两个元素都能确定一个公差。所有元素相同时，排序方法自然通过，位置方法由
``span == 0`` 直接返回。数组包含负数时，排序、跨度和位置关系均不改变。

差值与跨度使用 ``long long`` 计算，避免整数减法在更大数据范围下溢出。
