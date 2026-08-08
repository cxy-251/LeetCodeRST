0048. Rotate Image
==================

题目信息
--------

:题号: 0048. 旋转图像
:难度: Medium
:主题: 矩阵、坐标映射、原地置换
:原题: `LeetCode 0048 <https://leetcode.com/problems/rotate-image/>`_
:重点: 从额外矩阵按目标坐标写入，推导到四元环轮换与转置后水平翻转

题目重述
--------

给定一个 ``n x n`` 整数方阵 ``matrix``，把整幅图像顺时针旋转 ``90`` 度。

必须直接修改原矩阵，不能再分配另一个 ``n x n`` 矩阵保存旋转结果。

自建示例
--------

.. code-block:: text

   输入：
   [1, 2, 3, 4]
   [5, 6, 7, 8]
   [9,10,11,12]
   [13,14,15,16]

   修改后：
   [13, 9, 5,1]
   [14,10, 6,2]
   [15,11, 7,3]
   [16,12, 8,4]

原矩阵第一列从下到上成为结果第一行，第二列从下到上成为结果第二行。

边界情况：

* ``[[7]]`` 旋转后仍为 ``[[7]]``；
* ``[[1,2],[3,4]]`` 旋转后为 ``[[3,1],[4,2]]``；
* 奇数阶矩阵的中心元素不移动。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void copyByCoordinateMapping(std::vector<std::vector<int>>& matrix) {
           const int n = static_cast<int>(matrix.size());
           std::vector<std::vector<int>> rotated(n, std::vector<int>(n));

           for (int row = 0; row < n; ++row) {
               for (int col = 0; col < n; ++col) {
                   rotated[col][n - 1 - row] = matrix[row][col];
               }
           }
           matrix = std::move(rotated);
       }

       void rotateFourWayCycles(std::vector<std::vector<int>>& matrix) {
           const int n = static_cast<int>(matrix.size());

           for (int layer = 0; layer < n / 2; ++layer) {
               const int last = n - 1 - layer;
               for (int offset = 0; offset < last - layer; ++offset) {
                   const int top = matrix[layer][layer + offset];

                   matrix[layer][layer + offset] =
                       matrix[last - offset][layer];
                   matrix[last - offset][layer] =
                       matrix[last][last - offset];
                   matrix[last][last - offset] =
                       matrix[layer + offset][last];
                   matrix[layer + offset][last] = top;
               }
           }
       }

       void transposeThenReverseRows(std::vector<std::vector<int>>& matrix) {
           const int n = static_cast<int>(matrix.size());

           for (int row = 0; row < n; ++row) {
               for (int col = row + 1; col < n; ++col) {
                   std::swap(matrix[row][col], matrix[col][row]);
               }
           }

           for (auto& row : matrix) {
               std::reverse(row.begin(), row.end());
           }
       }

   public:
       void rotate(std::vector<std::vector<int>>& matrix) {
           transposeThenReverseRows(matrix);
       }
   };

题解
----

目标坐标映射
~~~~~~~~~~~~

设原坐标为 ``(row, col)``。顺时针旋转后，原列号成为新行号，原行号从上到下的顺序变为新列从右到左的顺序：

.. math::

   (row,col) \longrightarrow (col,n-1-row)

``copyByCoordinateMapping`` 按这个公式把每个元素写入新矩阵。映射中的两个坐标都唯一确定，因此每个原位置恰好进入
一个目标位置，不同原位置也不会冲突。该方法直接实现定义，时间为 ``O(n^2)``，问题是额外矩阵占用
``O(n^2)`` 空间。

原地写入不能逐格执行同一赋值。目标位置可能仍保存着尚未搬走的旧值，单向覆盖会破坏后续读取。需要把坐标置换中的
整组相关位置同时轮换，或把目标映射分解成只使用交换的简单变换。

四元环轮换
~~~~~~~~~~

连续四次应用旋转映射会回到起点：

.. code-block:: text

   (row, col)
       -> (col, n-1-row)
       -> (n-1-row, n-1-col)
       -> (n-1-col, row)
       -> (row, col)

除奇数阶矩阵中心点外，每个位置都属于一个长度为四的环。对于第 ``layer`` 层上边的一点，四个位置为：

.. code-block:: text

   top    = (layer,          layer + offset)
   right  = (layer + offset, last)
   bottom = (last,           last - offset)
   left   = (last - offset,  layer)

顺时针旋转要求 ``left -> top -> right -> bottom -> left``。保存 ``top`` 的旧值后依次赋值，四个元素便能在不丢失
数据的情况下完成一次轮换。

四元环不变量
~~~~~~~~~~~~

进入第 ``layer`` 层时，外侧各层已经完成旋转，当前层及其内侧仍保持原始相对关系。只把当前层上边的前
``last - layer`` 个位置作为环代表：

.. code-block:: text

   offset = 0, 1, ..., last - layer - 1

右上角不再单独作为代表，因为它已经属于 ``offset = 0`` 的环。当前层的每个非角点和角点都恰好出现在一个四元环
中；轮换结束后，整层满足目标坐标映射，内层未被修改。

外层循环只处理 ``n / 2`` 层。偶数阶矩阵的所有位置都落入某一层，奇数阶矩阵中心点单独形成长度为一的环，旋转后
仍在原处。由此所有元素恰好移动一次。

复合变换
~~~~~~~~

另一种原地路线是把旋转拆成两个简单置换。

沿主对角线转置：

.. code-block:: text

   (row, col) -> (col, row)

再水平翻转每一行：

.. code-block:: text

   (col, row) -> (col, n - 1 - row)

两步复合后正好得到顺时针旋转坐标：

.. code-block:: text

   (row, col) -> (col, n - 1 - row)

对三阶矩阵：

.. code-block:: text

   原矩阵          主对角线转置后     每行反转后
   1 2 3           1 4 7              7 4 1
   4 5 6     ->    2 5 8       ->     8 5 2
   7 8 9           3 6 9              9 6 3

复合变换不变量
~~~~~~~~~~~~~~

转置阶段只遍历 ``col > row`` 的位置，并交换 ``matrix[row][col]`` 与 ``matrix[col][row]``。主对角线元素无需移动，
每对非对角线元素只交换一次；若遍历整个矩阵，同一对位置会被交换两次而恢复原状。

行翻转阶段在每一行内对称交换左右元素。两个阶段都只由两两交换组成，不会覆盖尚未保存的旧值；它们也都是矩阵位置
上的双射，不会遗漏或复制元素。复合坐标已经等于目标映射，因此最终矩阵就是顺时针旋转结果。

代码演进
~~~~~~~~

``copyByCoordinateMapping`` 直接按目标坐标写入新矩阵，建立最清晰的正确基线。

``rotateFourWayCycles`` 把旋转置换拆成互不重叠的四元环，每个环只用一个临时变量原地轮换。

``transposeThenReverseRows`` 将同一坐标映射分解为转置和行翻转，代码更短，公开入口采用该方法。

复杂度分析
~~~~~~~~~~

矩阵共有 ``n^2`` 个元素，三种方法都需要处理同阶数量的位置，时间复杂度均为 ``O(n^2)``。

额外矩阵方法使用 ``O(n^2)`` 空间。四元环和转置加行翻转只使用少量临时变量，额外空间为 ``O(1)``。
