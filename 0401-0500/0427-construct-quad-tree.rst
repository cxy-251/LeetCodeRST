0427. Construct Quad Tree
=========================

题目信息
--------

:题号: 0427
:难度: Medium
:主题: 二值方阵、四叉树、均匀区域、递归划分
:原题: `LeetCode 0427 <https://leetcode.com/problems/construct-quad-tree/>`_
:重点: 均匀区域生成叶节点、混合区域平均分成四块、叶节点没有子节点、非叶节点的 ``val`` 不参与判定

题目重述
--------

给定只包含 0 和 1 的 ``n × n`` 方阵 ``grid``，构造表示该矩阵的四叉树。若当前正方形区域中的所有值都相同，则创建叶节点，``isLeaf`` 为 ``true``，``val`` 等于该区域的布尔值，四个子节点均为空。

若区域同时包含 0 和 1，则创建非叶节点，并把区域等分为左上、右上、左下、右下四个同样大小的正方形，分别递归构造四个子树。非叶节点的 ``val`` 可以为任意布尔值，判题时会忽略它。

``n`` 位于 ``[1, 64]`` 且是 2 的幂，矩阵元素只能是 0 或 1。返回四叉树根节点。

自建示例
--------

整个矩阵均匀：

.. code-block:: text

   输入：grid = [[1,1],[1,1]]
   输出：一个 isLeaf = true、val = true 的根节点
   解释：整个区域都是 1，无需继续划分，根节点的四个子节点均为空。

四个象限取值不同：

.. code-block:: text

   输入：grid = [[1,0],[0,1]]
   输出：一个非叶根节点，四个叶子依次表示左上 1、右上 0、左下 0、右下 1
   解释：根区域并不均匀，因此必须划分成四个 1×1 区域，每个区域单独成为叶节点。

先判断区域是否均匀，再递归四等分
----------------------------------

对当前正方形扫描一次，若所有值都等于左上角值，就可以直接创建叶节点；只有发现 0 和 1 混合时才把区域按中线分成四个象限。四个象限的顺序固定为左上、右上、左下、右下，分别递归后挂到非叶节点上。

``n`` 是 2 的幂，因此不断二分最终会到达单元格；单元格天然均匀，不需要额外的停止条件。非叶节点的 ``val`` 不参与表达区域值，设为任意合法布尔值即可。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       Node* build(std::vector<std::vector<int>>& grid,
                   int row, int col, int size) {
           int value = grid[row][col];
           bool uniform = true;
           for (int r = row; r < row + size && uniform; ++r) {
               for (int c = col; c < col + size; ++c) {
                   if (grid[r][c] != value) {
                       uniform = false;
                       break;
                   }
               }
           }
           if (uniform) return new Node(value == 1, true);

           int half = size / 2;
           Node* node = new Node(true, false);
           node->topLeft = build(grid, row, col, half);
           node->topRight = build(grid, row, col + half, half);
           node->bottomLeft = build(grid, row + half, col, half);
           node->bottomRight = build(
               grid, row + half, col + half, half);
           return node;
       }

   public:
       Node* construct(std::vector<std::vector<int>>& grid) {
           return build(grid, 0, 0, static_cast<int>(grid.size()));
       }
   };

代码分析
--------

每个区域只有在确实混合时才继续分割，叶节点的四个子指针保持为空；递归覆盖且不重叠地覆盖整个矩阵，因此树能还原每个格子的值。朴素扫描的最坏时间复杂度为 ``O(n^2 log n)``，递归树额外空间为 ``O(log n)``（不计输出节点）。
