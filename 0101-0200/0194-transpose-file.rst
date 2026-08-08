0194. Transpose File
====================

题目信息
--------

:题号: 0194. 转置文件
:难度: Medium
:主题: Shell、awk、文本矩阵、跨行状态
:原题: `LeetCode 0194 <https://leetcode.com/problems/transpose-file/>`_
:重点: 将原第 c 列跨行累积为第 c 个输出缓冲，并在读完文件后按列号依次输出

题目重述
--------

编写 Bash 脚本读取 ``file.txt``。文件可视为文本矩阵，每行字段数相同，字段以空白分隔。
输出矩阵转置：原文件第 ``c`` 列成为输出第 ``c`` 行，同一输出行的字段用单个空格连接，
并保持原行从上到下的顺序。

若输入有 ``r`` 行、``c`` 列，输出应有 ``c`` 行，每行 ``r`` 个字段。

自建示例
--------

.. code-block:: text

   file.txt:
   item qty zone
   pens 8 north
   paper 3 west

   输出：
   item pens paper
   qty 8 3
   zone north west

Bash 实现
---------

.. code-block:: bash

   #!/usr/bin/env bash

   awk '
   NR == 1 {
       columns = NF
   }

   {
       for (column = 1; column <= NF; ++column) {
           if (NR == 1) {
               transposed[column] = $column
           } else {
               transposed[column] = \
                   transposed[column] " " $column
           }
       }
   }

   END {
       for (column = 1; column <= columns; ++column) {
           print transposed[column]
       }
   }
   ' file.txt

题解
----

行流与目标输出方向相反
~~~~~~~~~~~~~~~~~~~~~~

``awk`` 天然一次读入一行，而转置后的第一行需要原文件 **每一行** 的第一个字段。读到输入
第一行时，任何输出行都还不完整，不能立刻打印；必须把属于同一原始列的字段跨行保存，
等文件读取结束再输出。

可以先统计列数，再对每一列调用一次 ``cut`` 或 ``awk``，但文件会被重复扫描 ``c`` 次。
主脚本只扫描一遍输入，为每个原始列维护一个不断增长的输出缓冲。

状态如何对应转置定义
~~~~~~~~~~~~~~~~~~~~

``NR`` 是当前输入行号，``NF`` 是当前行字段数，``$column`` 是该行第 ``column`` 个字段。
数组 ``transposed[column]`` 的不变量是：处理完前 ``NR`` 行后，它恰好包含这些行的第
``column`` 个字段，顺序与原行一致，并以单个空格分隔。

处理第一行时直接赋值，不添加前导空格；之后每读一行，就在旧缓冲末尾追加一个空格和当前
字段。这个状态转移把矩阵坐标：

.. code-block:: text

   input[row][column]

写入对应的：

.. code-block:: text

   output[column] 的下一个字段

因此无需保存完整二维数组或在结束阶段重新访问单元格。

为什么单独记录列数
~~~~~~~~~~~~~~~~~~

第一条规则在 ``NR == 1`` 时保存 ``columns = NF``。题目保证所有输入行字段数相同，第一行
即可确定最终输出行数。``END`` 阶段使用这个固定值，而不是依赖最后一行的临时 ``NF``，
让状态含义更明确；空文件从未设置 ``columns``，其数值默认为 0，结束循环不会输出任何行。

``awk`` 默认把一段连续空白当作字段分隔，所以输入使用一个或多个空格时，``$column`` 仍是
单独字段。脚本自己拼接字面 ``" "``，保证输出字段之间恰好一个空格，不继承输入中的多余
间隔。

具体状态走读
~~~~~~~~~~~~

处理示例第一行后：

.. code-block:: text

   transposed[1] = "item"
   transposed[2] = "qty"
   transposed[3] = "zone"

第二行到来后分别追加 ``pens、8、north``，状态变成
``"item pens"``、``"qty 8"``、``"zone north"``；第三行再追加
``paper、3、west``。直到此时三个输出行才完整，``END`` 按列号 1、2、3 依次打印。

顺序与边界
~~~~~~~~~~

输入行从上到下读取，追加操作天然保持每个输出行内部字段顺序；``END`` 中列号递增，保持
原列从左到右成为输出行从上到下。关联数组本身的迭代顺序没有保证，所以不能写
``for (column in transposed)``，必须显式使用数值范围 ``1..columns``。

设文件有 ``r*c`` 个字段，总字符量为 ``L``。每个字段读取、追加和最终输出一次，概念上
为 ``O(L)`` 工作；由于不可在读完整列前输出，脚本保存的列缓冲总长度为 ``O(L)``。它用
内存换取一次文件扫描；逐列多次扫描可降低单次缓冲，但会重复读取输入。
