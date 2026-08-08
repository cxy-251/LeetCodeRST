0125. Valid Palindrome
======================

题目信息
--------

:题号: 0125. 验证回文串
:难度: Easy
:主题: 字符串、双指针、字符归一化
:原题: `LeetCode 0125 <https://leetcode.com/problems/valid-palindrome/>`_
:重点: 分清逻辑序列与物理存储，按需寻找下一对有效字符，以双指针消除完整清洗副本

题目重述
--------

给定字符串 ``s``，只保留英文字母和十进制数字，并把英文字母视为不区分大小写。判断保留下来的字符序列
是否为回文，即从左向右读取与从右向左读取完全相同。

原串只含可打印 ASCII 字符，长度在 ``[1, 2 * 10^5]`` 内。若删除无效字符后序列为空，也应返回
``true``。

自建示例
--------

* ``s = "A man, a plan, a canal: Panama"``：有效字符依次组成 ``amanaplanacanalpanama``，返回
  ``true``；
* ``s = "0P"``：数字 ``0`` 与字母 ``p`` 不相等，返回 ``false``；
* ``s = ".,!"``：没有有效字符，清洗结果为空序列，返回 ``true``；
* ``s = "a-b_Ca"``：两端 ``a/a`` 相等，随后比较 ``b/c``，返回 ``false``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       bool isAsciiLetterOrDigit(char ch) {
           return ('0' <= ch && ch <= '9') ||
                  ('A' <= ch && ch <= 'Z') ||
                  ('a' <= ch && ch <= 'z');
       }

       char normalized(char ch) {
           if ('A' <= ch && ch <= 'Z') {
               return static_cast<char>(ch - 'A' + 'a');
           }
           return ch;
       }

       bool buildNormalizedString(const std::string& s) {
           std::string cleaned;
           cleaned.reserve(s.size());
           for (char ch : s) {
               if (isAsciiLetterOrDigit(ch)) {
                   cleaned.push_back(normalized(ch));
               }
           }

           int left = 0;
           int right = static_cast<int>(cleaned.size()) - 1;
           while (left < right) {
               if (cleaned[left] != cleaned[right]) {
                   return false;
               }
               ++left;
               --right;
           }
           return true;
       }

       bool compareInOriginalString(const std::string& s) {
           int left = 0;
           int right = static_cast<int>(s.size()) - 1;

           while (left < right) {
               while (left < right && !isAsciiLetterOrDigit(s[left])) {
                   ++left;
               }
               while (left < right && !isAsciiLetterOrDigit(s[right])) {
                   --right;
               }

               if (normalized(s[left]) != normalized(s[right])) {
                   return false;
               }
               ++left;
               --right;
           }
           return true;
       }

   public:
       bool isPalindrome(std::string s) {
           return compareInOriginalString(s);
       }
   };

题解
----

先明确真正比较的对象
~~~~~~~~~~~~~~~~~~~~

回文定义作用在“清洗后的字符序列”上，而不是原字符串的物理相邻位置。标点和空格不参与序列；大写字母
也不是另一个字符，而是要先映射到对应小写字母再比较。若直接拿 ``s[left]`` 与 ``s[right]`` 比较，
``"a,a"`` 会在第一步比较 ``a`` 和 ``a`` 后碰到逗号；若只跳过空格，其他标点仍会制造错误。算法必须同时
表达两件事：找到逻辑序列的下一项，以及比较归一化后的值。

方案一：显式构造逻辑序列
~~~~~~~~~~~~~~~~~~~~~~~~~~

最直观的方法是扫描原串，把每个有效字符归一化后放入 ``cleaned``，再检查 ``cleaned`` 的首尾镜像位置。
这正好对应题目定义，因此正确性直接：``cleaned`` 就是题目要求比较的序列，全部镜像位置相等当且仅当它是
回文。

``buildNormalizedString`` 保留这一基线。它把“过滤和归一化”与“回文检查”分成两个清晰阶段，便于理解和
调试；代价是即使首尾第一对字符就不相等，也已经扫描并复制了整个字符串，最坏还要保存 ``O(n)`` 个字符。

结构信息：回文检查只按镜像位置取值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

判断回文并不需要随机访问完整的 ``cleaned``，任一时刻只需要它最左和最右尚未比较的字符。原串中从左侧
遇到的下一个有效字符，恰好就是逻辑序列的下一项；从右侧遇到的下一个有效字符，恰好就是逻辑序列的最后
一项。因此可以让两个指针直接在原串上移动，遇到无效字符就各自跳过，找到一对有效字符后再归一化比较。

这不是改变了清洗规则，而是把“先生成全部清洗结果”压缩为“需要哪一对就生成哪一对”。每个已经跨过的
字符再也不会参与后续比较，所以无需保存它。

双指针的不变量与删除规则
~~~~~~~~~~~~~~~~~~~~~~~~

每轮外层循环开始时，``left`` 左侧和 ``right`` 右侧的逻辑字符已经成对验证相等。两段内层循环分别寻找
剩余逻辑序列的首字符和尾字符：无效字符不会出现在清洗结果中，跳过它等价于从未存储它，不会漏掉候选。

找到两端后：

* 归一化值不同，当前就是清洗序列的一对镜像位置，回文条件已经被否定，可以立即返回；
* 归一化值相同，这一对已经完成验证，同时向内移动后，不变量对下一轮继续成立；
* 指针相遇或交错时，剩余逻辑序列至多有一个字符，不再存在未验证的镜像对，因此返回 ``true``。

最后一条也覆盖清洗结果为空的情况。内层循环使用 ``left < right`` 作为边界，所以即使原串全是标点，也
不会越过数组边界；两指针最终相遇，单个位置无需与自身之外的字符比较。

具体走读
~~~~~~~~

以 ``s = "a-b_Ca"`` 为例：

.. list-table::
   :header-rows: 1

   * - 待处理区间
     - 跳过字符
     - 实际比较
     - 结论
   * - ``[0, 5]``
     - 无
     - ``a`` 与 ``a``
     - 相等，删除这一对
   * - ``[1, 4]``
     - 左侧 ``-``
     - ``b`` 与 ``C``，归一化为 ``b`` 与 ``c``
     - 不等，立即返回 ``false``

这里的下划线尚未访问，因为更外层的有效字符已经证明结果为假。显式清洗方案仍会处理它，原串双指针则
自然省掉了与结论无关的后续工作。

代码对应与主解选择
~~~~~~~~~~~~~~~~~~

``isAsciiLetterOrDigit`` 明确实现题目的 ASCII 字符域，避免区域设置影响字符分类；``normalized`` 只转换
大写英文字母，数字和小写字母保持不变。``compareInOriginalString`` 中两次跳过必须相互独立，因为左右两端
可能有不同数量、不同种类的无效字符；先跳完两侧再比较，才得到清洗序列中真正对应的一对。

公开入口采用原串双指针：它与显式清洗具有相同的线性扫描上界，却把工作空间从 ``O(n)`` 降到 ``O(1)``，
并能在发现首个不匹配时提前结束。显式构造法保留为方案演进的起点，它的收益是概念分层更直接，适合验证
规则；没有必要再保留递归版本，因为它不删除搜索工作，只把指针状态转移到调用栈并增加 ``O(n)`` 栈空间。

复杂度分析
~~~~~~~~~~

两种方法的时间复杂度都是 ``O(n)``。显式构造法需要 ``O(n)`` 工作空间；主解中每个指针只朝中心移动，
每个原字符最多被检查常数次，工作空间为 ``O(1)``。
