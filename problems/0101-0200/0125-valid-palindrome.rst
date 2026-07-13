0125. Valid Palindrome
======================

题目信息
--------

:题号: 0125
:难度: Easy
:主题: 字符串、双指针、字符分类
:原题: `LeetCode 0125 <https://leetcode.com/problems/valid-palindrome/>`_
:访问状态: Available
:教学重点: 跳过非字母数字、大小写归一

题目重述
--------

忽略非字母数字字符并忽略大小写，判断字符串是否回文。

自建示例
--------

.. code-block:: text

   输入：s = "A man, a plan, a canal: Panama"
   输出：true

   输入：s = "race a car"
   输出：false

问题抽象
--------

左右指针向内移动，跳过非字母数字字符；比较归一化后的字符，不等立即失败。

主解法：双指针过滤比较
-------------

思路
~~~~

双指针过滤比较。 跳过非字母数字、大小写归一

核心状态与不变量
~~~~~~~~~~~~~~~~

左右指针向内移动，跳过非字母数字字符；比较归一化后的字符，不等立即失败。

正确性依据
~~~~~~~~~~

每轮跳过的字符按题意不参与序列。比较的是剩余有效序列当前首尾；若相等，回文性等价于内部子序列回文。指针交错时所有对应位置均相等。

复杂度与语言边界
~~~~~~~~~~~~~~~~

设字节长度 ``n``，ASCII 契约下时间 ``O(n)``、空间 ``O(1)``。若扩展 Unicode，字符分类和大小写折叠语义需重新定义。

核心语言实现
------------

C
~

.. code-block:: c

   #include <ctype.h>
   #include <stdbool.h>
   bool isPalindrome(char*s) {
       int l=0,r=0;
       while(s[r])r++;
       r--;
       while(l<r) {
           while(l<r&&!isalnum((unsigned char)s[l]))l++;
           while(l<r&&!isalnum((unsigned char)s[r]))r--;
           if(tolower((unsigned char)s[l])!=tolower((unsigned char)s[r]))return false;
           l++;
           r--;
       }
       return true;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:bool isPalindrome(string s) {
           int l=0,r=s.size()-1;
           while(l<r) {
               while(l<r&&!isalnum((unsigned char)s[l]))l++;
               while(l<r&&!isalnum((unsigned char)s[r]))r--;
               if(tolower((unsigned char)s[l++])!=tolower((unsigned char)s[r--]))return false;
           }
           return true;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def isPalindrome(self, s: str) -> bool:
           l, r = (0, len(s) - 1)
           while l < r:
               while l < r and (not s[l].isalnum()):
                   l += 1
               while l < r and (not s[r].isalnum()):
                   r -= 1
               if s[l].lower() != s[r].lower():
                   return False
               l += 1
               r -= 1
           return True
Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isPalindrome(String s) {
           int l=0,r=s.length()-1;
           while(l<r) {
               while(l<r&&!Character.isLetterOrDigit(s.charAt(l)))l++;
               while(l<r&&!Character.isLetterOrDigit(s.charAt(r)))r--;
               if(Character.toLowerCase(s.charAt(l++))!=Character.toLowerCase(s.charAt(r--)))return
                   false;
           }
           return true;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_palindrome(s:String)->bool {
           let b=s.as_bytes();
           let(mut l,mut r)=(0,b.len().saturating_sub(1));
           while l<r {
               while l<r&&!b[l].is_ascii_alphanumeric() {
                   l+=1
               }
               while l<r&&!b[r].is_ascii_alphanumeric() {
                   r-=1
               }
               if b[l].to_ascii_lowercase()!=b[r].to_ascii_lowercase() {
                   return false
               }
               l+=1;
               r-=1;
           }
           true
       }
   }
Go
~~

.. code-block:: go

   func isPalindrome(s string) bool {
       left, right := 0, len(s)-1
       isAlphaNumeric := func(c byte) bool {
           return c >= '0' && c <= '9' ||
               c >= 'a' && c <= 'z' ||
               c >= 'A' && c <= 'Z'
       }
       lower := func(c byte) byte {
           if c >= 'A' && c <= 'Z' {
               return c + ('a' - 'A')
           }
           return c
       }
       for left < right {
           for left < right && !isAlphaNumeric(s[left]) {
               left++
           }
           for left < right && !isAlphaNumeric(s[right]) {
               right--
           }
           if lower(s[left]) != lower(s[right]) {
               return false
           }
           left++
           right--
       }
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isPalindrome(s: string): boolean {
       let l = 0, r = s.length - 1;
       const ok = (c: string) => /[A-Za-z0-9]/.test(c);
       while (l < r) {
           while (l < r && !ok(s[l]))
               l++;
           while (l < r && !ok(s[r]))
               r--;
           if (s[l].toLowerCase() !== s[r].toLowerCase())
               return false;
           l++;
           r--;
       }
       return true;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsPalindrome(string s) {
           int l=0,r=s.Length-1;
           while(l<r) {
               while(l<r&&!char.IsLetterOrDigit(s[l]))l++;
               while(l<r&&!char.IsLetterOrDigit(s[r]))r--;
               if(char.ToLowerInvariant(s[l++])!=char.ToLowerInvariant(s[r--]))return false;
           }
           return true;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function is_palindrome(s::String)::Bool
       b=codeunits(s)
       l=1
       r=length(b)
       ok(c)=0x30<=c<=0x39||0x41<=c<=0x5a||0x61<=c<=0x7a
       low(c)=0x41<=c<=0x5a ? c+0x20 : c
       while l<r
           while l<r&&!ok(b[l])
               l+=1
           end
           while l<r&&!ok(b[r])
               r-=1
           end
           low(b[l])==low(b[r])||return false
           l+=1
           r-=1
       end
       true
   end
R
~

.. code-block:: r

   is_palindrome <- function(s) {
       b<-utf8ToInt(s)
       l<-1L
       r<-length(b)
       ok<-function(c)(c>=48L&&c<=57L)||(c>=65L&&c<=90L)||(c>=97L&&c<=122L)
       low<-function(c)if(c>=65L&&c<=90L)c+32L else c
       while(l<r) {
           while(l<r&&!ok(b[[l]]))l<-l+1L
           while(l<r&&!ok(b[[r]]))r<-r-1L
           if(low(b[[l]])!=low(b[[r]]))return(FALSE)
           l<-l+1L
           r<-r-1L
       }
       TRUE
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空串和仅标点串视为回文。
* 明确本实现按 ASCII 字母数字处理。

易错点
------

* 直接调用语言默认 Unicode 分类却仍按字节索引。
* 先构造过滤字符串造成不必要 ``O(n)`` 空间。

本题新增知识
------------

* 跳过非字母数字、大小写归一
* 题号 0125 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0005. Longest Palindromic Substring <../0001-0100/0005-longest-palindromic-substring.rst>`_；
* `0131. Palindrome Partitioning <0131-palindrome-partitioning.rst>`_；

最小自检
--------

#. ``双指针过滤比较`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每轮跳过的字符按题意不参与序列。比较的是剩余有效序列当前首尾；若相等，回文性等价于内部子序列回文。指针交错时所有对应位置均相等。
