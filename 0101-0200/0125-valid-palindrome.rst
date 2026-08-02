0125. Valid Palindrome
======================

题目信息
--------

:题号: 0125
:难度: Easy
:主题: 字符串、双指针、ASCII、原串扫描
:原题: `LeetCode 0125 <https://leetcode.com/problems/valid-palindrome/>`_
:重点: 忽略非字母数字字符、忽略字母大小写、清洗后回文

题目重述
--------

给定字符串 ``s``，先删除其中所有不是英文字母或十进制数字的字符，再把字母统一按不区分大小写的方式比较。判断处理后的字符序列是否从左到右与从右到左完全相同。若清洗后为空字符串，也视为回文。

字符串长度在 ``1..2 × 10^5`` 范围内，只包含可打印 ASCII 字符。

自建示例
--------

.. code-block:: text

   输入：s = "No 'x' in Nixon!"
   输出：true
   解释：删除空格和标点并忽略大小写后得到 "noxinnixon"，正读和反读相同。

.. code-block:: text

   输入：s = "Room 12, Moor 21"
   输出：false
   解释：清洗后得到 "room12moor21"，首尾字符分别是 r 和 1，不相同。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   private:
       bool valid(char ch) {
           return ('0' <= ch && ch <= '9') ||
                  ('A' <= ch && ch <= 'Z') ||
                  ('a' <= ch && ch <= 'z');
       }

       char lowerAscii(char ch) {
           return 'A' <= ch && ch <= 'Z' ? ch - 'A' + 'a' : ch;
       }

       bool cleanAndReverse(const std::string& s) {
           std::string cleaned;
           for (char ch : s) if (valid(ch)) cleaned.push_back(lowerAscii(ch));
           return std::equal(cleaned.begin(), cleaned.end(), cleaned.rbegin());
       }

       bool recursiveCompare(const std::string& s, int left, int right) {
           while (left < right && !valid(s[left])) ++left;
           while (left < right && !valid(s[right])) --right;
           if (left >= right) return true;
           return lowerAscii(s[left]) == lowerAscii(s[right]) &&
                  recursiveCompare(s, left + 1, right - 1);
       }

       bool twoPointers(const std::string& s) {
           int left = 0, right = static_cast<int>(s.size()) - 1;
           while (left < right) {
               while (left < right && !valid(s[left])) ++left;
               while (left < right && !valid(s[right])) --right;
               if (lowerAscii(s[left]) != lowerAscii(s[right])) return false;
               ++left; --right;
           }
           return true;
       }

   public:
       bool isPalindrome(std::string s) {
           return twoPointers(s);
       }
   };

题解
----

清洗字符串不是必要状态
~~~~~~~~~~~~~~~~~~~~~~

直接方法先生成只含小写字母数字的字符串，再与逆序比较，需要 ``O(n)`` 额外空间。回文只关心左右对应字符，可以直接在原字符串上寻找下一对有效字符。

双指针状态
~~~~~~~~~~

每轮执行：

#. 左指针向右跳过无效字符；
#. 右指针向左跳过无效字符；
#. 两端按 ASCII 小写形式比较；
#. 相同则同时向内移动，不同立即失败。

.. list-table::
   :header-rows: 1

   * - 左端
     - 右端
     - 动作
   * - ``A``
     - ``a``
     - 归一化后相等
   * - 空格与标点
     - 标点与空格
     - 分别跳过
   * - ``m``
     - ``m``
     - 相等并继续

为什么左右跳过相互独立
~~~~~~~~~~~~~~~~~~~~~~

清洗序列的下一左字符由原串中最靠左的有效字符决定，下一右字符由最靠右的有效字符决定。无效字符不出现在清洗结果中，跳过它们不会改变任何应比较的字符对。

为什么显式限定 ASCII
~~~~~~~~~~~~~~~~~~~~

题目字符域按 ASCII 定义时，显式判断 ``0-9``、``A-Z``、``a-z``，可以避免依赖本地化字符分类规则，并与 C++ 主实现的比较条件完全一致。

空清洗序列为何返回真
~~~~~~~~~~~~~~~~~~~~

若没有有效字符，两个指针在跳过后交错或相遇，循环结束。空序列与其逆序相同，因此返回真；单个有效字符同理。

为什么不重不漏
~~~~~~~~~~~~~~

每个指针只向中心移动。它们依次访问清洗序列的第一个与最后一个、第二个与倒数第二个字符，恰好覆盖全部镜像位置；任一不等立即证明非回文，全部相等则回文成立。

复杂度来源
~~~~~~~~~~

每个原字符最多被一个指针跨过一次，时间 ``O(n)``，额外空间 ``O(1)``。清洗方法为 ``O(n)`` 空间，递归方法使用 ``O(n)`` 栈。

九语言实现
----------

C
~

.. code-block:: c

   static bool valid(char c){return(c>='0'&&c<='9')||(c>='A'&&c<='Z')||(c>='a'&&c<='z');}static char lower(char c){return c>='A'&&c<='Z'?c-'A'+'a':c;}bool isPalindrome(char*s){int l=0,r=(int)strlen(s)-1;while(l<r){while(l<r&&!valid(s[l]))l++;while(l<r&&!valid(s[r]))r--;if(lower(s[l])!=lower(s[r]))return false;l++;r--;}return true;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isPalindrome(self, s: str) -> bool:
           def valid(ch): return "0" <= ch <= "9" or "A" <= ch <= "Z" or "a" <= ch <= "z"
           def lower(ch): return chr(ord(ch)+32) if "A" <= ch <= "Z" else ch
           left, right = 0, len(s)-1
           while left < right:
               while left < right and not valid(s[left]): left += 1
               while left < right and not valid(s[right]): right -= 1
               if lower(s[left]) != lower(s[right]): return False
               left += 1; right -= 1
           return True

Java
~~~~

.. code-block:: java

   class Solution {boolean valid(char c){return c>='0'&&c<='9'||c>='A'&&c<='Z'||c>='a'&&c<='z';}char lower(char c){return c>='A'&&c<='Z'?(char)(c+32):c;}public boolean isPalindrome(String s){int l=0,r=s.length()-1;while(l<r){while(l<r&&!valid(s.charAt(l)))l++;while(l<r&&!valid(s.charAt(r)))r--;if(lower(s.charAt(l))!=lower(s.charAt(r)))return false;l++;r--;}return true;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_palindrome(s:String)->bool{fn valid(c:u8)->bool{c.is_ascii_alphanumeric()}let b=s.as_bytes();let(mut l,mut r)=(0usize,b.len().saturating_sub(1));while l<r{while l<r&&!valid(b[l]){l+=1}while l<r&&!valid(b[r]){r-=1}if b[l].to_ascii_lowercase()!=b[r].to_ascii_lowercase(){return false}l+=1;r-=1}true}}

Go
~~

.. code-block:: go

   func isPalindrome(s string)bool{valid:=func(c byte)bool{return c>='0'&&c<='9'||c>='A'&&c<='Z'||c>='a'&&c<='z'};lower:=func(c byte)byte{if c>='A'&&c<='Z'{return c+32};return c};l,r:=0,len(s)-1;for l<r{for l<r&&!valid(s[l]){l++};for l<r&&!valid(s[r]){r--};if lower(s[l])!=lower(s[r]){return false};l++;r--};return true}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isPalindrome(s:string):boolean{const valid=(c:string)=>/[0-9A-Za-z]/.test(c),lower=(c:string)=>c>="A"&&c<="Z"?String.fromCharCode(c.charCodeAt(0)+32):c;let l=0,r=s.length-1;while(l<r){while(l<r&&!valid(s[l]))l++;while(l<r&&!valid(s[r]))r--;if(lower(s[l])!==lower(s[r]))return false;l++;r--;}return true;}

C#
~~

.. code-block:: csharp

   public class Solution {bool Valid(char c)=>c>='0'&&c<='9'||c>='A'&&c<='Z'||c>='a'&&c<='z';char Lower(char c)=>c>='A'&&c<='Z'?(char)(c+32):c;public bool IsPalindrome(string s){int l=0,r=s.Length-1;while(l<r){while(l<r&&!Valid(s[l]))l++;while(l<r&&!Valid(s[r]))r--;if(Lower(s[l])!=Lower(s[r]))return false;l++;r--;}return true;}}

Julia
~~~~~

.. code-block:: julia

   function is_palindrome(s::String)
       a=collect(codeunits(s));valid(c)=UInt8('0')<=c<=UInt8('9')||UInt8('A')<=c<=UInt8('Z')||UInt8('a')<=c<=UInt8('z');lower(c)=UInt8('A')<=c<=UInt8('Z') ? c+0x20 : c
       l=1;r=length(a);while l<r;while l<r&&!valid(a[l]);l+=1;end;while l<r&&!valid(a[r]);r-=1;end;lower(a[l])==lower(a[r])||return false;l+=1;r-=1;end;true
   end

R
~

.. code-block:: r

   is_palindrome <- function(s){a<-strsplit(s,"",fixed=TRUE)[[1L]];valid<-function(c)grepl("^[0-9A-Za-z]$",c);l<-1L;r<-length(a);while(l<r){while(l<r&&!valid(a[[l]]))l<-l+1L;while(l<r&&!valid(a[[r]]))r<-r-1L;if(tolower(a[[l]])!=tolower(a[[r]]))return(FALSE);l<-l+1L;r<-r-1L};TRUE}
