1032. Stream of Characters
==========================

题目信息
--------

:题号: 1032
:难度: Hard
:主题: 设计题、字符流、后缀匹配
:原题: `LeetCode 1032 <https://leetcode.com/problems/stream-of-characters/>`_
:重点: 对象保存按时间到达的全部查询字符；每次 ``query`` 判断当前字符流是否存在一个后缀恰好等于给定单词

题目重述
--------

实现 ``StreamChecker`` 类。构造函数接收小写单词数组 ``words``。对象之后会按顺序多次调用 ``query(letter)``，每次把一个小写字母追加到已有字符流末尾。

``query`` 需要判断追加后的整个字符流是否有某个非空后缀与 ``words`` 中的任意单词完全相同。若存在返回 ``true``，否则返回 ``false``。各次调用共享之前已经输入的所有字符状态。

``1 <= words.length <= 2000``，``1 <= words[i].length <= 200``；调用 ``query`` 的总次数不超过 ``4 * 10^4``，所有字符均为小写英文字母。

自建示例
--------

不同查询时刻可以匹配不同后缀：

.. code-block:: text

   输入：
   ["StreamChecker","query","query","query","query"]
   [[['ab','ba','aa']],['a'],['b'],['a'],['a']]
   输出：[null,false,true,true,true]
   解释：字符流依次为 a、ab、aba、abaa；后三个时刻的后缀分别匹配 ab、ba 和 aa。

字符流始终没有匹配后缀：

.. code-block:: text

   输入：
   ["StreamChecker","query","query"]
   [[['z']],['a'],['b']]
   输出：[null,false,false]
   解释：字符流依次为 a、ab，它们的任何非空后缀都不等于单词 z。