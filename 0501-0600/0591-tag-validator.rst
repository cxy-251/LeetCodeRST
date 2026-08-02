0591. Tag Validator
===================

题目信息
--------

:题号: 0591
:难度: Hard
:主题: 标签字符串、嵌套结构、CDATA、整体合法性
:原题: `LeetCode 0591 <https://leetcode.com/problems/tag-validator/>`_
:重点: 整段代码必须由唯一根标签包围、标签名为 1 至 9 个大写字母、闭合顺序正确、CDATA 只在标签内容中有效

题目重述
--------

给定字符串 ``code``，判断它是否是合法的标签代码。整个字符串必须恰好由一个完整根标签包围，根标签之外不能出现任何字符。

开始标签写作 ``<TAG_NAME>``，结束标签写作 ``</TAG_NAME>``；标签名长度位于 ``[1, 9]``，并且只能包含大写英文字母。标签可以正确嵌套。标签内容中可以出现 ``<![CDATA[...]]>``，其中的文本不按标签解析，直到最近的 ``]]>`` 为止；CDATA 不能出现在任何标签之外。

自建示例
--------

CDATA 中的标签样式文本不解析：

.. code-block:: text

   输入：code = "<A><![CDATA[<B>text</B>]]></A>"
   输出：true
   解释：整个字符串由 A 标签包围，CDATA 内的尖括号内容按普通文本处理。

存在两个根标签：

.. code-block:: text

   输入：code = "<A></A><B></B>"
   输出：false
   解释：第一个根标签闭合后仍有第二段标签，整段代码没有唯一根节点。

按栈解析唯一根标签
--------------------

扫描字符串时维护当前尚未闭合的标签栈。遇到开始标签就校验标签名并入栈，遇到结束标签就要求它与栈顶完全相同后出栈；CDATA 必须位于非空栈中，并整体跳过直到 ``]]>``。普通文本只有在标签栈非空时才合法，根标签闭合后不允许再出现任何内容。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool validName(const std::string& name) {
           if (name.empty() || name.size() > 9) return false;
           for (char c : name) {
               if (c < 'A' || c > 'Z') return false;
           }
           return true;
       }

   public:
       bool isValid(std::string code) {
           std::vector<std::string> tags;
           bool seenRoot = false;
           bool rootClosed = false;
           int i = 0;

           while (i < static_cast<int>(code.size())) {
               if (code[i] != '<') {
                   if (tags.empty()) return false;
                   ++i;
                   continue;
               }

               if (code.compare(i, 9, "<![CDATA[") == 0) {
                   if (tags.empty()) return false;
                   std::size_t end = code.find("]]>", i + 9);
                   if (end == std::string::npos) return false;
                   i = static_cast<int>(end + 3);
                   continue;
               }

               if (i + 1 < static_cast<int>(code.size()) &&
                   code[i + 1] == '/') {
                   std::size_t end = code.find('>', i + 2);
                   if (end == std::string::npos) return false;
                   std::string name =
                       code.substr(i + 2, end - (i + 2));
                   if (!validName(name) || tags.empty() ||
                       tags.back() != name) {
                       return false;
                   }
                   tags.pop_back();
                   i = static_cast<int>(end + 1);
                   if (tags.empty()) rootClosed = true;
                   continue;
               }

               std::size_t end = code.find('>', i + 1);
               if (end == std::string::npos) return false;
               std::string name = code.substr(i + 1, end - (i + 1));
               if (!validName(name)) return false;
               if (tags.empty()) {
                   if (rootClosed) return false;
                   seenRoot = true;
               }
               tags.push_back(name);
               i = static_cast<int>(end + 1);
           }

           return seenRoot && rootClosed && tags.empty();
       }
   };

代码分析
--------

栈顶记录最近打开且尚未闭合的标签，因此每次闭合都同时检查嵌套顺序和标签名称；CDATA 直接定位结束标记，避免把其中的 ``<`` 误当成标签。只有第一次打开的标签可以成为根节点，根标签闭合后 ``rootClosed`` 阻止后续内容。每个字符最多被扫描和定位一次，时间复杂度为 ``O(n)``，标签栈与临时名称占用 ``O(n)`` 空间。
