1206. Design Skiplist
=====================

题目信息
--------

:题号: 1206
:难度: Hard
:主题: 设计题、跳表、有序集合、随机化
:原题: `LeetCode 1206 <https://leetcode.com/problems/design-skiplist/>`_
:重点: 实现 ``search``、``add`` 和 ``erase``；结构允许重复值，``erase`` 每次只删除一个实例

题目重述
--------

实现 ``Skiplist`` 类，维护一个可包含重复整数的有序多重集合。``search(target)`` 判断目标值是否至少存在一次；``add(num)`` 插入一个值；``erase(num)`` 在值存在时删除其中一个实例并返回 ``true``，不存在时返回 ``false``。

禁止直接使用语言内置的平衡树、集合或其他等价容器替代跳表。各次方法调用共享同一个对象状态。

``0 <= num, target <= 2 * 10^4``，三种方法的总调用次数不超过 ``5 * 10^4``。

自建示例
--------

删除重复值时只移除一个实例：

.. code-block:: text

   输入：
   ["Skiplist","add","add","search","erase","search"]
   [[],[4],[4],[4],[4],[4]]
   输出：[null,null,null,true,true,true]
   解释：插入两个 4 后第一次删除只移除一个，另一个 4 仍可被搜索到。

空结构中查询和删除都失败：

.. code-block:: text

   输入：
   ["Skiplist","search","erase"]
   [[],[9],[9]]
   输出：[null,false,false]
   解释：对象尚未插入任何元素，因此搜索与删除都返回 false。