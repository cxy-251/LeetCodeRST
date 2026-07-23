0055. Jump Game
===============

题目信息
--------

:题号: 0055
:难度: Medium
:主题: 数组、贪心、动态规划、可达区间
:原题: `LeetCode 0055 <https://leetcode.com/problems/jump-game/>`_
:重点: 最远可达位置、不可达断点、前缀可达性、终点判断

题目重述
--------

给定非负整数数组 ``nums``。位于下标 ``i`` 时，最多可以向右跳 ``nums[i]`` 步；判断能否从下标 0 到达最后一个下标。单元素数组的起点就是终点。

约束为 ``1 <= nums.length <= 10^4``、``0 <= nums[i] <= 10^5``。

自建示例
--------

.. code-block:: text

   输入：nums = [2,0,2,0,1]
   输出：true

可以按下标 ``0 -> 2 -> 4`` 到达最后一个位置。

.. code-block:: text

   输入：nums = [2,1,0,0,4]
   输出：false

从起点最多到达下标 2，而下标 2 的跳跃长度为 0，无法进入后面的区域。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool dynamicProgramming(const std::vector<int>& nums) {
           int n = nums.size();
           std::vector<char> reachable(n);
           reachable[0] = true;
           for (int i = 0; i < n; ++i) {
               if (!reachable[i]) continue;
               int end = std::min(n - 1, i + nums[i]);
               for (int next = i + 1; next <= end; ++next) reachable[next] = true;
           }
           return reachable[n - 1];
       }

       bool reverseGoodPosition(const std::vector<int>& nums) {
           int goal = nums.size() - 1;
           for (int i = goal - 1; i >= 0; --i)
               if (i + nums[i] >= goal) goal = i;
           return goal == 0;
       }

       bool farthestReach(const std::vector<int>& nums) {
           int farthest = 0;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (i > farthest) return false;
               farthest = std::max(farthest, i + nums[i]);
               if (farthest >= static_cast<int>(nums.size()) - 1) return true;
           }
           return true;
       }

   public:
       bool canJump(std::vector<int>& nums) {
           return farthestReach(nums);
       }
   };

题解
----

显式可达状态为何重复扩张
~~~~~~~~~~~~~~~~~~~~~~

动态规划可令 ``reachable[i]`` 表示下标 ``i`` 是否可达，并从每个可达位置标记它覆盖的后续区间。多个位置的覆盖范围大量重叠，最坏需要 ``O(n²)`` 次写入。

可达位置为什么形成连续前缀
~~~~~~~~~~~~~~~~~~~~~~~~

从一个可达位置可以跳任意不超过 ``nums[i]`` 的步数，因此它覆盖的是连续区间。若当前已确认 ``0..farthest`` 可达，扫描其中任何位置只会把右边界继续向右扩展，不会在前缀内部留下空洞。

最远边界如何更新
~~~~~~~~~~~~~~~~

扫描下标 ``i`` 前，``farthest`` 表示此前可达位置能够覆盖的最右端。若 ``i <= farthest``，该位置可达，可用 ``i + nums[i]`` 扩展边界；若 ``i > farthest``，当前下标前出现断点，所有后续下标也无法被访问。

.. list-table::
   :header-rows: 1

   * - 下标
     - 数值
     - 旧 ``farthest``
     - 新 ``farthest``
   * - 0
     - 3
     - 0
     - 3
   * - 1
     - 2
     - 3
     - 3
   * - 2
     - 1
     - 3
     - 3
   * - 3
     - 0
     - 3
     - 3
   * - 4
     - 4
     - 3
     - ``4 > 3``，失败

为什么遇到断点可以立即失败
~~~~~~~~~~~~~~~~~~~~~~~~~~

所有边都只向右。若下标 ``i`` 超出当前最远边界，任何更早可达位置都无法跳到 ``i``；更晚位置又必须先经过某个可达起点才能使用，因此后续不可能重新恢复可达性。

反向好位置为何等价
~~~~~~~~~~~~~~~~~~

从终点开始维护 ``goal``：若下标 ``i`` 能直接到达当前 ``goal``，则把 ``goal`` 左移到 ``i``。最终 ``goal == 0`` 表示存在一条链连接起点与终点。它与前向边界都利用单调可达关系，只是证明方向相反。

与 Jump Game II 的区别
~~~~~~~~~~~~~~~~~~~~~~

第 45 题要最少跳数，必须区分当前 BFS 层边界和下一层最远边界；本题只问是否可达，所有可达位置可以合并成一个前缀，只保留 ``farthest`` 即可。

为什么不会错误跳过某条路径
~~~~~~~~~~~~~~~~~~~~~~~~

算法不实际选择落点，而是保留所有已确认可达位置能形成的最远覆盖。任意具体路径上的每个落点都位于这个前缀内；扫描到它时，其跳跃能力已经参与边界扩张。因此只保留最远边界不会丢失路径信息。

复杂度来源
~~~~~~~~~~

显式动态规划最坏 ``O(n²)`` 时间和 ``O(n)`` 空间；前向和反向贪心都只扫描一次，时间 ``O(n)``、额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   bool canJump(int*nums,int n){int farthest=0;for(int i=0;i<n;i++){if(i>farthest)return false;if(i+nums[i]>farthest)farthest=i+nums[i];if(farthest>=n-1)return true;}return true;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def canJump(self, nums: list[int]) -> bool:
           farthest = 0
           for index, length in enumerate(nums):
               if index > farthest: return False
               farthest = max(farthest, index + length)
               if farthest >= len(nums) - 1: return True
           return True

Java
~~~~

.. code-block:: java

   class Solution {public boolean canJump(int[]nums){int farthest=0;for(int i=0;i<nums.length;i++){if(i>farthest)return false;farthest=Math.max(farthest,i+nums[i]);if(farthest>=nums.length-1)return true;}return true;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn can_jump(nums:Vec<i32>)->bool{let mut farthest=0usize;for(i,&v)in nums.iter().enumerate(){if i>farthest{return false}farthest=farthest.max(i+v as usize);if farthest>=nums.len()-1{return true}}true}}

Go
~~

.. code-block:: go

   func canJump(nums []int)bool{farthest:=0;for i,v:=range nums{if i>farthest{return false};if i+v>farthest{farthest=i+v};if farthest>=len(nums)-1{return true}};return true}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canJump(nums:number[]):boolean{let farthest=0;for(let i=0;i<nums.length;i++){if(i>farthest)return false;farthest=Math.max(farthest,i+nums[i]);if(farthest>=nums.length-1)return true;}return true;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool CanJump(int[]nums){int farthest=0;for(int i=0;i<nums.Length;i++){if(i>farthest)return false;farthest=Math.Max(farthest,i+nums[i]);if(farthest>=nums.Length-1)return true;}return true;}}

Julia
~~~~~

.. code-block:: julia

   function can_jump(nums::Vector{Int})
       farthest=0
       for index in 0:length(nums)-1
           index>farthest&&return false
           farthest=max(farthest,index+nums[index+1])
           farthest>=length(nums)-1&&return true
       end
       true
   end

R
~

.. code-block:: r

   can_jump <- function(nums){farthest<-0L;for(index in 0:(length(nums)-1L)){if(index>farthest)return(FALSE);farthest<-max(farthest,index+nums[[index+1L]]);if(farthest>=length(nums)-1L)return(TRUE)};TRUE}
