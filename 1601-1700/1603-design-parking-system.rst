1603. Design Parking System
===========================

题目信息
--------

:题号: 1603
:难度: Easy
:主题: 设计题、计数器、对象状态
:原题: `LeetCode 1603 <https://leetcode.com/problems/design-parking-system/>`_
:重点: 三种车位容量独立维护；停车成功后对应剩余容量减一

题目重述
--------

实现 ``ParkingSystem``。构造函数给出大型、中型、小型车位数。``addCar(carType)`` 尝试停入对应类型车位，成功返回 ``true`` 并占用一个车位，容量已满时返回 ``false``。

``carType`` 为 ``1``、``2`` 或 ``3``，方法调用共享对象状态。

自建示例
--------

.. code-block:: text

   输入：["ParkingSystem","addCar","addCar","addCar"], [[1,1,0],[1],[2],[3]]
   输出：[null,true,true,false]
   解释：大型和中型各有一个车位，小型容量为零。

.. code-block:: text

   输入：["ParkingSystem","addCar","addCar"], [[1,0,0],[1],[1]]
   输出：[null,true,false]
   解释：第一次停车后唯一大型车位被占用，第二次失败。