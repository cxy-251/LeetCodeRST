0076. Minimum Window Substring
==============================

题目信息
--------

:题号: 0076
:题名: Minimum Window Substring
:难度: Hard
:类型: Algorithms
:主题: 字符串、滑动窗口、频次计数
:原题: `LeetCode 0076 <https://leetcode.com/problems/minimum-window-substring/>`_
:教学重点: 重复字符需求、缺口计数、可行窗口收缩、最短区间提交

题目重述
--------

给定字符串 ``s`` 和 ``t``，寻找 ``s`` 中最短连续子串，使它包含 ``t`` 的全部字符及重复次数。大小写区分；无解返回空字符串。题目保证最短答案唯一。

自建示例
--------

.. code-block:: text

   s = "CABAA", t = "AABC" -> "CABA"
   s = "abc",   t = "AA"   -> ""

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <climits>
   #include <string>

   class Solution {
   private:
       bool covers(const std::string& s, int left, int right,
                   const std::array<int,128>& required) {
           std::array<int,128> count{};
           for (int i = left; i <= right; ++i) ++count[static_cast<unsigned char>(s[i])];
           for (int c = 0; c < 128; ++c) if (count[c] < required[c]) return false;
           return true;
       }

       std::string bruteForce(const std::string& s, const std::string& t) {
           std::array<int,128> required{};
           for (char ch : t) ++required[static_cast<unsigned char>(ch)];
           int best_start = 0, best_length = INT_MAX;
           for (int left = 0; left < static_cast<int>(s.size()); ++left)
               for (int right = left; right < static_cast<int>(s.size()); ++right)
                   if (right - left + 1 < best_length && covers(s, left, right, required)) {
                       best_start = left; best_length = right - left + 1; break;
                   }
           return best_length == INT_MAX ? "" : s.substr(best_start, best_length);
       }

       std::string formedKinds(const std::string& s, const std::string& t) {
           std::array<int,128> required{}, window{};
           int kinds = 0;
           for (char ch : t) if (++required[static_cast<unsigned char>(ch)] == 1) ++kinds;
           int formed = 0, left = 0, best_start = 0, best_length = INT_MAX;
           for (int right = 0; right < static_cast<int>(s.size()); ++right) {
               unsigned char ch = s[right];
               if (++window[ch] == required[ch] && required[ch] > 0) ++formed;
               while (formed == kinds) {
                   if (right - left + 1 < best_length) {
                       best_start = left; best_length = right - left + 1;
                   }
                   unsigned char drop = s[left++];
                   if (required[drop] > 0 && window[drop]-- == required[drop]) --formed;
                   else --window[drop];
               }
           }
           return best_length == INT_MAX ? "" : s.substr(best_start, best_length);
       }

       std::string missingCount(const std::string& s, const std::string& t) {
           std::array<int,128> need{};
           for (char ch : t) ++need[static_cast<unsigned char>(ch)];
           int missing = t.size();
           int left = 0, best_start = 0, best_length = INT_MAX;
           for (int right = 0; right < static_cast<int>(s.size()); ++right) {
               unsigned char ch = s[right];
               if (need[ch] > 0) --missing;
               --need[ch];
               while (missing == 0) {
                   if (right - left + 1 < best_length) {
                       best_start = left; best_length = right - left + 1;
                   }
                   unsigned char drop = s[left++];
                   ++need[drop];
                   if (need[drop] > 0) ++missing;
               }
           }
           return best_length == INT_MAX ? "" : s.substr(best_start, best_length);
       }

   public:
       std::string minWindow(std::string s, std::string t) {
           if (t.size() > s.size()) return "";
           return missingCount(s, t);
       }
   };

题解
----

枚举窗口重复了什么
~~~~~~~~~~~~~~~~

固定每个左端点再向右寻找覆盖，会多次统计重叠区间中的相同字符。滑动窗口让右端只负责加入字符，左端只负责移出字符，每个位置最多经过两个指针各一次。

need 的正零负含义
~~~~~~~~~~~~~~~~~

初始化 ``need[c]`` 为 ``t`` 中字符数量。窗口加入字符时减一：正数表示仍缺副本，零表示刚好满足，负数表示窗口中有多余副本。

missing 为什么按字符总数计
~~~~~~~~~~~~~~~~~~~~~~~~~

``missing`` 初始为 ``t.length``。加入字符前若 ``need[ch] > 0``，该字符填补一个真实缺口，``missing`` 减一；若 ``need[ch] <= 0``，它只是多余副本，不改变可行性。

右端扩张后的状态
~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 读取字符
     - 关键 need
     - missing
   * - ``C``
     - ``C:0``
     - 3
   * - ``A``
     - ``A:1``
     - 2
   * - ``B``
     - ``B:0``
     - 1
   * - ``A``
     - ``A:0``
     - 0，窗口 ``CABA`` 可行

窗口可行后为何必须持续收缩
~~~~~~~~~~~~~~~~~~~~~~~~~~

固定右端时，最短可行窗口一定由左端尽量右移得到。每次在删除前提交当前区间，再把左字符归还给 ``need``；只要归还后没有形成正缺口，窗口仍可继续缩小。

删除字符何时破坏可行性
~~~~~~~~~~~~~~~~~~~~~~

移出 ``drop`` 后执行 ``++need[drop]``。若新值大于 0，说明窗口从满足或超额变成缺少一个副本，``missing`` 增加，收缩停止。若新值仍不大于 0，删掉的是多余副本。

为什么不会错过更短答案
~~~~~~~~~~~~~~~~~~~~~~

每个右端到达时，算法枚举了以该右端结尾的所有可行窗口中从宽到窄的序列，直到再删一个字符就不可行。因此每个右端的最短可行窗口都被提交；全局最短必在其中。

字符种类计数与总缺口计数的关系
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``formedKinds`` 统计有多少字符种类达到所需频次；``missingCount`` 统计还缺多少字符副本。两者等价，后者无需维护窗口频次数组和种类总数，更新更直接。

复杂度来源
~~~~~~~~~~

暴力方法最坏高于平方级。滑动窗口中左右指针各单调移动 ``O(|s|)`` 次，加上初始化 ``O(|t|)``，总时间 ``O(|s|+|t|)``。ASCII 频次数组大小固定，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   char*minWindow(char*s,char*t){int need[128]={0};for(int i=0;t[i];i++)need[(unsigned char)t[i]]++;int missing=strlen(t),left=0,best=-1,len=INT_MAX;for(int right=0;s[right];right++){unsigned char c=s[right];if(need[c]>0)missing--;need[c]--;while(missing==0){if(right-left+1<len){best=left;len=right-left+1;}unsigned char d=s[left++];need[d]++;if(need[d]>0)missing++;}}if(best<0)return strdup("");char*out=malloc(len+1);memcpy(out,s+best,len);out[len]='\0';return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minWindow(self, s: str, t: str) -> str:
           need={};
           for ch in t:need[ch]=need.get(ch,0)+1
           missing=len(t);left=0;best=(0,float('inf'))
           for right,ch in enumerate(s):
               if need.get(ch,0)>0:missing-=1
               need[ch]=need.get(ch,0)-1
               while missing==0:
                   if right-left+1<best[1]:best=(left,right-left+1)
                   drop=s[left];left+=1;need[drop]=need.get(drop,0)+1
                   if need[drop]>0:missing+=1
           return '' if best[1]==float('inf') else s[best[0]:best[0]+best[1]]

Java
~~~~

.. code-block:: java

   class Solution {public String minWindow(String s,String t){int[]need=new int[128];for(char c:t.toCharArray())need[c]++;int missing=t.length(),left=0,start=0,len=Integer.MAX_VALUE;for(int right=0;right<s.length();right++){char c=s.charAt(right);if(need[c]>0)missing--;need[c]--;while(missing==0){if(right-left+1<len){start=left;len=right-left+1;}char d=s.charAt(left++);if(++need[d]>0)missing++;}}return len==Integer.MAX_VALUE?"":s.substring(start,start+len);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn min_window(s:String,t:String)->String{let b=s.as_bytes();let mut need=[0i32;128];for &c in t.as_bytes(){need[c as usize]+=1}let(mut missing,mut left,mut start,mut len)=(t.len()as i32,0,0,usize::MAX);for right in 0..b.len(){let c=b[right]as usize;if need[c]>0{missing-=1}need[c]-=1;while missing==0{if right-left+1<len{start=left;len=right-left+1}let d=b[left]as usize;left+=1;need[d]+=1;if need[d]>0{missing+=1}}}if len==usize::MAX{"".into()}else{s[start..start+len].into()}}}

Go
~~

.. code-block:: go

   func minWindow(s,t string)string{need:=[128]int{};for i:=range t{need[t[i]]++};missing,left,start,length:=len(t),0,0,len(s)+1;for right:=range s{c:=s[right];if need[c]>0{missing--};need[c]--;for missing==0{if right-left+1<length{start,length=left,right-left+1};d:=s[left];left++;need[d]++;if need[d]>0{missing++}}};if length>len(s){return ""};return s[start:start+length]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minWindow(s:string,t:string):string{const need=Array(128).fill(0);for(const c of t)need[c.charCodeAt(0)]++;let missing=t.length,left=0,start=0,len=Infinity;for(let right=0;right<s.length;right++){const c=s.charCodeAt(right);if(need[c]>0)missing--;need[c]--;while(missing===0){if(right-left+1<len){start=left;len=right-left+1;}const d=s.charCodeAt(left++);if(++need[d]>0)missing++;}}return len===Infinity?'':s.slice(start,start+len);}

C#
~~

.. code-block:: csharp

   public class Solution {public string MinWindow(string s,string t){int[]need=new int[128];foreach(char c in t)need[c]++;int missing=t.Length,left=0,start=0,len=int.MaxValue;for(int right=0;right<s.Length;right++){char c=s[right];if(need[c]>0)missing--;need[c]--;while(missing==0){if(right-left+1<len){start=left;len=right-left+1;}char d=s[left++];if(++need[d]>0)missing++;}}return len==int.MaxValue?"":s.Substring(start,len);}}

Julia
~~~~~

.. code-block:: julia

   function min_window(s::String,t::String)
       b=codeunits(s);need=zeros(Int,128);for c in codeunits(t);need[c+1]+=1;end;missing=ncodeunits(t);left=1;start=1;best=typemax(Int)
       for right in eachindex(b);c=b[right]+1;if need[c]>0;missing-=1;end;need[c]-=1;while missing==0;if right-left+1<best;start=left;best=right-left+1;end;d=b[left]+1;left+=1;need[d]+=1;if need[d]>0;missing+=1;end;end;end
       best==typemax(Int) ? "" : String(b[start:start+best-1])
   end

R
~

.. code-block:: r

   min_window <- function(s,t){x<-utf8ToInt(s);y<-utf8ToInt(t);need<-integer(128);for(c in y)need[[c+1L]]<-need[[c+1L]]+1L;missing<-length(y);left<-1L;start<-1L;best<-Inf;for(right in seq_along(x)){c<-x[[right]]+1L;if(need[[c]]>0L)missing<-missing-1L;need[[c]]<-need[[c]]-1L;while(missing==0L){if(right-left+1L<best){start<-left;best<-right-left+1L};d<-x[[left]]+1L;left<-left+1L;need[[d]]<-need[[d]]+1L;if(need[[d]]>0L)missing<-missing+1L}};if(is.infinite(best))"" else intToUtf8(x[start:(start+best-1L)])}
