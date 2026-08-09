0205. Isomorphic Strings
========================

题目信息
--------

:题号: 0205. 同构字符串
:难度: Easy
:主题: 字符串、双射、双向映射
:原题: `LeetCode 0205 <https://leetcode.com/problems/isomorphic-strings/>`_
:重点: 同一源字符映射一致、不同源字符不能共享目标，两个方向必须同时检查

题目重述
--------

给定两个字符串 ``s`` 和 ``t``，判断是否可以把 ``s`` 中的每一种字符统一替换成某个字符，
使结果恰好等于 ``t``。同一个源字符的所有出现位置必须映射到同一个目标字符；两个不同源字符
不能映射到同一个目标字符；字符允许映射到自身。

``s`` 和 ``t`` 的长度相同，长度位于 ``[1, 5 * 10^4]``，字符为有效 ASCII 字符。判断的是
对应位置的模式关系，不是字符频次或字典序；函数只返回布尔值，不修改输入字符串。

自建示例
--------

重复位置模式一致：

.. code-block:: text

   输入：s = "egg"，t = "add"
   输出：true
   解释：e->a，g->d；g 的两次出现都映射到 d。

同一个源字符被迫映射到两个目标：

.. code-block:: text

   输入：s = "foo"，t = "bar"
   输出：false
   解释：o 第一次要映射到 a，第二次又要映射到 r，不能由一个统一替换完成。

不同源字符争用同一个目标：

.. code-block:: text

   输入：s = "ab"，t = "aa"
   输出：false
   解释：a 和 b 都需要映射到 a，违反目标字符不能重复占用。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>

   class Solution {
   public:
       bool isIsomorphic(std::string s, std::string t) {
           return checkWithBidirectionalMap(s, t);
       }

   private:
       bool checkWithBidirectionalMap(const std::string& s, const std::string& t) {
           if (s.size() != t.size()) return false;

           std::array<int, 256> sourceToTarget;
           std::array<int, 256> targetToSource;
           sourceToTarget.fill(-1);
           targetToSource.fill(-1);

           for (std::size_t index = 0; index < s.size(); ++index) {
               unsigned char source = static_cast<unsigned char>(s[index]);
               unsigned char target = static_cast<unsigned char>(t[index]);

               if ((sourceToTarget[source] != -1 && sourceToTarget[source] != target) ||
                   (targetToSource[target] != -1 && targetToSource[target] != source)) {
                   return false;
               }

               sourceToTarget[source] = target;
               targetToSource[target] = source;
           }
           return true;
       }

       bool checkByPreviousPositions(const std::string& s, const std::string& t) {
           if (s.size() != t.size()) return false;

           std::array<int, 256> lastSource;
           std::array<int, 256> lastTarget;
           lastSource.fill(0);
           lastTarget.fill(0);

           for (std::size_t index = 0; index < s.size(); ++index) {
               unsigned char source = static_cast<unsigned char>(s[index]);
               unsigned char target = static_cast<unsigned char>(t[index]);
               if (lastSource[source] != lastTarget[target]) return false;

               lastSource[source] = static_cast<int>(index) + 1;
               lastTarget[target] = static_cast<int>(index) + 1;
           }
           return true;
       }
   };

题解
----

逐位置建立替换关系
~~~~~~~~~~~~~~~~~~~~

字符串替换不是为每个位置临时挑一个字符，而是为每个源字符建立一次统一规则。最直接的搜索
是扫描对应位置 ``(s[i], t[i])``，把它解释为一条 ``s[i] -> t[i]`` 关系；之后遇到同一个源
字符时，必须复用已经登记的目标。

但只保存 ``source -> target`` 还不够。例如 ``s = "ab"``、``t = "aa"`` 时，单向表可以先
登记 ``a->a``，再登记 ``b->a``，看不出两个来源占用了同一个目标。合法替换要求的是双射：
既要保证源字符的函数一致性，也要保证目标字符最多有一个来源。

双向映射把冲突变成局部检查
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

维护两张互逆表：

.. code-block:: text

   sourceToTarget[source] = target
   targetToSource[target] = source

处理当前字符对 ``source = s[i]``、``target = t[i]`` 时，先检查两种冲突：若源字符已有目标，
它必须仍等于当前目标；若目标字符已有来源，来源必须仍等于当前源。两项都通过时才写入两张
表；新字符对扩展映射，重复字符对只是再次确认已有事实。

这样每个位置只需常数次数组访问，不必枚举字符替换方案，也不必在后续位置重新搜索前缀。
双向表记录的正是当前前缀已经确定的部分，局部冲突一旦出现就足以拒绝整个字符串。

状态不变量
~~~~~~~~~~~~

扫描到位置 ``index`` 之前，保持：

* 对所有已处理位置，``sourceToTarget[s[i]] == t[i]``；
* ``targetToSource`` 恰好记录同一批关系的反方向；
* 一个源字符至多有一个目标，一个目标字符至多有一个来源；
* 两张表互为逆关系，已登记的配对构成部分双射；
* ``index`` 及之后的字符尚未影响映射。

当前字符对若与任一既有关系冲突，任何后续替换都无法修复已经矛盾的前缀；若无冲突，同时写入
两张表后，不变量继续成立。扫描结束意味着每个位置都满足同一个双射，因此可以返回 ``true``。

状态走读
~~~~~~~~

对 ``s = "egg"``、``t = "add"``：

.. list-table::
   :header-rows: 1

   * - 位置
     - 字符对
     - 新状态
     - 结果
   * - 0
     - ``e,a``
     - ``e->a``、``a->e``
     - 建立第一对关系
   * - 1
     - ``g,d``
     - ``g->d``、``d->g``
     - 建立第二对关系
   * - 2
     - ``g,d``
     - 状态不变
     - 与既有关系一致

对 ``s = "ab"``、``t = "aa"``，位置 0 建立 ``a<->a``；位置 1 的源 ``b`` 尚未出现，但目标
``a`` 已由源 ``a`` 占用，反向表立即报告冲突。对 ``foo`` 与 ``bar``，位置 2 的源 ``o`` 已经
映射到 ``a``，而当前目标是 ``r``，正向表报告冲突。两个失败位置展示了两张表各自不可替代的
职责。

按出现位置记录模式
~~~~~~~~~~~~~~~~~~~~

``checkByPreviousPositions`` 是同一判定的另一种表达。对每个字符记录它上一次出现的位置，
未出现用 ``0`` 表示。扫描位置 ``index`` 时，若 ``s[index]`` 与 ``t[index]`` 的上次出现位置
不同，说明两个字符串的重复模式已经分叉；若相同，就把两者都更新为当前的 ``index + 1``。

例如 ``egg`` 与 ``add`` 在三个位置的上次出现位置分别为 ``(0,0)``、``(0,0)``、``(2,2)``，
模式一致。这个版本不直接保存字符到字符的映射，代码更短，但需要读者先接受“同构等价于每个
位置的上次出现模式相同”；主入口选择双向映射，因为它直接对应题目的替换规则。

代码分析
~~~~~~~~

公共入口调用 ``checkWithBidirectionalMap``，用 256 项数组覆盖有效 ASCII。数组初值 ``-1`` 表示
尚未见过；字符先转成 ``unsigned char`` 再作为下标，避免把有符号 ``char`` 当作负数索引。

代码在写入前同时检查正向和反向关系。长度检查也必须先于按位置访问；虽然题目保证长度相同，
保留该分支使函数契约在独立阅读时完整。重复配对可以重复赋同样的值，不会改变已经成立的不变量。

``checkByPreviousPositions`` 用 ``index + 1`` 区分“从未出现”的 0 与第 0 个位置，并将双向
映射压缩成两个位置状态。它不是第三种本质不同的算法，而是为了展示从显式映射到位置模式的
等价转换；两者都不修改输入字符串。

复杂度与边界
~~~~~~~~~~~~

两种方法都扫描每个字符一次，时间复杂度为 ``O(n)``。双向数组和位置数组各有 256 个槽位，
额外空间为 ``O(1)``；若改用哈希表，空间则按实际不同字符数计为 ``O(k)``。长度不同立即返回
``false``；空字符串虽不在题目约束中，长度相等时也会自然返回 ``true``。

字符映射到自身不需要特殊分支，重复字符只要关系一致即可继续。ASCII 范围使固定数组下标有界，
不会出现因 Unicode 多字节编码而改变题目字符单位的额外语义。
