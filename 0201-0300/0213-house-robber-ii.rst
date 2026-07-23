0213. House Robber II
=====================

题目信息
--------

:题号: 0213
:难度: Medium
:主题: 动态规划、环形数组、滚动状态
:原题: `LeetCode 0213 <https://leetcode.com/problems/house-robber-ii/>`_
:重点: 首尾房屋相邻、不能选择相邻房屋、单屋边界、返回最大金额

题目重述
--------

有一圈房屋，每间房内有一定金额，数组 ``nums[i]`` 表示第 ``i`` 间房的金额。若在同一晚选择两间相邻房屋会触发警报，需要在不选择任何相邻房屋的前提下，返回能够取得的最大总金额。由于房屋围成一圈，第一间房和最后一间房也互相相邻，不能同时选择。

房屋数量位于 ``[1, 100]``，每间房金额位于 ``[0, 1000]``。只返回最大金额，不要求返回具体选择方案；函数不修改输入数组。只有一间房时不存在两间不同房屋之间的冲突，答案就是该房屋金额。

自建示例
--------

首尾金额都较大但不能同时选择：

.. code-block:: text

   输入：nums = [8, 1, 1, 8]
   输出：9
   解释：两端的 8 相邻，不能同时选择。可以选择第一间 8 和第三间 1，或第二间 1 和最后一间 8，最大总额都是 9。

最优方案跨过多个未选择位置：

.. code-block:: text

   输入：nums = [4, 1, 2, 7, 5, 3, 1]
   输出：14
   解释：选择金额为 4、7、3 的房屋，三者两两不相邻且首尾冲突未发生，总金额为 14；不存在更大的合法组合。

环形拆分
--------

当 ``n>=2`` 时，任何合法方案都不能同时包含首屋和尾屋，因此至少满足一个条件：

#. 不选尾屋，全部选择位于 ``[0,n-2]``；
#. 不选首屋，全部选择位于 ``[1,n-1]``。

于是答案为：

.. code-block:: text

   max(
       rob_linear(nums, 0, n - 2),
       rob_linear(nums, 1, n - 1)
   )

同时不选首尾的方案会被两个区间重复覆盖，但求最大值不受影响。两个子问题只需覆盖全部合法方案，不需要互斥。

为什么不能直接运行一次线性 DP
----------------------------

普通线性 DP 只处理 ``i`` 与 ``i-1`` 的相邻冲突。它不知道最后一间房还与第 0 间相邻，因此可能返回一个同时选择首尾的非法方案。

拆分后的每个区间都缺少环的一端，首尾额外冲突被消除，剩余结构就是普通线性街道。

线性区间递推
------------

对闭区间 ``[start,end]``，令 ``best(i)`` 表示从 ``start`` 到 ``i`` 中不选择相邻房屋时的最大金额。

处理第 ``i`` 间时：

* 不选 ``i``，金额为 ``best(i-1)``；
* 选择 ``i``，则不能选择 ``i-1``，金额为 ``best(i-2)+nums[i]``。

因此：

.. code-block:: text

   best(i) = max(best(i - 1), best(i - 2) + nums[i])

边界统一设为：

.. code-block:: text

   best(start - 2) = 0
   best(start - 1) = 0

滚动状态
--------

递推只依赖前两项。扫描第 ``i`` 间之前维护：

.. code-block:: text

   previous_two = best(i - 2)
   previous_one = best(i - 1)

本轮执行：

.. code-block:: text

   current = max(previous_one, previous_two + nums[i])
   previous_two = previous_one
   previous_one = current

``current`` 必须在覆盖旧状态前计算，否则会错误地把相邻房屋同时纳入。

正确性证明
----------

**引理一：线性递推正确。**

任意最优方案对最后一间房 ``i`` 只有两类：不选 ``i``，最优值为 ``best(i-1)``；选择 ``i``，则其余部分来自 ``start..i-2``，最优值为 ``best(i-2)+nums[i]``。两类方案都可实现，取最大值即为 ``best(i)``。

**引理二：滚动状态与完整 DP 等价。**

两个初始 0 对应空前缀。若扫描 ``i`` 前变量分别等于 ``best(i-2)`` 和 ``best(i-1)``，递推得到 ``best(i)``；更新后又成为下一轮需要的两项。

**引理三：两个线性区间覆盖全部环形合法方案。**

首尾不能同时选择。任何方案若不选尾屋就属于第一段；若选择尾屋，则必不选首屋，属于第二段。

**引理四：两个线性子问题的方案在环中都合法。**

第一段不包含尾屋，第二段不包含首屋，因而都不会同时选择环的两端；区间内部冲突由线性递推处理。

**定理：两个线性最优值的最大值就是环形最优值。**

引理三保证没有遗漏，引理四保证没有引入非法候选。

复杂度
------

* 两个区间各扫描一次，总时间复杂度为 ``O(n)``；
* 只维护两个滚动状态，额外空间复杂度为 ``O(1)``；
* 输入不复制、不修改；
* 官方约束下普通整数不会溢出。

十语言实现
----------

C
~

.. code-block:: c

   static int max_int(int a, int b) {
       return a > b ? a : b;
   }

   static int rob_linear(const int *nums, int start, int end) {
       int previous_two = 0;
       int previous_one = 0;

       for (int i = start; i <= end; ++i) {
           const int current = max_int(
               previous_one,
               previous_two + nums[i]
           );
           previous_two = previous_one;
           previous_one = current;
       }
       return previous_one;
   }

   int rob(int *nums, int numsSize) {
       if (numsSize == 1) return nums[0];
       return max_int(
           rob_linear(nums, 0, numsSize - 2),
           rob_linear(nums, 1, numsSize - 1)
       );
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       static int robLinear(
           const std::vector<int>& nums,
           int start,
           int end
       ) {
           int previousTwo = 0;
           int previousOne = 0;

           for (int i = start; i <= end; ++i) {
               int current = std::max(
                   previousOne,
                   previousTwo + nums[i]
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

   public:
       int rob(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           if (n == 1) return nums[0];
           return std::max(
               robLinear(nums, 0, n - 2),
               robLinear(nums, 1, n - 1)
           );
       }
   };

需要 ``<algorithm>`` 与 ``<vector>``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rob(self, nums: list[int]) -> int:
           def rob_linear(start: int, end: int) -> int:
               previous_two = 0
               previous_one = 0

               for i in range(start, end + 1):
                   current = max(previous_one, previous_two + nums[i])
                   previous_two, previous_one = previous_one, current

               return previous_one

           if len(nums) == 1:
               return nums[0]

           return max(
               rob_linear(0, len(nums) - 2),
               rob_linear(1, len(nums) - 1),
           )

Java
~~~~

.. code-block:: java

   class Solution {
       public int rob(int[] nums) {
           if (nums.length == 1) return nums[0];
           return Math.max(
               robLinear(nums, 0, nums.length - 2),
               robLinear(nums, 1, nums.length - 1)
           );
       }

       private int robLinear(int[] nums, int start, int end) {
           int previousTwo = 0;
           int previousOne = 0;

           for (int i = start; i <= end; ++i) {
               int current = Math.max(
                   previousOne,
                   previousTwo + nums[i]
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn rob(nums: Vec<i32>) -> i32 {
           fn rob_linear(nums: &[i32]) -> i32 {
               let mut previous_two = 0;
               let mut previous_one = 0;

               for &money in nums {
                   let current = previous_one.max(previous_two + money);
                   previous_two = previous_one;
                   previous_one = current;
               }
               previous_one
           }

           if nums.len() == 1 {
               return nums[0];
           }

           rob_linear(&nums[..nums.len() - 1])
               .max(rob_linear(&nums[1..]))
       }
   }

Go
~~

.. code-block:: go

   func rob(nums []int) int {
       robLinear := func(values []int) int {
           previousTwo, previousOne := 0, 0
           for _, money := range values {
               current := previousOne
               if previousTwo+money > current {
                   current = previousTwo + money
               }
               previousTwo, previousOne = previousOne, current
           }
           return previousOne
       }

       if len(nums) == 1 {
           return nums[0]
       }

       excludeLast := robLinear(nums[:len(nums)-1])
       excludeFirst := robLinear(nums[1:])
       if excludeLast > excludeFirst {
           return excludeLast
       }
       return excludeFirst
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rob(nums: number[]): number {
       function robLinear(start: number, end: number): number {
           let previousTwo = 0;
           let previousOne = 0;

           for (let i = start; i <= end; i += 1) {
               const current = Math.max(
                   previousOne,
                   previousTwo + nums[i]
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

       if (nums.length === 1) return nums[0];
       return Math.max(
           robLinear(0, nums.length - 2),
           robLinear(1, nums.length - 1)
       );
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Rob(int[] nums) {
           if (nums.Length == 1) return nums[0];
           return System.Math.Max(
               RobLinear(nums, 0, nums.Length - 2),
               RobLinear(nums, 1, nums.Length - 1)
           );
       }

       private static int RobLinear(int[] nums, int start, int end) {
           int previousTwo = 0;
           int previousOne = 0;

           for (int i = start; i <= end; ++i) {
               int current = System.Math.Max(
                   previousOne,
                   previousTwo + nums[i]
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function rob(nums::Vector{Int})::Int
       function rob_linear(values)
           previous_two = 0
           previous_one = 0

           for money in values
               current = max(previous_one, previous_two + money)
               previous_two, previous_one = previous_one, current
           end
           previous_one
       end

       length(nums) == 1 && return nums[1]
       max(
           rob_linear(@view nums[1:end-1]),
           rob_linear(@view nums[2:end])
       )
   end

R
~

.. code-block:: r

   rob <- function(nums) {
     rob_linear <- function(start, end) {
       previous_two <- 0
       previous_one <- 0

       for (i in seq.int(start, end)) {
         current <- max(previous_one, previous_two + nums[i])
         previous_two <- previous_one
         previous_one <- current
       }
       previous_one
     }

     if (length(nums) == 1L) return(nums[1L])
     max(
       rob_linear(1L, length(nums) - 1L),
       rob_linear(2L, length(nums))
     )
   }

关键易错点
----------

* 直接对整个环运行一次线性 DP，允许首尾同时选择；
* 只计算一个排除区间；
* 忘记单元素边界；
* 误认为两个子问题必须互不重叠；
* 选择当前房屋时使用 ``best(i-1)``；
* 覆盖旧滚动状态后才计算 ``current``；
* 在官方小范围输入中加入没有必要的宽整数和窄化讨论。

知识联系
-----------

环形动态规划常通过枚举少量边界状态拆成线性问题。本题只多出一条首尾冲突边，因此分别排除首屋和尾屋即可。

若环上存在更多跨边界依赖，通常需要固定开头若干位置的状态，让线性 DP 在结尾检查兼容性。

自检问题
--------

#. 为什么任何环形合法方案都至少被两个线性区间之一覆盖？
#. 为什么重复覆盖不会影响最大值？
#. 线性递推为什么只依赖前两项？
#. 单元素为什么必须单独处理？
#. 滚动状态的更新顺序为什么重要？

参考答案
~~~~~~~~

#. 首尾不能同时选择，因此方案必然不选其中至少一个。
#. 目标是最大值，不是方案计数；重复候选不会改变最大结果。
#. 当前决策只有不选当前位置和选择当前位置两类，后者只需跳过前一项。
#. 两个拆分区间都会排除唯一房屋，但真实答案允许选择它。
#. ``current`` 必须读取旧的 ``best(i-2)`` 与 ``best(i-1)``。
