0119. Pascal's Triangle II
==========================

题目信息
--------

:题号: 0119
:难度: Easy
:主题: 数组、动态规划、滚动数组、组合数
:原题: `LeetCode 0119 <https://leetcode.com/problems/pascals-triangle-ii/>`_
:重点: 零基行号、单行结果、相邻父项、空间进阶

题目重述
--------

给定非负整数 ``rowIndex``，返回帕斯卡三角形中零基编号为 ``rowIndex`` 的一整行。第 ``0`` 行是 ``[1]``；第 ``rowIndex`` 行共有 ``rowIndex + 1`` 个元素，首尾为 ``1``，其余元素由上一行相邻两项之和得到。

约束为 ``0 <= rowIndex <= 33``。仅使用 ``O(rowIndex)`` 额外空间是本题的进阶要求，不改变返回内容。

自建示例
--------

.. code-block:: text

   输入：rowIndex = 6
   输出：[1,6,15,20,15,6,1]
   解释：这是帕斯卡三角形按零基编号的第 6 行，共包含 7 个元素。

.. code-block:: text

   输入：rowIndex = 1
   输出：[1,1]
   解释：第 1 行只有两个边界元素，因此二者都为 1。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> fullTriangle(int rowIndex) {
           std::vector<std::vector<int>> triangle;
           for (int row = 0; row <= rowIndex; ++row) {
               std::vector<int> current(row + 1, 1);
               if (row > 0)
                   for (int column = 1; column < row; ++column)
                       current[column] = triangle.back()[column - 1] +
                                         triangle.back()[column];
               triangle.push_back(std::move(current));
           }
           return triangle.back();
       }

       std::vector<int> combinationFormula(int rowIndex) {
           std::vector<int> row(rowIndex + 1);
           long long value = 1;
           for (int column = 0; column <= rowIndex; ++column) {
               row[column] = static_cast<int>(value);
               if (column < rowIndex)
                   value = value * (rowIndex - column) / (column + 1);
           }
           return row;
       }

       std::vector<int> reverseRolling(int rowIndex) {
           std::vector<int> row(rowIndex + 1);
           row[0] = 1;
           for (int current = 1; current <= rowIndex; ++current)
               for (int column = current; column >= 1; --column)
                   row[column] += row[column - 1];
           return row;
       }

   public:
       std::vector<int> getRow(int rowIndex) {
           return reverseRolling(rowIndex);
       }
   };

题解
----

如何从二维状态压缩为一行
~~~~~~~~~~~~~~~~~~~~~~~~

第 ``current`` 行第 ``column`` 项只依赖上一行同列和左邻列：

.. code-block:: text

   new[column] = old[column] + old[column-1]

返回数组长度一开始就分配为 ``rowIndex+1``，未生成的位置保持 0。``row[0]=1``，每轮把前 ``current+1`` 个位置更新为下一行。

为什么必须从右向左
~~~~~~~~~~~~~~~~~~

更新 ``row[column]`` 时，需要旧的 ``row[column]`` 与旧的 ``row[column-1]``。从右向左时，左邻居尚未被本轮修改；从左向右时，左邻居已变成新行值，相当于重复使用当前轮结果。

.. list-table::
   :header-rows: 1

   * - 目标行
     - 更新前工作区
     - 逆序更新后
   * - 0
     - ``[1,0,0,0,0]``
     - ``[1,0,0,0,0]``
   * - 1
     - ``[1,0,0,0,0]``
     - ``[1,1,0,0,0]``
   * - 2
     - ``[1,1,0,0,0]``
     - ``[1,2,1,0,0]``
   * - 3
     - ``[1,2,1,0,0]``
     - ``[1,3,3,1,0]``
   * - 4
     - ``[1,3,3,1,0]``
     - ``[1,4,6,4,1]``

尾部 1 如何自然产生
~~~~~~~~~~~~~~~~~~~~

进入第 ``current`` 轮前，``row[current]`` 仍为 0；逆序第一步执行 ``row[current] += row[current-1]``。上一行末尾为 1，因此新行尾部自然得到 1，不需要单独赋值。

返回数组为什么可以兼作状态
~~~~~~~~~~~~~~~~~~~~~~~~~~

题目只要求最终一行，历史行无需保留。工作数组最终内容就是返回值，没有额外复制；空间 ``O(rowIndex)`` 主要由输出本身构成。

组合数线性方法
~~~~~~~~~~~~~~

目标行第 ``column`` 项是 ``C(rowIndex,column)``，相邻项满足：

.. code-block:: text

   next = current * (rowIndex-column) / (column+1)

它能在 ``O(rowIndex)`` 时间生成结果，但需要较宽中间值和精确整除。逆序 DP 更直接展示滚动覆盖规则。

为什么最终状态正确
~~~~~~~~~~~~~~~~~~

按轮数归纳。初始数组表示第 0 行。假设更新前前缀保存第 ``current-1`` 行，逆序转移读取的两个位置都仍是旧值，因此所有内部项符合相邻父项求和，边界项也正确。完成 ``rowIndex`` 轮后得到目标行。

复杂度来源
~~~~~~~~~~

逆序 DP 执行 ``1+2+...+rowIndex`` 次更新，时间 ``O(rowIndex²)``，返回数组空间 ``O(rowIndex)``。组合数递推时间 ``O(rowIndex)``，空间仍由返回数组占用。

九语言实现
----------

C
~

.. code-block:: c

   int*getRow(int rowIndex,int*returnSize){int n=rowIndex+1;int*row=calloc((size_t)n,sizeof(int));row[0]=1;for(int current=1;current<=rowIndex;current++)for(int column=current;column>=1;column--)row[column]+=row[column-1];*returnSize=n;return row;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def getRow(self, rowIndex: int) -> list[int]:
           row = [1] + [0] * rowIndex
           for current in range(1, rowIndex + 1):
               for column in range(current, 0, -1):
                   row[column] += row[column - 1]
           return row

Java
~~~~

.. code-block:: java

   class Solution {public List<Integer> getRow(int index){int[]row=new int[index+1];row[0]=1;for(int current=1;current<=index;current++)for(int column=current;column>=1;column--)row[column]+=row[column-1];List<Integer>out=new ArrayList<>();for(int x:row)out.add(x);return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn get_row(row_index:i32)->Vec<i32>{let n=row_index as usize;let mut row=vec![0;n+1];row[0]=1;for current in 1..=n{for column in(1..=current).rev(){row[column]+=row[column-1];}}row}}

Go
~~

.. code-block:: go

   func getRow(rowIndex int)[]int{row:=make([]int,rowIndex+1);row[0]=1;for current:=1;current<=rowIndex;current++{for column:=current;column>=1;column--{row[column]+=row[column-1]}};return row}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getRow(rowIndex:number):number[]{const row=Array(rowIndex+1).fill(0);row[0]=1;for(let current=1;current<=rowIndex;current++)for(let column=current;column>=1;column--)row[column]+=row[column-1];return row;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<int> GetRow(int index){var row=new int[index+1];row[0]=1;for(int current=1;current<=index;current++)for(int column=current;column>=1;column--)row[column]+=row[column-1];return row;}}

Julia
~~~~~

.. code-block:: julia

   function get_row(row_index::Int)
       row=zeros(Int,row_index+1);row[1]=1
       for current in 1:row_index
           for position in current+1:-1:2
               row[position]+=row[position-1]
           end
       end
       row
   end

R
~

.. code-block:: r

   get_row <- function(row_index){row<-c(1L,rep(0L,row_index));if(row_index>0L)for(current in seq_len(row_index))for(position in seq.int(current+1L,2L))row[[position]]<-row[[position]]+row[[position-1L]];row}