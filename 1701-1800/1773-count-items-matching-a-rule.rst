1773. Count Items Matching a Rule
=================================

题目信息
--------

:题号: 1773
:难度: Easy
:主题: 数组、字符串匹配
:原题: `LeetCode 1773 <https://leetcode.com/problems/count-items-matching-a-rule/>`_
:重点: 每个物品字段顺序固定为类型、颜色、名称

题目重述
--------

给定物品三字段数组、规则键和规则值。统计指定字段等于规则值的物品数量。

自建示例
--------

.. code-block:: text

   输入：items = [["phone","blue","pixel"],["computer","silver","lenovo"]], ruleKey = "color", ruleValue = "blue"
   输出：1
   解释：只有第一件物品颜色为 blue。

.. code-block:: text

   输入：items = [["a","b","c"]], ruleKey = "name", ruleValue = "x"
   输出：0
   解释：没有名称匹配。