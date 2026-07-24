0535. Encode and Decode TinyURL
===============================

题目信息
--------

:题号: 0535
:难度: Medium
:主题: 设计、URL 映射、编码解码、对象状态
:原题: `LeetCode 0535 <https://leetcode.com/problems/encode-and-decode-tinyurl/>`_
:重点: encode 生成可用于恢复的短链接、decode 必须返回对应原链接、不同链接不能发生不可区分的冲突

题目重述
--------

设计 ``Codec`` 类，实现 ``encode(longUrl)`` 和 ``decode(shortUrl)``。``encode`` 接收一个长网址并返回它的短网址表示；``decode`` 接收此前生成的短网址并恢复原始长网址。

题目不限定短网址的具体格式或编码方法，但必须保证对每个已编码网址都有 ``decode(encode(longUrl)) = longUrl``。对象可以在多次调用之间保存映射状态；不同长网址生成的可用短网址不能在解码时产生歧义。

自建示例
--------

编码后能够无损恢复：

.. code-block:: text

   输入：longUrl = "https://example.com/articles/42"
   输出：shortUrl = encode(longUrl)，decode(shortUrl) = "https://example.com/articles/42"
   解释：短网址文本由实现自行决定，但解码结果必须与原网址完全一致。

两个网址保持独立映射：

.. code-block:: text

   输入：依次编码 "https://a.example/x" 和 "https://b.example/y"
   输出：分别解码两个短网址时返回各自原网址
   解释：两个映射不能互相覆盖或混淆。