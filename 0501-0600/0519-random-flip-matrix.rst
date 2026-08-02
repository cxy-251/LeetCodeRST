0519. Random Flip Matrix
========================

题目信息
--------

:题号: 0519
:难度: Medium
:主题: 状态设计、随机抽样、矩阵翻转、重置
:原题: `LeetCode 0519 <https://leetcode.com/problems/random-flip-matrix/>`_
:重点: flip 只能选择当前为 0 的格子、所有剩余零格等概率、选中后改为 1、reset 恢复全部零并共享对象状态

题目重述
--------

实现一个管理 ``m × n`` 二进制矩阵的对象，矩阵初始全部为 ``0``。``flip()`` 必须从当前仍为 ``0`` 的格子中等概率随机选择一个，返回其坐标 ``[row, col]``，并把该格子改为 ``1``。

在一次 ``reset()`` 之前，同一格子不能被 ``flip()`` 重复返回。``reset()`` 把所有格子重新设为 ``0``，之后每个格子又可以被选择。题目保证调用 ``flip()`` 时至少还存在一个零格；对象需要在多次调用之间保存矩阵状态。

自建示例
--------

两格矩阵不会重复翻转：

.. code-block:: text

   输入：初始化 Solution(1,2)，连续调用 flip() 两次
   输出：第一次可能为 [0,0] 或 [0,1]，第二次必须为另一个坐标
   解释：第一次调用时两个零格各有 1/2 概率；被选格子变为 1 后，第二次只剩一个可选格子。

重置恢复可选状态：

.. code-block:: text

   输入：初始化 Solution(1,1)，调用 flip()、reset()、flip()
   输出：[0,0]，随后 [0,0]
   解释：reset 后唯一格子恢复为 0，因此可以再次被翻转。

把未选择位置压缩成尾部交换表
------------------------------

把矩阵按行优先编号为 ``0..m*n-1``，维护尚未翻转的编号区间 ``[0, remaining)``。每次在区间内均匀抽取一个位置 ``pick``，将它映射到的真实编号返回；随后用区间最后一个位置替换 ``pick`` 的槽位并减少 ``remaining``。这样不需要显式保存整张矩阵。

哈希表只记录发生过交换的编号，未记录的位置默认映射到自身。``reset`` 清空映射并恢复 ``remaining = m*n``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int columns;
       int total;
       int remaining;
       std::unordered_map<int, int> mapping;
       std::mt19937 generator{std::random_device{}()};

       int actual(int index) {
           auto it = mapping.find(index);
           return it == mapping.end() ? index : it->second;
       }

   public:
       Solution(int m, int n)
           : columns(n), total(m * n), remaining(total) {}

       std::vector<int> flip() {
           std::uniform_int_distribution<int> distribution(0, remaining - 1);
           int pick = distribution(generator);
           int value = actual(pick);
           int last = remaining - 1;
           mapping[pick] = actual(last);
           --remaining;
           return {value / columns, value % columns};
       }

       void reset() {
           mapping.clear();
           remaining = total;
       }
   };

代码分析
--------

额外保存的 ``total`` 使 ``reset`` 能恢复原始矩阵大小；交换表的不变量是未翻转编号始终均匀占据前缀区间，因而每个剩余格子等概率。哈希查找使单次操作平均 ``O(1)``，空间复杂度为已翻转次数 ``O(t)``。
