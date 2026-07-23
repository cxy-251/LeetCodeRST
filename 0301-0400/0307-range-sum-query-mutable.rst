0307. Range Sum Query - Mutable
===============================

题目信息
--------

:题号: 0307
:难度: Medium
:主题: 数组、可变对象、单点更新、区间和
:原题: `LeetCode 0307 <https://leetcode.com/problems/range-sum-query-mutable/>`_
:重点: 更新会改变后续查询状态、区间包含两个端点、同一对象支持交错调用

题目重述
--------

实现 ``NumArray`` 类。构造函数接收整数数组 ``nums``；``update(index, val)`` 把下标 ``index`` 的元素替换为 ``val``；``sumRange(left, right)`` 返回当前数组中闭区间 ``[left, right]`` 的元素总和。

数组长度位于 ``[1, 3 * 10^4]``，初始元素及更新值均位于 ``[-100, 100]``。更新下标始终有效，查询满足 ``0 <= left <= right < nums.length``。``update`` 与 ``sumRange`` 的总调用次数不超过 ``3 * 10^4``；每次更新都必须影响之后在同一对象上执行的查询。

自建示例
--------

查询与更新交错发生：

.. code-block:: text

   输入：NumArray([4, -1, 6])
        sumRange(0, 2)
        update(1, 5)
        sumRange(0, 2)
        sumRange(1, 1)
   输出：9
        null
        15
        5
   解释：更新把数组从 [4,-1,6] 改为 [4,5,6]；后两次查询都必须读取更新后的值。
