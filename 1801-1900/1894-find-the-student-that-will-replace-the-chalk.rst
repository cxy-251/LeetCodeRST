1894. Find the Student that Will Replace the Chalk
=================================================

题目信息
--------

:题号: 1894
:难度: Medium
:主题: 前缀和、模拟、二分查找
:原题: `LeetCode 1894 <https://leetcode.com/problems/find-the-student-that-will-replace-the-chalk/>`_
:重点: 学生循环消耗粉笔，返回首次粉笔不足时的学生下标

题目重述
--------

学生按顺序循环使用粉笔，学生 ``i`` 每次消耗 ``chalk[i]``。返回当前剩余粉笔不足以供其使用的第一名学生下标。

自建示例
--------

.. code-block:: text

   输入：chalk = [3,4,1], k = 7
   输出：2
   解释：前两名学生共用掉 7 支，第三名学生无法获得所需的 1 支。

.. code-block:: text

   输入：chalk = [5], k = 100
   输出：0
   解释：总量是 5 的倍数，循环结束后仍由唯一学生更换粉笔。
