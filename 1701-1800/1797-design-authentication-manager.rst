1797. Design Authentication Manager
===================================

题目信息
--------

:题号: 1797
:难度: Medium
:主题: 设计题、哈希表、过期时间
:原题: `LeetCode 1797 <https://leetcode.com/problems/design-authentication-manager/>`_
:重点: 令牌在 ``currentTime`` 等于过期时间时已失效；续期只对尚未过期令牌生效

题目重述
--------

实现认证管理器。``generate`` 创建令牌并设置过期时间，``renew`` 延长仍有效令牌，``countUnexpiredTokens`` 返回当前未过期令牌数量。调用时间严格递增。

自建示例
--------

.. code-block:: text

   输入：["AuthenticationManager","generate","countUnexpiredTokens","countUnexpiredTokens"], [[5],["a",1],[5],[6]]
   输出：[null,null,1,0]
   解释：令牌过期时间为 6，在时间 5 有效，在时间 6 已失效。

.. code-block:: text

   输入：["AuthenticationManager","generate","renew","countUnexpiredTokens"], [[3],["x",1],["x",2],[4]]
   输出：[null,null,null,1]
   解释：时间 2 续期后新过期时间为 5。