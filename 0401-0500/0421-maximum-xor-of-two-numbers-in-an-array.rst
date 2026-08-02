0421. Maximum XOR of Two Numbers in an Array
=============================================

题目信息
--------

:题号: 0421
:难度: Medium
:主题: 非负整数、按位异或、二元选择、最大结果
:原题: `LeetCode 0421 <https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/>`_
:重点: 从数组中选择两个下标 ``i <= j``、计算完整整数的按位异或、只返回最大异或值

题目重述
--------

给定非负整数数组 ``nums``，在所有满足 ``0 <= i <= j < nums.length`` 的下标对中，计算 ``nums[i] XOR nums[j]``，返回能够得到的最大值。

``nums.length`` 位于 ``[1, 2 * 10^5]``，每个元素位于 ``[0, 2^31-1]``。允许 ``i == j``，此时异或结果为 0；当数组中有多个下标对取得同一最大值时，仍只返回该最大整数，不需要返回下标或元素。

自建示例
--------

最大值来自不同大小的两个数：

.. code-block:: text

   输入：nums = [2, 7, 10]
   输出：13
   解释：7 XOR 10 = 13，大于 2 XOR 7 = 5 和 2 XOR 10 = 8，因此最大异或值为 13。

只有一个元素：

.. code-block:: text

   输入：nums = [19]
   输出：0
   解释：唯一允许的下标对是 i = j = 0，任何整数与自身异或都等于 0。

按最高位贪心保留可行前缀
--------------------------

异或结果的高位比低位重要。将所有数插入二进制 trie 后，查询一个数时从最高位到最低位尽量选择与当前位相反的分支：若该分支存在，就能让这一位为 1；否则只能走相同位。因为高位决策优先级更高，这样得到与该数配对的最大异或值。

数组值不超过 ``2^31-1``，从第 30 位向下检查即可；允许同一个下标配对不会影响结果，至少一个数时最大值也会由查询得到。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       struct Node {
           int child[2] = {-1, -1};
       };
       std::vector<Node> trie;

       void insert(int value) {
           int node = 0;
           for (int bit = 30; bit >= 0; --bit) {
               int current = (value >> bit) & 1;
               if (trie[node].child[current] == -1) {
                   trie[node].child[current]
                       = static_cast<int>(trie.size());
                   trie.push_back(Node());
               }
               node = trie[node].child[current];
           }
       }

       int bestWith(int value) const {
           int node = 0;
           int result = 0;
           for (int bit = 30; bit >= 0; --bit) {
               int current = (value >> bit) & 1;
               int wanted = current ^ 1;
               if (trie[node].child[wanted] != -1) {
                   result |= 1 << bit;
                   node = trie[node].child[wanted];
               } else {
                   node = trie[node].child[current];
               }
           }
           return result;
       }

   public:
       int findMaximumXOR(std::vector<int>& nums) {
           trie.clear();
           trie.push_back(Node());
           for (int value : nums) insert(value);
           int answer = 0;
           for (int value : nums) {
               answer = std::max(answer, bestWith(value));
           }
           return answer;
       }
   };

代码分析
--------

Trie 中的每条路径代表一个完整数的位前缀；查询优先尝试相反位，若存在就不会牺牲已确定的高位最优性。插入和查询各检查 31 位，时间复杂度为 ``O(31n)``，额外空间为 ``O(31n)``。
