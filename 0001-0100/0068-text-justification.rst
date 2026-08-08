0068. Text Justification
========================

题目信息
--------

:题号: 0068. 文本左右对齐
:难度: Hard
:主题: 字符串、贪心、文本排版、商余分配
:原题: `LeetCode 0068 <https://leetcode.com/problems/text-justification/>`_
:重点: 从逐个试放单词，推导到唯一行边界与商余空格分配

题目重述
--------

给定按顺序排列的单词数组 ``words`` 和正整数 ``maxWidth``，把所有单词排成若干行并返回结果。
每行字符串长度必须恰好为 ``maxWidth``，单词顺序不能改变，并且每行必须尽可能容纳更多单词。

除最后一行外，普通行需要两端对齐：

* 空格只放在相邻单词之间；
* 各间隔的空格数应尽量相等；
* 无法均分时，左侧间隔比右侧间隔多一个空格。

最后一行使用单个空格分隔单词，剩余空格全部补在末尾。若普通行只有一个单词，也把该单词放在
行首并在末尾补空格。

约束条件：

* ``1 <= words.length <= 300``；
* ``1 <= words[i].length <= 20``；
* ``words[i]`` 只包含英文字母和符号；
* ``1 <= maxWidth <= 100``；
* 每个单词的长度都不超过 ``maxWidth``。

自建示例
--------

.. code-block:: text

   输入：words = ["a", "bb", "ccc", "dddd"], maxWidth = 11
   输出：["a   bb  ccc", "dddd       "]

第一行的单词字符总数为 6，需要分配 5 个空格。两个间隔分别得到 3 个和 2 个空格；最后一行
左对齐并在末尾补空格。

.. code-block:: text

   输入：words = ["one", "two", "three"], maxWidth = 7
   输出：["one two", "three  "]

前两个单词连同一个最小间隔恰好占满第一行。最后一个单词独占末行，右侧补两个空格。

.. code-block:: text

   输入：words = ["abcdefgh", "i", "j"], maxWidth = 8
   输出：["abcdefgh", "i j     "]

第一个单词已经占满整行。末行使用单个空格连接 ``i`` 和 ``j``，其余位置补空格。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string formatLine(
           const std::vector<std::string>& words,
           int start,
           int end,
           int letters,
           int width,
           bool isLast
       ) {
           const int count = end - start;
           std::string line;
           line.reserve(width);

           if (isLast || count == 1) {
               for (int index = start; index < end; ++index) {
                   if (index > start) {
                       line.push_back(' ');
                   }
                   line += words[index];
               }
               line.append(width - static_cast<int>(line.size()), ' ');
               return line;
           }

           const int gaps = count - 1;
           const int totalSpaces = width - letters;
           const int baseSpaces = totalSpaces / gaps;
           const int extraSpaces = totalSpaces % gaps;

           for (int index = start; index < end; ++index) {
               line += words[index];
               if (index + 1 < end) {
                   const int gapIndex = index - start;
                   const int spaces = baseSpaces +
                                      (gapIndex < extraSpaces ? 1 : 0);
                   line.append(spaces, ' ');
               }
           }
           return line;
       }

       std::vector<std::string> groupThenFormat(
           const std::vector<std::string>& words,
           int width
       ) {
           std::vector<std::vector<std::string>> groups;
           std::vector<std::string> current;
           int letters = 0;

           for (const std::string& word : words) {
               const int minimumLength = letters +
                                         static_cast<int>(current.size()) +
                                         static_cast<int>(word.size());
               if (!current.empty() && minimumLength > width) {
                   groups.push_back(current);
                   current.clear();
                   letters = 0;
               }

               current.push_back(word);
               letters += static_cast<int>(word.size());
           }
           groups.push_back(current);

           std::vector<std::string> result;
           result.reserve(groups.size());

           for (int lineIndex = 0;
                lineIndex < static_cast<int>(groups.size());
                ++lineIndex) {
               int groupLetters = 0;
               for (const std::string& word : groups[lineIndex]) {
                   groupLetters += static_cast<int>(word.size());
               }

               const bool isLast =
                   lineIndex + 1 == static_cast<int>(groups.size());
               result.push_back(formatLine(
                   groups[lineIndex],
                   0,
                   static_cast<int>(groups[lineIndex].size()),
                   groupLetters,
                   width,
                   isLast
               ));
           }
           return result;
       }

       std::vector<std::string> greedyWithFormatter(
           const std::vector<std::string>& words,
           int width
       ) {
           std::vector<std::string> result;
           int start = 0;

           while (start < static_cast<int>(words.size())) {
               int end = start;
               int letters = 0;

               while (end < static_cast<int>(words.size())) {
                   const int minimumLength = letters +
                                             static_cast<int>(words[end].size()) +
                                             (end - start);
                   if (minimumLength > width) {
                       break;
                   }
                   letters += static_cast<int>(words[end].size());
                   ++end;
               }

               result.push_back(formatLine(
                   words,
                   start,
                   end,
                   letters,
                   width,
                   end == static_cast<int>(words.size())
               ));
               start = end;
           }
           return result;
       }

   public:
       std::vector<std::string> fullJustify(
           std::vector<std::string>& words,
           int maxWidth
       ) {
           return greedyWithFormatter(words, maxWidth);
       }
   };

题解
----

行边界搜索
~~~~~~~~~~

处理一行时，先只决定这一行包含哪些连续单词，不立即构造空格。设当前行候选区间为
``[start, end)``，其中单词字符总数为 ``letters``。

准备加入 ``words[end]`` 时，原有 ``end - start`` 个单词与新单词之间至少需要
``end - start`` 个单空格，因此加入后的最小长度为：

.. code-block:: text

   letters + words[end].length + (end - start)

该值不超过 ``maxWidth`` 时，新单词可以进入当前行；首次超过宽度时，当前 ``end`` 就是唯一合法行尾。

最大装行不变量
~~~~~~~~~~~~~~

内层循环结束时，区间 ``[start, end)`` 满足两个条件：

* 区间内全部单词使用最少间隔时能够放入当前行；
* 若仍有下一个单词，把它加入后即使每个间隔只放一个空格也会超宽。

题目要求保持顺序并尽可能多装单词。仍可容纳时提前换行会违反要求；最少间隔已经超宽时，增加或重新分配
空格也无法容纳下一个单词。因此该贪心条件直接确定每一行的边界。

普通行空格分配
~~~~~~~~~~~~~~

普通行包含 ``count`` 个单词，共有 ``gaps = count - 1`` 个间隔。单词字符总数为 ``letters``，所以必须分配：

.. code-block:: text

   totalSpaces = maxWidth - letters

对总空格数做商余分解：

.. code-block:: text

   baseSpaces  = totalSpaces / gaps
   extraSpaces = totalSpaces % gaps

每个间隔先获得 ``baseSpaces`` 个空格，最左侧的 ``extraSpaces`` 个间隔再各获得一个。这样所有间隔
只可能相差一个空格，并且较多的空格全部位于左侧。

商余分配不变量
~~~~~~~~~~~~~~

以 ``a, bb, ccc`` 和宽度 11 为例：

.. list-table::
   :header-rows: 1

   * - 项目
     - 数值
   * - 单词字符数
     - ``1 + 2 + 3 = 6``
   * - 空格总数
     - ``11 - 6 = 5``
   * - 间隔数
     - 2
   * - 商与余数
     - ``baseSpaces = 2``、``extraSpaces = 1``
   * - 最终间隔
     - 3 个空格、2 个空格

因为 ``totalSpaces = baseSpaces * gaps + extraSpaces``，全部空格都会被使用且不会重复。前
``extraSpaces`` 个间隔多放一个空格，正好实现左侧优先。

末行与独占行
~~~~~~~~~~~~

最后一行不参与商余分配。它先用单个空格连接单词，再把剩余空格全部补到末尾。

只有一个单词的普通行也采用相同格式。此时 ``gaps`` 为 0，没有可分配的单词间隔；把单词放在左侧并在
末尾补满，是满足固定宽度的唯一形式。统一处理这两类行也避免了除以零。

状态演化
~~~~~~~~

以 ``words = ["a", "bb", "ccc", "dddd"]``、``maxWidth = 11`` 为例：

.. list-table::
   :header-rows: 1

   * - 尝试加入
     - 最小长度
     - 结果
   * - ``a``
     - 1
     - 加入第一行
   * - ``bb``
     - ``1 + 2 + 1 = 4``
     - 加入第一行
   * - ``ccc``
     - ``3 + 3 + 2 = 8``
     - 加入第一行
   * - ``dddd``
     - ``6 + 4 + 3 = 13``
     - 超宽，结束第一行

第一行随后把 5 个空格分成 3 和 2，得到 ``"a   bb  ccc"``。第二行是末行，生成
``"dddd       "``。

两种组织方式
~~~~~~~~~~~~

``groupThenFormat`` 先把所有行保存为二维单词数组，再逐行计算字符数和格式。这一版把分组与输出完全分开，
便于直接观察每行的单词集合，但会复制全部单词并保存中间分组。

``greedyWithFormatter`` 只维护当前行的起止下标和字符数。行边界确定后立即调用 ``formatLine``，不保存全部
中间分组。公开入口采用这一版，因为它保留相同的贪心逻辑，同时减少中间状态。

复杂度分析
~~~~~~~~~~

设全部单词字符数为 ``C``，输出行数为 ``L``。主方法每个单词在选行和格式化阶段各访问常数次，并写出
``L * maxWidth`` 个输出字符，因此时间复杂度为 ``O(C + L * maxWidth)``。

返回结果本身需要 ``O(L * maxWidth)`` 空间。除返回结果和当前正在构造的一行外，主方法只维护常数个下标与
计数，额外工作空间为 ``O(maxWidth)``。先分组方案还需要复制全部单词，额外空间为 ``O(C)``。

边界处理
~~~~~~~~

* 单个单词长度恰好等于 ``maxWidth`` 时，该行不需要补空格；
* 普通行只有一个单词时，直接在右侧补满，避免 ``gaps = 0`` 的除法；
* 最后一行始终使用单空格连接，不执行两端对齐；
* 下一单词无法放入当前行时，当前行至少已有一个单词，因为每个单词长度都不超过 ``maxWidth``；
* 普通行写入的字符数为 ``letters + totalSpaces``，左对齐行补到 ``maxWidth``，所有输出行长度均精确。
