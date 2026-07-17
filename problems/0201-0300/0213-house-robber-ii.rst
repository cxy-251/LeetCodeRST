0213. House Robber II
=====================

题目信息
--------

:题号: 0213
:难度: Medium
:主题: 动态规划、环形数组、互斥选择、滚动状态
:原题: `LeetCode 0213 <https://leetcode.com/problems/house-robber-ii/>`_
:访问状态: Available
:教学重点: 首尾互斥拆分、线性子问题覆盖、滚动 DP 不变量、宽整数累计

精确契约
--------

给定一个非负整数数组 ``nums``，第 ``i`` 个元素表示第 ``i`` 间房屋中的金额。房屋首尾相连形成一个环：

* 不能同时选择任意两间相邻房屋；
* 第 0 间与第 ``n-1`` 间也相邻；
* 返回满足约束时可取得的最大总金额；
* 输入数组保持只读。

官方输入至少包含一间房。本文额外把空数组定义为返回 0，便于完整说明区间辅助函数。

最容易遗漏的边界是 ``n=1``。此时唯一房屋并不与另一间不同房屋冲突，答案就是 ``nums[0]``。
不能把它交给两个空线性区间处理。

自建示例
--------

经典首尾冲突
~~~~~~~~~~~~

.. code-block:: text

   nums = [2, 3, 2]

若按普通线性数组处理，可能错误选择首尾两个 2，得到 4。环中首尾相邻，合法答案为 3。

两段产生不同答案
~~~~~~~~~~~~~~~~

.. code-block:: text

   nums = [1, 2, 3, 1]

排除最后一间，线性区间 ``[1,2,3]`` 的最优值为 4；排除第一间，区间 ``[2,3,1]`` 的最优值为 3。
最终答案为 4。

单元素与双元素
~~~~~~~~~~~~~~

.. code-block:: text

   [7]    -> 7
   [4,9]  -> 9

两间房在环中相邻，只能取较大者。

全零
~~~~

.. code-block:: text

   [0,0,0,0] -> 0

金额非负，允许一间也不取；零不会破坏滚动状态。

首屋或尾屋分别最优
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   [9,1,1,3] -> 10
   [3,1,1,9] -> 10

两个线性区间都必须计算，不能固定排除某一端。

问题抽象
--------

在线性街道中，处理到位置 ``i`` 时只有两种互斥选择：

* 不取第 ``i`` 间，最优值沿用处理到 ``i-1`` 的结果；
* 取第 ``i`` 间，则第 ``i-1`` 间不能取，金额为处理到 ``i-2`` 的最优值加 ``nums[i]``。

环形街道只比线性街道多一条约束边：第 0 间与第 ``n-1`` 间不能同时选择。

环形拆成两个线性区间
--------------------

当 ``n>=2`` 时，任何合法方案不可能同时包含首屋和尾屋，因此至少满足下面一个条件：

#. 不选择尾屋，全部选择都位于区间 ``[0,n-2]``；
#. 不选择首屋，全部选择都位于区间 ``[1,n-1]``。

于是答案为：

.. code-block:: text

   max(
       linear_rob(nums, 0, n-2),
       linear_rob(nums, 1, n-1)
   )

两个集合不是互斥分区：同时不选首尾的方案会出现在两边。求最大值不要求方案只出现一次，重复覆盖不影响结果。

为什么不能直接对整个数组运行线性 DP
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

线性 DP 只检查 ``i`` 与 ``i-1`` 的冲突。它不知道最后一间还与第 0 间相邻，因此可能同时选择首尾，
产生在线性路径上合法、在环上非法的方案。

线性区间 DP
-----------

对固定闭区间 ``[start,end]``，定义 ``best(i)`` 为在 ``start..i`` 中不选择相邻房屋时的最大金额。
递推为：

.. code-block:: text

   best(i) = max(best(i-1), best(i-2) + nums[i])

边界统一设为：

.. code-block:: text

   best(start-2) = 0
   best(start-1) = 0

金额非负，所以空前缀最优值为 0。

滚动状态
--------

完整 DP 数组只依赖前两项。扫描下一间房之前维护：

``previous_two``
   递推中的 ``best(i-2)``。

``previous_one``
   递推中的 ``best(i-1)``。

当前值为：

.. code-block:: text

   current = max(previous_one, previous_two + nums[i])

更新顺序必须是：

.. code-block:: text

   previous_two = previous_one
   previous_one = current

``current`` 必须在覆盖旧状态之前计算。若先把 ``previous_two`` 改成 ``previous_one``，取当前房屋时会错误地把
``best(i-1)`` 与 ``nums[i]`` 相加，相当于允许相邻房屋同时被选择。

正确性证明
----------

引理一：线性递推覆盖所有合法方案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑闭区间 ``[start,i]`` 的任意最优方案。

* 若不选择 ``i``，它完全位于 ``[start,i-1]``，金额至多为 ``best(i-1)``；
* 若选择 ``i``，则不能选择 ``i-1``，其余选择位于 ``[start,i-2]``，金额至多为
  ``best(i-2)+nums[i]``。

反过来，``best(i-1)`` 对应的方案在不取 ``i`` 时仍合法；
``best(i-2)`` 对应的方案加入 ``i`` 后也仍合法，因为中间的 ``i-1`` 未被选择。
两类候选都可实现，因此取最大值恰好得到 ``best(i)``。

引理二：滚动状态始终等价于完整 DP
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化时，``previous_two=previous_one=0``，对应两个空前缀边界。
假设扫描 ``i`` 前二者分别等于 ``best(i-2)`` 和 ``best(i-1)``。根据引理一，``current`` 等于 ``best(i)``。
更新后新 ``previous_two`` 等于旧 ``best(i-1)``，新 ``previous_one`` 等于 ``best(i)``，不变量继续成立。
区间结束后 ``previous_one`` 就是该线性区间最优值。

引理三：每个环形合法方案都被两个线性子问题至少覆盖一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

环中首屋与尾屋相邻，合法方案不能同时选择二者。

* 若方案不选尾屋，它完全位于 ``[0,n-2]``；
* 若方案选择尾屋，它必不选首屋，完全位于 ``[1,n-1]``。

因此每个环形合法方案至少属于一个线性子问题，其金额不会超过两个线性最优值的最大值。

引理四：两个线性子问题产生的方案都满足环形约束
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

区间 ``[0,n-2]`` 完全不包含尾屋，因此不可能同时选择首尾；区间内部的相邻约束由线性 DP 保证。
同理，区间 ``[1,n-1]`` 不包含首屋。两边的任何候选方案都在原环中合法。

定理：算法返回环形街道的最优金额
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理三，环形最优值不大于两个线性最优值的最大值。
由引理四，这两个线性最优值对应的方案都在环中合法，因此其最大值不大于环形最优值。
上下界相等，算法返回精确最优值。

终止性
~~~~~~

两个辅助扫描都在有限闭区间内单向前进，每轮索引增加 1；主函数只调用两次辅助函数，必然结束。

复杂度与真实资源
----------------

对于 ``n>=2``，两个区间长度都为 ``n-1``：

* 时间复杂度为 ``O(n)``；
* 核心额外空间为 ``O(1)``；
* 输入数组不复制、不修改；
* 没有递归栈或 DP 数组。

固定宽度语言在辅助函数中使用较宽累计类型，避免中间和过早溢出。官方平台保证最终答案可由接口返回类型表示；
若扩展输入域，应同步扩大公开返回类型，而不是只在最后强制窄化。

十语言实现
----------

C
~

.. code-block:: c

   static long long rob_linear(const int *nums, int start, int end) {
       long long previous_two = 0;
       long long previous_one = 0;

       for (int i = start; i <= end; ++i) {
           const long long take = previous_two + (long long)nums[i];
           const long long current = take > previous_one ? take : previous_one;
           previous_two = previous_one;
           previous_one = current;
       }
       return previous_one;
   }

   int rob(int *nums, int numsSize) {
       if (numsSize <= 0) return 0;
       if (numsSize == 1) return nums[0];

       const long long exclude_last = rob_linear(nums, 0, numsSize - 2);
       const long long exclude_first = rob_linear(nums, 1, numsSize - 1);
       const long long answer =
           exclude_last > exclude_first ? exclude_last : exclude_first;
       return (int)answer;
   }

C 适配器不分配内存。``long long`` 承担累计状态，最终窄化依赖官方答案位于 ``int`` 范围的合同。

C++
~~~

.. code-block:: cpp

   class Solution {
       static long long robLinear(
           const std::vector<int>& nums,
           int start,
           int end
       ) {
           long long previousTwo = 0;
           long long previousOne = 0;

           for (int i = start; i <= end; ++i) {
               const long long current = std::max(
                   previousOne,
                   previousTwo + static_cast<long long>(nums[i])
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

   public:
       int rob(std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           if (n == 0) return 0;
           if (n == 1) return nums[0];

           return static_cast<int>(std::max(
               robLinear(nums, 0, n - 2),
               robLinear(nums, 1, n - 1)
           ));
       }
   };

参数按引用接收且只读访问；辅助累计使用 ``long long``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rob(self, nums: list[int]) -> int:
           n = len(nums)
           if n == 0:
               return 0
           if n == 1:
               return nums[0]

           def rob_linear(start: int, end: int) -> int:
               previous_two = 0
               previous_one = 0
               for index in range(start, end + 1):
                   current = max(
                       previous_one,
                       previous_two + nums[index],
                   )
                   previous_two, previous_one = previous_one, current
               return previous_one

           return max(
               rob_linear(0, n - 2),
               rob_linear(1, n - 1),
           )

Python 整数按需扩展；元组赋值基于更新前的状态完成滚动更新。

Java
~~~~

.. code-block:: java

   class Solution {
       private long robLinear(int[] nums, int start, int end) {
           long previousTwo = 0L;
           long previousOne = 0L;

           for (int i = start; i <= end; ++i) {
               long current = Math.max(
                   previousOne,
                   previousTwo + (long) nums[i]
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

       public int rob(int[] nums) {
           int n = nums.length;
           if (n == 0) return 0;
           if (n == 1) return nums[0];

           long answer = Math.max(
               robLinear(nums, 0, n - 2),
               robLinear(nums, 1, n - 1)
           );
           return (int) answer;
       }
   }

加法前把房屋金额提升为 ``long``；返回 ``int`` 依赖平台结果范围。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       fn rob_linear(nums: &[i32], start: usize, end: usize) -> i64 {
           let mut previous_two = 0_i64;
           let mut previous_one = 0_i64;

           for &amount in &nums[start..=end] {
               let current = previous_one.max(previous_two + i64::from(amount));
               previous_two = previous_one;
               previous_one = current;
           }
           previous_one
       }

       pub fn rob(nums: Vec<i32>) -> i32 {
           match nums.len() {
               0 => 0,
               1 => nums[0],
               n => Self::rob_linear(&nums, 0, n - 2)
                   .max(Self::rob_linear(&nums, 1, n - 1))
                   as i32,
           }
       }
   }

``n>=2`` 后两个含端点切片都非空，不会产生 ``usize`` 下溢。辅助函数只借用切片。

Go
~~

.. code-block:: go

   func robLinear(nums []int, start int, end int) int64 {
       var previousTwo int64
       var previousOne int64

       for i := start; i <= end; i++ {
           take := previousTwo + int64(nums[i])
           current := previousOne
           if take > current {
               current = take
           }
           previousTwo = previousOne
           previousOne = current
       }
       return previousOne
   }

   func rob(nums []int) int {
       n := len(nums)
       if n == 0 {
           return 0
       }
       if n == 1 {
           return nums[0]
       }

       answer := robLinear(nums, 0, n-2)
       other := robLinear(nums, 1, n-1)
       if other > answer {
           answer = other
       }
       return int(answer)
   }

累计状态显式使用 ``int64``；最终转换依赖官方返回范围。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rob(nums: number[]): number {
       const n = nums.length;
       if (n === 0) return 0;
       if (n === 1) return nums[0];

       const robLinear = (start: number, end: number): number => {
           let previousTwo = 0;
           let previousOne = 0;

           for (let index = start; index <= end; index += 1) {
               const current = Math.max(
                   previousOne,
                   previousTwo + nums[index],
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       };

       return Math.max(
           robLinear(0, n - 2),
           robLinear(1, n - 1),
       );
   }

``number`` 是 IEEE-754 双精度数。官方金额上界远低于安全整数上限；更宽输入需改用 ``bigint`` 并统一接口。

C#
~~

.. code-block:: csharp

   public class Solution {
       private static long RobLinear(int[] nums, int start, int end) {
           long previousTwo = 0L;
           long previousOne = 0L;

           for (int i = start; i <= end; ++i) {
               long current = Math.Max(
                   previousOne,
                   previousTwo + (long)nums[i]
               );
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

       public int Rob(int[] nums) {
           int n = nums.Length;
           if (n == 0) return 0;
           if (n == 1) return nums[0];

           long answer = Math.Max(
               RobLinear(nums, 0, n - 2),
               RobLinear(nums, 1, n - 1)
           );
           return (int)answer;
       }
   }

辅助函数使用 ``long``；输入数组没有被修改。

Julia
~~~~~

.. code-block:: julia

   function rob_linear(nums::Vector{Int}, first::Int, last::Int)::Int
       previous_two = 0
       previous_one = 0
       index = first

       while index <= last
           current = max(previous_one, previous_two + nums[index])
           previous_two = previous_one
           previous_one = current
           index += 1
       end
       return previous_one
   end

   function rob(nums::Vector{Int})::Int
       n = length(nums)
       n == 0 && return 0
       n == 1 && return nums[1]

       return max(
           rob_linear(nums, 1, n - 1),
           rob_linear(nums, 2, n),
       )
   end

Julia 使用一基索引，所以两个区间分别是 ``1..n-1`` 与 ``2..n``。``n==1`` 在构造区间前已返回。

R
~

.. code-block:: r

   rob <- function(nums) {
     n <- length(nums)
     if (n == 0L) return(0)
     if (n == 1L) return(nums[[1L]])

     rob_linear <- function(first, last) {
       previous_two <- 0
       previous_one <- 0
       index <- first

       while (index <= last) {
         current <- max(
           previous_one,
           previous_two + nums[[index]]
         )
         previous_two <- previous_one
         previous_one <- current
         index <- index + 1L
       }
       previous_one
     }

     max(
       rob_linear(1L, n - 1L),
       rob_linear(2L, n)
     )
   }

R 使用双精度 ``numeric`` 累计金额。辅助函数使用 ``while``，不会因 ``1:0`` 或方向错误生成反向索引序列。

人工推演
--------

以 ``[2,3,2]`` 为例：

* 区间 ``[2,3]`` 的滚动最优值依次为 2、3；
* 区间 ``[3,2]`` 的滚动最优值依次为 3、3；
* 两者最大值为 3，不会产生非法的首尾组合 4。

以 ``[1,2,3,1]`` 为例：

* 区间 ``[1,2,3]`` 的滚动最优值依次为 1、2、4；
* 区间 ``[2,3,1]`` 的滚动最优值依次为 2、3、3；
* 返回 4。

静态审查记录
------------

本章未运行、未编译、未对拍或测试任何题解代码。完成的静态检查包括：

* 人工推演 ``[2,3,2]``、``[1,2,3,1]``、单元素、双元素、全零、首屋最优和尾屋最优；
* 证明任意环形合法方案至少属于一个排除端点的线性区间；
* 证明两个线性区间产生的方案都不会违反首尾冲突；
* 证明线性取或不取递推和滚动状态更新顺序；
* 核对十语言都在 ``n=1`` 时提前返回；
* 核对 C、C++、Java、Rust、Go、C# 使用较宽累计状态；
* 核对 Julia/R 的一基端点，R 不构造可能反向的冒号序列；
* 核对输入只读、时间 ``O(n)`` 和核心额外空间 ``O(1)``。

剩余风险：题解未经过目标平台编译或执行；固定宽度适配器的公开返回类型仍依赖官方结果范围；
各语言整数宽度与容器 ABI 由目标平台决定。

关键易错点
----------

* 直接在整个环上运行线性 House Robber；
* 忘记 ``n=1``，导致两个区间都为空或端点下溢；
* 只计算排除首屋或只计算排除尾屋；
* 误认为两个线性区间必须互不重叠；
* 更新 ``previous_two`` 后才计算 ``take``，破坏旧状态；
* 声称需要 ``O(n)`` DP 数组；
* Julia/R 把零基端点原样用于一基数组；
* 只扩大中间类型，却不声明最终返回类型的范围合同。

知识更新与关联题
----------------

* ``0198 House Robber``：提供线性取或不取递推；
* ``0213``：新增首尾互斥的两个线性区间覆盖证明；
* ``0337 House Robber III``：把相邻约束从路径推广到树；
* ``0256 Paint House``：同样通过局部互斥状态构造 DP。

自检问题与答案
--------------

**问题 1：为什么答案不是直接运行一次线性 DP？**

线性 DP 不检查最后一间与第一间的冲突，可能返回同时选择首尾的非法方案。

**问题 2：为什么两个区间足以覆盖全部环形方案？**

首尾不能同时选择；不选尾屋的方案属于 ``[0,n-2]``，选择尾屋的方案必不选首屋，属于 ``[1,n-1]``。

**问题 3：为什么两个区间重叠不会重复计算出错？**

这里只比较最大金额，不统计方案数量。同一合法方案出现两次不会改变最大值。

**问题 4：滚动状态为什么只有两个数？**

当前位置的最优值只依赖前一位置最优值和前两位置最优值加当前金额。

**问题 5：为什么 ``n=1`` 必须特判？**

唯一房屋应当可以选择；一般拆分会把它同时排除，无法表达该合法方案。
