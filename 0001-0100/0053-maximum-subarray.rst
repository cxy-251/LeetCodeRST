0053. Maximum Subarray
======================

题目信息
--------

:题号: 0053
:难度: Medium
:主题: 数组、动态规划、前缀和、分治
:原题: `LeetCode 0053 <https://leetcode.com/problems/maximum-subarray/>`_
:重点: 非空连续子数组、右端点状态、负贡献前缀、全负数组

题目重述
--------

给定整数数组 ``nums``，选择一个至少包含一个元素的连续子数组，返回该子数组的最大元素和。空子数组不能作为候选，因此数组全部为负数时，答案是其中最大的单个元素。

约束为 ``1 <= nums.length <= 10^5``、``-10^4 <= nums[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：nums = [-4,2,3,-8,5,6,-2]
   输出：11

最大和子数组是 ``[5,6]``，元素和为 ``11``。

.. code-block:: text

   输入：nums = [-9,-2,-7]
   输出：-2

所有连续子数组的和都为负，最优选择是单个元素 ``-2``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       int bruteForce(const std::vector<int>& nums) {
           int best = INT_MIN;
           for (int left = 0; left < static_cast<int>(nums.size()); ++left) {
               int sum = 0;
               for (int right = left; right < static_cast<int>(nums.size()); ++right) {
                   sum += nums[right];
                   best = std::max(best, sum);
               }
           }
           return best;
       }

       int prefixMinimum(const std::vector<int>& nums) {
           int prefix = 0;
           int minimum_prefix = 0;
           int best = INT_MIN;
           for (int value : nums) {
               prefix += value;
               best = std::max(best, prefix - minimum_prefix);
               minimum_prefix = std::min(minimum_prefix, prefix);
           }
           return best;
       }

       int kadane(const std::vector<int>& nums) {
           int ending_here = nums[0];
           int best = nums[0];
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               ending_here = std::max(nums[i], ending_here + nums[i]);
               best = std::max(best, ending_here);
           }
           return best;
       }

       struct Segment { int total, prefix, suffix, best; };

       Segment divide(const std::vector<int>& nums, int left, int right) {
           if (left == right) return {nums[left], nums[left], nums[left], nums[left]};
           int mid = left + (right - left) / 2;
           Segment a = divide(nums, left, mid);
           Segment b = divide(nums, mid + 1, right);
           return {
               a.total + b.total,
               std::max(a.prefix, a.total + b.prefix),
               std::max(b.suffix, b.total + a.suffix),
               std::max({a.best, b.best, a.suffix + b.prefix})
           };
       }

   public:
       int maxSubArray(std::vector<int>& nums) {
           return kadane(nums);
       }
   };

题解
----

这道题最容易写错的地方是把“到当前位置为止的最大和”当成状态。那个值不一定以当前位置结尾，不能直接判断下一个元素是否应该接上。真正有用的状态是 ``ending_here``：处理 ``nums[i]`` 后，它表示**必须以 ``i`` 作为右端点**的连续子数组最大和。

以 ``nums[i]`` 结尾的候选只有两类：从当前位置重新开始，或把当前位置接到某个以 ``i-1`` 结尾的区间后面。后一类只需要保留上一步的最优值，因为更差的前缀再接上同一个 ``nums[i]`` 只会更差。因此转移为：

.. code-block:: text

   ending_here = max(nums[i], previous_ending + nums[i])
   best = max(best, ending_here)

当 ``previous_ending`` 为负时，接上它会比直接从当前元素开始更小，所以负贡献前缀可以丢弃；为非负时，保留它不会降低当前和。这个判断不是凭直觉跳过区间，而是已经包含在上面的两项取最大值中。

用第一个自建数组逐项追踪状态：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 连接旧区间
     - 重新开始
     - ``ending_here``
     - ``best``
   * - -4
     - —
     - -4
     - -4
     - -4
   * - 2
     - -2
     - 2
     - 2
     - 2
   * - 3
     - 5
     - 3
     - 5
     - 5
   * - -8
     - -3
     - -8
     - -3
     - 5
   * - 5
     - 2
     - 5
     - 5
     - 5
   * - 6
     - 11
     - 6
     - 11
     - 11
   * - -2
     - 9
     - -2
     - 9
     - 11

初始化为什么不能使用 0
~~~~~~~~~~~~~~~~~~~~~

数组要求非空。若 ``ending_here`` 和 ``best`` 初始化为 0，输入 ``[-8,-3,-5]`` 会错误返回空区间的 0。使用首元素初始化，使每个状态从始至终对应非空区间。

另一种线性写法：前缀最小值
~~~~~~~~~~~~~~~~~~~~~~~~~~

区间 ``[left,right]`` 的和是 ``prefix[right+1]-prefix[left]``。固定右端前缀时，应减去此前最小前缀。它与 Kadane 都在线性扫描中决定最优左端，只是一个维护最小前缀，一个维护最佳结尾和。

代码中的 ``prefixMinimum`` 因而不需要保存所有前缀；``minimum_prefix`` 始终是当前前缀之前的最小值，先用它更新答案，再把当前前缀纳入后续位置的候选。这样可以避免把空区间当成答案，和 ``kadane`` 一样能正确处理全负数组。

四项区间摘要如何合并
~~~~~~~~~~~~~~~~~~~~

``divide`` 的每个区间返回 ``total``、``prefix``、``suffix`` 和 ``best``。跨过中点的最优区间只能由左段后缀接右段前缀组成，因此合并时只需比较左、右内部答案和这一个跨界候选；其余三项也能由两段摘要常数时间算出。这份递归摘要不同于每次跨界重新扫描的分治写法：每个递归节点只做常数工作，所有节点总数为 ``O(n)``，所以当前实现的 ``divide`` 是线性时间、``O(log n)`` 栈空间。

为什么最终覆盖全部答案
~~~~~~~~~~~~~~~~~~~~~~

转移完整枚举了所有以 ``i`` 结尾的区间：长度 1 的区间与从 ``i-1`` 延伸的区间。归纳可得 ``ending_here`` 正确。所有非空区间都有唯一右端点，``best`` 取各右端点最优值的最大值，因此得到全局答案。

主入口与代价
~~~~~~~~~~~~

``maxSubArray`` 调用 ``kadane``，不修改输入数组，只保留当前结尾状态和全局答案，因此时间为 ``O(n)``、额外空间为 ``O(1)``。类中的 ``bruteForce``、``prefixMinimum`` 和 ``divide`` 是用于对照的实现：前者为 ``O(n²)``；前缀摘要为 ``O(n)`` 且使用 ``O(1)`` 空间；四项区间摘要为 ``O(n)`` 时间和 ``O(log n)`` 递归栈，不计返回结果。

九语言实现
----------

C
~

.. code-block:: c

   int maxSubArray(int *nums,int n){int ending=nums[0],best=nums[0];for(int i=1;i<n;i++){ending=nums[i]>ending+nums[i]?nums[i]:ending+nums[i];if(ending>best)best=ending;}return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxSubArray(self, nums: list[int]) -> int:
           ending = best = nums[0]
           for value in nums[1:]:
               ending = max(value, ending + value)
               best = max(best, ending)
           return best

Java
~~~~

.. code-block:: java

   class Solution {public int maxSubArray(int[] nums){int ending=nums[0],best=nums[0];for(int i=1;i<nums.length;i++){ending=Math.max(nums[i],ending+nums[i]);best=Math.max(best,ending);}return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_sub_array(nums:Vec<i32>)->i32{let mut ending=nums[0];let mut best=ending;for &v in &nums[1..]{ending=v.max(ending+v);best=best.max(ending);}best}}

Go
~~

.. code-block:: go

   func maxSubArray(nums []int)int{ending,best:=nums[0],nums[0];for _,v:=range nums[1:]{if ending+v>v{ending+=v}else{ending=v};if ending>best{best=ending}};return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxSubArray(nums:number[]):number{let ending=nums[0],best=nums[0];for(let i=1;i<nums.length;i++){ending=Math.max(nums[i],ending+nums[i]);best=Math.max(best,ending);}return best;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MaxSubArray(int[] nums){int ending=nums[0],best=nums[0];for(int i=1;i<nums.Length;i++){ending=Math.Max(nums[i],ending+nums[i]);best=Math.Max(best,ending);}return best;}}

Julia
~~~~~

.. code-block:: julia

   function max_sub_array(nums::Vector{Int})
       ending=best=nums[1]
       for value in nums[2:end];ending=max(value,ending+value);best=max(best,ending);end
       best
   end

R
~

.. code-block:: r

   max_sub_array <- function(nums){ending<-nums[[1L]];best<-ending;if(length(nums)>1L)for(value in nums[-1L]){ending<-max(value,ending+value);best<-max(best,ending)};best}
