0048. Rotate Image
==================

题目信息
--------

:题号: 0048
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

先写出每个元素的目标坐标
~~~~~~~~~~~~~~~~~~~~~~~~

设原坐标为 ``(row, col)``。顺时针旋转后：

.. code-block:: text

   新行 = col
   新列 = n - 1 - row

所以完整映射为：

.. math::

   (row,col) \longrightarrow (col,n-1-row)

例如四阶矩阵中的 ``matrix[0][1]`` 位于第一行第二列，旋转后进入 ``matrix[1][3]``。

``copyByCoordinateMapping`` 直接按这个公式写入新矩阵。每个原坐标有唯一目标坐标，不同原坐标也不会映射到同一位置，
所以它一定得到正确结果。这是最直接的基线，问题只在于额外使用了 ``O(n^2)`` 空间。

为什么不能直接写回原矩阵
~~~~~~~~~~~~~~~~~~~~~~~~

若执行：

.. code-block:: cpp

   matrix[col][n - 1 - row] = matrix[row][col];

目标位置可能仍保存着尚未搬走的原始元素。一次赋值会覆盖后续需要读取的数据，因此原地算法必须把互相依赖的位置作为
一个整体同时轮换，或者把旋转拆成若干不会丢失数据的交换操作。

连续四次映射形成四元环
~~~~~~~~~~~~~~~~~~~~~~

从一个坐标开始连续应用旋转映射：

.. code-block:: text

   (row, col)
       -> (col, n-1-row)
       -> (n-1-row, n-1-col)
       -> (n-1-col, row)
       -> (row, col)

除奇数阶矩阵的中心点外，每个位置都属于一个长度为四的环。环内四个值必须同时顺时针移动。

对当前层左上边的一点：

.. code-block:: text

   top    = (layer,          layer + offset)
   right  = (layer + offset, last)
   bottom = (last,           last - offset)
   left   = (last - offset,  layer)

顺时针旋转后，左边值进入上边，上边值进入右边，右边值进入下边，下边值进入左边。保存一个 ``top`` 临时值后，
即可完成四次赋值而不丢失数据。

为什么分层遍历不会重复处理
~~~~~~~~~~~~~~~~~~~~~~~~~~

外层 ``layer`` 表示当前正方形边框。每处理完一圈，就进入内一圈。

对某一层，只把上边从左到右的前 ``边长 - 1`` 个位置作为四元环代表：

.. code-block:: text

   offset = 0, 1, ..., last - layer - 1

右上角不能再次作为新的代表，否则它所属的四元环会重复处理。每个非中心位置恰好落在某一层，并且在该层恰好属于
一个由上边代表的四元环，因此所有元素都移动一次且仅一次。

奇数阶矩阵最中心位置单独形成长度为一的环，旋转后仍在原处，所以循环只处理 ``n / 2`` 层。

把旋转拆成两个简单置换
~~~~~~~~~~~~~~~~~~~~~~

四元环直接执行目标映射。另一条路线是寻找两个更容易实现的变换，使它们的复合结果等于目标映射。

第一步沿主对角线转置：

.. code-block:: text

   (row, col) -> (col, row)

第二步水平翻转每一行：

.. code-block:: text

   (col, row) -> (col, n - 1 - row)

复合后正好得到：

.. code-block:: text

   (row, col) -> (col, n - 1 - row)

因此“转置后反转每一行”与顺时针旋转完全等价。

状态演化
~~~~~~~~

对三阶矩阵：

.. code-block:: text

   原矩阵          主对角线转置后     每行反转后
   1 2 3           1 4 7              7 4 1
   4 5 6     ->    2 5 8       ->     8 5 2
   7 8 9           3 6 9              9 6 3

最终矩阵的每个位置都符合顺时针坐标映射。

转置为什么只处理主对角线上方
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

转置需要交换 ``matrix[row][col]`` 与 ``matrix[col][row]``。

若遍历整个矩阵，一对对称位置会先交换一次，随后又交换回来。限制 ``col > row`` 后：

* 主对角线元素保持不动；
* 每对非对角线元素只交换一次；
* 所有需要转置的位置都被覆盖。

两个阶段为何都不会覆盖数据
~~~~~~~~~~~~~~~~~~~~~~~~~~

转置和行反转都只由两两交换组成。交换会同时保存两个位置的原值，再把它们互换，不会像单向赋值那样丢失尚未读取
的数据。

两步都是矩阵位置上的双射：转置不会重复或遗漏元素，行反转也不会重复或遗漏元素。两个双射复合后仍是双射，并且复合
坐标已经证明等于顺时针旋转坐标，所以最终矩阵正确。

三种方法的关系
~~~~~~~~~~~~~~

#. ``copyByCoordinateMapping`` 最直接：按目标坐标写入新矩阵，用空间换取简单的数据依赖；
#. ``rotateFourWayCycles`` 观察到旋转置换由若干四元环组成，用一个临时变量逐环原地执行；
#. ``transposeThenReverseRows`` 把同一坐标映射分解为两种简单交换，代码更短，作为公开入口。

复杂度分析
~~~~~~~~~~

矩阵共有 ``n^2`` 个元素，三种方法都需要处理同阶数量的位置，时间复杂度均为 ``O(n^2)``。

额外矩阵方法使用 ``O(n^2)`` 空间。四元环和转置加行反转只使用少量临时变量，额外空间为 ``O(1)``。
