0966. Vowel Spellchecker
========================

题目信息
--------

:题号: 0966
:难度: Medium
:主题: 字符串、拼写匹配、优先级
:原题: `LeetCode 0966 <https://leetcode.com/problems/vowel-spellchecker/>`_
:重点: 每个查询依次尝试大小写敏感完全匹配、忽略大小写匹配、忽略大小写并允许元音互换；后两级有多个匹配时返回 ``wordlist`` 中最早者

题目重述
--------

给定单词列表 ``wordlist`` 和查询数组 ``queries``。对每个查询独立寻找更正结果，并严格按以下优先级处理：若存在大小写完全相同的单词，返回查询本身；否则寻找忽略大小写后相同的单词，返回列表中最先出现者；否则把 ``a、e、i、o、u`` 都视为可互换元音，在忽略大小写后寻找首个匹配；仍无匹配则返回空字符串。

元音错误匹配要求字符串长度相同，且所有辅音位置及辅音字母保持一致。按查询原顺序返回更正结果数组。

``1 <= wordlist.length, queries.length <= 5000``，每个单词长度在 ``[1, 7]`` 范围内，仅含英文字母。

自建示例
--------

展示三级匹配优先级：

.. code-block:: text

   输入：wordlist = ["KiTe","kite","hare"], queries = ["KITE","keto","Hare","zero"]
   输出：["KiTe","KiTe","hare",""]
   解释："KITE" 忽略大小写后首先匹配 "KiTe"；"keto" 通过元音互换匹配 "KiTe"；"Hare" 忽略大小写匹配 "hare"；"zero" 无匹配。

完全匹配优先于前面的大小写匹配：

.. code-block:: text

   输入：wordlist = ["KiTe","kite"], queries = ["kite"]
   输出：["kite"]
   解释：查询与第二个单词大小写完全一致，因此直接返回 "kite"，不会选择列表中更早的 "KiTe"。