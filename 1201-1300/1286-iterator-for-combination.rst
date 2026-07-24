1286. Iterator for Combination
==============================

题目信息
--------

:题号: 1286
:难度: Medium
:主题: 设计题、组合、字典序、迭代器
:原题: `LeetCode 1286 <https://leetcode.com/problems/iterator-for-combination/>`_
:重点: ``characters`` 已严格递增且字符互不相同；按字典序依次返回固定长度组合，并支持判断是否还有下一项

题目重述
--------

实现 ``CombinationIterator`` 类。构造函数接收按字典序严格递增的不同小写字母字符串 ``characters`` 和整数 ``combinationLength``。

对象需要按字典序升序枚举从 ``characters`` 中选择指定数量字符形成的所有组合。``next()`` 返回下一组合；``hasNext()`` 判断是否仍有未返回组合。各次调用共享迭代进度。

``1 <= combinationLength <= characters.length <= 15``，测试保证只在存在下一项时调用 ``next``，方法总调用次数不超过 ``10^4``。

自建示例
--------

组合按字典序逐项返回：

.. code-block:: text

   输入：
   ["CombinationIterator","next","next","hasNext"]
   [["abcd",2],[],[],[]]
   输出：[null,"ab","ac",true]
   解释：长度为 2 的组合顺序以 ab、ac、ad、bc、bd、cd 开始。

组合长度等于字符数时只有一个结果：

.. code-block:: text

   输入：
   ["CombinationIterator","next","hasNext"]
   [["xyz",3],[],[]]
   输出：[null,"xyz",false]
   解释：必须选择全部三个字符，因此只有一个组合。