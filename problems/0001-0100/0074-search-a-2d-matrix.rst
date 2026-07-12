0074. Search a 2D Matrix
========================

题目信息
--------

:题号: 0074
:难度: Medium
:主题: 矩阵、二分查找、坐标映射
:原题: `LeetCode 0074 <https://leetcode.com/problems/search-a-2d-matrix/>`_
:访问状态: Available
:教学重点: 全局有序、虚拟扁平下标、闭区间二分

题目重述
--------

给定非空规则矩阵和整数 ``target``。每行非递减，下一行首元素严格大于上一行末元素。判断目标是否
存在。``1 <= m,n <= 100``，输入只读。

自建示例
--------

.. code-block:: text

   matrix = [[1,3,5,7], [10,11,16,20], [23,30,34,60]]
   target = 16
   输出：true

问题抽象
--------

按行读取可得到整体有序序列。零基扁平位置 ``index`` 映射为 ``row=index/n``、``col=index%n``，
所以可以二分 ``m*n`` 个虚拟元素，无需复制矩阵。

解法选择
--------

主解法为扁平坐标二分，时间 ``O(log(mn))``、空间 ``O(1)``。逐元素扫描需要 ``O(mn)``。

主解法：扁平坐标二分
--------------------

维护闭区间 ``[left,right]``。目标若存在，只可能位于该区间。读取
``matrix[mid/n][mid%n]`` 后，根据比较删除不可能包含目标的一半，相等立即返回真。

同一行内有序；跨行时下一行首元素严格大于上一行末元素，因此扁平序列整体有序。每个扁平下标与
一个矩阵坐标一一对应，删除半区不会遗漏目标。区间为空时没有候选；每轮至少删除 ``mid``，循环终止。

复杂度
~~~~~~

时间 ``O(log(mn))``，额外空间 ``O(1)``。``m*n<=10000``，32 位整数足够。Rust 使用半开
lower-bound 区间，避免无符号下标执行 ``mid-1``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   bool searchMatrix(
       int **matrix,
       int matrixSize,
       int *matrixColSize,
       int target
   ) {
       const int cols = matrixColSize[0];
       int left = 0;
       int right = matrixSize * cols - 1;

       while (left <= right) {
           const int mid = left + (right - left) / 2;
           const int value = matrix[mid / cols][mid % cols];

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

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       bool searchMatrix(
           std::vector<std::vector<int>>& matrix,
           int target
       ) {
           const int rows = static_cast<int>(matrix.size());
           const int cols = static_cast<int>(matrix[0].size());
           int left = 0;
           int right = rows * cols - 1;

           while (left <= right) {
               const int mid = left + (right - left) / 2;
               const int value = matrix[mid / cols][mid % cols];

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
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchMatrix(
           self,
           matrix: list[list[int]],
           target: int,
       ) -> bool:
           rows = len(matrix)
           cols = len(matrix[0])
           left = 0
           right = rows * cols - 1

           while left <= right:
               mid = left + (right - left) // 2
               value = matrix[mid // cols][mid % cols]

               if value == target:
                   return True
               if value < target:
                   left = mid + 1
               else:
                   right = mid - 1
           return False

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean searchMatrix(int[][] matrix, int target) {
           int rows = matrix.length;
           int cols = matrix[0].length;
           int left = 0;
           int right = rows * cols - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               int value = matrix[mid / cols][mid % cols];

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
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search_matrix(matrix: Vec<Vec<i32>>, target: i32) -> bool {
           let rows = matrix.len();
           let cols = matrix[0].len();
           let mut left = 0usize;
           let mut right = rows * cols;

           while left < right {
               let mid = left + (right - left) / 2;
               let value = matrix[mid / cols][mid % cols];

               if value < target {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           left < rows * cols
               && matrix[left / cols][left % cols] == target
       }
   }

Go
~~

.. code-block:: go

   func searchMatrix(matrix [][]int, target int) bool {
       rows := len(matrix)
       cols := len(matrix[0])
       left := 0
       right := rows*cols - 1

       for left <= right {
           mid := left + (right-left)/2
           value := matrix[mid/cols][mid%cols]

           if value == target {
               return true
           }
           if value < target {
               left = mid + 1
           } else {
               right = mid - 1
           }
       }
       return false
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchMatrix(
       matrix: number[][],
       target: number,
   ): boolean {
       const rows = matrix.length;
       const cols = matrix[0].length;
       let left = 0;
       let right = rows * cols - 1;

       while (left <= right) {
           const mid = left + Math.floor((right - left) / 2);
           const value = matrix[Math.floor(mid / cols)][mid % cols];

           if (value === target) {
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

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool SearchMatrix(int[][] matrix, int target) {
           int rows = matrix.Length;
           int cols = matrix[0].Length;
           int left = 0;
           int right = rows * cols - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               int value = matrix[mid / cols][mid % cols];

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
   }

Julia
~~~~~

.. code-block:: julia

   function search_matrix(matrix::Matrix{Int}, target::Int)::Bool
       rows, cols = size(matrix)
       left = 0
       right = rows * cols - 1

       while left <= right
           mid = left + (right - left) ÷ 2
           row = mid ÷ cols + 1
           col = mid % cols + 1
           value = matrix[row, col]

           if value == target
               return true
           elseif value < target
               left = mid + 1
           else
               right = mid - 1
           end
       end
       return false
   end

R
~

.. code-block:: r

   search_matrix <- function(matrix, target) {
     rows <- nrow(matrix)
     cols <- ncol(matrix)
     left <- 0L
     right <- rows * cols - 1L

     while (left <= right) {
       mid <- left + (right - left) %/% 2L
       row <- mid %/% cols + 1L
       col <- mid %% cols + 1L
       value <- matrix[row, col]

       if (value == target) {
         return(TRUE)
       }
       if (value < target) {
         left <- mid + 1L
       } else {
         right <- mid - 1L
       }
     }
     FALSE
   }

验证计划与证据
--------------

覆盖单元素、单行、单列、全局两端、行间空隙和范围外目标；随机生成合法矩阵，与直接遍历对拍，并对
可用语言执行编译、严格类型检查和运行测试。

关键边界
--------

* 跨行严格边界是扁平二分的必要契约；
* 矩阵必须非空且规则；
* Julia、R 访问容器时把零基坐标加一；
* Rust 半开区间不能混用闭区间终止条件。

易错点
------

* 写反整数商与余数对应的行列；
* 把扁平 ``mid`` 当作行号；
* 闭区间使用 ``left=mid`` 或 ``right=mid``；
* 对不满足跨行边界的矩阵使用全局二分。

本题新增知识
------------

* 规则矩阵的虚拟扁平索引；
* 行内与跨行条件合成全局有序性。

本题强化知识
------------

二分候选区间、安全中点、TypeScript 整数运算，以及 Julia、R 的零基到一基映射。

关联题目
--------

* `0035. Search Insert Position <0035-search-insert-position.rst>`_：一维二分；
* `0069. Sqrt(x) <0069-sqrtx.rst>`_：单调边界搜索。

最小自检
--------

#. 为什么仅有行内有序还不够？
#. ``mid/n`` 与 ``mid%n`` 分别是什么？
#. 为什么比较后能安全删除半区？
#. Rust 为什么采用半开区间？
