0053. Maximum Subarray
======================

题目信息
--------

:题号: 0053
:题名: Maximum Subarray
:难度: Medium
:类型: Algorithms
:主题: 数组、动态规划、前缀和、分治
:原题: `LeetCode 0053 <https://leetcode.com/problems/maximum-subarray/>`_
:教学重点: 非空连续区间、右端点状态、负贡献前缀、全负数组

题目重述
--------

给定非空整数数组，选择一个连续且至少包含一个元素的子数组，返回其最大元素和。不能把空子数组的和 0 当作候选，因此全部为负数时应返回其中最大的单个元素。

自建示例
--------

.. code-block:: text

   [-2,1,-3,4,-1,2,1,-5,4] -> 6
   最优区间是 [4,-1,2,1]

.. code-block:: text

   [-8,-3,-5] -> -3
   [5,-7,6] -> 6，负和前缀应被丢弃

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

区间枚举重复计算了什么
~~~~~~~~~~~~~~~~~~~~

共有 ``O(n²)`` 个连续区间。固定左端点后滚动累加可把暴力从立方降到平方，但相邻区间仍反复维护大量相同前缀。优化需要把答案按某个唯一维度分类。

为什么按右端点分类
~~~~~~~~~~~~~~~~

任意非空子数组都有唯一右端点。设 ``ending_here`` 为必须以当前位置 ``i`` 结尾的最大和，那么候选只有两类：单独使用 ``nums[i]``；或把它接到以 ``i-1`` 结尾的最优区间之后。

.. code-block:: text

   ending_here = max(nums[i], previous_ending + nums[i])
   best = max(best, ending_here)

为什么负贡献前缀可以永久丢弃
~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``previous_ending < 0``，把它接在任何当前值前都会使结果更小；从当前元素重新开始严格更优。若它非负，继续扩展不劣于重新开始。这个判断把动态规划转移解释成局部贪心。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 当前值
     - 连接旧区间
     - 重新开始
     - ``ending_here``
     - ``best``
   * - -2
     - —
     - -2
     - -2
     - -2
   * - 1
     - -1
     - 1
     - 1
     - 1
   * - -3
     - -2
     - -3
     - -2
     - 1
   * - 4
     - 2
     - 4
     - 4
     - 4
   * - -1,2,1
     - 持续扩展
     - —
     - 6
     - 6

初始化为什么不能使用 0
~~~~~~~~~~~~~~~~~~~~~

数组要求非空。若 ``ending_here`` 和 ``best`` 初始化为 0，输入 ``[-8,-3,-5]`` 会错误返回空区间的 0。使用首元素初始化，使每个状态从始至终对应非空区间。

前缀最小值为何等价
~~~~~~~~~~~~~~~~~~

区间 ``[left,right]`` 的和是 ``prefix[right+1]-prefix[left]``。固定右端前缀时，应减去此前最小前缀。它与 Kadane 都在线性扫描中决定最优左端，只是一个维护最小前缀，一个维护最佳结尾和。

分治状态为何需要四项
~~~~~~~~~~~~~~~~~~~~

跨越中点的最优区间由左段最大后缀与右段最大前缀组成。为了向父节点合并，还需保存区间总和、最大前缀、最大后缀和内部最大值。这一结构可推广到线段树，但单次查询不如 Kadane 简洁。

为什么最终覆盖全部答案
~~~~~~~~~~~~~~~~~~~~~~

转移完整枚举了所有以 ``i`` 结尾的区间：长度 1 的区间与从 ``i-1`` 延伸的区间。归纳可得 ``ending_here`` 正确。所有非空区间都有唯一右端点，``best`` 取各右端点最优值的最大值，因此得到全局答案。

复杂度来源
~~~~~~~~~~

暴力滚动求和为 ``O(n²)``；前缀最小值和 Kadane 为 ``O(n)`` 时间、``O(1)`` 空间；分治为 ``O(n log n)`` 时间、``O(log n)`` 递归栈。

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
