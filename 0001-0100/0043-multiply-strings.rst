0043. Multiply Strings
======================

题目信息
--------

:题号: 0043
:难度: Medium
:主题: 字符串、竖式乘法、位权对齐、进位
:原题: `LeetCode 0043 <https://leetcode.com/problems/multiply-strings/>`_
:重点: 乘积位数上界、结果槽位、局部进位、前导零处理

题目重述
--------

给定两个表示非负整数的十进制字符串 ``num1`` 和 ``num2``，返回它们乘积的十进制字符串。不能把整个字符串转换成内置整数，也不能使用任意精度整数库。除字符串 ``"0"`` 外，输入和输出都没有前导零。

约束为 ``1 <= num1.length, num2.length <= 200``，字符只可能是数字 ``0`` 到 ``9``。

自建示例
--------

.. code-block:: text

   输入：num1 = "314", num2 = "27"
   输出："8478"

``314 * 27 = 314 * 20 + 314 * 7 = 6280 + 2198 = 8478``。

.. code-block:: text

   输入：num1 = "500", num2 = "0"
   输出："0"

任一因数为零时，结果必须规范化为单个字符 ``"0"``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string addStrings(const std::string& a, const std::string& b) {
           int i = static_cast<int>(a.size()) - 1;
           int j = static_cast<int>(b.size()) - 1;
           int carry = 0;
           std::string result;
           while (i >= 0 || j >= 0 || carry) {
               int sum = carry;
               if (i >= 0) sum += a[i--] - '0';
               if (j >= 0) sum += b[j--] - '0';
               result.push_back(static_cast<char>('0' + sum % 10));
               carry = sum / 10;
           }
           std::reverse(result.begin(), result.end());
           return result;
       }

       std::string partialProducts(const std::string& a, const std::string& b) {
           std::string result = "0";
           for (int j = static_cast<int>(b.size()) - 1, zeros = 0; j >= 0; --j, ++zeros) {
               int carry = 0;
               std::string row(zeros, '0');
               for (int i = static_cast<int>(a.size()) - 1; i >= 0; --i) {
                   int product = (a[i] - '0') * (b[j] - '0') + carry;
                   row.push_back(static_cast<char>('0' + product % 10));
                   carry = product / 10;
               }
               if (carry) row.push_back(static_cast<char>('0' + carry));
               std::reverse(row.begin(), row.end());
               result = addStrings(result, row);
           }
           return result;
       }

       std::string resultArray(const std::string& a, const std::string& b) {
           if (a == "0" || b == "0") return "0";
           const int m = static_cast<int>(a.size());
           const int n = static_cast<int>(b.size());
           std::vector<int> digits(m + n, 0);
           for (int i = m - 1; i >= 0; --i) {
               for (int j = n - 1; j >= 0; --j) {
                   int sum = digits[i + j + 1] + (a[i] - '0') * (b[j] - '0');
                   digits[i + j + 1] = sum % 10;
                   digits[i + j] += sum / 10;
               }
           }
           std::string result;
           int first = 0;
           while (first < m + n && digits[first] == 0) ++first;
           for (; first < m + n; ++first) result.push_back(static_cast<char>('0' + digits[first]));
           return result.empty() ? "0" : result;
       }

   public:
       std::string multiply(std::string num1, std::string num2) {
           return resultArray(num1, num2);
       }
   };

题解
----

从重复加法到竖式部分积
~~~~~~~~~~~~~~~~~~~~~~

把一个数重复相加另一个数次，循环次数与数值大小相关，不适合长字符串。十进制竖式只需枚举 ``m*n`` 对数字位；逐行部分积方法已经把工作限制到输入位数，但需要反复构造字符串并执行字符串加法。

为什么乘积最多有 m+n 位
~~~~~~~~~~~~~~~~~~~~~~~

``m`` 位数小于 ``10^m``，``n`` 位数小于 ``10^n``，乘积小于 ``10^(m+n)``，所以最多 ``m+n`` 位。结果数组固定为这个长度，首槽可能为 0。

两个数字位影响哪些槽位
~~~~~~~~~~~~~~~~~~~~~~

字符串下标从高位到低位。``a[i]`` 与 ``b[j]`` 的乘积最低位进入 ``i+j+1``，进位进入 ``i+j``：

.. code-block:: text

   product = digit1 * digit2 + digits[i+j+1]
   digits[i+j+1] = product % 10
   digits[i+j]  += product / 10

这个位置关系等价于竖式中个位、十位、百位的位权对齐。

局部进位为何不会丢失
~~~~~~~~~~~~~~~~~~~~

从右下角向左上角枚举。更新 ``digits[i+j+1]`` 时，该槽位已经汇集右侧组合传来的贡献；取模留下最终个位，商累加到更高槽位。更高槽位稍后还会参与新的 ``sum``，因此多次贡献会继续被规范化。

123 乘 45 的关键累加
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 数字对
     - 乘积
     - 低位槽
     - 高位进位
   * - 3 × 5
     - 15
     - 下标 4 写 5
     - 下标 3 加 1
   * - 2 × 5
     - 11
     - 下标 3 写 1
     - 下标 2 加 1
   * - 3 × 4
     - 12 加原槽贡献
     - 下标 3 更新
     - 下标 2 累加

全部数字对处理后数组为 ``[0,5,5,3,5]``，跳过首个零得到 ``"5535"``。

为什么只删除结果数组开头的零
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

中间或末尾的零具有真实位权，不能删除。结果数组最前端的零仅来自 ``m+n`` 位上界未被占满；从首个非零槽开始输出即可。一方为 ``"0"`` 时提前返回避免得到空字符串。

复杂度来源
~~~~~~~~~~

部分积和统一数组都执行 ``O(mn)`` 个数字乘法。统一数组使用 ``O(m+n)`` 空间，并避免多次字符串相加；输出转换再花 ``O(m+n)``。

九语言实现
----------

C
~

.. code-block:: c

   char *multiply(char *a, char *b) {
       if ((a[0]=='0'&&a[1]=='\0')||(b[0]=='0'&&b[1]=='\0')) { char *z=malloc(2);strcpy(z,"0");return z; }
       int m=(int)strlen(a),n=(int)strlen(b);int *d=calloc((size_t)(m+n),sizeof(int));
       for(int i=m-1;i>=0;--i)for(int j=n-1;j>=0;--j){int s=d[i+j+1]+(a[i]-'0')*(b[j]-'0');d[i+j+1]=s%10;d[i+j]+=s/10;}
       int first=0;while(first<m+n&&d[first]==0)++first;char *r=malloc((size_t)(m+n-first+1));int k=0;
       for(;first<m+n;++first)r[k++]=(char)('0'+d[first]);r[k]='\0';free(d);return r;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def multiply(self, a: str, b: str) -> str:
           if a == "0" or b == "0": return "0"
           digits = [0] * (len(a) + len(b))
           for i in range(len(a)-1, -1, -1):
               for j in range(len(b)-1, -1, -1):
                   total = digits[i+j+1] + int(a[i]) * int(b[j])
                   digits[i+j+1] = total % 10
                   digits[i+j] += total // 10
           first = 0
           while first < len(digits) and digits[first] == 0: first += 1
           return "".join(map(str, digits[first:]))

Java
~~~~

.. code-block:: java

   class Solution {
       public String multiply(String a,String b){if(a.equals("0")||b.equals("0"))return "0";int m=a.length(),n=b.length();int[] d=new int[m+n];
           for(int i=m-1;i>=0;i--)for(int j=n-1;j>=0;j--){int s=d[i+j+1]+(a.charAt(i)-'0')*(b.charAt(j)-'0');d[i+j+1]=s%10;d[i+j]+=s/10;}
           StringBuilder r=new StringBuilder();int first=0;while(first<d.length&&d[first]==0)first++;for(;first<d.length;first++)r.append(d[first]);return r.toString();}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn multiply(a:String,b:String)->String{if a=="0"||b=="0"{return "0".into()}let x=a.as_bytes();let y=b.as_bytes();let mut d=vec![0i32;x.len()+y.len()];
           for i in (0..x.len()).rev(){for j in (0..y.len()).rev(){let s=d[i+j+1]+((x[i]-b'0')as i32)*((y[j]-b'0')as i32);d[i+j+1]=s%10;d[i+j]+=s/10;}}
           let first=d.iter().position(|&v|v!=0).unwrap_or(d.len());d[first..].iter().map(|v|char::from(b'0'+*v as u8)).collect()}
   }

Go
~~

.. code-block:: go

   func multiply(a,b string)string{if a=="0"||b=="0"{return "0"};d:=make([]int,len(a)+len(b));for i:=len(a)-1;i>=0;i--{for j:=len(b)-1;j>=0;j--{s:=d[i+j+1]+int(a[i]-'0')*int(b[j]-'0');d[i+j+1]=s%10;d[i+j]+=s/10}};first:=0;for first<len(d)&&d[first]==0{first++};r:=make([]byte,len(d)-first);for i:=first;i<len(d);i++{r[i-first]=byte('0'+d[i])};return string(r)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function multiply(a:string,b:string):string{if(a==="0"||b==="0")return "0";const d=Array(a.length+b.length).fill(0);for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--){const s=d[i+j+1]+Number(a[i])*Number(b[j]);d[i+j+1]=s%10;d[i+j]+=Math.floor(s/10);}let first=0;while(first<d.length&&d[first]===0)first++;return d.slice(first).join("");}

C#
~~

.. code-block:: csharp

   public class Solution {public string Multiply(string a,string b){if(a=="0"||b=="0")return "0";int[] d=new int[a.Length+b.Length];for(int i=a.Length-1;i>=0;i--)for(int j=b.Length-1;j>=0;j--){int s=d[i+j+1]+(a[i]-'0')*(b[j]-'0');d[i+j+1]=s%10;d[i+j]+=s/10;}int first=0;while(first<d.Length&&d[first]==0)first++;var r=new System.Text.StringBuilder();for(;first<d.Length;first++)r.Append(d[first]);return r.ToString();}}

Julia
~~~~~

.. code-block:: julia

   function multiply_strings(a::String,b::String)::String
       (a=="0"||b=="0")&&return "0";x=collect(a);y=collect(b);d=zeros(Int,length(x)+length(y))
       for i in length(x):-1:1,j in length(y):-1:1;s=d[i+j]+(Int(x[i])-Int('0'))*(Int(y[j])-Int('0'));d[i+j]=s%10;d[i+j-1]+=s÷10;end
       first=findfirst(!=(0),d);first===nothing ? "0" : join(d[first:end])
   end

R
~

.. code-block:: r

   multiply_strings <- function(a,b){if(a=="0"||b=="0")return("0");x<-strsplit(a,"")[[1]];y<-strsplit(b,"")[[1]];m<-length(x);n<-length(y);d<-integer(m+n)
     for(i in m:1)for(j in n:1){s<-d[[i+j]]+as.integer(x[[i]])*as.integer(y[[j]]);d[[i+j]]<-s%%10L;d[[i+j-1L]]<-d[[i+j-1L]]+s%/%10L}
     first<-which(d!=0L)[1];paste0(d[first:length(d)],collapse="")
   }