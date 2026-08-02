0440. K-th Smallest in Lexicographical Order
============================================

题目信息
--------

:题号: 0440
:难度: Hard
:主题: 整数范围、十进制字典序、一基排名、第 ``k`` 个数
:原题: `LeetCode 0440 <https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/>`_
:重点: 排序对象是整数 ``1..n`` 的十进制表示、按字符串字典序比较、``k`` 从 1 开始、返回整数本身

题目重述
--------

给定整数 ``n`` 和 ``k``，把所有整数 ``1, 2, ..., n`` 按其十进制字符串的字典序排列，返回排列中的第 ``k`` 个整数。

字典序按字符逐位比较，例如 ``10``、``100``、``101`` 都排在 ``2`` 之前。``n`` 位于 ``[1, 10^9]``，``k`` 位于 ``[1, n]``。排名采用一基编号，只返回对应整数，不需要构造或返回完整排列。

自建示例
--------

排名跨过前缀 1 的整棵分支：

.. code-block:: text

   输入：n = 25，k = 13
   输出：20
   解释：前 13 个数依次为 1、10、11、12、13、14、15、16、17、18、19、2、20，因此第 13 个是 20。

全部都是一位数：

.. code-block:: text

   输入：n = 9，k = 7
   输出：7
   解释：1 到 9 的字典序与数值顺序相同，第七个整数为 7。

前缀子树计数与跳过
------------------

把整数看成十叉字典树中的节点：``1`` 的下一层是 ``10`` 到 ``19``，``2`` 的下一层是 ``20`` 到 ``29``。字典序遍历一棵子树时，会先访问前缀本身，再访问所有更长的后缀，因此只要知道某个前缀在 ``1..n`` 中包含多少个整数，就能整棵跳过它。

对前缀 ``prefix``，维护当前层的首值 ``first`` 和开区间右端 ``last``。每向下一层就把两者都乘以 10，并把本层与 ``n`` 的交集加入计数。主循环从 ``1`` 开始，``k`` 改成从 0 开始的剩余排名：若当前前缀的数量不超过排名，就移动到下一个兄弟；否则进入当前前缀的下一层，并消耗掉前缀节点本身的一个排名。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long countPrefix(long long prefix, long long n) {
           long long first = prefix;
           long long last = prefix + 1;  // [first, last)
           long long count = 0;
           while (first <= n) {
               count += std::min(n + 1, last) - first;
               first *= 10;
               last *= 10;
           }
           return count;
       }

   public:
       int findKthNumber(int n, int k) {
           long long prefix = 1;
           long long rank = static_cast<long long>(k) - 1;
           while (rank > 0) {
               long long count = countPrefix(prefix, n);
               if (count <= rank) {
                   ++prefix;
                   rank -= count;
               } else {
                   prefix *= 10;
                   --rank;
               }
           }
           return static_cast<int>(prefix);
       }
   };

代码分析
--------

``countPrefix`` 统计的是一个字典树前缀的完整子树大小，而不是数值区间的长度，所以能正确处理 ``19`` 后面紧接着 ``2`` 的字典序规则。跳过兄弟分支时排名减少整棵子树的数量，向下时只减少当前前缀节点；循环始终保留第 ``k`` 个数所在的分支。每次处理一个十进制层级，时间复杂度为 ``O(log n)``，额外空间复杂度为 ``O(1)``。
