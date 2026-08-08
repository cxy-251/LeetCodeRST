0074. Search a 2D Matrix
========================

题目信息
--------

:题号: 0074. 搜索二维矩阵
:难度: Medium
:主题: 矩阵、二分查找、坐标映射
:原题: `LeetCode 0074 <https://leetcode.com/problems/search-a-2d-matrix/>`_
:重点: 从逐格扫描，推导到定位候选行，再把矩阵视为虚拟一维有序序列

题目重述
--------

给定一个 ``m × n`` 整数矩阵 ``matrix`` 和整数 ``target``，判断目标值是否存在于矩阵中。

矩阵满足以下条件：

* 每一行都按非递减顺序排列；
* 每一行的第一个元素都严格大于上一行的最后一个元素。

算法必须达到 ``O(log(m * n))`` 时间复杂度。

约束为 ``1 <= m, n <= 100``，``-10^4 <= matrix[i][j], target <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：
   matrix = [[2,4,8],
             [12,15,19],
             [25,31,40]]
   target = 15

   输出：true

按行连接后得到 ``[2,4,8,12,15,19,25,31,40]``，目标值位于虚拟下标 4。

.. code-block:: text

   输入：
   matrix = [[1,3,3],
             [7,9,12]]
   target = 5

   输出：false

行内允许重复值，但第一行末尾的 3 仍小于第二行开头的 7；5 位于两行取值范围之间。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool linearScan(const std::vector<std::vector<int>>& matrix, int target) {
           for (const auto& row : matrix) {
               for (int value : row) {
                   if (value == target) {
                       return true;
                   }
               }
           }
           return false;
       }

       bool rowThenColumnBinary(
           const std::vector<std::vector<int>>& matrix,
           int target
       ) {
           int rows = static_cast<int>(matrix.size());
           int left = 0;
           int right = rows - 1;
           int candidate = -1;

           while (left <= right) {
               int mid = left + (right - left) / 2;

               if (matrix[mid][0] <= target) {
                   candidate = mid;
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }

           if (candidate == -1) {
               return false;
           }

           const auto& row = matrix[candidate];
           return std::binary_search(row.begin(), row.end(), target);
       }

       bool flattenedBinary(
           const std::vector<std::vector<int>>& matrix,
           int target
       ) {
           int rows = static_cast<int>(matrix.size());
           int cols = static_cast<int>(matrix[0].size());
           int left = 0;
           int right = rows * cols - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               int row = mid / cols;
               int col = mid % cols;
               int value = matrix[row][col];

               if (value == target) {
                   return true;
               }

               if (value < target) {
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }

           return false;
       }

   public:
       bool searchMatrix(std::vector<std::vector<int>>& matrix, int target) {
           return flattenedBinary(matrix, target);
       }
   };

题解
----

逐格扫描
~~~~~~~~

直接检查所有元素一定能找到目标，但最坏需要访问 ``m * n`` 个位置，时间为 ``O(mn)``，没有利用矩阵的有序性。

两层有序结构
~~~~~~~~~~~~

每一行内部非递减，并且下一行首元素严格大于上一行末元素。因此目标若存在，只可能位于最后一个满足
``matrix[row][0] <= target`` 的行。

先在各行首元素中寻找这个最后可行行，再在该行内部二分，时间为：

.. code-block:: text

   O(log m + log n)

若目标小于第一行首元素，则不存在候选行。若候选行中也没有目标，其他行更不可能包含目标。

虚拟一维序列
~~~~~~~~~~~~

把矩阵按行连接，可得到一个全局非递减序列。无需真的复制元素，只需把虚拟下标映射回二维坐标。

设列数为 ``cols``，虚拟下标 ``index`` 对应：

.. code-block:: text

   row = index / cols
   col = index % cols

整数商表示已经跨过的完整行数，余数表示当前行中的列下标。区间 ``0..m*n-1`` 与矩阵中的所有位置一一对应。

闭区间二分
~~~~~~~~~~

``[left, right]`` 保存所有尚未排除的虚拟位置。读取中点后有三种情况：

* 中点值等于目标，立即返回；
* 中点值小于目标，中点及其左侧全部排除；
* 中点值大于目标，中点及其右侧全部排除。

每轮都把边界移动到 ``mid + 1`` 或 ``mid - 1``，候选区间严格缩小。

状态跟踪
~~~~~~~~

对示例矩阵搜索 ``20``：

.. list-table::
   :header-rows: 1

   * - 区间
     - 中点
     - 中点值
     - 下一步
   * - ``0..8``
     - 4
     - 15
     - 左边界变为 5
   * - ``5..8``
     - 6
     - 25
     - 右边界变为 5
   * - ``5..5``
     - 5
     - 19
     - 左边界变为 6

此时 ``left > right``，所有位置都已排除。

跨行边界
~~~~~~~~

上一行末元素严格小于下一行首元素，所以虚拟序列在换行处仍保持有序。行内即使出现重复值，也不会破坏二分所需的非递减性质。

两种二分的关系
~~~~~~~~~~~~~~

两阶段方法显式利用“行首有序”和“行内有序”；虚拟展平方法把这两层顺序合并为一个长度为 ``m*n`` 的有序区间。

两阶段方法时间为 ``O(log m + log n)``，虚拟展平方法时间为 ``O(log(mn))``。两者等价，因为：

.. code-block:: text

   log(mn) = log m + log n

虚拟展平只维护一个二分区间，公开入口采用该方法。

复杂度
~~~~~~

线性扫描时间 ``O(mn)``。两阶段二分和虚拟展平二分时间均为 ``O(log(mn))``，额外空间均为 ``O(1)``。
