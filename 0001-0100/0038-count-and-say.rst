0038. Count and Say
===================

题目信息
--------

:题号: 0038
:难度: Medium
:主题: 字符串、游程编码、递推
:原题: `LeetCode 0038 <https://leetcode.com/problems/count-and-say/>`_
:重点: 从保存完整序列，推导到按最大连续段生成下一项，并只保留当前字符串

题目重述
--------

定义字符串序列 ``countAndSay``：

* 第 ``1`` 项为 ``"1"``；
* 第 ``n`` 项通过从左到右描述第 ``n-1`` 项得到。

描述一个字符串时，把相邻且相同的字符划分为最大连续段。对于每一段，依次写出“该段的字符数量”和“该字符”。
给定整数 ``n``，返回序列的第 ``n`` 项。

这里处理的是字符串而不是整数运算。例如 ``"21"`` 表示“一个 ``2``、一个 ``1``”，因此下一项为
``"1211"``。``n`` 位于 ``[1, 30]``。

自建示例
--------

* ``n = 1`` 时返回 ``"1"``，这是序列定义给出的初始项；
* ``n = 4`` 时返回 ``"1211"``，因为第三项 ``"21"`` 包含一个 ``2`` 和一个 ``1``；
* ``n = 6`` 时返回 ``"312211"``，因为第五项 ``"111221"`` 被划分为 ``"111"``、``"22"``、
  ``"1"``，分别描述为 ``"31"``、``"22"``、``"11"``；
* 描述 ``"1211"`` 时，开头的 ``'1'`` 与末尾两个 ``'1'`` 不能合并，中间的 ``'2'`` 将它们分成
  不同连续段。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string describe(const std::string& current) {
           std::string next;
           next.reserve(current.size() * 2);

           int start = 0;
           while (start < static_cast<int>(current.size())) {
               int end = start + 1;
               while (end < static_cast<int>(current.size()) &&
                      current[end] == current[start]) {
                   ++end;
               }

               next += std::to_string(end - start);
               next.push_back(current[start]);
               start = end;
           }
           return next;
       }

       std::string buildWholeSequence(int n) {
           std::vector<std::string> sequence(n);
           sequence[0] = "1";
           for (int index = 1; index < n; ++index) {
               sequence[index] = describe(sequence[index - 1]);
           }
           return sequence.back();
       }

       std::string rollingGeneration(int n) {
           std::string current = "1";
           for (int index = 2; index <= n; ++index) {
               current = describe(current);
           }
           return current;
       }

   public:
       std::string countAndSay(int n) {
           return rollingGeneration(n);
       }
   };

题解
----

完整序列基线
~~~~~~~~~~~~

按照定义，可以保存从第一项到第 ``n`` 项的全部字符串：

.. code-block:: text

   sequence[0] = "1"
   sequence[i] = describe(sequence[i - 1])

``buildWholeSequence`` 直接实现这条递推，因此不会跳过任何中间项。它的问题在于，第 ``i`` 项生成完成后，后续只会
读取这一项；更早的字符串已经失去用途，继续保存它们只是额外空间开销。

描述操作的局部性
~~~~~~~~~~~~~~~~

下一项并不统计整个字符串中每种字符的总数，而是依次描述最大连续相同字符段。例如：

.. code-block:: text

   "1211" = "1" | "2" | "11"

三段分别生成 ``"11"``、``"12"`` 和 ``"21"``，合并得到 ``"111221"``。开头与末尾的 ``'1'``
虽然字符相同，却被 ``'2'`` 分隔，不能合并计数。

这说明生成下一项只需从左到右确定连续段的边界，无需建立全局字符频次表，也无需回看已经描述的部分。

最大连续段
~~~~~~~~~~

令 ``start`` 指向尚未处理部分的首字符，``end`` 从 ``start + 1`` 开始向右移动。只要
``current[end] == current[start]``，当前字符仍属于同一段；遇到不同字符或到达末尾时停止。

停止后，半开区间 ``[start, end)`` 满足：

* 区间内字符全部等于 ``current[start]``；
* 区间长度为 ``end - start``；
* ``end`` 已越界，或 ``current[end]`` 与段字符不同。

因此它正是从 ``start`` 开始的最大连续段。把 ``end - start`` 和段字符写入 ``next`` 后，令
``start = end``，下一轮从第一个未处理字符继续。

每轮至少处理一个字符，且新区间从上一段末尾开始，所以所有字符恰好被覆盖一次。每一段的结束位置又由第一个不同
字符唯一决定，因此生成结果也唯一。

单轮生成不变量
~~~~~~~~~~~~~~

每轮开始时保持：

* ``current[0..start-1]`` 已被完整描述；
* ``next`` 恰好等于这段已处理前缀的描述结果；
* ``current[start..]`` 尚未处理。

找到 ``[start, end)`` 后，追加该段的数量和字符，便得到前缀 ``current[0..end-1]`` 的完整描述；再令
``start = end``，不变量继续成立。

当 ``start == current.size()`` 时，整个输入都已按顺序分段并描述，``next`` 就是唯一的下一项。使用
``std::to_string(end - start)``，而不是假设段长度只有一位，也使 ``describe`` 对任意连续段长度都成立。

状态演化
~~~~~~~~

描述 ``"111221"`` 时，各轮状态为：

.. list-table::
   :header-rows: 1

   * - ``start``
     - ``end``
     - 连续段
     - 写入片段
     - 累计结果
   * - 0
     - 3
     - ``"111"``
     - ``"31"``
     - ``"31"``
   * - 3
     - 5
     - ``"22"``
     - ``"22"``
     - ``"3122"``
   * - 5
     - 6
     - ``"1"``
     - ``"11"``
     - ``"312211"``

滚动递推
~~~~~~~~

序列只有一阶依赖：

.. math::

   term_i = describe(term_{i-1})

生成新字符串后，旧项不再参与后续计算。因此 ``rollingGeneration`` 只维护 ``current``，每轮用
``describe(current)`` 的结果替换它。

第 ``i`` 轮开始时，``current`` 与完整序列方法中的第 ``i-1`` 项相同；应用同一个 ``describe`` 后，新值便等于
第 ``i`` 项。逐轮保持这一关系，最终返回的正是第 ``n`` 项。

``n = 1`` 时循环不会执行，直接返回初始项 ``"1"``。单字符输入和末尾连续段都由 ``end`` 的越界条件正常结束，
无需额外哨兵。

方法演进
~~~~~~~~

``buildWholeSequence`` 保存全部历史项，完整体现递推定义，但保留了后续不再使用的字符串。

``describe`` 把一轮转换缩减为最大连续段扫描，每个输入字符只属于一个分组。``rollingGeneration`` 再利用一阶依赖，
删除历史数组，只保留当前项和正在构造的下一项。公开入口采用该滚动方法。

复杂度分析
~~~~~~~~~~

设第 ``i`` 项长度为 ``L_i``。生成第 ``i+1`` 项时，需要读取 ``L_i`` 个字符，并写出长度为 ``L_{i+1}`` 的结果，
因此生成第 ``n`` 项的总时间为：

.. math::

   O\left(\sum_{i=1}^{n-1}(L_i+L_{i+1})\right)
   = O\left(\sum_{i=1}^{n}L_i\right)

``buildWholeSequence`` 保存全部项，额外空间为 ``O(\sum L_i)``。滚动方法在一轮转换中只同时持有当前项与下一项，
工作空间为 ``O(L_{n-1}+L_n)``，与最大单项长度同阶。
