1157. Online Majority Element In Subarray
=========================================

题目信息
--------

:题号: 1157
:难度: Hard
:主题: 设计题、区间查询、多数元素
:原题: `LeetCode 1157 <https://leetcode.com/problems/online-majority-element-in-subarray/>`_
:重点: 每次查询统计闭区间 ``[left,right]``；题目保证 ``threshold`` 严格超过区间长度的一半，因此符合条件的元素至多一个

题目重述
--------

实现 ``MajorityChecker`` 类，构造函数接收整数数组 ``arr``。方法 ``query(left, right, threshold)`` 在闭区间 ``arr[left..right]`` 中寻找出现次数至少为 ``threshold`` 的元素。

查询保证 ``2 * threshold > right - left + 1``。若存在符合条件的元素，返回该元素；否则返回 ``-1``。

``1 <= arr.length <= 2 * 10^4``，``1 <= arr[i] <= 2 * 10^4``；查询次数不超过 ``10^4``，下标和阈值均合法。

自建示例
--------

同一对象处理成功与失败查询：

.. code-block:: text

   输入：
   ["MajorityChecker","query","query"]
   [[[2,2,1,2,3]],[0,3,3],[1,4,3]]
   输出：[null,2,-1]
   解释：区间 [0,3] 中 2 出现三次；区间 [1,4] 没有元素出现至少三次。

单元素区间：

.. code-block:: text

   输入：
   ["MajorityChecker","query"]
   [[[9]],[0,0,1]]
   输出：[null,9]
   解释：唯一元素在长度为 1 的区间中出现一次，达到阈值 1。