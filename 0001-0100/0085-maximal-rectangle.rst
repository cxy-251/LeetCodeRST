0085. Maximal Rectangle
=======================

题目信息
--------

:题号: 0085
:难度: Hard
:主题: 矩阵、动态柱高、单调栈
:原题: `LeetCode 0085 <https://leetcode.com/problems/maximal-rectangle/>`_
:重点: 从枚举上下边界，推导到逐行维护柱高，并在线性时间结算最大矩形

题目重述
--------

给定一个只包含字符 ``'0'`` 和 ``'1'`` 的二维矩阵 ``matrix``，寻找全部由 ``'1'`` 组成的最大轴对齐矩形，返回其面积。

矩形必须覆盖连续若干行和连续若干列。矩阵行数和列数均不超过 200。

自建示例
--------

.. code-block:: text

   输入：
   matrix = [["1","1","0","1"],
             ["1","1","1","1"],
             ["0","1","1","1"]]

   输出：6

最后两行的第 1 到第 3 列组成高 2、宽 3 的全 1 矩形。

.. code-block:: text

   输入：
   matrix = [["1","0","1"],
             ["1","1","1"],
             ["1","1","1"]]

   输出：6

后两行的三列全部为 1，形成高 2、宽 3 的矩形。

.. code-block:: text

   输入：matrix = [["0","0"],["0","0"]]
   输出：0

矩阵中没有可用格子，最大面积为 0。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumerateTopBottom(const std::vector<std::vector<char>>& matrix) {
           if (matrix.empty() || matrix[0].empty()) {
               return 0;
           }

           const int rows = static_cast<int>(matrix.size());
           const int cols = static_cast<int>(matrix[0].size());
           int best = 0;

           for (int top = 0; top < rows; ++top) {
               std::vector<char> valid(cols, true);

               for (int bottom = top; bottom < rows; ++bottom) {
                   int width = 0;

                   for (int col = 0; col < cols; ++col) {
                       valid[col] = valid[col] && matrix[bottom][col] == '1';
                       width = valid[col] ? width + 1 : 0;
                       int height = bottom - top + 1;
                       best = std::max(best, width * height);
                   }
               }
           }

           return best;
       }

       int dynamicBoundaries(const std::vector<std::vector<char>>& matrix) {
           if (matrix.empty() || matrix[0].empty()) {
               return 0;
           }

           const int cols = static_cast<int>(matrix[0].size());
           std::vector<int> heights(cols, 0);
           std::vector<int> left(cols, 0);
           std::vector<int> right(cols, cols);
           int best = 0;

           for (const auto& row : matrix) {
               int current_left = 0;

               for (int col = 0; col < cols; ++col) {
                   if (row[col] == '1') {
                       ++heights[col];
                       left[col] = std::max(left[col], current_left);
                   } else {
                       heights[col] = 0;
                       left[col] = 0;
                       current_left = col + 1;
                   }
               }

               int current_right = cols;

               for (int col = cols - 1; col >= 0; --col) {
                   if (row[col] == '1') {
                       right[col] = std::min(right[col], current_right);
                   } else {
                       right[col] = cols;
                       current_right = col;
                   }
               }

               for (int col = 0; col < cols; ++col) {
                   int width = right[col] - left[col];
                   best = std::max(best, heights[col] * width);
               }
           }

           return best;
       }

       int histogramArea(const std::vector<int>& heights) {
           std::vector<int> stack{-1};
           const int size = static_cast<int>(heights.size());
           int best = 0;

           for (int right = 0; right <= size; ++right) {
               int current_height = right == size ? 0 : heights[right];

               while (stack.back() != -1 &&
                      heights[stack.back()] > current_height) {
                   int middle = stack.back();
                   stack.pop_back();

                   int width = right - stack.back() - 1;
                   int area = heights[middle] * width;
                   best = std::max(best, area);
               }

               stack.push_back(right);
           }

           return best;
       }

       int rowHistograms(const std::vector<std::vector<char>>& matrix) {
           if (matrix.empty() || matrix[0].empty()) {
               return 0;
           }

           std::vector<int> heights(matrix[0].size(), 0);
           int best = 0;

           for (const auto& row : matrix) {
               for (int col = 0; col < static_cast<int>(row.size()); ++col) {
                   if (row[col] == '1') {
                       ++heights[col];
                   } else {
                       heights[col] = 0;
                   }
               }

               best = std::max(best, histogramArea(heights));
           }

           return best;
       }

   public:
       int maximalRectangle(std::vector<std::vector<char>>& matrix) {
           return rowHistograms(matrix);
       }
   };

题解
----

上下边界枚举
~~~~~~~~~~~~

最直接的做法是枚举矩形的上边界 ``top`` 和下边界 ``bottom``。对每一列维护 ``valid[col]``，表示这两行之间该列是否全部为 1。

固定上下边界后，问题只剩下寻找最长连续合法列。扫描列时维护当前连续宽度，即可得到以当前列为右边界的最大矩形。

同一组行之间的列状态能够增量更新，因此时间为 ``O(rows² * cols)``，空间为 ``O(cols)``。重复枚举不同上边界仍然较慢。

固定底边
~~~~~~~~

任意合法矩形都有唯一的底边行。处理当前行时，定义：

.. code-block:: text

   heights[col] = 以当前行为底，在该列向上连续出现 1 的数量

当前格为 1 时，高度在上一行基础上加一；当前格为 0 时，所有经过该格的矩形都被截断，高度清零。

.. list-table::
   :header-rows: 1

   * - 当前行
     - heights
     - 当前柱状图最大面积
   * - ``[1,1,0,1]``
     - ``[1,1,0,1]``
     - 2
   * - ``[1,1,1,1]``
     - ``[2,2,1,2]``
     - 4
   * - ``[0,1,1,1]``
     - ``[0,3,2,3]``
     - 6

此时，每一行都产生一个柱状图。以当前行为底的全 1 矩形，与该柱状图中的矩形一一对应。

左右边界维护
~~~~~~~~~~~~

``dynamicBoundaries`` 为每列同时维护高度、最远左边界和最远右边界。

从左向右扫描时，``current_left`` 是最近一个 0 的右侧位置；从右向左扫描时，``current_right`` 是最近一个 0 的位置。连续多行的边界需要取交集：

.. code-block:: text

   left[col]  = max(left[col], current_left)
   right[col] = min(right[col], current_right)

于是当前列作为限制高度时，可形成的面积为：

.. code-block:: text

   heights[col] * (right[col] - left[col])

每行执行三次线性扫描，总时间为 ``O(rows * cols)``。

柱状图单调栈
~~~~~~~~~~~~

另一条线性路线是直接复用柱状图最大矩形。栈中保存高度非递减的柱子下标。遇到更矮柱时，栈顶柱第一次获得完整右边界，可以立即结算。

弹出 ``middle`` 后：

.. code-block:: text

   right boundary = 当前下标 right
   left boundary  = 弹栈后的新栈顶
   width          = right - stack.top - 1

栈底的 ``-1`` 统一处理矩形延伸到最左侧的情况。遍历结束时使用虚拟高度 0，迫使仍在栈中的柱子全部结算。

矩形对应关系
~~~~~~~~~~~~

任意二维全 1 矩形在处理其底边时，覆盖列的高度都不小于矩形高度，因此一定会成为该行柱状图中的候选。

反过来，柱状图中高度 ``h``、宽度 ``w`` 的候选说明这些连续列向上至少 ``h`` 行都为 1，所以映射回矩阵后必然是合法矩形。

状态压缩
~~~~~~~~

下一行的柱高只依赖上一行同列柱高和当前字符，不需要保存所有历史行。二维纵向信息被压缩到一维 ``heights`` 中。

上下边界枚举需要 ``O(rows² * cols)`` 时间。左右边界方法和逐行单调栈方法都需要 ``O(rows * cols)`` 时间、``O(cols)`` 额外空间。