0151. Reverse Words in a String
===============================

题目信息
--------

:题号: 0151. 反转字符串中的单词
:难度: Medium
:主题: 字符串、双指针、原地压缩、区间反转
:原题: `LeetCode 0151 <https://leetcode.com/problems/reverse-words-in-a-string/>`_
:重点: 先把空格规则归一化，再用整体反转改变单词顺序、逐词反转恢复单词内部顺序

题目重述
--------

给定字符串 ``s``，其中单词是连续非空格字符组成的最大片段。返回单词出现顺序完全反转后的字符串。输入
可能有前导、尾随和连续多个空格；输出只保留原单词，相邻单词间恰好一个空格，首尾没有空格。输入保证
至少含一个单词。

自建示例
--------

* ``"   code   reads  clearly "`` 变为 ``"clearly reads code"``；
* ``"one"`` 仍为 ``"one"``，不产生额外空格；
* ``"  a   bc "`` 先规范为空格单一的 ``"a bc"``，再得到 ``"bc a"``，单词内部字符不能反转。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       std::string collectWordsThenJoin(const std::string& s) {
           std::vector<std::string> words;
           const int length = static_cast<int>(s.size());

           for (int read = 0; read < length;) {
               while (read < length && s[read] == ' ') {
                   ++read;
               }
               if (read == length) {
                   break;
               }
               const int start = read;
               while (read < length && s[read] != ' ') {
                   ++read;
               }
               words.push_back(s.substr(start, read - start));
           }

           std::string result;
           for (int index = static_cast<int>(words.size()) - 1;
                index >= 0;
                --index) {
               if (!result.empty()) {
                   result.push_back(' ');
               }
               result += words[index];
           }
           return result;
       }

       std::string compactAndReverse(std::string s) {
           const int originalLength = static_cast<int>(s.size());
           int write = 0;

           for (int read = 0; read < originalLength;) {
               while (read < originalLength && s[read] == ' ') {
                   ++read;
               }
               if (read == originalLength) {
                   break;
               }
               if (write > 0) {
                   s[write] = ' ';
                   ++write;
               }
               while (read < originalLength && s[read] != ' ') {
                   s[write] = s[read];
                   ++write;
                   ++read;
               }
           }
           s.resize(write);

           std::reverse(s.begin(), s.end());
           for (int start = 0; start < write;) {
               int end = start;
               while (end < write && s[end] != ' ') {
                   ++end;
               }
               std::reverse(s.begin() + start, s.begin() + end);
               start = end + 1;
           }
           return s;
       }

   public:
       std::string reverseWords(std::string s) {
           return compactAndReverse(std::move(s));
       }
   };

题解
----

原始方案：先把单词变成独立对象
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的 ``collectWordsThenJoin`` 扫描出每个最大非空格片段，放进 ``words``，再从数组末尾向前拼接。它
把“识别单词”“反转顺序”“规范空格”分成清晰步骤，正确性直接；代价是同时保存单词数组、各个子串和最终
字符串，额外存储与输入长度成正比。

题目返回字符串本身已经提供一块可写缓冲区。若能在其中先得到规范单词序列，再利用区间反转改变排列，就
不必保存单词列表。

第一阶段：读写指针只保留逻辑内容
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``read`` 在原内容上跳过全部空格，再复制一个完整单词；``write`` 指向规范结果的下一个位置。除第一个单词
外，每写新单词前只写一个空格。扫描结束后把字符串缩到 ``write``，便同时删除了前导、尾随和重复空格。

循环开始处理某个单词时，``write`` 不会越过 ``read``：前面删除过的空格只会让写指针更靠左；两个单词
之间至少有一个已被 ``read`` 跳过的空格，所以先写规范分隔符也不会覆盖尚未读取的单词首字符。原地向前
复制因此安全。

这个阶段结束后的不变量是：``s[0..write-1]`` 恰好按原顺序包含所有单词，单词间一个空格，首尾无空格。
后续反转无需再判断多余空格。

两类反转怎样只改变单词顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

整体反转规范字符串，会同时发生两件事：单词块顺序倒置，每个单词内部字符也倒置。第二次扫描以空格为界，
逐个反转每个单词区间，只恢复内部字符顺序，不改变块的位置。因此最终只剩单词顺序的反转。

.. code-block:: text

   规范化：     "code reads"
   整体反转：   "sdaer edoc"
   逐词恢复：   "reads code"

空格是单字符分隔符，整体反转后仍然位于两个反向单词块之间；逐词反转的区间不包含空格，所以输出继续满足
间隔规则。

逐词扫描的边界
~~~~~~~~~~~~~~

``start`` 指向当前单词首字符，``end`` 前进到空格或字符串末尾；``reverse(begin+start, begin+end)`` 使用
左闭右开区间。完成后令 ``start = end + 1`` 跳过分隔空格。最后一个单词使 ``end == write``，新的
``start`` 虽为 ``write + 1``，循环条件立即失败，不会解引用越界。输入至少有一个单词，所以压缩结果非空。

为什么不用逐个搬移单词
~~~~~~~~~~~~~~~~~~~~~~

若每次把最后一个单词移到输出前方，字符串中间插入会反复移动后续字符，最坏形成二次工作。整体反转把
所有单词块的位置一次性互换，逐词反转又只访问每个字符一次；没有任何单词需要单独跨越其他单词。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用原地压缩加两类反转。每个字符参与常数次扫描或交换，时间 ``O(n)``；在传入的返回字符串缓冲
上操作，除返回值自身外只用固定下标，工作空间 ``O(1)``。分词数组方案同为线性时间，但额外空间
``O(n)``，保留它作为题目规则的直观基线；主解利用反转结构删除了单词数组与拼接状态。
