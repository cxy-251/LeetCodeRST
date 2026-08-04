1502. Can Make Arithmetic Progression From Sequence
===================================================

题目信息
--------

:题号: 1502
:难度: Easy
:主题: 数组、全排列、排序、等差数列、位置映射
:原题: `LeetCode 1502 <https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/>`_
:重点: 从枚举所有排列，逐步推导到排序后的唯一候选，再利用最小值和最大值直接验证每个元素的位置

题目重述
--------

给定一个长度为 ``n`` 的整数数组 ``arr``。可以任意调整元素顺序，但每个元素必须且只能使用一次。

需要判断是否存在一个重排后的数组 ``b``，以及一个固定整数 ``d``，使所有相邻元素都满足 ``b[i] - b[i - 1] = d``。

只需要返回是否存在这样的排列，不需要返回具体排列。公差 ``d`` 可以是正数、负数或 ``0``。

约束条件：

* ``2 <= arr.length <= 1000``；
* ``-10^6 <= arr[i] <= 10^6``。

测试用例
--------

* 普通乱序：``arr = [3, 5, 1]``，可以重排为 ``[1, 3, 5]``，返回 ``true``；
* 无法统一公差：``arr = [1, 2, 4]``，排序后相邻差为 ``1`` 和 ``2``，返回 ``false``；
* 公差为零：``arr = [7, 7, 7]``，所有相邻差都为 ``0``，返回 ``true``；
* 只有两个元素：``arr = [-5, 100]``，两个数总能构成等差数列，返回 ``true``；
* 部分元素重复：``arr = [1, 1, 3]``，既不能使用公差 ``0``，也无法使用非零公差，返回 ``false``。

方法一：全排列搜索
------------------

题目允许任意重排，最直接的做法就是枚举所有排列。

对于每个排列，先用前两个元素确定公差，再检查后续相邻差是否相同。只要找到一个合法排列，就返回 ``true``；全部排列都不合法时返回 ``false``。

这个方法一定不会漏掉答案，因为所有可能顺序都会被检查。问题在于长度为 ``n`` 的数组最多有 ``n!`` 种排列，而每个排列还需要 ``O(n)`` 时间检查，总时间达到 ``O(n! · n)``。

C++ 实现一
~~~~~~~~~~

.. code-block:: cpp

   class Solution {
   private:
       bool isArithmetic(const vector<int>& nums) {
           const long long difference =
               static_cast<long long>(nums[1]) - nums[0];

           for (int i = 2; i < static_cast<int>(nums.size()); ++i) {
               const long long currentDifference =
                   static_cast<long long>(nums[i]) - nums[i - 1];

               if (currentDifference != difference) {
                   return false;
               }
           }

           return true;
       }

   public:
       bool canMakeArithmeticProgression(vector<int>& arr) {
           sort(arr.begin(), arr.end());

           do {
               if (isArithmetic(arr)) {
                   return true;
               }
           } while (next_permutation(arr.begin(), arr.end()));

           return false;
       }
   };

先排序不是为了直接得到答案，而是让 ``next_permutation`` 从最小字典序开始，完整枚举所有不同排列。

这一版代码中，``isArithmetic`` 的线性检查并不慢。真正无法承受的是外层的全排列枚举。因此下一步需要消除的不是检查过程，而是“寻找正确顺序”的过程。

方法二：排序确定候选
--------------------

等差数列的顺序并不是任意的。

假设某个合法排列的公差 ``d < 0``，将整个排列反转后，公差就变成 ``-d > 0``。因此，只要存在合法排列，就一定存在一个公差非负的合法排列。

公差非负时，数列必然按照非递减顺序排列。而一个数组的全部元素排序后，恰好得到它唯一的非递减顺序。

所以：

* 若数组能够重排成等差数列，排序后的数组一定也是等差数列；
* 若排序后的数组相邻差不相同，就不可能再通过其他排列得到等差数列。

全排列搜索原本需要反复尝试不同顺序。得到这个结论后，所有候选顺序被压缩成了排序后的唯一序列，只需检查一次。

C++ 实现二
~~~~~~~~~~

.. code-block:: cpp

   class Solution {
   public:
       bool canMakeArithmeticProgression(vector<int>& arr) {
           sort(arr.begin(), arr.end());

           const long long difference =
               static_cast<long long>(arr[1]) - arr[0];

           for (int i = 2; i < static_cast<int>(arr.size()); ++i) {
               const long long currentDifference =
                   static_cast<long long>(arr[i]) - arr[i - 1];

               if (currentDifference != difference) {
                   return false;
               }
           }

           return true;
       }
   };

与实现一相比，``isArithmetic`` 的核心检查几乎没有变化。真正的优化是删除了 ``do-while`` 全排列循环，只保留一次排序和一次检查。

这说明代码变短并不是因为省略了步骤，而是因为“排序后的序列是唯一候选”这个结构直接消除了搜索空间。

方法三：线性位置验证
--------------------

排序方案已经足以通过题目，还可以继续利用等差数列的结构，连排序也省掉。

长度为 ``n`` 的等差数列若最小值为 ``minimum``、最大值为 ``maximum``，公差只能是 ``(maximum - minimum) / (n - 1)``。

因此首先检查 ``maximum - minimum`` 是否能被 ``n - 1`` 整除。若不能整除，就不存在整数公差。

公差确定后，每个元素 ``value`` 的位置也被唯一确定：它必须满足 ``value = minimum + index * difference``，所以 ``index = (value - minimum) / difference``。

每个元素只需检查三件事：

#. ``value - minimum`` 能否被公差整除；
#. 算出的 ``index`` 是否位于 ``[0, n - 1]``；
#. 该位置是否已经被另一个元素占用。

若公差不为 ``0``，同一个位置不能出现两个元素；若最大值等于最小值，则所有元素相同，直接返回 ``true``。

C++ 实现三
~~~~~~~~~~

.. code-block:: cpp

   class Solution {
   public:
       bool canMakeArithmeticProgression(vector<int>& arr) {
           const int n = static_cast<int>(arr.size());
           const auto [minimumIt, maximumIt] =
               minmax_element(arr.begin(), arr.end());

           const long long minimum = *minimumIt;
           const long long maximum = *maximumIt;
           const long long span = maximum - minimum;

           if (span == 0) {
               return true;
           }

           if (span % (n - 1) != 0) {
               return false;
           }

           const long long difference = span / (n - 1);
           vector<bool> occupied(n, false);

           for (int value : arr) {
               const long long offset =
                   static_cast<long long>(value) - minimum;

               if (offset % difference != 0) {
                   return false;
               }

               const long long index = offset / difference;

               if (index < 0 || index >= n || occupied[index]) {
                   return false;
               }

               occupied[index] = true;
           }

           return true;
       }
   };

这一次的优化不再寻找元素顺序，而是先由最小值、最大值和数组长度推导出唯一公差，再直接验证每个元素是否落在它应有的位置。

排序方案通过比较相邻元素发现错误；线性方案则通过“目标位置不存在、位置不整除或位置冲突”发现错误。两者判断的是同一个结构，只是验证方式不同。

代码分析
--------

第一版代码包含两层工作：外层枚举排列，内层检查相邻差。相邻差检查已经是线性的，瓶颈来自外层的阶乘级搜索。

第二版发现合法等差数列必然可以按非递减顺序排列，因此排序结果是唯一需要检查的候选。这个结论让代码直接删除整个全排列循环，时间复杂度从阶乘级降为 ``O(n log n)``。

第三版继续观察到，等差数列一旦确定最小值、最大值和长度，公差及每个元素的位置也随之确定。于是代码删除 ``sort``，改用 ``minmax_element`` 找边界，再使用 ``occupied`` 验证位置，时间复杂度降为 ``O(n)``。

三次实现的变化对应三层认识：

* 不知道顺序时，枚举所有顺序；
* 知道合法顺序必然有序时，只检查排序结果；
* 知道每个值的目标位置可以计算时，直接验证位置。

实际提交时，排序方案通常是更合适的默认解法。它的时间复杂度已经足够，代码短，边界条件少，也更容易验证。线性方案具有更优的渐进时间复杂度，但需要额外位置数组，并增加整除、零公差和重复位置处理。

复杂度分析
----------

方法一：全排列搜索
~~~~~~~~~~~~~~~~~~

* 时间复杂度：最坏 ``O(n! · n)``；
* 额外空间复杂度：取决于排列生成和排序实现，通常为 ``O(log n)``。

方法二：排序检查
~~~~~~~~~~~~~~~~

* 时间复杂度：排序为 ``O(n log n)``，扫描为 ``O(n)``，总计 ``O(n log n)``；
* 额外空间复杂度：取决于排序实现，通常记为 ``O(log n)``。

方法三：位置验证
~~~~~~~~~~~~~~~~

* 时间复杂度：寻找最小值和最大值为 ``O(n)``，验证所有位置为 ``O(n)``，总计 ``O(n)``；
* 额外空间复杂度：位置数组占用 ``O(n)``。

边界处理
--------

* 长度为 ``2`` 时，任意两个元素都能确定一个公差，三种实现都会返回 ``true``；
* 所有元素相同时，公差为 ``0``，排序方案正常通过，线性方案由 ``span == 0`` 直接返回；
* 只有部分元素重复时，排序方案会遇到不一致的相邻差，线性方案会检测到位置冲突；
* 数组包含负数时，差值和位置关系不变；
* C++ 实现使用 ``long long`` 计算差值和跨度，避免减法在更大数据范围下产生溢出。