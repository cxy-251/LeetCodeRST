0213. House Robber II
=====================

题目信息
--------

:题号: 0213. 打家劫舍 II
:难度: Medium
:主题: 动态规划、环形数组、滚动状态
:原题: `LeetCode 0213 <https://leetcode.com/problems/house-robber-ii/>`_
:重点: 首尾房屋相邻、线性递推、环拆线、滚动压缩

题目重述
--------

有一圈房屋，``nums[i]`` 是第 ``i`` 间房中的金额。选择一间房会得到其金额，但相邻两间不能在同一晚同时选择；
由于房屋首尾相接，第 0 间和最后一间也算相邻。返回不触发警报时能够得到的最大金额，不需要返回具体的房屋下标。

房屋数量在 ``[1,100]``，金额为非负整数。输入数组只读；只有一间房时不存在第二间房与它相邻，答案就是这间房的金额。

自建示例
--------

``nums = [8,1,1,8]`` 返回 ``9``。把数组错误地当成直线会同时选择两个 8 得到 16；在圆环中只能选择一端的 8，
再配一间不相邻的小房屋。

``nums = [2,3,2]`` 返回 ``3``。第 0 间和第 2 间虽然在数组中不相邻，却在圆环中相邻，所以不能同时选择。
``nums = [5]`` 返回 ``5``；``nums = [2,7]`` 返回 ``7``，两间房互相相邻时只能取金额较大的一间。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       static int robLinearTable(const std::vector<int>& nums, int left, int right) {
           if (left > right) return 0;
           std::vector<int> dp(right - left + 1, 0);
           dp[0] = nums[left];
           if (left == right) return dp[0];
           dp[1] = std::max(nums[left], nums[left + 1]);
           for (int index = 2; index < static_cast<int>(dp.size()); ++index) {
               dp[index] = std::max(dp[index - 1],
                                    dp[index - 2] + nums[left + index]);
           }
           return dp.back();
       }

       static int robLinearRolling(const std::vector<int>& nums, int left, int right) {
           int previous_two = 0;
           int previous_one = 0;
           for (int index = left; index <= right; ++index) {
               const int current = std::max(previous_one,
                                            previous_two + nums[index]);
               previous_two = previous_one;
               previous_one = current;
           }
           return previous_one;
       }

   public:
       int rob(std::vector<int>& nums) {
           const int count = static_cast<int>(nums.size());
           if (count == 1) return nums[0];
           return std::max(robLinearRolling(nums, 0, count - 2),
                           robLinearRolling(nums, 1, count - 1));
       }
   };

题解
----

线性房屋的最后一步
~~~~~~~~~~~~~~~~~~~~

先忽略首尾相邻，把房屋看成一条线。逐间枚举“选或不选”当然覆盖全部方案，但搜索树有 ``O(2^n)`` 个叶子。
固定处理到下标 ``i`` 的最优值时，最后一间只有两个互斥去向：不选它，继承 ``i-1`` 的最优值；选它，则 ``i-1`` 不能选，
只能接上 ``i-2`` 的最优值。于是：

.. code-block:: text

   best[i] = max(best[i - 1], best[i - 2] + nums[i])

这个递推的关键不是金额的具体组合，而是“同一个前缀只保留最大金额”已经足够支配后续选择。金额非负只让空前缀可以用 0 初始化。

环形约束的唯一额外信息
~~~~~~~~~~~~~~~~~~~~~~~~

线性递推会把第 0 间和最后一间同时纳入。圆环的特殊边只有这一条，因此按第 0 间是否选择分成两个互斥覆盖的区间：

* 不选第 0 间：在 ``[1,n-1]`` 上运行线性 DP；
* 选择第 0 间：最后一间必不能选，在 ``[0,n-2]`` 上运行线性 DP。

每个合法方案恰好落入其中一个分支，两个区间内部已经是普通线性问题。这样把“是否选过首房”的历史状态编码进边界，
避免让每个 DP 单元额外携带一个布尔维度。

滚动状态与更新顺序
~~~~~~~~~~~~~~~~~~~~

``robLinearTable`` 用完整数组展示线性递推；但计算新项只读取前两项。``robLinearRolling`` 在处理 ``index`` 前保持：

* ``previous_one`` 是区间 ``[left,index-1]`` 的最优值；
* ``previous_two`` 是区间 ``[left,index-2]`` 的最优值；
* 选择当前房屋的候选为 ``previous_two + nums[index]``，跳过当前的候选为 ``previous_one``。

必须先用两个旧值算出 ``current``，再执行 ``previous_two = previous_one``、``previous_one = current``。若提前覆盖旧值，
下一轮就会把相邻两间房错误地当成可同时选择。

状态走读
~~~~~~~~

对 ``nums=[2,3,2]``，两个线性子问题的滚动状态如下：

.. list-table::
   :header-rows: 1

   * - 区间
     - 处理顺序
     - ``(previous_two, previous_one)`` 的变化
     - 结果
   * - ``[0,1]``
     - 2、3
     - ``(0,0) -> (0,2) -> (2,3)``
     - 3
   * - ``[1,2]``
     - 3、2
     - ``(0,0) -> (0,3) -> (3,3)``
     - 3

``(previous_two, previous_one)`` 保存的是前缀最优金额，而不是最近两间房的金额。比如处理第二个区间的 2 时，
连接前两间的候选是 ``0+2``，不选当前则保留已有的 3。

代码演进与方案选择
~~~~~~~~~~~~~~~~~~~~

``robLinearTable`` 保留完整数组只为展示状态来源，``robLinearRolling`` 删除已经不会再读取的前缀。公共入口只负责处理两个互斥区间，
选择滚动版本作为主解；它不再维护“首房是否已选”的额外标记，因为该信息已经由区间端点表达。

复杂度与边界
~~~~~~~~~~~~

两个区间各扫描至多 ``n`` 间房，主解时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。完整表版本时间同为 ``O(n)``，
额外空间为 ``O(n)``；返回值不计入工作空间。单屋、两屋、全零金额、首尾高额和首尾相等的情况都由单屋分支与环拆分覆盖。
