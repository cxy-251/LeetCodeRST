0115. Distinct Subsequences
===========================

题目信息
--------

:题号: 0115. 不同的子序列
:难度: Hard
:主题: 字符串、组合计数、动态规划、滚动数组
:原题: `LeetCode 0115 <https://leetcode.com/problems/distinct-subsequences/>`_
:重点: 将选或不选的指数搜索合并为源前缀与目标前缀状态，再用逆序更新保证一个源下标只使用一次

题目重述
--------

给定字符串 ``s`` 和 ``t``，统计有多少种方式可以从 ``s`` 删除零个或多个字符，使剩余字符保持原相对顺序
并恰好组成 ``t``。

不同方案按保留的 ``s`` 下标序列区分：即使字符值相同，只要选择了不同源下标，就要分别计数。删除不能改变
字符顺序，也不能重复使用同一下标。最终答案保证能放入 32 位有符号整数。

``s``、``t`` 长度都在 ``1..1000`` 范围内，只包含小写英文字母。

自建示例
--------

* 重复字符产生多种下标方案：``s = "banana"``、``t = "ban"``，返回 ``3``，可选择下标
  ``(0,1,2)``、``(0,1,4)``、``(0,3,4)``；
* 相对顺序不符：``s = "abc"``、``t = "ca"``，返回 ``0``；
* 目标更长：``s = "ab"``、``t = "aba"``，返回 ``0``；
* 全部字符相同：``s = "aaaa"``、``t = "aa"``，返回 ``6``，对应从四个下标中选择两个。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <string>
   #include <vector>

   class Solution {
   private:
       static constexpr long long LIMIT = INT_MAX;

       long long cappedAdd(long long first, long long second) {
           return std::min(LIMIT, first + second);
       }

       int tableDynamicProgramming(const std::string& s, const std::string& t) {
           const int sourceLength = static_cast<int>(s.size());
           const int targetLength = static_cast<int>(t.size());
           std::vector<std::vector<long long>> ways(
               sourceLength + 1, std::vector<long long>(targetLength + 1));
           for (int sourceCount = 0; sourceCount <= sourceLength; ++sourceCount) {
               ways[sourceCount][0] = 1;
           }
           for (int sourceCount = 1; sourceCount <= sourceLength; ++sourceCount) {
               for (int targetCount = 1; targetCount <= targetLength; ++targetCount) {
                   ways[sourceCount][targetCount] = ways[sourceCount - 1][targetCount];
                   if (s[sourceCount - 1] == t[targetCount - 1]) {
                       ways[sourceCount][targetCount] =
                           cappedAdd(ways[sourceCount][targetCount], ways[sourceCount - 1][targetCount - 1]);
                   }
               }
           }
           return static_cast<int>(ways[sourceLength][targetLength]);
       }

       int rollingDynamicProgramming(const std::string& s, const std::string& t) {
           if (t.size() > s.size()) {
               return 0;
           }
           std::vector<long long> ways(t.size() + 1);
           ways[0] = 1;
           for (char sourceCharacter : s) {
               for (int targetCount = static_cast<int>(t.size()); targetCount >= 1; --targetCount) {
                   if (sourceCharacter == t[targetCount - 1]) {
                       ways[targetCount] = cappedAdd(ways[targetCount], ways[targetCount - 1]);
                   }
               }
           }
           return static_cast<int>(ways[t.size()]);
       }

   public:
       int numDistinct(std::string s, std::string t) {
           return rollingDynamicProgramming(s, t);
       }
   };

题解
----

选与不选的搜索树
~~~~~~~~~~~~~~~~

扫描 ``s`` 时，每个位置都有两种决定：删除当前字符，或在它与当前所需目标字符相等时保留它。枚举所有决定
形成最多 ``2^n`` 条分支；到达源字符串末尾时，恰好匹配完 ``t`` 的分支计为一种方案。

这种枚举是正确的，因为每个保留下标序列对应唯一一组“选或不选”决定。相同字符位于不同下标时属于不同
分支，正好符合题目的计数口径。

指数搜索重复了大量后续问题。不同选择可能到达同一状态：已经处理 ``s`` 的前 ``i`` 个字符，也已经组成
``t`` 的前 ``j`` 个字符；从这里继续的方案数只取决于 ``i``、``j``，与更早具体选择了哪些下标无关。

二维前缀状态
~~~~~~~~~~~~

定义 ``ways[i][j]`` 为使用 ``s`` 前 ``i`` 个字符组成 ``t`` 前 ``j`` 个字符的下标方案数。

空目标 ``j = 0`` 始终有一种方案：删除当前源前缀的全部字符，所以 ``ways[i][0] = 1``。空源无法组成非空
目标，初始化的 ``ways[0][j] = 0`` 保持不变。

观察新加入源前缀的最后下标 ``i - 1``，全部方案可以按是否使用它分成两类：

* 不使用 ``s[i - 1]``：方案完全来自 ``ways[i - 1][j]``；
* 若 ``s[i - 1] == t[j - 1]``，使用它作为目标前缀最后字符：此前必须组成 ``t`` 前 ``j - 1`` 个字符，
  方案来自 ``ways[i - 1][j - 1]``。

.. code-block:: text

   ways[i][j] = ways[i - 1][j]
   if s[i - 1] == t[j - 1]:
       ways[i][j] += ways[i - 1][j - 1]

两类方案按是否包含源下标 ``i - 1`` 划分，互斥且覆盖全部可能，因此可以直接相加。二维表把所有到达同一
前缀状态的指数分支合并，每个状态只计算一次。

一维状态压缩
~~~~~~~~~~~~

第 ``i`` 行只读取第 ``i - 1`` 行，可以把源前缀维度压缩掉。处理当前 ``sourceCharacter`` 前，
``ways[j]`` 表示旧源前缀组成目标前 ``j`` 个字符的方案数；处理后，它要加上旧的 ``ways[j - 1]``。

目标下标必须从右向左更新。若从左向右，``ways[j - 1]`` 已经包含当前源字符，随后更新 ``ways[j]`` 时会在
同一方案中再次使用这个下标。例如只处理一个字符 ``'a'``、目标为 ``"aa"``，正序会先令 ``ways[1] = 1``，
再错误地用这个新值令 ``ways[2] = 1``。逆序保证读取的左邻居仍属于上一轮源前缀。

状态走读
~~~~~~~~

对 ``s = "banana"``、``t = "ban"``，``ways`` 各位置依次表示目标前缀 ``""``、``"b"``、``"ba"``、
``"ban"``：

.. list-table::
   :header-rows: 1

   * - 已处理源前缀
     - ``ways``
     - 新增含义
   * - ``""``
     - ``[1,0,0,0]``
     - 只有空目标
   * - ``"b"``
     - ``[1,1,0,0]``
     - 下标 0 可形成 ``"b"``
   * - ``"ba"``
     - ``[1,1,1,0]``
     - 得到第一种 ``"ba"``
   * - ``"ban"``
     - ``[1,1,1,1]``
     - 得到第一种 ``"ban"``
   * - ``"bana"``
     - ``[1,1,2,1]``
     - 两个 ``a`` 下标可形成 ``"ba"``
   * - ``"banan"``
     - ``[1,1,2,3]``
     - 两种旧 ``"ba"`` 加入当前 ``n``
   * - ``"banana"``
     - ``[1,1,3,3]``
     - 最终完整目标仍为 3 种

数值上界处理
~~~~~~~~~~~~

题目只保证最终完整目标计数适合 32 位；某些较短目标前缀可能拥有更多选择。代码把每个状态饱和到
``INT_MAX``，并使用 ``long long`` 完成两个已饱和值的加法。

转移只有非负加法。如果某个超过上界的前缀状态能够继续扩展成完整目标，固定任意一种后缀扩展后，它的每个
不同前缀方案都会产生不同完整下标序列，最终答案也会超过上界，与题目保证矛盾。因此被饱和的状态不会改变
合法最终答案；不能贡献到最终目标的巨大状态本来也与返回值无关。

主解与复杂度
~~~~~~~~~~~~

目标比源更长时无法选择足够下标，主解直接返回 ``0``。公开入口采用逆序一维 DP，因为它保留二维转移的旧行
语义，把工作空间从 ``O(nm)`` 压缩为 ``O(m)``。

设 ``n = s.length``、``m = t.length``。二维与一维方案都计算至多 ``nm`` 个字符配对状态，时间
``O(nm)``；二维空间 ``O(nm)``，一维工作空间 ``O(m)``。返回值只占常数空间。
