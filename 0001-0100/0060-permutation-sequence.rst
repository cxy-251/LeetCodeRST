0060. Permutation Sequence
==========================

题目信息
--------

:题号: 0060
:难度: Hard
:主题: 排列、字典序、阶乘分组、秩选择
:原题: `LeetCode 0060 <https://leetcode.com/problems/permutation-sequence/>`_
:重点: 从按字典序访问排列树，推导到用阶乘块直接选择每一位

题目重述
--------

数字 ``1`` 到 ``n`` 各使用一次，可以形成 ``n!`` 个排列。把这些排列按字典序从小到大编号为
``1..n!``，返回第 ``k`` 个排列对应的字符串。

约束为 ``1 <= n <= 9``、``1 <= k <= n!``。

自建示例
--------

.. code-block:: text

   输入：n = 5, k = 42
   输出："24531"

以同一个首位开头的排列共有 ``4! = 24`` 个。第 42 个排列跳过以 1 开头的 24 个排列，进入以 2 开头的
分块；继续在更小的阶乘块中定位，最终得到 ``"24531"``。

.. code-block:: text

   输入：n = 4, k = 17
   输出："3412"

每个首位分块包含 ``3! = 6`` 个排列，第 17 个排列位于第三块，因此首位是 3。

.. code-block:: text

   输入：n = 3, k = 6
   输出："321"

最后一个字典序排列是全部数字降序排列。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool findByEnumeration(
           int n,
           int& remainingRank,
           std::vector<char>& used,
           std::string& current,
           std::string& answer
       ) {
           if (static_cast<int>(current.size()) == n) {
               --remainingRank;
               if (remainingRank == 0) {
                   answer = current;
                   return true;
               }
               return false;
           }

           for (int value = 1; value <= n; ++value) {
               if (used[value]) continue;
               used[value] = true;
               current.push_back(static_cast<char>('0' + value));
               if (findByEnumeration(
                       n,
                       remainingRank,
                       used,
                       current,
                       answer
                   )) {
                   return true;
               }
               current.pop_back();
               used[value] = false;
           }
           return false;
       }

       std::string enumerateLexicographically(int n, int k) {
           std::vector<char> used(n + 1, false);
           std::string current;
           std::string answer;
           findByEnumeration(n, k, used, current, answer);
           return answer;
       }

       std::string selectByFactorialBlocks(int n, int k) {
           std::vector<int> factorial(n + 1, 1);
           for (int value = 1; value <= n; ++value) {
               factorial[value] = factorial[value - 1] * value;
           }

           std::vector<int> available;
           for (int value = 1; value <= n; ++value) {
               available.push_back(value);
           }

           int rank = k - 1;
           std::string result;
           result.reserve(n);

           for (int remaining = n; remaining >= 1; --remaining) {
               const int blockSize = factorial[remaining - 1];
               const int choice = rank / blockSize;
               rank %= blockSize;

               result.push_back(
                   static_cast<char>('0' + available[choice])
               );
               available.erase(available.begin() + choice);
           }
           return result;
       }

   public:
       std::string getPermutation(int n, int k) {
           return selectByFactorialBlocks(n, k);
       }
   };

题解
----

从定义出发：按字典序访问排列树
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的做法是从空前缀开始，每一层按数字从小到大选择一个尚未使用的数字。由于候选始终按升序尝试，搜索树
的叶子顺序就是排列的字典序。

``enumerateLexicographically`` 在到达一个叶子时把 ``k`` 减一；第一次减到 0 的叶子就是答案。它不需要
保存全部排列，也不需要事后排序，但最坏仍要访问接近 ``n!`` 个叶子。

真正的浪费不在于叶子如何生成，而在于搜索明知目标不在某个大子树中，仍逐个访问该子树的全部排列。

固定下一位后，子树大小为什么是阶乘
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设当前还有 ``remaining`` 个数字尚未使用。若把下一位固定为某个候选，剩余
``remaining - 1`` 个数字可以任意排列，因此该前缀下恰有：

.. code-block:: text

   (remaining - 1)!

个完整排列。

候选数字按升序排列，所以这些等大的子树也按字典序连续排列。例如 ``n = 4`` 时，首位分别为
1、2、3、4 的四个分块，每块都有 ``3! = 6`` 个排列。

这使问题从“逐个访问叶子”变成“目标位于第几个等大分块”。

为什么必须先把 k 减一
~~~~~~~~~~~~~~~~~~~~~~

题目中的 ``k`` 从 1 开始，而数组下标和分块编号从 0 开始。令：

.. code-block:: text

   rank = k - 1

则当前分块编号可以直接计算为：

.. code-block:: text

   choice = rank / blockSize
   rank   = rank % blockSize

``choice`` 表示应跳过多少个完整分块，也就是当前应选择可用数字数组中的第几个元素；余数 ``rank`` 是进入
该分块后的零基秩。

若不先减一，当 ``k`` 恰好是块大小的整数倍时，会被错误地分到下一块。例如每块大小为 6 时，第 6 个排列仍
属于第一个块，而 ``6 / 6 = 1`` 会错误选择第二块；改为零基秩后 ``5 / 6 = 0``，结果正确。

n = 5，k = 42 的逐位定位
~~~~~~~~~~~~~~~~~~~~~~~~

初始零基秩为 ``41``：

.. list-table::
   :header-rows: 1

   * - 可用数字
     - ``rank``
     - 每块大小
     - ``choice``
     - 选择结果
   * - ``[1,2,3,4,5]``
     - 41
     - ``4! = 24``
     - 1
     - 选择 2，块内秩 17
   * - ``[1,3,4,5]``
     - 17
     - ``3! = 6``
     - 2
     - 选择 4，块内秩 5
   * - ``[1,3,5]``
     - 5
     - ``2! = 2``
     - 2
     - 选择 5，块内秩 1
   * - ``[1,3]``
     - 1
     - ``1! = 1``
     - 1
     - 选择 3，块内秩 0
   * - ``[1]``
     - 0
     - ``0! = 1``
     - 0
     - 选择 1

依次得到 ``2、4、5、3、1``，答案为 ``"24531"``。

为什么选择下标始终合法
~~~~~~~~~~~~~~~~~~~~~~

一轮开始时，目标一定满足：

.. code-block:: text

   0 <= rank < remaining!

而 ``remaining! = remaining × (remaining - 1)!``，所以：

.. code-block:: text

   0 <= rank / (remaining - 1)! < remaining

因此 ``choice`` 一定落在当前候选数组的合法下标范围 ``0..remaining-1``。取余后又有：

.. code-block:: text

   0 <= rank < (remaining - 1)!

正好满足下一轮的不变量。

为什么删除已选数字
~~~~~~~~~~~~~~~~~~

排列要求每个数字只使用一次。当前位确定后，必须从 ``available`` 中删除该数字。

删除后剩余数字仍保持升序，因此下一轮的候选顺序仍与字典序分块顺序一致。若只做标记而不保持“第几个未使用
数字”的顺序，``choice`` 就不能直接作为数组下标使用。

为什么最终结果恰好是第 k 个排列
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每一轮都跳过 ``choice`` 个完整分块；这些分块中的排列全部严格早于目标。随后算法进入唯一包含目标秩的分块，
并把块内余数作为下一轮的新秩。

因此，已选前缀始终是包含原目标排列的唯一前缀。重复这一过程直到没有候选数字，得到的唯一叶子就是第
``k`` 个排列。

边界值如何自然处理
~~~~~~~~~~~~~~~~~~

``k = 1`` 时，``rank = 0``，每轮都选择最小可用数字，得到 ``123...n``。

``k = n!`` 时，零基秩为 ``n! - 1``，每轮都选择当前最大可用数字，得到 ``n...(2)(1)``。两种边界都无需
额外分支。

题目限制 ``n <= 9``，所以 ``9! = 362880`` 可以安全存入 ``int``，数字 1 到 9 也都能用单个字符表示。

复杂度来源
~~~~~~~~~~

按字典序回溯最坏需要访问 ``O(n!)`` 个排列，每个叶子长度为 ``n``。

阶乘分组只进行 ``n`` 轮选择，但 ``vector::erase`` 删除中间元素时需要移动后缀，单轮最坏 ``O(n)``，因此
总时间为 ``O(n²)``，候选数组和阶乘数组占用 ``O(n)`` 额外空间。

主入口调用 ``selectByFactorialBlocks``。在本题 ``n <= 9`` 的限制下，顺序数组比引入顺序统计树更直接。
