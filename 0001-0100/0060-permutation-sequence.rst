0060. Permutation Sequence
==========================

题目信息
--------

:题号: 0060. 第 k 个排列
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

排列树基线
~~~~~~~~~~

从空前缀开始，每一层按从小到大的顺序选择一个未使用数字。候选顺序固定为升序，因此搜索树叶子的访问顺序
就是排列的字典序。

``enumerateLexicographically`` 到达叶子时把剩余名次减一，第一次减到零的叶子就是答案。它不保存全部排列，
但目标若靠后，仍需访问接近 ``n!`` 个叶子。重复工作集中在整棵与目标无关的子树中。

阶乘分块
~~~~~~~~

当前还有 ``remaining`` 个数字时，固定下一位后，剩余 ``remaining - 1`` 个数字可以任意排列，所以每个候选
对应的子树大小都是：

.. code-block:: text

   blockSize = (remaining - 1)!

候选数字按升序排列，这些等大的子树也按字典序连续排列。于是无需逐个访问叶子，只需确定目标位于第几个
阶乘块，再进入该块继续定位。

零基秩
~~~~~~

题目名次从 1 开始，数组下标与块编号从 0 开始。先转换为：

.. code-block:: text

   rank = k - 1

当前位的选择与块内新秩为：

.. code-block:: text

   choice = rank / blockSize
   rank   = rank % blockSize

``choice`` 表示跳过多少个完整块，也就是当前选择 ``available[choice]``。先减一能够正确处理块边界；例如
块大小为 6 时，第 6 个排列的零基秩是 5，仍属于第 0 块。

阶乘秩选择不变量
~~~~~~~~~~~~~~~~

每轮开始时，保持以下状态：

.. code-block:: text

   available 按升序保存尚未使用的 remaining 个数字
   result 是目标排列已经确定的前缀
   0 <= rank < remaining!

因为：

.. code-block:: text

   remaining! = remaining * (remaining - 1)!

所以 ``choice = rank / blockSize`` 一定满足 ``0 <= choice < remaining``，能够安全索引当前候选数组。
选择该数字后，算法跳过 ``choice`` 个完整子树，并进入唯一包含目标的子树。

更新 ``rank %= blockSize`` 后，有：

.. code-block:: text

   0 <= rank < (remaining - 1)!

这正是下一轮需要的秩范围。已选数字从 ``available`` 中删除后，每个数字只会使用一次，剩余候选仍保持升序，
下一层的数组下标继续对应字典序块编号。

当 ``remaining`` 递减到零时，每轮都进入了唯一包含原目标的子树，最终留下的叶子恰好是第 ``k`` 个排列。

状态演化
~~~~~~~~

对 ``n = 5``、``k = 42``，初始零基秩为 ``41``：

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

两种方法的关系
~~~~~~~~~~~~~~

回溯法按字典序逐个访问排列树叶子。阶乘分块法使用每棵子树的精确叶子数，一次跳过整棵无关子树。
两者访问的是同一棵排列树，优化点只是把逐叶计数替换为按子树规模直接定位。

边界处理
~~~~~~~~

``k = 1`` 时，``rank = 0``，每轮都选择最小可用数字，得到 ``123...n``。

``k = n!`` 时，零基秩为 ``n! - 1``，每轮都选择最大可用数字，得到降序排列。

题目限制 ``n <= 9``，因此 ``9! = 362880`` 可以安全存入 ``int``，数字 1 到 9 也都能用单个字符表示。

复杂度分析
~~~~~~~~~~

按字典序回溯最坏需要访问 ``O(n!)`` 个排列，递归路径与辅助标记使用 ``O(n)`` 空间。

阶乘分组执行 ``n`` 轮选择。``vector::erase`` 删除中间元素时需要移动后缀，单轮最坏 ``O(n)``，总时间为
``O(n²)``；阶乘数组、候选数组与结果使用 ``O(n)`` 空间。主入口调用 ``selectByFactorialBlocks``。
