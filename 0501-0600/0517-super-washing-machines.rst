0517. Super Washing Machines
============================

题目信息
--------

:题号: 0517
:难度: Hard
:主题: 相邻传递、同步操作、平均分配、最少轮数
:原题: `LeetCode 0517 <https://leetcode.com/problems/super-washing-machines/>`_
:重点: 每轮可让任意多台机器各向一个相邻机器传一件衣服、传递同时发生、总数不可整除时返回 -1

题目重述
--------

一排洗衣机中，第 ``i`` 台机器当前有 ``machines[i]`` 件衣服。一次操作中，可以选择任意数量的洗衣机；每台被选中的机器向它左边或右边的一台相邻机器传递恰好一件衣服，所有选择同时生效。

返回使每台洗衣机最终拥有相同衣服数量所需的最少操作轮数。若衣服总数不能被机器数量整除，则无法平均分配，返回 ``-1``。一台机器在同一轮中最多向一个方向送出一件衣服，但可以同时接收邻居送来的衣服。

自建示例
--------

需要跨越多台机器传递：

.. code-block:: text

   输入：machines = [0,0,6]
   输出：4
   解释：目标是每台 2 件。最右机器需要连续向左输出，部分轮次中间机器可以一边接收一边继续向左传递，最少需要 4 轮。

总数无法平均：

.. code-block:: text

   输入：machines = [1,0]
   输出：-1
   解释：共有 1 件衣服，无法在两台机器之间平均分配。

前缀流量与单机净输出的最大值
----------------------------

先求平均目标 ``average``。从左到右扫描时，``balance`` 表示当前位置左侧整体需要从右侧得到的衣服数：正数代表需要向右传出，负数代表需要从右向左传入。跨过这条边至少需要 ``abs(balance)`` 轮。

单台机器若比目标多出 ``machines[i] - average`` 件，就还需要自己在若干轮中送出这些衣服；它每轮最多送一件，所以答案还必须至少覆盖这个正数。遍历时取两种下界的最大值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findMinMoves(std::vector<int>& machines) {
           long long total = std::accumulate(machines.begin(),
                                             machines.end(), 0LL);
           int n = static_cast<int>(machines.size());
           if (total % n != 0) return -1;
           long long average = total / n;
           long long balance = 0;
           long long answer = 0;
           for (int clothes : machines) {
               long long excess = clothes - average;
               balance += excess;
               answer = std::max(answer,
                                 std::max(std::llabs(balance), excess));
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

前缀净流量给出相邻边不可突破的传输下界，过剩机器给出单机每轮至多输出一件的下界；同时操作可以并行进行，二者最大值即可达到。时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。
