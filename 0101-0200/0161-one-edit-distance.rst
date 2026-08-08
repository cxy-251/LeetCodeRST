0161. One Edit Distance
=======================

题目信息
--------

:题号: 0161. 相隔为 1 的编辑距离
:难度: Medium
:主题: 字符串、双指针、编辑距离、分类讨论
:原题: `LeetCode 0161 <https://leetcode.com/problems/one-edit-distance/>`_
:重点: 用长度差确定唯一可能的编辑类型，在首次不匹配处消费一次机会，并排除零次或两次以上编辑

题目重述
--------

给定字符串 ``s``、``t``，判断能否对其中一个字符串恰好执行一次编辑，使两者相等。一次编辑只能是插入
一个字符、删除一个字符或把一个字符替换成另一个字符。原本相等的字符串编辑距离为零，应返回 ``false``；
需要两次及以上编辑也返回 ``false``。

自建示例
--------

* ``s = "ab"``、``t = "ac"``：替换 ``b`` 为 ``c``，返回 ``true``；
* ``s = "ab"``、``t = "acb"``：在 ``a`` 后插入 ``c``，返回 ``true``；
* ``s = "ab"``、``t = "ab"``：无需编辑，不满足“恰好一次”，返回 ``false``；
* ``s = "ab"``、``t = "ba"``：有两个位置不同，一次替换不够，返回 ``false``；
* 空串与单字符字符串相隔一次插入，返回 ``true``；两个空串返回 ``false``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       bool differByExactlyOneEdit(
           const std::string& first,
           const std::string& second
       ) {
           if (first.size() > second.size()) {
               return differByExactlyOneEdit(second, first);
           }

           const int shorterLength = static_cast<int>(first.size());
           const int longerLength = static_cast<int>(second.size());
           if (longerLength - shorterLength > 1) {
               return false;
           }

           int shorterIndex = 0;
           int longerIndex = 0;
           int editsUsed = 0;

           while (shorterIndex < shorterLength &&
                  longerIndex < longerLength) {
               if (first[shorterIndex] == second[longerIndex]) {
                   ++shorterIndex;
                   ++longerIndex;
                   continue;
               }

               ++editsUsed;
               if (editsUsed > 1) {
                   return false;
               }
               if (shorterLength == longerLength) {
                   ++shorterIndex;
               }
               ++longerIndex;
           }

           return editsUsed == 1 ||
                  longerLength == shorterLength + 1;
       }

   public:
       bool isOneEditDistance(std::string s, std::string t) {
           return differByExactlyOneEdit(s, t);
       }
   };

题解
----

通用编辑距离做了多少多余工作
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一般编辑距离动态规划要为所有前缀对计算最少操作数，状态量 ``O(mn)``；也可以枚举每个位置可能执行的
插入、删除、替换，再比较完整字符串。可是本题只关心距离是否恰好为一，绝大多数状态在第二次不匹配出现后
已经没有继续计算价值。

一次编辑对长度的影响只有 ``-1``、``0``、``+1``。因此两串长度差超过一可立即判假；长度相等时唯一可能
是一次替换，长度相差一时唯一可能是对短串插入一个字符，等价地对长串删除一个字符。这个分类把通用三种
选择压缩为由长度决定的唯一推进规则。

先统一谁是短串
~~~~~~~~~~~~~~

辅助函数保证 ``first.size() <= second.size()``。若传入顺序相反，只交换参数递归一次；后续便只需讨论
“等长”或“第二串长一”，不用为删除和插入写两套镜像分支。字符串按常量引用传递，交换调用不复制内容。

双指针的不变量
~~~~~~~~~~~~~~

循环开始时，两个指针之前的前缀已经通过至多 ``editsUsed`` 次编辑对齐。字符相等时，两边同时前进，不消耗
编辑。第一次不同按长度执行：

* 等长：只能把一个字符替换成另一个，两个指针都前进；
* 长串多一个字符：把长串当前字符视为需要删除的字符，或视为短串此处缺少的插入字符；只前进长串指针，
  短串当前字符留待与下一个字符比较。

第二次不匹配意味着唯一编辑机会已经用完，立即返回 ``false``。两种推进都不会回退，因此此前对齐前缀
不会被重新检查。

具体走读插入情况
~~~~~~~~~~~~~~~~

对 ``first="ab"``、``second="acb"``：

.. list-table::
   :header-rows: 1

   * - 指针字符
     - 状态
     - 动作
   * - ``a`` 与 ``a``
     - 相等，``editsUsed=0``
     - 两指针都前进
   * - ``b`` 与 ``c``
     - 首次不匹配，长串多一字符
     - 只跳过长串 ``c``，``editsUsed=1``
   * - ``b`` 与 ``b``
     - 再次相等
     - 两指针前进到末尾，返回真

若第二串是 ``"acd"``，跳过 ``c`` 后还会比较 ``b`` 与 ``d``，形成第二次不匹配并返回假。

循环结束后为何还要检查尾部
~~~~~~~~~~~~~~~~~~~~~~~~~~

如果扫描中已经遇到一次不匹配，``editsUsed == 1`` 表示那次替换或插入/删除使其余部分对齐，答案为真。
如果一直没有不匹配：

* 两串等长，说明完全相同，编辑次数为零，必须返回假；
* 长串恰好多一个字符，额外字符只能在尾部，一次插入/删除即可，必须返回真。

所以返回条件是 ``editsUsed == 1`` 或长度恰差一。长度差分支也覆盖空串与单字符字符串。

为什么不能把条件写成“最多一次”
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

许多实现只在发现第二个差异时返回假，最后无条件返回真，会把 ``"ab"`` 与 ``"ab"`` 误判。题目询问的
不是能否用不超过一次编辑变成相等，而是编辑距离是否等于一；零次状态必须在最终分支明确排除。

正确性与复杂度
~~~~~~~~~~~~~~

若算法返回真，等长时记录的唯一不匹配可由一次替换修复；差一时唯一跳过字符或尾部多字符可由一次插入/
删除修复。反之，任意一次编辑可行的字符串长度差至多一，且除编辑位置外字符顺序完全相同；双指针会在该
位置使用唯一对应推进，此后不会出现第二个差异，所以必返回真。

两个指针最多各扫描一次，时间 ``O(min(m,n))`` 至 ``O(m+n)``，额外空间 ``O(1)``。通用编辑距离表没有
提供本题所需之外的认知收益，因此 C++ 只保留长度分类后的双指针主解。
