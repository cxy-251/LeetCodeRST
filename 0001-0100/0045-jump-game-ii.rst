0045. Jump Game II
==================

题目信息
--------

:题号: 0045
:难度: Medium
:主题: 数组、动态规划、BFS 分层、区间贪心
:原题: `LeetCode 0045 <https://leetcode.com/problems/jump-game-ii/>`_
:重点: 当前层边界、下一层最远位置、最少跳数、终点可达保证

题目重述
--------

给定非负整数数组 ``nums``。位于下标 ``i`` 时，最多可以向右跳 ``nums[i]`` 步；从下标 0 出发，返回到达最后一个下标所需的最少跳跃次数。题目保证最后一个下标一定可达。

约束为 ``1 <= nums.length <= 10^4``、``0 <= nums[i] <= 1000``。单元素数组的答案为 0。

自建示例
--------

.. code-block:: text

   输入：nums = [3,1,2,0,4,1]
   输出：2

第一次从下标 0 跳到下标 2，第二次可直接跳到下标 4 或越过它到达末尾下标 5；最少需要两跳。

.. code-block:: text

   输入：nums = [1,2,1,1]
   输出：2

可以按下标 ``0 -> 1 -> 3`` 到达终点。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <queue>
   #include <vector>

   class Solution {
   private:
       int dynamicProgramming(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           std::vector<int> dp(n, INT_MAX);
           dp[0] = 0;
           for (int i = 0; i < n; ++i) {
               for (int next = i + 1; next < n && next <= i + nums[i]; ++next)
                   dp[next] = std::min(dp[next], dp[i] + 1);
           }
           return dp[n - 1];
       }

       int explicitBfs(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           std::queue<int> q;
           std::vector<char> visited(n, false);
           q.push(0); visited[0] = true;
           int distance = 0;
           while (!q.empty()) {
               int level = static_cast<int>(q.size());
               while (level--) {
                   int index = q.front(); q.pop();
                   if (index == n - 1) return distance;
                   for (int next = index + 1; next < n && next <= index + nums[index]; ++next) {
                       if (!visited[next]) { visited[next] = true; q.push(next); }
                   }
               }
               ++distance;
           }
           return -1;
       }

       int intervalGreedy(const std::vector<int>& nums) {
           int jumps = 0;
           int current_end = 0;
           int farthest = 0;
           for (int i = 0; i + 1 < static_cast<int>(nums.size()); ++i) {
               farthest = std::max(farthest, i + nums[i]);
               if (i == current_end) {
                   ++jumps;
                   current_end = farthest;
                   if (current_end >= static_cast<int>(nums.size()) - 1) break;
               }
           }
           return jumps;
       }

   public:
       int jump(std::vector<int>& nums) {
           return intervalGreedy(nums);
       }
   };

题解
----

为什么这是隐式图最短路
~~~~~~~~~~~~~~~~~~~~~~

每个下标是节点，从 ``i`` 到 ``i+1..i+nums[i]`` 各有一条边。每次跳跃代价都是 1，因此最少跳数等于从 0 到末尾的 BFS 层数。显式 BFS 会枚举大量重叠区间边。

动态规划重复更新了哪些位置
~~~~~~~~~~~~~~~~~~~~~~~~~~

``dp[i]`` 表示到达 ``i`` 的最少跳数。每个位置向整个可达区间更新，最坏 ``O(n²)``。由于从一层所有位置出发得到的下一层仍是连续区间，可以只维护区间右边界。

三个贪心状态分别表示什么
~~~~~~~~~~~~~~~~~~~~~~~~

``current_end`` 是使用当前 ``jumps`` 次跳跃能覆盖的最右位置；``farthest`` 是扫描当前层内所有起点后，再跳一次能到达的最远位置；扫描下标 ``i`` 遍历当前层节点。

为什么不能看到更远位置就立即跳
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在当前层结束前，后面的起点可能给出更远的下一层边界。立即选择某个落点会丢失这些候选。算法只更新 ``farthest``，直到 ``i == current_end``，说明当前层所有起点都已比较完，此时才增加跳数并提交下一层边界。

状态演化
~~~~~~~~

对 ``[2,3,1,1,4]``：

.. list-table::
   :header-rows: 1

   * - ``i``
     - ``i+nums[i]``
     - ``farthest``
     - ``current_end``
     - ``jumps``
   * - 0
     - 2
     - 2
     - 由 0 更新为 2
     - 1
   * - 1
     - 4
     - 4
     - 2
     - 1
   * - 2
     - 3
     - 4
     - 由 2 更新为 4
     - 2

第二层边界已覆盖终点，答案为 2。

为什么每次层结束选择最远边界最优
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

BFS 的第 ``k`` 层包含恰好能在 ``k`` 跳内到达的新位置。当前层所有位置能扩张出的并集是一个从旧边界之后延伸到 ``farthest`` 的连续区间。把下一层边界设为最远点不会增加跳数，也不会排除任何较近节点；它最大化下一轮可用起点集合。因此首次覆盖终点的层数就是最少跳数。

为什么循环不需要处理最后一个下标
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

到达最后下标后不需要再跳。若把最后位置也作为层末处理，可能多加一次跳跃。因此循环只扫描到 ``n-2``，并可在新边界覆盖终点时提前结束。

复杂度来源
~~~~~~~~~~

动态规划和显式 BFS 最坏 ``O(n²)``；区间贪心每个下标扫描一次，时间 ``O(n)``，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int jump(int *nums, int n) {
       int jumps=0,current_end=0,farthest=0;
       for(int i=0;i<n-1;++i){if(i+nums[i]>farthest)farthest=i+nums[i];if(i==current_end){++jumps;current_end=farthest;if(current_end>=n-1)break;}}
       return jumps;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def jump(self, nums: list[int]) -> int:
           jumps = current_end = farthest = 0
           for i in range(len(nums) - 1):
               farthest = max(farthest, i + nums[i])
               if i == current_end:
                   jumps += 1
                   current_end = farthest
                   if current_end >= len(nums) - 1: break
           return jumps

Java
~~~~

.. code-block:: java

   class Solution {public int jump(int[] nums){int jumps=0,end=0,farthest=0;for(int i=0;i<nums.length-1;i++){farthest=Math.max(farthest,i+nums[i]);if(i==end){jumps++;end=farthest;if(end>=nums.length-1)break;}}return jumps;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn jump(nums:Vec<i32>)->i32{let(mut jumps,mut end,mut farthest)=(0,0usize,0usize);for i in 0..nums.len().saturating_sub(1){farthest=farthest.max(i+nums[i]as usize);if i==end{jumps+=1;end=farthest;if end>=nums.len()-1{break}}}jumps}}

Go
~~

.. code-block:: go

   func jump(nums []int)int{jumps,end,farthest:=0,0,0;for i:=0;i<len(nums)-1;i++{if i+nums[i]>farthest{farthest=i+nums[i]};if i==end{jumps++;end=farthest;if end>=len(nums)-1{break}}};return jumps}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function jump(nums:number[]):number{let jumps=0,end=0,farthest=0;for(let i=0;i<nums.length-1;i++){farthest=Math.max(farthest,i+nums[i]);if(i===end){jumps++;end=farthest;if(end>=nums.length-1)break;}}return jumps;}

C#
~~

.. code-block:: csharp

   public class Solution {public int Jump(int[] nums){int jumps=0,end=0,farthest=0;for(int i=0;i<nums.Length-1;i++){farthest=Math.Max(farthest,i+nums[i]);if(i==end){jumps++;end=farthest;if(end>=nums.Length-1)break;}}return jumps;}}

Julia
~~~~~

.. code-block:: julia

   function jump(nums::Vector{Int})::Int
       length(nums) <= 1 && return 0
       jumps=endpos=farthest=0
       for index in 0:length(nums)-2
           farthest=max(farthest,index+nums[index+1])
           if index==endpos;jumps+=1;endpos=farthest;endpos>=length(nums)-1&&break;end
       end
       jumps
   end

R
~

.. code-block:: r

   jump <- function(nums){n<-length(nums);jumps<-0L;endpos<-0L;farthest<-0L;if(n>=2L)for(index in 0:(n-2L)){farthest<-max(farthest,index+nums[[index+1L]]);if(index==endpos){jumps<-jumps+1L;endpos<-farthest;if(endpos>=n-1L)break}};jumps}