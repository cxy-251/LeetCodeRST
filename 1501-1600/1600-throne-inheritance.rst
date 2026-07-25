1600. Throne Inheritance
========================

题目信息
--------

:题号: 1600
:难度: Medium
:主题: 设计题、树、先序遍历、继承顺序
:原题: `LeetCode 1600 <https://leetcode.com/problems/throne-inheritance/>`_
:重点: 子女按出生顺序排列；继承顺序为王室家族树的先序遍历，已死亡成员从结果中跳过但其后代仍保留

题目重述
--------

实现 ``ThroneInheritance`` 类。构造时给定国王姓名。``birth(parentName,childName)`` 记录某人的新生子女，兄弟姐妹按出生时间排序；``death(name)`` 标记成员死亡；``getInheritanceOrder()`` 返回当前继承顺序。

继承顺序从国王开始，依次访问每人的子女及其后代，采用出生顺序。死亡成员不出现在返回列表中，但不会删除其家族节点，其后代仍按原位置参与继承。

所有姓名唯一，方法总调用次数不超过 ``10^5``。

自建示例
--------

死亡成员会从顺序中移除：

.. code-block:: text

   输入：
   ["ThroneInheritance","birth","birth","getInheritanceOrder","death","getInheritanceOrder"]
   [["king"],["king","alice"],["king","bob"],[],["alice"],[]]
   输出：[null,null,null,["king","alice","bob"],null,["king","bob"]]
   解释：alice 死亡后不再出现在继承列表中。

死亡父母的后代仍保留继承资格：

.. code-block:: text

   输入：国王 king；依次 birth(king,alice)、birth(alice,carol)、death(alice)
   输出：["king","carol"]
   解释：alice 被跳过，但其子女 carol 仍位于原家系位置。