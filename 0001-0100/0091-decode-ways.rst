0091. Decode Ways
=================

题目信息
--------

:题号: 0091
:难度: Medium
:主题: 字符串、动态规划、记忆化搜索、滚动状态
:原题: `LeetCode 0091 <https://leetcode.com/problems/decode-ways/>`_
:教学重点: 前缀方案数、一位与两位贡献、零的强制约束、空前缀基准

题目重述
--------

数字 ``1..26`` 分别映射到 ``A..Z``。给定非空数字字符串 ``s``，计算把整个字符串切分为合法一位编码或两位编码的方案数。一位编码只能是 ``1..9``；两位编码只能是 ``10..26``；字符 ``0`` 不能单独使用。输入只读，题目保证最终答案适合 32 位有符号整数。

自建示例
--------

.. code-block:: text

   s = "11106" -> 2
   合法划分：1|1|10|6、11|10|6

.. code-block:: text

   "226" -> 3
   "06"  -> 0
   "30"  -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       int plainDfs(const std::string& s, int index) {
           if (index == static_cast<int>(s.size())) return 1;
           if (s[index] == '0') return 0;
           int total = plainDfs(s, index + 1);
           if (index + 1 < static_cast<int>(s.size())) {
               int value = (s[index] - '0') * 10 + s[index + 1] - '0';
               if (value <= 26) total += plainDfs(s, index + 2);
           }
           return total;
       }

       int memoDfs(const std::string& s, int index, std::vector<int>& memo) {
           if (index == static_cast<int>(s.size())) return 1;
           if (s[index] == '0') return 0;
           if (memo[index] != -1) return memo[index];
           int total = memoDfs(s, index + 1, memo);
           if (index + 1 < static_cast<int>(s.size())) {
               int value = (s[index] - '0') * 10 + s[index + 1] - '0';
               if (value <= 26) total += memoDfs(s, index + 2, memo);
           }
           return memo[index] = total;
       }

       int prefixDp(const std::string& s) {
           int n = s.size();
           std::vector<int> dp(n + 1);
           dp[0] = 1;
           for (int length = 1; length <= n; ++length) {
               if (s[length - 1] != '0') dp[length] += dp[length - 1];
               if (length >= 2) {
                   int value = (s[length - 2] - '0') * 10 + s[length - 1] - '0';
                   if (10 <= value && value <= 26) dp[length] += dp[length - 2];
               }
           }
           return dp[n];
       }

       int rollingDp(const std::string& s) {
           int previous_two = 1;
           int previous_one = s[0] == '0' ? 0 : 1;
           for (int length = 2; length <= static_cast<int>(s.size()); ++length) {
               int current = 0;
               if (s[length - 1] != '0') current += previous_one;
               int value = (s[length - 2] - '0') * 10 + s[length - 1] - '0';
               if (10 <= value && value <= 26) current += previous_two;
               previous_two = previous_one;
               previous_one = current;
           }
           return previous_one;
       }

   public:
       int numDecodings(std::string s) {
           return rollingDp(s);
       }
   };

题解
----

朴素递归枚举什么
~~~~~~~~~~~~~~~~

从下标 ``index`` 开始，若当前字符不是 ``0``，可以消费一位；若当前两位在 ``10..26``，还可以消费两位。递归树完整枚举所有切分方式，但同一后缀会从多个上层切分重复到达，最坏呈指数增长。

前缀状态如何消除重复
~~~~~~~~~~~~~~~~~~~~

定义 ``dp[length]``：前 ``length`` 个字符的合法完整解码方案数。加入末尾字符后，最后一个编码只有两种互斥来源：

.. code-block:: text

   一位贡献：s[length-1] != '0'        -> dp[length-1]
   两位贡献：10 <= s[length-2:length] <= 26 -> dp[length-2]

两类方案最后一个编码长度不同，不会重复；任意合法解码的最后一个编码又必属于其中一类，因此转移完整。

空前缀为何有一种方案
~~~~~~~~~~~~~~~~~~~~

``dp[0] = 1`` 表示“不选择任何编码”这一种空划分。它不是实际字母，而是乘法与递推的单位元：首字符合法时，一位贡献来自 ``dp[0]``；前两位构成合法双字符编码时，两位贡献同样来自 ``dp[0]``。

零如何强制切分
~~~~~~~~~~~~~~

``0`` 不能单独编码，所以一位贡献必须跳过。只有前一位与它组成 ``10`` 或 ``20`` 时，两位贡献才存在。于是：

* ``06`` 的首位状态为 0，后续也无法恢复；
* ``30`` 的两位值超过 26，两个贡献都为 0；
* ``10`` 只能来自 ``dp[0]``，恰好一种方案。

``11106`` 的状态演化
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 前缀
     - 一位贡献
     - 两位贡献
     - 方案数
   * - 空
     - —
     - —
     - 1
   * - ``1``
     - 1
     - —
     - 1
   * - ``11``
     - 1
     - 1
     - 2
   * - ``111``
     - 2
     - 1
     - 3
   * - ``1110``
     - 0
     - 2
     - 2
   * - ``11106``
     - 2
     - 0
     - 2

为什么滚动数组可以覆盖二维历史
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

计算 ``dp[length]`` 只读取前一项和前两项，更早状态不会再被访问。用 ``previous_one`` 和 ``previous_two`` 保存这两个值即可把空间从 ``O(n)`` 压缩为 ``O(1)``；更新时必须先计算 ``current``，再整体向前滚动，避免覆盖仍要读取的旧状态。

为什么最终状态表示完整解码
~~~~~~~~~~~~~~~~~~~~~~~~

每个状态只统计恰好消费对应前缀的划分，没有允许跳过字符。归纳地，一位和两位转移都从已完整解码的更短前缀接上一个合法编码，因此 ``dp[n]`` 中每个方案都消费全部字符；反之任意完整解码按最后编码长度必被某个转移计入。

复杂度来源
~~~~~~~~~~

裸递归最坏指数级；记忆化、完整 DP 和滚动 DP 都只处理 ``n`` 个位置，时间 ``O(n)``。记忆化和完整 DP 使用 ``O(n)`` 空间，滚动实现额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int numDecodings(char *s){int n=(int)strlen(s),two=1,one=s[0]=='0'?0:1;for(int len=2;len<=n;len++){int cur=0;if(s[len-1]!='0')cur+=one;int v=(s[len-2]-'0')*10+s[len-1]-'0';if(v>=10&&v<=26)cur+=two;two=one;one=cur;}return one;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numDecodings(self, s: str) -> int:
           two, one = 1, int(s[0] != "0")
           for i in range(1, len(s)):
               current = one if s[i] != "0" else 0
               if 10 <= int(s[i-1:i+1]) <= 26: current += two
               two, one = one, current
           return one

Java
~~~~

.. code-block:: java

   class Solution {public int numDecodings(String s){int two=1,one=s.charAt(0)=='0'?0:1;for(int i=1;i<s.length();i++){int cur=s.charAt(i)=='0'?0:one;int v=(s.charAt(i-1)-'0')*10+s.charAt(i)-'0';if(v>=10&&v<=26)cur+=two;two=one;one=cur;}return one;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn num_decodings(s:String)->i32{let b=s.as_bytes();let(mut two,mut one)=(1,if b[0]==b'0'{0}else{1});for i in 1..b.len(){let mut cur=if b[i]==b'0'{0}else{one};let v=(b[i-1]-b'0')as i32*10+(b[i]-b'0')as i32;if(10..=26).contains(&v){cur+=two}two=one;one=cur;}one}}

Go
~~

.. code-block:: go

   func numDecodings(s string)int{two,one:=1,0;if s[0]!='0'{one=1};for i:=1;i<len(s);i++{cur:=0;if s[i]!='0'{cur=one};v:=int(s[i-1]-'0')*10+int(s[i]-'0');if v>=10&&v<=26{cur+=two};two,one=one,cur};return one}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numDecodings(s:string):number{let two=1,one=s[0]==='0'?0:1;for(let i=1;i<s.length;i++){let cur=s[i]==='0'?0:one;const v=(s.charCodeAt(i-1)-48)*10+s.charCodeAt(i)-48;if(v>=10&&v<=26)cur+=two;two=one;one=cur;}return one;}

C#
~~

.. code-block:: csharp

   public class Solution {public int NumDecodings(string s){int two=1,one=s[0]=='0'?0:1;for(int i=1;i<s.Length;i++){int cur=s[i]=='0'?0:one,v=(s[i-1]-'0')*10+s[i]-'0';if(v>=10&&v<=26)cur+=two;two=one;one=cur;}return one;}}

Julia
~~~~~

.. code-block:: julia

   function num_decodings(s::String)
       b=codeunits(s);two=1;one=b[1]==UInt8('0') ? 0 : 1
       for i in 2:length(b);cur=b[i]==UInt8('0') ? 0 : one;v=(b[i-1]-UInt8('0'))*10+(b[i]-UInt8('0'));if 10<=v<=26;cur+=two;end;two,one=one,cur;end
       one
   end

R
~

.. code-block:: r

   num_decodings <- function(s){d<-utf8ToInt(s)-48L;two<-1L;one<-if(d[[1L]]==0L)0L else 1L;if(length(d)>1L)for(i in 2:length(d)){cur<-if(d[[i]]==0L)0L else one;v<-d[[i-1L]]*10L+d[[i]];if(v>=10L&&v<=26L)cur<-cur+two;two<-one;one<-cur};one}
