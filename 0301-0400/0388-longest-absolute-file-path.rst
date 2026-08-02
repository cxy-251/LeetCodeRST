0388. Longest Absolute File Path
================================

题目信息
--------

:题号: 0388
:难度: Medium
:主题: 文件系统文本、层级、绝对路径、最大字符长度
:原题: `LeetCode 0388 <https://leetcode.com/problems/longest-absolute-file-path/>`_
:重点: 换行分隔条目、前导制表符表示深度、名称含点视为文件、路径分隔符计入长度、没有文件返回 0

题目重述
--------

字符串 ``input`` 编码一个文件系统。不同文件或目录条目由换行符 ``\n`` 分隔；某条目开头连续的制表符 ``\t`` 数量表示它相对根层的深度。名称中包含点号 ``.`` 的条目视为文件，其余条目视为目录。

文件的绝对路径由从根目录到该文件的各级名称使用 ``/`` 连接。返回所有文件绝对路径中的最大字符长度，分隔符也计入长度；若表示中没有任何文件，返回 ``0``。``input`` 长度位于 ``[1, 10^4]``，每个文件或目录名称非空，输入保证层级表示有效。

自建示例
--------

最深文件形成最长路径：

.. code-block:: text

   输入：input = "root\n\tlogs\n\t\ta.txt\n\tdata\n\t\tarchive\n\t\t\tb.bin"
   输出：23
   解释：最长路径是 "root/data/archive/b.bin"，四段名称和三个斜杠共 23 个字符。

只有目录：

.. code-block:: text

   输入：input = "home\n\tdocs\n\timages"
   输出：0
   解释：没有任何名称包含点号，因此文件系统中没有文件路径可统计。

用每一层的累计路径长度压缩树结构
----------------------------------

逐行读取条目，前导制表符数量就是深度。维护 ``pathLength[depth]``，表示到该层条目父目录为止的路径长度；当前条目长度等于父路径长度加一个斜杠（若有父层）再加名称长度。目录只更新这一层的长度，文件则用当前累计长度更新答案，不再把文件作为后续目录父节点。

遇到更浅层条目时，覆盖对应深度的长度即可丢弃旧的兄弟分支；因为输入按先序层级排列，当前行的父目录信息总在数组中。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int lengthLongestPath(std::string input) {
           std::vector<int> pathLength(1, 0);
           int answer = 0;
           int start = 0;
           while (start < static_cast<int>(input.size())) {
               int end = input.find('\n', start);
               if (end == static_cast<int>(std::string::npos)) {
                   end = static_cast<int>(input.size());
               }

               int depth = 0;
               while (start + depth < end
                      && input[start + depth] == '\t') {
                   ++depth;
               }
               std::string name = input.substr(
                   start + depth, end - start - depth);
               int currentLength = pathLength[depth]
                                  + (depth == 0 ? 0 : 1)
                                  + static_cast<int>(name.size());
               if (name.find('.') != std::string::npos) {
                   answer = std::max(answer, currentLength);
               } else {
                   if (pathLength.size() <= depth + 1) {
                       pathLength.resize(depth + 2);
                   }
                   pathLength[depth + 1] = currentLength;
               }
               start = end + 1;
           }
           return answer;
       }
   };

代码分析
--------

``pathLength[depth]`` 始终是当前条目的父路径长度，斜杠只在有父目录时计入；文件名中的点号直接决定是否更新答案。每个字符被扫描和切分有限次，时间复杂度为 ``O(|input|)``，额外空间为 ``O(h)``，``h`` 为层级深度。
