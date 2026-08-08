0006. Zigzag Conversion
=======================

题目信息
--------

:题号: 0006. Z 字形变换
:难度: Medium
:主题: 字符串、模拟、周期、索引映射
:原题: `LeetCode 0006 <https://leetcode.com/problems/zigzag-conversion/>`_
:重点: 从往返行轨迹提取周期，再按最终行序直接访问原字符串，删除中间行缓冲区

题目重述
--------

给定字符串 ``s`` 和正整数 ``numRows``，依次把字符写入若干行：先从第 0 行向下移动到最后一行，再沿斜线向上移动回第 0 行，如此反复。完成排列后，按照从上到下、每行从左到右的顺序连接所有字符并返回。

排版中的空白位置不属于结果，每个输入字符必须恰好出现一次。字符串长度和 ``numRows`` 均位于 ``[1, 1000]``；字符串只包含英文字母、逗号和句点。

自建示例
--------

* 三行经典排列：``s = "PAYPALISHIRING"``、``numRows = 3``，各行为 ``"PAHN"``、``"APLSIIG"``、``"YIR"``，返回 ``"PAHNAPLSIIGYIR"``；
* 四行未完整周期：``s = "ABCDEFGHIJK"``、``numRows = 4``，各行为 ``"AG"``、``"BFH"``、``"CEIK"``、``"DJ"``，返回 ``"AGBFHCEIKDJ"``；
* 两行排列：``s = "ABCDE"``、``numRows = 2``，行号交替为 ``0, 1, 0, 1, 0``，返回 ``"ACEBD"``；
* 单行退化：``s = "CODE"``、``numRows = 1``，返回 ``"CODE"``；
* 行数不少于字符数：``s = "HI"``、``numRows = 5``，返回 ``"HI"``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string simulatePath(const std::string& s, int numRows) {
           if (numRows == 1 || numRows >= static_cast<int>(s.size())) {
               return s;
           }
           std::vector<std::string> rows(numRows);
           int row = 0;
           int direction = 1;
           for (char ch : s) {
               rows[row].push_back(ch);
               if (row == 0) {
                   direction = 1;
               } else if (row == numRows - 1) {
                   direction = -1;
               }
               row += direction;
           }
           std::string result;
           result.reserve(s.size());
           for (const std::string& current : rows) {
               result += current;
           }
           return result;
       }

       std::string groupByCycle(const std::string& s, int numRows) {
           const int length = static_cast<int>(s.size());
           if (numRows == 1 || numRows >= length) {
               return s;
           }
           const int cycle = 2 * numRows - 2;
           std::vector<std::string> rows(numRows);
           for (int index = 0; index < length; ++index) {
               const int offset = index % cycle;
               const int row = offset < numRows ? offset : cycle - offset;
               rows[row].push_back(s[index]);
           }
           std::string result;
           result.reserve(s.size());
           for (const std::string& current : rows) {
               result += current;
           }
           return result;
       }

       std::string readByCycle(const std::string& s, int numRows) {
           const int length = static_cast<int>(s.size());
           if (numRows == 1 || numRows >= length) {
               return s;
           }
           const int cycle = 2 * numRows - 2;
           std::string result;
           result.reserve(s.size());
           for (int row = 0; row < numRows; ++row) {
               for (int vertical = row; vertical < length; vertical += cycle) {
                   result.push_back(s[vertical]);
                   const int diagonal = vertical + cycle - 2 * row;
                   if (row > 0 && row < numRows - 1 && diagonal < length) {
                       result.push_back(s[diagonal]);
                   }
               }
           }
           return result;
       }

   public:
       std::string convert(std::string s, int numRows) {
           return readByCycle(s, numRows);
       }
   };

题解
----

路径模拟
~~~~~~~~

最直接的做法不需要创建带空格的二维图形，只要为每一行保存一个字符串。扫描输入时维护当前行 ``row`` 和移动方向 ``direction``：向下时为 ``1``，向上时为 ``-1``。

字符写入当前行后，只有两个转向点需要处理：到达第 0 行后只能向下，到达最后一行后只能向上。于是行号依次变化为：

``0, 1, 2, ..., numRows - 1, numRows - 2, ..., 1, 0, ...``

``simulatePath`` 直接复现这条轨迹，每个字符只写入一个行缓冲区。最后连接全部行即可得到答案。这一版已经把二维排版压缩为“字符属于哪一行”，但仍需保存所有中间行，并维护会在端点翻转的方向状态。

周期行号
~~~~~~~~

往返轨迹会重复。设行数为 ``r``，从第 0 行到第 ``r - 1`` 行需要 ``r - 1`` 次移动，再回到第 0 行还需要 ``r - 1`` 次，因此一个完整周期包含：

.. math::

   cycle = 2r - 2

个字符位置。

对于输入下标 ``index``，令 ``offset = index % cycle``。周期的前 ``r`` 个位置属于下降阶段，行号与偏移相同；其余位置属于上升阶段，行号关于周期末端对称：

.. math::

   row =
   \begin{cases}
   offset, & offset < r \\
   cycle - offset, & offset \ge r
   \end{cases}

例如 ``r = 4`` 时，周期偏移 ``0, 1, 2, 3, 4, 5`` 对应行号 ``0, 1, 2, 3, 2, 1``。

``groupByCycle`` 用这个公式替换 ``row`` 和 ``direction`` 的逐步更新。方向翻转、端点判断和行号累加全部消失，每个字符可以直接计算所属行。不过代码仍然需要 ``rows`` 保存分组结果，最终再连接一次。

按行读取
~~~~~~~~

题目最终需要的是“先读第 0 行，再读第 1 行”，因此还可以跳过字符分组，直接计算每一行在原字符串中的下标。

固定一行 ``row``。每个周期的下降阶段都会在该行出现一次，对应下标为：

.. math::

   vertical = row + k \cdot cycle

其中 ``k = 0, 1, 2, ...``。这些是代码中的 ``vertical`` 位置。

第一行和最后一行在每个周期中只出现一次。中间行还会在上升阶段出现一次，其周期内偏移为 ``cycle - row``。由当前下降位置可得：

.. math::

   diagonal = vertical + cycle - 2 \cdot row

因此中间行的读取顺序是 ``vertical``、``diagonal``、下一个周期的 ``vertical``。对于 ``0 < row < numRows - 1``：

.. math::

   vertical_k < diagonal_k < vertical_{k+1}

所以这正是该行从左到右的字符顺序。第一行和最后一行跳过 ``diagonal``，避免把下一周期位置或当前竖列位置重复加入。

索引推演
~~~~~~~~

以 ``s = "ABCDEFGHIJK"``、``numRows = 4`` 为例，``cycle = 6``：

* 第 0 行读取下标 ``0, 6``，得到 ``AG``；
* 第 1 行读取下标 ``1, 5, 7``，得到 ``BFH``；
* 第 2 行读取下标 ``2, 4, 8, 10``，得到 ``CEIK``；
* 第 3 行读取下标 ``3, 9``，得到 ``DJ``。

连接各行得到 ``AGBFHCEIKDJ``。最后一个周期不完整时，``vertical < length`` 和 ``diagonal < length`` 会自然忽略越界位置。

任意输入下标都能唯一写成 ``k * cycle + offset``。下降阶段位置由某一行的 ``vertical`` 公式读取，上升阶段位置由某一中间行的 ``diagonal`` 公式读取；两个转向点只属于第一行或最后一行。于是每个字符都被覆盖，并且不会重复。

代码演进
~~~~~~~~

``simulatePath`` 按输入顺序逐字符移动，保存 ``row``、``direction`` 和全部行缓冲区。它直接对应题目描述，但方向变化属于运行时状态。

``groupByCycle`` 发现行号序列具有固定周期，用 ``index % cycle`` 直接计算行号。方向状态、端点翻转和逐步移动被删除，仍保留行缓冲区以完成最终重排。

``readByCycle`` 进一步从“每个字符属于哪一行”改为“每一行包含哪些原始下标”。``rows``、逐字符行号计算和最后的行连接全部消失，代码直接按答案顺序向 ``result`` 追加字符。

三种实现时间复杂度相同，优化重点不是减少字符访问次数，而是逐步删除中间状态和临时存储。公开入口采用 ``readByCycle``。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要状态
   * - 方向模拟
     - ``O(n)``
     - ``O(n)``
     - 当前行、方向、行缓冲区
   * - 周期分组
     - ``O(n)``
     - ``O(n)``
     - 周期偏移、行缓冲区
   * - 周期直读
     - ``O(n)``
     - ``O(1)``
     - 当前行、竖列和斜线下标

三种方法都恰好处理 ``n`` 个输入字符。空间复杂度不计返回字符串：前两种方法的各行合计保存 ``n`` 个字符，周期直读只维护常数个整数。

边界处理
~~~~~~~~

* ``numRows = 1`` 时周期公式会得到 ``0``，必须在计算周期前直接返回原字符串；
* ``numRows >= s.size()`` 时每个字符至多占一行，按行读取顺序与输入顺序相同；
* ``numRows = 2`` 时没有中间行，算法只读取竖列位置，不会追加斜线字符；
* 最后一个周期可以不完整，所有候选下标都经过长度检查；
* 返回结果预留 ``s.size()`` 容量，避免追加字符时反复扩容。
