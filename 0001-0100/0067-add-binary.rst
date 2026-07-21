0067. Add Binary
================

题目信息
--------

:题号: 0067
:难度: Easy
:主题: 字符串、二进制、双指针、进位
:原题: `LeetCode 0067 <https://leetcode.com/problems/add-binary/>`_
:教学重点: 低位对齐、三项求和、反向构造、最高位进位

题目重述
--------

给定两个非空二进制字符串 ``a`` 和 ``b``，返回它们的和。输入可能很长，不能转换为固定宽整数；除 ``"0"`` 外没有前导零，输出也应为规范二进制字符串。

自建示例
--------

.. code-block:: text

   "1011" + "110" -> "10001"
   "1111" + "1"   -> "10000"
   "0"    + "0"   -> "0"

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   private:
       std::string fixedWidthConversion(const std::string& a, const std::string& b) {
           unsigned long long left = 0, right = 0;
           for (char ch : a) left = left * 2 + (ch - '0');
           for (char ch : b) right = right * 2 + (ch - '0');
           unsigned long long sum = left + right;
           if (sum == 0) return "0";
           std::string result;
           while (sum > 0) { result.push_back('0' + sum % 2); sum /= 2; }
           std::reverse(result.begin(), result.end());
           return result;
       }

       std::string padAndAdd(std::string a, std::string b) {
           if (a.size() < b.size()) a.insert(a.begin(), b.size() - a.size(), '0');
           if (b.size() < a.size()) b.insert(b.begin(), a.size() - b.size(), '0');
           std::string result(a.size(), '0');
           int carry = 0;
           for (int i = static_cast<int>(a.size()) - 1; i >= 0; --i) {
               int total = a[i] - '0' + b[i] - '0' + carry;
               result[i] = '0' + total % 2;
               carry = total / 2;
           }
           if (carry) result.insert(result.begin(), '1');
           return result;
       }

       std::string reversePointers(const std::string& a, const std::string& b) {
           int i = static_cast<int>(a.size()) - 1;
           int j = static_cast<int>(b.size()) - 1;
           int carry = 0;
           std::string reversed;
           reversed.reserve(std::max(a.size(), b.size()) + 1);
           while (i >= 0 || j >= 0 || carry) {
               int total = carry;
               if (i >= 0) total += a[i--] - '0';
               if (j >= 0) total += b[j--] - '0';
               reversed.push_back('0' + total % 2);
               carry = total / 2;
           }
           std::reverse(reversed.begin(), reversed.end());
           return reversed;
       }

   public:
       std::string addBinary(std::string a, std::string b) {
           return reversePointers(a, b);
       }
   };

题解
----

为什么固定宽整数不可用
~~~~~~~~~~~~~~~~~~~~

输入长度可达到上万位，任何普通整数都会溢出。字符串已经给出逐位表示，按二进制竖式计算可以让每轮状态始终保持在常数范围。

为什么从字符串末尾开始
~~~~~~~~~~~~~~~~~~~~

不同长度数字按最低位对齐，而最低位位于字符串末尾。两个下标分别从末尾向左移动；某个字符串耗尽后，该侧数字位视为 0，无需在前面实际补零。

每轮如何拆分结果位与进位
~~~~~~~~~~~~~~~~~~~~~~~~

两个输入位和旧进位都只可能是 0 或 1，因此 ``total`` 只可能为 0 到 3：

.. code-block:: text

   result_bit = total % 2
   carry      = total / 2

模 2 得当前位，整除 2 得传向更高位的进位。

1011 + 110 的状态跟踪
~~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 输入位
     - 旧进位
     - ``total``
     - 结果位 / 新进位
   * - ``1 + 0``
     - 0
     - 1
     - ``1 / 0``
   * - ``1 + 1``
     - 0
     - 2
     - ``0 / 1``
   * - ``0 + 1``
     - 1
     - 2
     - ``0 / 1``
   * - ``1 + 0``
     - 1
     - 2
     - ``0 / 1``
   * - 输入耗尽
     - 1
     - 1
     - ``1 / 0``

低位依次产生 ``10001`` 的反向序列，反转后得到答案。

循环条件为何包含 carry
~~~~~~~~~~~~~~~~~~~~~~

两个下标都越界时，最高位仍可能留下进位。例如 ``1111 + 1``。循环条件包含 ``carry``，可自然再生成一个最高位 1，而不需要循环后的额外分支。

为什么结果先反向构造
~~~~~~~~~~~~~~~~~~~~

竖式从最低位产生字符，而字符串需要高位在前。向缓冲区末尾追加是常数摊还成本；完成后整体反转一次为 ``O(m+n)``。若每轮在字符串头插入，会反复移动已有字符，退化为平方级。

补零方法与双指针方法的取舍
~~~~~~~~~~~~~~~~~~~~~~~~~~

左侧补零后两个字符串下标一致，代码直观，但需要复制和扩展输入。双指针把缺失位按 0 处理，不创建补零字符串，状态更少。

为什么输出没有多余前导零
~~~~~~~~~~~~~~~~~~~~~~

输入规范。最高输出位要么来自最高非零输入位，要么来自最终进位；只有两数都为 0 时产生单个 0。因此不会形成额外前导零。

复杂度来源
~~~~~~~~~~

双指针访问每个输入位一次并反转结果，时间 ``O(m+n)``。结果最多 ``max(m,n)+1`` 位；除返回字符串外额外状态 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   char*addBinary(char*a,char*b){int i=(int)strlen(a)-1,j=(int)strlen(b)-1,carry=0,k=0,cap=(i>j?i:j)+3;char*out=malloc((size_t)cap);while(i>=0||j>=0||carry){int total=carry+(i>=0?a[i--]-'0':0)+(j>=0?b[j--]-'0':0);out[k++]=(char)('0'+total%2);carry=total/2;}for(int l=0,r=k-1;l<r;l++,r--){char t=out[l];out[l]=out[r];out[r]=t;}out[k]='\0';return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def addBinary(self, a: str, b: str) -> str:
           i, j, carry, output = len(a)-1, len(b)-1, 0, []
           while i >= 0 or j >= 0 or carry:
               total = carry
               if i >= 0: total += ord(a[i])-48; i -= 1
               if j >= 0: total += ord(b[j])-48; j -= 1
               output.append(str(total % 2)); carry = total // 2
           return "".join(reversed(output))

Java
~~~~

.. code-block:: java

   class Solution {public String addBinary(String a,String b){int i=a.length()-1,j=b.length()-1,carry=0;StringBuilder out=new StringBuilder();while(i>=0||j>=0||carry!=0){int total=carry+(i>=0?a.charAt(i--)-'0':0)+(j>=0?b.charAt(j--)-'0':0);out.append(total%2);carry=total/2;}return out.reverse().toString();}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn add_binary(a:String,b:String)->String{let(x,y)=(a.as_bytes(),b.as_bytes());let(mut i,mut j,mut carry)=(x.len()as i32-1,y.len()as i32-1,0u8);let mut out=Vec::new();while i>=0||j>=0||carry>0{let mut total=carry;if i>=0{total+=x[i as usize]-b'0';i-=1}if j>=0{total+=y[j as usize]-b'0';j-=1}out.push(b'0'+total%2);carry=total/2;}out.reverse();String::from_utf8(out).unwrap()}}

Go
~~

.. code-block:: go

   func addBinary(a,b string)string{i,j,carry:=len(a)-1,len(b)-1,0;out:=[]byte{};for i>=0||j>=0||carry>0{total:=carry;if i>=0{total+=int(a[i]-'0');i--};if j>=0{total+=int(b[j]-'0');j--};out=append(out,byte('0'+total%2));carry=total/2};for l,r:=0,len(out)-1;l<r;l,r=l+1,r-1{out[l],out[r]=out[r],out[l]};return string(out)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function addBinary(a:string,b:string):string{let i=a.length-1,j=b.length-1,carry=0;const out:string[]=[];while(i>=0||j>=0||carry){let total=carry;if(i>=0)total+=Number(a[i--]);if(j>=0)total+=Number(b[j--]);out.push(String(total%2));carry=Math.floor(total/2);}return out.reverse().join("");}

C#
~~

.. code-block:: csharp

   public class Solution {public string AddBinary(string a,string b){int i=a.Length-1,j=b.Length-1,carry=0;var outp=new System.Text.StringBuilder();while(i>=0||j>=0||carry!=0){int total=carry+(i>=0?a[i--]-'0':0)+(j>=0?b[j--]-'0':0);outp.Append(total%2);carry=total/2;}char[]chars=outp.ToString().ToCharArray();Array.Reverse(chars);return new string(chars);}}

Julia
~~~~~

.. code-block:: julia

   function add_binary(a::String,b::String)
       x=collect(a);y=collect(b);i=length(x);j=length(y);carry=0;out=Char[]
       while i>=1||j>=1||carry>0;total=carry;if i>=1;total+=Int(x[i]-'0');i-=1;end;if j>=1;total+=Int(y[j]-'0');j-=1;end;push!(out,Char(Int('0')+total%2));carry=total÷2;end
       String(reverse(out))
   end

R
~

.. code-block:: r

   add_binary <- function(a,b){x<-strsplit(a,"",fixed=TRUE)[[1L]];y<-strsplit(b,"",fixed=TRUE)[[1L]];i<-length(x);j<-length(y);carry<-0L;out<-character();while(i>=1L||j>=1L||carry>0L){total<-carry;if(i>=1L){total<-total+as.integer(x[[i]]);i<-i-1L};if(j>=1L){total<-total+as.integer(y[[j]]);j<-j-1L};out<-c(out,as.character(total%%2L));carry<-total%/%2L};paste0(rev(out),collapse="")}
