1352. Product of the Last K Numbers
===================================

题目信息
--------

:题号: 1352
:难度: Medium
:主题: 设计题、前缀乘积、零值处理
:原题: `LeetCode 1352 <https://leetcode.com/problems/product-of-the-last-k-numbers/>`_
:重点: ``add`` 按顺序追加整数，``getProduct(k)`` 返回最近 ``k`` 个数的乘积；查询范围可能包含零

题目重述
--------

实现 ``ProductOfNumbers`` 类，维护一个动态整数序列。``add(num)`` 把 ``num`` 追加到末尾；``getProduct(k)`` 返回序列最后 ``k`` 个数的乘积。

测试保证调用查询时序列长度至少为 ``k``，并保证任意查询结果可放入 32 位有符号整数。各次调用共享同一序列状态。

``0 <= num <= 100``，方法总调用次数不超过 ``4 * 10^4``。

自建示例
--------

查询跨越零时乘积为零：

.. code-block:: text

   输入：依次 add(3)、add(0)、add(2)、add(5)，再 getProduct(2)、getProduct(3)
   输出：[10,0]
   解释：最后两个数为 2、5；最后三个数包含零。

查询最近一个数：

.. code-block:: text

   输入：新对象执行 add(7)、getProduct(1)
   输出：7
   解释：最近一个数就是 7。