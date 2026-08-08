0198. House Robber
==================

题目信息
--------

:题号: 0198. 打家劫舍
:难度: Medium
:主题: 动态规划、前缀最优、相邻排斥、滚动状态
:原题: `LeetCode 0198 <https://leetcode.com/problems/house-robber/>`_
:重点: 按最后一间选或不选拆分全部方案，再把只依赖两个前缀的 DP 压缩为常数状态

题目重述
--------

给定非负整数数组 ``nums``，``nums[i]`` 是第 ``i`` 间房屋中的金额。不能选择两间相邻
房屋，返回所有合法选择能取得的最大总金额。

可以不选择任何房屋；只要求最大金额，不需要返回具体房屋下标。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3,1]
   输出：4

   选择金额 1 和 3，总计 4。

.. code-block:: text

   输入：nums = [2,7,9,3,1]
   输出：12

   选择 2、9、1。只在每对相邻房屋中选较大者会错过这种跨段组合。

.. code-block:: text

   输入：nums = [8]
   输出：8

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int fullPrefixTable(const std::vector<int>& nums) {
           int size = static_cast<int>(nums.size());
           if (size == 0) {
               return 0;
           }

           std::vector<long long> best(size + 1, 0);
           best[1] = nums[0];
           for (int houses = 2; houses <= size; ++houses) {
               best[houses] = std::max(
                   best[houses - 1],
                   best[houses - 2] + nums[houses - 1]);
           }
           return static_cast<int>(best[size]);
       }

       int rollingPrefixes(const std::vector<int>& nums) {
           long long two_back = 0;
           long long one_back = 0;

           for (int money : nums) {
               long long take_current = two_back + money;
               long long current = std::max(one_back, take_current);
               two_back = one_back;
               one_back = current;
           }
           return static_cast<int>(one_back);
       }

   public:
       int rob(std::vector<int>& nums) {
           return rollingPrefixes(nums);
       }
   };

题解
----

原始搜索是选或不选的决策树
~~~~~~~~~~~~~~~~~~~~~~~~~~

对每间房屋都尝试“选择、跳过”，并在选择后跳过下一间，可以枚举全部合法方案。但分支数
随房屋数量指数增长，而且不同选择历史会到达同一个剩余后缀，重复计算它能贡献的最优值。

局部贪心也无法替代搜索。例如在 ``[2,7,9,3,1]`` 中先从前两间选择较大的 7，看似合理，
却会阻止选择 9；全局最优反而选择 2、9、1。当前选择会改变下一位置是否可选，必须保存
足以描述前缀约束的最优状态。

按最后一间拆分全部方案
~~~~~~~~~~~~~~~~~~~~~~

定义 ``best[i]`` 为只考虑前 ``i`` 间房屋时的最大金额。对最后一间，也就是数组下标
``i-1``，任意合法方案恰好属于两类：

* 不选最后一间：全部选择位于前 ``i-1`` 间，最优为 ``best[i-1]``；
* 选择最后一间：相邻的倒数第二间必须排除，之前只能取前 ``i-2`` 间最优，再加
  ``nums[i-1]``。

两类互斥且覆盖全部方案，因此：

.. code-block:: text

   best[i] = max(best[i-1], best[i-2] + nums[i-1])

边界 ``best[0] = 0`` 表示没有房屋，``best[1] = nums[0]`` 表示单间时选择它最优。金额
非负，所以不需要用负无穷表示“不选任何房屋”。

为什么递推没有丢失具体选择
~~~~~~~~~~~~~~~~~~~~~~~~~~

选择最后一间时，前部与它之间隔着未选的倒数第二间，因此任意达到 ``best[i-2]`` 的方案
都能安全与当前房屋组合；不选时，达到 ``best[i-1]`` 的方案也仍合法。两个数值分别是两类
方案可达到的上界，而且上界都有构造，所以取最大值既不低估也不引入相邻冲突。

``fullPrefixTable`` 按房屋数量从小到大计算，当前依赖都已确定。长度为 ``n+1`` 的数组让
房屋下标与前缀数量分开，避免第一、第二间的负下标边界。

空间如何压缩成两个前缀
~~~~~~~~~~~~~~~~~~~~~~~~

计算 ``best[i]`` 后，更早的 ``best[0..i-3]`` 不会再被直接读取。``rollingPrefixes`` 只
维护：

* ``one_back``：已处理全部前缀的最优值；
* ``two_back``：少一间前缀的最优值。

处理当前金额前，若已处理 ``i`` 间，则 ``one_back = best[i]``、
``two_back = best[i-1]``。选择当前房屋得到 ``two_back + money``，跳过得到
``one_back``，两者最大值就是 ``best[i+1]``。

必须先用旧状态算出 ``current``，再执行 ``two_back = one_back``、
``one_back = current``。若先覆盖 ``two_back``，选择分支会读取 ``best[i]``，等价于允许
当前房屋与前一间同时被选，破坏相邻排斥。

具体状态走读
~~~~~~~~~~~~

对 ``[1,2,3,1]``：

.. code-block:: text

   当前金额  旧 two_back  旧 one_back  选择当前  跳过当前  新最优
   1         0             0             1         0         1
   2         0             1             2         1         2
   3         1             2             4         2         4
   1         2             4             3         4         4

第三轮的 4 来自第一间最优 1 加当前 3；第四轮选择当前只能得到 3，所以保留旧前缀最优 4。

空数组时循环不执行并返回初始 0；单间时第一轮比较 0 与该金额，得到单间答案。重复金额、
零金额都不改变位置约束，状态只按下标前缀推进。

方案选择与复杂度
~~~~~~~~~~~~~~~~

完整前缀表和滚动方案都只处理每间房屋一次，时间为 ``O(n)``。完整表保存全部前缀答案，
空间 ``O(n)``，适合理解或需要恢复方案时继续扩展；本题只返回最大金额，滚动变量删除不再
使用的历史，额外空间降为 ``O(1)``，因此 ``rollingPrefixes`` 是主解。状态使用
``long long`` 保存中间和，最终按题目接口转换为 ``int``。
