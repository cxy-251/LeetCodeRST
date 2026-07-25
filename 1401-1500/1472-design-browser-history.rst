1472. Design Browser History
============================

题目信息
--------

:题号: 1472
:难度: Medium
:主题: 设计题、数组、双栈、历史记录
:原题: `LeetCode 1472 <https://leetcode.com/problems/design-browser-history/>`_
:重点: ``visit`` 会清空当前页面之后的前进历史；``back`` 和 ``forward`` 最多移动指定步数，遇到边界即停止

题目重述
--------

实现 ``BrowserHistory`` 类。构造时设置首页；``visit(url)`` 访问新页面并删除全部前进历史；``back(steps)`` 最多后退 ``steps`` 页；``forward(steps)`` 最多前进 ``steps`` 页。

后退或前进到历史边界时停止，并返回最终页面地址。各次调用共享同一浏览历史状态。

页面地址非空，所有方法总调用次数不超过 ``5000``。

自建示例
--------

访问新页面会清除前进分支：

.. code-block:: text

   输入：
   ["BrowserHistory","visit","visit","back","visit","forward"]
   [["a.com"],["b.com"],["c.com"],[1],["d.com"],[2]]
   输出：[null,null,null,"b.com",null,"d.com"]
   解释：从 b.com 访问 d.com 后，原来的 c.com 前进记录被删除。

后退步数超过历史长度时停在首页：

.. code-block:: text

   输入：
   ["BrowserHistory","visit","back"]
   [["home"],["next"],[5]]
   输出：[null,null,"home"]
   解释：最多只能后退到首页。