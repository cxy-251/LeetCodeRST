0074. Search a 2D Matrix
========================

题目信息
--------

:题号: 0074
:难度: Medium
:主题: 矩阵、二分查找、坐标映射
:原题: `LeetCode 0074 <https://leetcode.com/problems/search-a-2d-matrix/>`_
:重点: 全局有序、虚拟扁平序列、闭区间二分、坐标恢复

题目重述
--------

给定非空规则矩阵。每行非递减，且下一行首元素严格大于上一行末元素。判断 ``target`` 是否存在；输入矩阵只读。

自建示例
--------

.. code-block:: text

   [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=16 -> true
   同一矩阵，target=13 -> false

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool linearScan(const std::vector<std::vector<int>>& matrix, int target) {
           for (const auto& row : matrix)
               for (int value : row)
                   if (value == target) return true;
           return false;
       }

       bool rowThenColumnBinary(const std::vector<std::vector<int>>& matrix, int target) {
           int rows = matrix.size(), cols = matrix[0].size();
           int low = 0, high = rows - 1, candidate = -1;
           while (low <= high) {
               int mid = low + (high - low) / 2;
               if (matrix[mid][0] <= target) { candidate = mid; low = mid + 1; }
               else high = mid - 1;
           }
           if (candidate < 0) return false;
           return std::binary_search(matrix[candidate].begin(), matrix[candidate].end(), target);
       }

       bool flattenedBinary(const std::vector<std::vector<int>>& matrix, int target) {
           int rows = matrix.size(), cols = matrix[0].size();
           int left = 0, right = rows * cols - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               int value = matrix[mid / cols][mid % cols];
               if (value == target) return true;
               if (value < target) left = mid + 1;
               else right = mid - 1;
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

矩阵为什么整体有序
~~~~~~~~~~~~~~~~

同一行内部有序；每个下一行首元素又严格大于上一行末元素。因此按行连接所有元素后，边界处也保持递增，得到一个全局非递减序列。

为什么无需真的扁平化
~~~~~~~~~~~~~~~~~~

设列数为 ``cols``。虚拟零基下标 ``index`` 对应：

.. code-block:: text

   row = index / cols
   col = index % cols

商表示完整跨过多少行，余数表示当前行列位置。每个 ``0..rows*cols-1`` 的下标都与一个格子一一对应。

二分区间保存什么
~~~~~~~~~~~~~~~~

闭区间 ``[left,right]`` 包含所有尚未排除的虚拟位置。读取中点值后，小于目标则中点及左侧全部过小；大于目标则中点及右侧全部过大。

.. list-table::
   :header-rows: 1

   * - 区间
     - 中点值
     - 动作
   * - ``0..11``
     - 下标 5，值 11
     - ``11 < 16``，左边界变 6
   * - ``6..11``
     - 下标 8，值 23
     - ``23 > 16``，右边界变 7
   * - ``6..7``
     - 下标 6，值 16
     - 命中

两阶段二分与一次二分的关系
~~~~~~~~~~~~~~~~~~~~~~~~~~

先按每行首元素寻找可能行，再在该行二分同样是 ``O(log m + log n)``。虚拟扁平二分把两次边界判断统一到一个区间，复杂度为 ``O(log(mn))``，两者数量级相同。

为什么不会遗漏跨行边界
~~~~~~~~~~~~~~~~~~~~~~

跨行边界满足上一行末值小于下一行首值，因此虚拟序列在边界处没有逆序。普通二分删除半区的依据对跨行位置同样成立。

区间为何一定终止
~~~~~~~~~~~~~~~~

未命中时每轮把 ``left`` 提升到 ``mid+1``，或把 ``right`` 降到 ``mid-1``，候选数严格减少。``left > right`` 时所有位置已排除。

复杂度来源
~~~~~~~~~~

线性扫描为 ``O(mn)``。两阶段和扁平二分都为 ``O(log(mn))`` 时间、``O(1)`` 额外空间；扁平方法不创建一维副本。

九语言实现
----------

C
~

.. code-block:: c

   bool searchMatrix(int**a,int rows,int*cols,int target){int n=cols[0],l=0,r=rows*n-1;while(l<=r){int mid=l+(r-l)/2,v=a[mid/n][mid%n];if(v==target)return true;if(v<target)l=mid+1;else r=mid-1;}return false;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchMatrix(self, a: list[list[int]], target: int) -> bool:
           rows,cols=len(a),len(a[0]);left,right=0,rows*cols-1
           while left<=right:
               mid=(left+right)//2;value=a[mid//cols][mid%cols]
               if value==target:return True
               if value<target:left=mid+1
               else:right=mid-1
           return False

Java
~~~~

.. code-block:: java

   class Solution {public boolean searchMatrix(int[][]a,int target){int n=a[0].length,l=0,r=a.length*n-1;while(l<=r){int mid=l+(r-l)/2,v=a[mid/n][mid%n];if(v==target)return true;if(v<target)l=mid+1;else r=mid-1;}return false;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn search_matrix(a:Vec<Vec<i32>>,target:i32)->bool{let n=a[0].len();let(mut l,mut r)=(0,a.len()*n);while l<r{let mid=l+(r-l)/2;let v=a[mid/n][mid%n];if v<target{l=mid+1}else{r=mid}}l<a.len()*n&&a[l/n][l%n]==target}}

Go
~~

.. code-block:: go

   func searchMatrix(a [][]int,target int)bool{n:=len(a[0]);l,r:=0,len(a)*n-1;for l<=r{mid:=l+(r-l)/2;v:=a[mid/n][mid%n];if v==target{return true};if v<target{l=mid+1}else{r=mid-1}};return false}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchMatrix(a:number[][],target:number):boolean{const n=a[0].length;let l=0,r=a.length*n-1;while(l<=r){const mid=l+Math.floor((r-l)/2),v=a[Math.floor(mid/n)][mid%n];if(v===target)return true;if(v<target)l=mid+1;else r=mid-1;}return false;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool SearchMatrix(int[][]a,int target){int n=a[0].Length,l=0,r=a.Length*n-1;while(l<=r){int mid=l+(r-l)/2,v=a[mid/n][mid%n];if(v==target)return true;if(v<target)l=mid+1;else r=mid-1;}return false;}}

Julia
~~~~~

.. code-block:: julia

   function search_matrix(a,target)
       rows,cols=size(a);l=0;r=rows*cols-1
       while l<=r;mid=l+(r-l)÷2;v=a[mid÷cols+1,mid%cols+1];v==target&&return true;if v<target;l=mid+1;else;r=mid-1;end;end
       false
   end

R
~

.. code-block:: r

   search_matrix <- function(a,target){rows<-nrow(a);cols<-ncol(a);l<-0L;r<-rows*cols-1L;while(l<=r){mid<-l+(r-l)%/%2L;v<-a[mid%/%cols+1L,mid%%cols+1L];if(v==target)return(TRUE);if(v<target)l<-mid+1L else r<-mid-1L};FALSE}
