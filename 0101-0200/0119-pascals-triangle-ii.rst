
0119. Pascal's Triangle II
==========================

题目信息
--------

:题号: 0119
:难度: Easy
:主题: 数组、动态规划、滚动数组、组合数
:原题: `LeetCode 0119 <https://leetcode.com/problems/pascals-triangle-ii/>`_
:访问状态: Available
:教学重点: 单行状态、逆序覆盖、输出复用、下降区间语义

题目重述
--------

给定零基行号 ``rowIndex``，返回帕斯卡三角形的第 ``rowIndex`` 行。
第 0 行为 ``[1]``。目标行长度为 ``rowIndex + 1``，首尾为 1，
内部值满足上一行相邻两项求和。

题目约束 ``0 <= rowIndex <= 33``，结果能放入 32 位有符号整数。
要求使用 ``O(rowIndex)`` 额外空间；返回数组本身可以同时作为动态规划工作区。

自建示例
--------

普通行
~~~~~~

.. code-block:: text

   rowIndex = 4
   输出：[1, 4, 6, 4, 1]

零行
~~~~

``rowIndex = 0`` 时输出 ``[1]``，不进入任何更新循环。

覆盖方向反例
~~~~~~~~~~~~

从 ``[1, 1, 0]`` 构造第 2 行时，若从左向右：先把中间位置更新成 2，
再用这个新值更新尾部，会得到错误的 ``[1, 2, 2]``。正确结果是 ``[1, 2, 1]``。

问题抽象
--------

若已经在一维数组中保存第 ``current - 1`` 行，则第 ``current`` 行满足：

.. code-block:: text

   new[column] = old[column - 1] + old[column]

其中超出旧行右边界的 ``old[current]`` 视为 0。为了原地复用同一数组，
必须从右向左更新：

.. code-block:: text

   for column = current down to 1:
       row[column] = row[column] + row[column - 1]

右侧 ``row[column]`` 在本轮尚未修改，仍是旧行同列；左侧 ``row[column - 1]``
也尚未修改，仍是旧行左邻居。

基础类型约定
------------

返回一维整数容器，长度精确为 ``rowIndex + 1``。C 由函数分配数组并通过
``returnSize`` 返回长度；调用者释放。Java 由于平台签名要求 ``List<Integer>``，
先用 ``int[]`` 计算再装箱。其余语言直接返回动态数组或向量。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 一维逆序原地 DP
     - ``O(rowIndex^2)``
     - ``O(rowIndex)``，即返回数组
     - 主解法；不保存历史行
   * - 生成完整三角形
     - ``O(rowIndex^2)``
     - ``O(rowIndex^2)``
     - 复用 0118，但保存了无关行
   * - 组合数乘除递推
     - ``O(rowIndex)``
     - ``O(rowIndex)`` 返回数组
     - 更快，但需要严格处理中间乘法与整除

本文选择一维 DP，因为它直接展示从二维依赖到滚动数组的压缩，并与 0115 的逆序覆盖规则一致。

主解法：一维逆序原地 DP
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

初始化 ``row[0] = 1``，其余槽位为 0。处理完 ``current`` 轮后保持：

* ``row[0..current]`` 恰好等于帕斯卡三角形第 ``current`` 行；
* ``current`` 右侧槽位仍为 0；
* 本轮从右向左覆盖，读取的两个来源都属于上一行；
* 数组长度始终为最终目标行长度。

第 ``current`` 轮更新 ``column = current, current - 1, ..., 1``。
首列 ``row[0]`` 不变，继续保持 1。尾列原值为 0，加上旧行最后一个 1 后自动得到 1。

为什么必须逆序
~~~~~~~~~~~~~~

更新 ``row[column]`` 需要旧的 ``row[column - 1]``。若从左向右，
``row[column - 1]`` 已经是当前行的新值，同一个上一行元素会在一轮中被级联使用多次。
逆序更新时，左邻居尚未覆盖，因此每个新位置只依赖上一行的两个状态。

输出数组兼作工作区
~~~~~~~~~~~~~~~~~~

算法从开始就分配最终长度数组，逐轮扩大有效前缀。完成后该数组本身就是答案，
不需要把 DP 再复制到返回容器。因此：

* 返回载荷为 ``Theta(rowIndex)``；
* 除返回数组外只使用循环索引，额外工作空间 ``O(1)``；
* Java 的最终装箱列表是平台适配器额外物化，不改变核心算法空间。

正确性依据
~~~~~~~~~~

对 ``current`` 做归纳。

**基础情况。** ``current = 0`` 时有效前缀只有 ``row[0] = 1``，等于第 0 行。

**归纳步骤。** 假设更新前有效前缀等于第 ``current - 1`` 行。
从右向左处理任意 ``column >= 1`` 时，``row[column]`` 与 ``row[column - 1]``
都仍是上一行值，因此相加得到当前行对应位置。``row[0]`` 保持 1。
所有 ``0..current`` 位置均正确，所以当前行正确。

**覆盖安全。** 逆序保证任何已写入的新值只位于当前 ``column`` 的右侧，
后续更小列不会读取它。

**终止性。** 外层执行 ``rowIndex`` 轮，每轮下降循环有限。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 总更新次数为 ``1 + 2 + ... + rowIndex = Theta(rowIndex^2)``；
* 返回数组长度 ``Theta(rowIndex)``；
* 除返回数组外，核心额外空间 ``O(1)``；
* Java 额外创建装箱列表，适配器空间和峰值空间 ``O(rowIndex)``；
* C 分配失败时返回空指针并把 ``returnSize`` 设为 0；
* Julia 必须显式使用负步长下降范围；
* R 必须先证明起点不小于终点，再调用负步长 ``seq.int``；
* TypeScript ``number`` 对题目最大组合数保持精确，因为结果远小于 ``2^53``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int *getRow(int rowIndex, int *returnSize) {
       const int width = rowIndex + 1;
       int *row = calloc((size_t)width, sizeof(*row));
       if (row == NULL) {
           *returnSize = 0;
           return NULL;
       }

       row[0] = 1;
       for (int current = 1; current <= rowIndex; ++current) {
           for (int column = current; column >= 1; --column) {
               row[column] += row[column - 1];
           }
       }

       *returnSize = width;
       return row;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> getRow(int rowIndex) {
           std::vector<int> row(rowIndex + 1, 0);
           row[0] = 1;

           for (int current = 1; current <= rowIndex; ++current) {
               for (int column = current; column >= 1; --column) {
                   row[column] += row[column - 1];
               }
           }

           return row;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def getRow(self, rowIndex: int) -> list[int]:
           row = [0] * (rowIndex + 1)
           row[0] = 1

           for current in range(1, rowIndex + 1):
               for column in range(current, 0, -1):
                   row[column] += row[column - 1]

           return row

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<Integer> getRow(int rowIndex) {
           int[] values = new int[rowIndex + 1];
           values[0] = 1;

           for (int current = 1; current <= rowIndex; ++current) {
               for (int column = current; column >= 1; --column) {
                   values[column] += values[column - 1];
               }
           }

           List<Integer> result = new ArrayList<>(values.length);
           for (int value : values) {
               result.add(value);
           }
           return result;
       }
   }

Java 先在原生 ``int[]`` 中完成 DP，再物化为平台要求的 ``List<Integer>``；装箱列表属于返回适配器。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn get_row(row_index: i32) -> Vec<i32> {
           let width = row_index as usize + 1;
           let mut row = vec![0; width];
           row[0] = 1;

           for current in 1..width {
               for column in (1..=current).rev() {
                   row[column] += row[column - 1];
               }
           }

           row
       }
   }

Go
~~

.. code-block:: go

   func getRow(rowIndex int) []int {
       row := make([]int, rowIndex+1)
       row[0] = 1

       for current := 1; current <= rowIndex; current++ {
           for column := current; column >= 1; column-- {
               row[column] += row[column-1]
           }
       }

       return row
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getRow(rowIndex: number): number[] {
       const row = new Array<number>(rowIndex + 1).fill(0);
       row[0] = 1;

       for (let current = 1; current <= rowIndex; current += 1) {
           for (let column = current; column >= 1; column -= 1) {
               row[column] += row[column - 1];
           }
       }

       return row;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> GetRow(int rowIndex) {
           int[] row = new int[rowIndex + 1];
           row[0] = 1;

           for (int current = 1; current <= rowIndex; ++current) {
               for (int column = current; column >= 1; --column) {
                   row[column] += row[column - 1];
               }
           }

           return row;
       }
   }

C# 的数组实现 ``IList<int>``，可以直接作为平台返回值，不需要再次复制。

Julia
~~~~~

.. code-block:: julia

   function get_pascal_row(row_index::Int)::Vector{Int}
       row = zeros(Int, row_index + 1)
       row[1] = 1

       for current in 1:row_index
           for column in current:-1:1
               row[column + 1] += row[column]
           end
       end

       return row
   end

下降范围必须显式写成 ``current:-1:1``；``current:1`` 在 Julia 中不会自动下降。

R
~

.. code-block:: r

   get_pascal_row <- function(row_index) {
     row <- integer(row_index + 1L)
     row[1L] <- 1L

     if (row_index >= 1L) {
       for (current in seq_len(row_index)) {
         for (column in seq.int(current, 1L, by = -1L)) {
           row[column + 1L] <- row[column + 1L] + row[column]
         }
       }
     }

     row
   }

R 只在 ``row_index >= 1`` 时构造下降序列，并显式使用 ``by = -1``。

验证计划与证据
--------------

* 固定检查行号 ``0, 1, 2, 4, 33``；
* 与 0118 完整生成结果的最后一行逐项比较；
* 检查首尾为 1、长度为 ``rowIndex + 1``、左右对称；
* 使用组合数基准 ``C(rowIndex, column)``；
* 专门运行正序覆盖反例，确认测试能捕获错误方向；
* Python 执行全部合法行号；
* C/C++、Java、Go、TypeScript 编译并执行全部合法行号，C/C++ 使用 sanitizers；
* Rust、C#、Julia、R 缺少运行时时，记录下降循环、索引和返回接口静态检查。

关键边界
--------

* ``rowIndex = 0`` 时只有一个槽位；
* 每轮尾位置原值为 0，不能预先错误填成 1 后再相加；
* 内层必须包含 ``column = current``，否则新尾部不会生成；
* 内层不能处理 ``column = 0``，首列应保持 1；
* 下降范围在 Julia 与 R 中必须显式表达方向。

易错点
------

* 从左向右更新，重复使用本轮新值；
* 只分配 ``rowIndex`` 个槽位；
* 忘记初始 ``row[0] = 1``；
* 生成全部历史行，违反目标空间约束；
* 把输出数组之外再复制一份工作数组，却仍声称除输出外 ``O(1)``；
* Julia 写 ``current:1`` 并误以为会自动下降；
* R 在 ``rowIndex = 0`` 时构造方向不匹配的下降序列。

本题新增知识
------------

* 帕斯卡单行可以用最终输出数组原地迭代；
* 逆序覆盖保护上一轮左邻居；
* 返回数组兼作 DP 时，核心工作空间与返回载荷要分开描述；
* 下降区间是语言语义边界，不是伪代码细节。

本题强化知识
------------

* 一维滚动 DP 的覆盖方向由依赖关系决定；
* 与 0115 相同，逆序防止同一轮状态被重复使用；
* Java 装箱列表属于适配器物化；
* C 分配失败需要同步输出元数据。

关联题目
--------

* `0118. Pascal's Triangle <0118-pascals-triangle.rst>`_：保存所有行的二维递推；
* `0115. Distinct Subsequences <0115-distinct-subsequences.rst>`_：目标前缀计数也必须逆序更新；
* `0120. Triangle <0120-triangle.rst>`_：从底向上复用一维相邻状态。

最小自检
--------

#. 正序更新为何会把同一个来源位置使用多次？
#. 为什么尾位置不需要单独赋值为 1？
#. 本题除返回数组外的核心额外空间是多少？

答案要点
--------

#. 左邻居已变成当前行值，后续位置会读取本轮结果而非上一行结果。
#. 尾槽旧值为 0，加上上一行最后一个 1 后自然得到 1。
#. 只有循环变量，为 ``O(1)``；返回数组本身是 ``Theta(rowIndex)``。
