0045. Jump Game II
==================

题目信息
--------

:题号: 0045
:难度: Medium
:主题: 数组、贪心、区间分层、最短跳跃
:原题: `LeetCode 0045 <https://leetcode.com/problems/jump-game-ii/>`_
:访问状态: Available
:教学重点: 当前层边界、下一层最远边界、延迟提交跳跃、BFS 层数解释

题目重述
--------

给定一个非负整数数组 ``nums``。位于下标 ``i`` 时，最多可以向右跳 ``nums[i]`` 步。

从下标 ``0`` 出发，返回到达最后一个下标所需的最少跳跃次数。题目保证最后一个下标一定
可以到达。

自建示例
--------

需要两次跳跃
~~~~~~~~~~~~

.. code-block:: text

   输入：[2, 3, 1, 1, 4]
   输出：2

   一条最优路径是 0 -> 1 -> 4。

局部最大值不是立即落点
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：[2, 3, 0, 1, 4]
   输出：2

   扫描第一跳可达的下标 1、2 后，下一层最远可以到达 4。

单元素
~~~~~~

.. code-block:: text

   输入：[0]
   输出：0

   起点已经是终点，不需要跳跃。

连续短跳
~~~~~~~~

.. code-block:: text

   输入：[1, 1, 1, 1]
   输出：3

问题抽象
--------

把每个下标看成图节点，从下标 ``i`` 可以连向区间
``[i + 1, i + nums[i]]`` 中的所有节点。要求最少跳跃次数，本质上是在这张隐式有向图中求
从 ``0`` 到最后下标的最短边数。

直接广度优先搜索会显式枚举大量边。数组可达区间具有连续性，因此只需维护 BFS 的层边界：

* ``current_end``：使用当前跳跃次数能够到达的最右下标；
* ``farthest``：扫描当前层所有位置后，下一次跳跃能够到达的最右下标；
* ``jumps``：已经完成的 BFS 层数，也就是已提交的跳跃次数。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - BFS 层边界贪心
     - ``O(n)``
     - ``O(1)``
     - 主解法；不枚举区间内的每条边
   * - 显式广度优先搜索
     - 最坏 ``O(n^2)``
     - ``O(n)``
     - 层数含义直观，但重复展开连续邻居
   * - 动态规划最短跳数
     - ``O(n^2)``
     - ``O(n)``
     - 状态直接，未利用连续可达区间
   * - 每步立即跳到数值最大的下标
     - 不保证正确
     - ``O(1)``
     - 最大步长不等于下一层覆盖范围最大

主解法：扫描一层后再提交一次跳跃
----------------------------------

状态含义
~~~~~~~~

初始化：

.. code-block:: text

   jumps = 0
   current_end = 0
   farthest = 0

从下标 ``0`` 扫描到倒数第二个下标。对于每个 ``i``：

#. 用 ``i + nums[i]`` 更新 ``farthest``；
#. 当 ``i == current_end`` 时，说明当前 BFS 层已经全部扫描完；
#. 此时必须增加一次跳跃，并令 ``current_end = farthest``。

为什么不立即选择具体落点
~~~~~~~~~~~~~~~~~~~~~~~~

扫描当前层时，每个下标都可能作为下一跳的起点。我们只关心这些选择合并后能覆盖到哪里：

.. code-block:: text

   下一层可达最右端 = max(i + nums[i])

只要保存最远边界，就不需要记录究竟从哪个下标跳出。最少跳数只取决于目标首次落入第几层，
不要求返回具体路径。

为什么只扫描到倒数第二个下标
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当最后一个下标已经进入当前可达层时，答案已经确定。若继续在最后下标触发
``i == current_end``，会多计算一次从终点出发的无意义跳跃。

因此循环范围是 ``0`` 到 ``n - 2``。

核心不变量
~~~~~~~~~~

扫描下标 ``i`` 之前：

* ``jumps`` 是到达 ``current_end`` 所代表这一层所需的跳跃次数；
* 不超过 ``current_end`` 的尚未扫描位置都能用 ``jumps`` 次跳跃到达；
* ``farthest`` 是已扫描的当前层位置再跳一次能够到达的最右下标；
* 所有少于 ``jumps`` 次跳跃可达的位置已经在更早层处理完；
* 目标第一次进入某个新边界时，该层数就是最少跳跃次数。

当 ``i == current_end``，当前层已完整扫描，``farthest`` 已汇总该层所有出边。把边界推进到
``farthest``，等价于进入 BFS 下一层。

正确性依据
~~~~~~~~~~

广度优先搜索按边数分层。第 ``k`` 层包含所有恰好可以用 ``k`` 次跳跃首次到达的位置。
由于每个位置的出边是向右的连续区间，当前层所有出边的并集从已覆盖前缀继续延伸到
``max(i + nums[i])``。算法扫描当前层全部位置并计算这个最大值，所以得到的
``farthest`` 正是下一层能够覆盖的最右边界。

算法只有在到达 ``current_end`` 时才增加 ``jumps``，因此不会在当前层尚未扫描完时提前选择
较差边界。每次提交都完整模拟 BFS 从一层进入下一层。

当最后下标第一次落入某个层的覆盖范围时，BFS 的层序性质保证不存在更少跳跃次数的路径。
题目保证可达，因此算法最终一定覆盖最后下标，返回的 ``jumps`` 即最小值。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每个下标最多扫描一次，时间复杂度为 ``O(n)``；
* 只保存三个整数状态，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int jump(int *nums, int numsSize) {
       if (numsSize <= 1) {
           return 0;
       }

       int jumps = 0;
       int current_end = 0;
       int farthest = 0;

       for (int index = 0; index < numsSize - 1; ++index) {
           int reach = index + nums[index];
           if (reach > farthest) {
               farthest = reach;
           }

           if (index == current_end) {
               ++jumps;
               current_end = farthest;
           }
       }

       return jumps;
   }

题目保证可达，因此到达层边界时 ``farthest`` 会严格推进，除非终点已经处于当前层。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int jump(vector<int>& nums) {
           if (nums.size() <= 1) {
               return 0;
           }

           int jumps = 0;
           int currentEnd = 0;
           int farthest = 0;

           for (int index = 0;
                index < static_cast<int>(nums.size()) - 1;
                ++index) {
               farthest = max(farthest, index + nums[index]);

               if (index == currentEnd) {
                   ++jumps;
                   currentEnd = farthest;
               }
           }

           return jumps;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def jump(self, nums: list[int]) -> int:
           if len(nums) <= 1:
               return 0

           jumps = 0
           current_end = 0
           farthest = 0

           for index in range(len(nums) - 1):
               farthest = max(farthest, index + nums[index])

               if index == current_end:
                   jumps += 1
                   current_end = farthest

           return jumps

Java
~~~~

.. code-block:: java

   class Solution {
       public int jump(int[] nums) {
           if (nums.length <= 1) {
               return 0;
           }

           int jumps = 0;
           int currentEnd = 0;
           int farthest = 0;

           for (int index = 0; index < nums.length - 1; ++index) {
               farthest = Math.max(
                   farthest,
                   index + nums[index]
               );

               if (index == currentEnd) {
                   ++jumps;
                   currentEnd = farthest;
               }
           }

           return jumps;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn jump(nums: Vec<i32>) -> i32 {
           if nums.len() <= 1 {
               return 0;
           }

           let mut jumps: i32 = 0;
           let mut current_end: usize = 0;
           let mut farthest: usize = 0;

           for index in 0..nums.len() - 1 {
               let reach = index + nums[index] as usize;
               farthest = farthest.max(reach);

               if index == current_end {
                   jumps += 1;
                   current_end = farthest;
               }
           }

           jumps
       }
   }

``nums[index]`` 非负，可以安全转换为 ``usize``。循环先处理 ``len <= 1``，避免
``len - 1`` 在无符号长度上发生下溢。

Go
~~

.. code-block:: go

   func jump(nums []int) int {
       if len(nums) <= 1 {
           return 0
       }

       jumps := 0
       currentEnd := 0
       farthest := 0

       for index := 0; index < len(nums)-1; index++ {
           reach := index + nums[index]
           if reach > farthest {
               farthest = reach
           }

           if index == currentEnd {
               jumps++
               currentEnd = farthest
           }
       }

       return jumps
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function jump(nums: number[]): number {
       if (nums.length <= 1) {
           return 0;
       }

       let jumps = 0;
       let currentEnd = 0;
       let farthest = 0;

       for (let index = 0; index < nums.length - 1; index++) {
           farthest = Math.max(farthest, index + nums[index]);

           if (index === currentEnd) {
               jumps++;
               currentEnd = farthest;
           }
       }

       return jumps;
   }

题目规模下整数运算远低于 JavaScript 的安全整数上限。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Jump(int[] nums) {
           if (nums.Length <= 1) {
               return 0;
           }

           int jumps = 0;
           int currentEnd = 0;
           int farthest = 0;

           for (int index = 0; index < nums.Length - 1; ++index) {
               farthest = Math.Max(
                   farthest,
                   index + nums[index]
               );

               if (index == currentEnd) {
                   ++jumps;
                   currentEnd = farthest;
               }
           }

           return jumps;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function jump(nums::Vector{Int})::Int
       length(nums) <= 1 && return 0

       jumps = 0
       current_end = 0
       farthest = 0

       # 算法边界保持零基；index 是 Julia 的一基数组位置。
       for index in 1:(length(nums) - 1)
           zero_index = index - 1
           farthest = max(farthest, zero_index + nums[index])

           if zero_index == current_end
               jumps += 1
               current_end = farthest
           end
       end

       return jumps
   end

``current_end`` 与 ``farthest`` 表示题目中的零基下标，只有读取数组时使用一基 ``index``。

R
~

.. code-block:: r

   jump <- function(nums) {
     n <- length(nums)
     if (n <= 1L) {
       return(0L)
     }

     jumps <- 0L
     current_end <- 0L
     farthest <- 0L

     for (index in seq_len(n - 1L)) {
       zero_index <- index - 1L
       reach <- zero_index + nums[[index]]
       farthest <- max(farthest, reach)

       if (zero_index == current_end) {
         jumps <- jumps + 1L
         current_end <- farthest
       }
     }

     jumps
   }

R 同样把层边界保存为零基题目下标，避免在边界公式中混用两套坐标。

关键边界
--------

* 数组长度为一：已经在终点，返回 ``0``；
* 第一个元素直接覆盖终点：扫描第一层边界时只增加一次跳跃；
* 数组中间含零：只要当前层的其他位置能越过它，就不影响结果；
* 所有元素均为一：每个位置形成一层，答案为 ``n - 1``；
* 循环必须排除最后下标，否则可能多计算一次跳跃；
* 本题保证可达；若扩展到不保证可达的版本，需要检测 ``farthest == current_end``。

易错点
------

* 每次选择 ``nums[i]`` 最大的位置，而不是比较 ``i + nums[i]`` 的覆盖终点；
* 扫描到一个更远位置就立即增加跳跃，尚未汇总当前层全部候选；
* 把 ``farthest`` 当成当前层边界，导致层边界在扫描中提前变化；
* 循环扫描最后下标并额外增加一次跳跃；
* 在 Rust 等语言中未先处理短数组，直接计算 ``len - 1``；
* Julia、R 将一基数组位置直接与零基层边界比较，产生一位偏移。

新增与强化知识
--------------

新增
~~~~

* 连续区间图可以用边界代替显式邻接表；
* 贪心层边界是 BFS 层序遍历的空间压缩形式；
* ``current_end`` 与 ``farthest`` 分别表示当前承诺和下一层候选，不能混为一个变量；
* 最少步数问题中的贪心需要由 BFS 层数解释，而不是只凭“跳得最远”。

强化
~~~~

* 继续强化单调扫描和延迟决策；
* 与 0011、0042 的双指针排除不同，本题贪心汇总的是整层所有出边；
* Julia、R 再次使用零基算法坐标与一基容器索引的显式映射；
* 正确性证明应说明每次边界推进对应且只对应一次 BFS 层转换。

最小自检
--------

#. ``current_end`` 与 ``farthest`` 分别表示什么？
#. 为什么必须扫描完整个当前层后才增加跳跃？
#. 为什么循环不处理最后一个下标？
#. 对 ``[2, 3, 1, 1, 4]``，第一次层结束时 ``farthest`` 是多少？
#. “每次跳到数值最大的元素”为什么不是正确贪心规则？

答案要点
~~~~~~~~

#. 前者是当前跳数可达的层边界，后者是当前层再跳一次可达的最远边界。
#. 当前层中靠后的位置可能产生更远的下一层边界，提前提交会丢失候选。
#. 到达终点后不需要再从终点跳出，处理它可能多计一次。
#. 扫描下标 0 后第一层边界为 2；继续扫描下标 1、2，下一层最远到 4。
#. 真正影响覆盖范围的是 ``index + nums[index]``，且需要比较整层所有候选。
