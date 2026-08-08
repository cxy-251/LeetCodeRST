0159. Longest Substring with At Most Two Distinct Characters
============================================================

题目信息
--------

:题号: 0159. 至多包含两个不同字符的最长子串
:难度: Medium
:主题: 字符串、滑动窗口、频次表、双指针
:原题: `LeetCode 0159 <https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/>`_
:重点: 维护至多两个字符的最长可行窗口，第三种字符进入时只删除必要的左前缀，并用频次归零判断种类消失

题目重述
--------

给定字符串 ``s``，返回其中至多包含两种不同字符的最长连续子串长度。子串必须在原字符串中连续；同一字符
可以出现任意多次。空字符串返回 ``0``。

自建示例
--------

* ``s = "eceba"``：最长合法子串为 ``"ece"``，包含 ``e``、``c`` 两种字符，返回 ``3``；
* ``s = "ccaabbb"``：``"aabbb"`` 长度为 ``5``，只含 ``a``、``b``；
* ``s = "aaaa"``：整串只有一种字符，返回 ``4``；
* ``s = ""``：没有非空子串，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <unordered_map>

   class Solution {
   private:
       int expandFromEveryStart(const std::string& s) {
           int bestLength = 0;
           for (int start = 0;
                start < static_cast<int>(s.size());
                ++start) {
               std::unordered_map<char, int> frequency;
               for (int end = start;
                    end < static_cast<int>(s.size());
                    ++end) {
                   ++frequency[s[end]];
                   if (frequency.size() > 2) {
                       break;
                   }
                   bestLength = std::max(
                       bestLength,
                       end - start + 1
                   );
               }
           }
           return bestLength;
       }

       int keepLongestValidWindow(const std::string& s) {
           std::unordered_map<char, int> frequency;
           int left = 0;
           int bestLength = 0;

           for (int right = 0;
                right < static_cast<int>(s.size());
                ++right) {
               ++frequency[s[right]];

               while (frequency.size() > 2) {
                   const char removed = s[left];
                   ++left;
                   --frequency[removed];
                   if (frequency[removed] == 0) {
                       frequency.erase(removed);
                   }
               }

               bestLength = std::max(
                   bestLength,
                   right - left + 1
               );
           }
           return bestLength;
       }

   public:
       int lengthOfLongestSubstringTwoDistinct(std::string s) {
           return keepLongestValidWindow(s);
       }
   };

题解
----

原始方案：为每个左端重新扩张
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定 ``start`` 后向右加入字符，并用频次表统计种类；一旦出现第三种字符，更长的同起点子串也都会非法，
可以停止当前扩张。``expandFromEveryStart`` 已经利用了这个单调性，但相邻起点会重复统计大片重叠区域。
例如只有两种字符的长字符串，每个起点都能扫描到末尾，时间仍为 ``O(n^2)``。

当右端继续前进时，旧窗口中的字符统计并没有失效。与其换一个起点从头计算，不如保留窗口，只在约束被
破坏时移动左端删除必要字符。

窗口状态必须保存频次而不只是字符集合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令当前窗口为闭区间 ``[left, right]``，频次表精确记录其中每个字符的出现次数。右端字符加入后，若种类数
不超过二，窗口仍合法；若出现第三种，就逐个移出左端字符，直到某个字符频次降为零并从表中删除，种类数
重新变为二。

只保存“当前见过哪些字符”不够，因为移走一个字符实例不代表这个字符已经离开窗口。例如 ``"ece"`` 左端
移出第一个 ``e`` 后，右侧仍有另一个 ``e``；只有计数从一降到零时，才应减少不同字符数。

为什么只移动左端不会漏掉更优答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定右端 ``right`` 时，若窗口含三种字符，任何比当前 ``left`` 更靠左的起点只会包含更多字符，也必然非法；
因此只能右移左端。收缩到种类数首次回到二时，当前 ``left`` 是这个右端下最靠左的合法起点，窗口就是以
``right`` 结尾的最长合法子串。用它更新全局最大值即可覆盖每个可能右端的最优候选。

被左端永久移出的字符也无需将来重新加入旧位置：后续右端只会更靠右，任何包含这些旧位置的窗口若已经因
第三种字符非法，不可能通过增加更多字符重新合法。两个指针都只向右移动。

具体走读 ``eceba``
~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 新右端
     - 加入后状态
     - 收缩与合法窗口
   * - ``e``，下标 ``0``
     - ``{e:1}``
     - ``"e"``，长度 ``1``
   * - ``c``，下标 ``1``
     - ``{e:1,c:1}``
     - ``"ec"``，长度 ``2``
   * - ``e``，下标 ``2``
     - ``{e:2,c:1}``
     - ``"ece"``，长度 ``3``
   * - ``b``，下标 ``3``
     - 出现第三种 ``{e:2,c:1,b:1}``
     - 移出 ``e`` 后仍三种，再移出 ``c``；窗口为 ``"eb"``
   * - ``a``，下标 ``4``
     - ``{e:1,b:1,a:1}``
     - 依次移出 ``e``，窗口为 ``"ba"``

在处理 ``b`` 时，第一个 ``e`` 被移出后计数仍为一，不能提前删除 ``e`` 键；继续移出唯一的 ``c`` 后才
恢复两种字符。

更新顺序与空串边界
~~~~~~~~~~~~~~~~~~

必须先完成 ``while`` 收缩，再用 ``right-left+1`` 更新答案；在第三种字符仍存在时更新会把非法窗口计入。
空串的右端循环不执行，``bestLength`` 保持零。频次表使用 ``char`` 为键，不依赖固定字母表大小，也无需为
某种字符编码单独开数组。

正确性与复杂度
~~~~~~~~~~~~~~

每轮结束时频次表与窗口内容一致、种类数至多二，且对当前右端窗口尽可能长；因此所有记录长度都合法，每个
右端的最佳合法候选又都被检查，全局最大值正确。右指针访问每个字符一次，左指针也最多移出每个字符一次，
总时间 ``O(n)``，不是嵌套循环表面上的二次方。频次表在收缩完成后最多含两个键，工作空间 ``O(1)``；
逐起点基线最坏 ``O(n^2)``。
