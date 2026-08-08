0180. Consecutive Numbers
=========================

题目信息
--------

:题号: 0180. 连续出现的数字
:难度: Medium
:主题: Database、窗口函数、相邻记录、去重
:原题: `LeetCode 0180 <https://leetcode.com/problems/consecutive-numbers/>`_
:重点: 将连续三行压缩为当前行及两个前驱的窗口状态，并把重叠命中归并为一个数字

题目重述
--------

``Logs(id, num)`` 表按自增主键 ``id`` 记录数字。查询所有至少在三条连续记录中重复出现的
数字，将结果列命名为 ``ConsecutiveNums``。

同一数字可能形成多段或长度超过 3 的连续区间，但结果中只输出一次。结果顺序任意。

自建示例
--------

.. code-block:: text

   Logs:
   id | num
   1  | 7
   2  | 7
   3  | 7
   4  | 4
   5  | 7
   6  | 4
   7  | 4
   8  | 4

   输出：
   ConsecutiveNums
   7
   4

   7 在 id 1..3 连续出现；4 在 id 6..8 连续出现。总次数相同并不能替代连续性。

.. code-block:: text

   Logs:
   id | num
   1  | 5
   2  | 5
   3  | 5
   4  | 5

   输出：
   ConsecutiveNums
   5

   长度 4 的连续段包含两个长度 3 的重叠窗口，但数字只输出一次。

SQL 实现
--------

.. code-block:: sql

   WITH history AS (
       SELECT
           id,
           num,
           LAG(id, 1) OVER (ORDER BY id) AS previous_id,
           LAG(id, 2) OVER (ORDER BY id) AS two_back_id,
           LAG(num, 1) OVER (ORDER BY id) AS previous_num,
           LAG(num, 2) OVER (ORDER BY id) AS two_back_num
       FROM Logs
   )
   SELECT DISTINCT num AS ConsecutiveNums
   FROM history
   WHERE id = previous_id + 1
     AND previous_id = two_back_id + 1
     AND num = previous_num
     AND num = two_back_num;

题解
----

总频次丢失了顺序
~~~~~~~~~~~~~~~~

按 ``num`` 分组并筛选 ``COUNT(*) >= 3`` 只能说明某数字总共出现至少三次。示例中的 7
在 id 1..3 构成连续段，但若三次 7 分散在 id 1、3、5，总计数仍为 3，却不应输出。

原始搜索可以把每一行当作起点，再分别查找 ``id+1``、``id+2`` 两行并比较数值；使用三份
``Logs`` 自连接能直接表达，但同一张表会被展开为三种角色。窗口函数更贴近顺序问题：
扫描到当前行时，只需知道前一行和前两行的状态。

当前行作为三行窗口终点
~~~~~~~~~~~~~~~~~~~~~~~~

把每条记录视为一个长度 3 窗口的终点。``LAG(column, offset) OVER (ORDER BY id)`` 在
``id`` 顺序中读取前 ``offset`` 条记录，因此 ``history`` 为当前行附加：

* ``previous_id``、``previous_num``：前一条记录；
* ``two_back_id``、``two_back_num``：前两条记录。

当前窗口合法需要同时满足两个条件：三条记录的 ``id`` 逐一相差 1，且三个 ``num``
相等。前两行不存在时，``LAG`` 返回 ``NULL``，比较条件不会为真，所以无需单独处理表头。

显式检查 ``id`` 连续比只依赖物理相邻更完整：即使数据中出现主键缺口，窗口也不会把
缺口两侧的记录误当成连续 id。``ORDER BY id`` 既定义前驱是谁，也让检查顺序稳定。

长连续段为何产生重复候选
~~~~~~~~~~~~~~~~~~~~~~~~~~

对 ``5,5,5,5``，以第三行为终点的窗口 ``[1,2,3]`` 命中，以第四行为终点的窗口
``[2,3,4]`` 也命中。窗口查询正确识别了两组三连，但题目输出的是“哪些数字满足”，不是
“有多少个三连窗口”。

因此外层使用 ``SELECT DISTINCT num``，把同一长段的重叠命中、以及同一数字在不同位置
形成的多个连续段统一压缩为一个 ``ConsecutiveNums``。不能在窗口计算前对 ``num`` 去重，
否则连续出现所需的重复行会先被删除。

具体走读
~~~~~~~~

示例的 id 3 行读取到：

.. code-block:: text

   current  = (id 3, num 7)
   previous = (id 2, num 7)
   two_back = (id 1, num 7)

两个 id 差都为 1，三个数字都为 7，于是产生候选 7。id 5 的当前数字也是 7，但前驱是
id 4 的 4，数值条件失败；分散出现不会混入连续段。id 8 行同理以 6、7、8 三条记录命中
数字 4。

查询层次与执行代价
~~~~~~~~~~~~~~~~~~

公共表表达式先只负责建立顺序状态，外层再负责判定窗口和结果去重，两个阶段的粒度明确。
窗口中的排序并不保证最终结果顺序，题目又允许任意顺序，所以无需外层 ``ORDER BY``。

无 ``id`` 顺序可利用时，窗口计算通常需要 ``O(n log n)`` 排序，再线性扫描；主键索引可
帮助按 id 读取。外层去重还需对命中数字建立集合或排序。与逐起点反复查找后两行相比，
每条记录的两个前驱只在一次有序窗口扫描中计算。
