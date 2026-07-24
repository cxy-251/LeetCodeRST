0676. Implement Magic Dictionary
================================

题目信息
--------

:题号: 0676
:难度: Medium
:主题: 设计、字典、等长字符串、恰好一次字符替换
:原题: `LeetCode 0676 <https://leetcode.com/problems/implement-magic-dictionary/>`_
:重点: search 必须通过替换恰好一个字符匹配字典词、不能零次替换、不能插入或删除字符、对象保留已构建字典

题目重述
--------

实现 ``MagicDictionary``。``buildDict(dictionary)`` 使用给定字符串数组建立字典；``search(searchWord)`` 判断能否把 ``searchWord`` 中恰好一个位置的字符替换成另一个小写字母，使修改后的字符串与字典中的某个单词完全相同。

替换不会改变字符串长度，因此只有等长字典词可能匹配。原字符串直接存在于字典中并不足以返回 ``true``，除非还存在另一个与它恰好相差一个字符的字典词。字典长度位于 ``[1, 100]``，单词长度位于 ``[1, 100]``，方法总调用次数不超过 ``100``。

自建示例
--------

恰好一个字符不同：

.. code-block:: text

   调用：buildDict(["hello","judge"]), search("hallo"), search("hello")
   输出：true, false
   解释：hallo 把第二个字符改为 e 后得到 hello；hello 自身虽然在字典中，但零次替换不符合要求。

长度不同不能通过替换匹配：

.. code-block:: text

   调用：buildDict(["code"]), search("codes")
   输出：false
   解释：替换操作不能删除多出的字符，因此长度 5 的查询词无法匹配长度 4 的字典词。
