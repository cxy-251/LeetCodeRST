0029. Divide Two Integers
=========================

题目信息
--------

:题号: 0029
:题名: Divide Two Integers
:难度: Medium
:类型: Algorithms
:主题: 数学、位运算
:原题: `LeetCode 0029 <https://leetcode.com/problems/divide-two-integers/>`_

题目重述
--------

给定两个 32 位有符号整数 ``dividend`` 和非零整数 ``divisor``，计算整数商，结果向 0 截断。实现不能使用乘法、除法和取模运算。若唯一的溢出情况 ``INT_MIN / -1`` 发生，返回 ``INT_MAX``。

自建示例
--------

.. code-block:: text

   输入：dividend = 43, divisor = -8
   输出：-5
   解释：精确结果为 -5.375，向 0 截断为 -5。

.. code-block:: text

   输入：dividend = -2147483648, divisor = -1
   输出：2147483647
   解释：数学结果超过 32 位有符号整数上限。

C++ 实现
--------

.. code-block:: cpp

   #include <climits>
   #include <vector>

   class Solution {
   private:
       void toNegative(int dividend, int divisor,
                       int& remaining, int& base, bool& negative) {
           negative = (dividend < 0) != (divisor < 0);
           remaining = dividend > 0 ? -dividend : dividend;
           base = divisor > 0 ? -divisor : divisor;
       }

       int repeatedSubtraction(int dividend, int divisor) {
           if (dividend == INT_MIN && divisor == -1) return INT_MAX;
           int remaining, base; bool negative;
           toNegative(dividend, divisor, remaining, base, negative);
           int quotient = 0;
           while (remaining <= base) {
               remaining -= base;
               --quotient;
           }
           return negative ? quotient : -quotient;
       }

       int doublingEveryRound(int dividend, int divisor) {
           if (dividend == INT_MIN && divisor == -1) return INT_MAX;
           int remaining, base; bool negative;
           toNegative(dividend, divisor, remaining, base, negative);
           int quotient = 0;
           const int half_min = INT_MIN / 2;
           while (remaining <= base) {
               int value = base;
               int contribution = -1;
               while (value >= half_min && remaining <= value + value) {
                   value += value;
                   contribution += contribution;
               }
               remaining -= value;
               quotient += contribution;
           }
           return negative ? quotient : -quotient;
       }

       int doublingTable(int dividend, int divisor) {
           if (dividend == INT_MIN && divisor == -1) return INT_MAX;
           int remaining, base; bool negative;
           toNegative(dividend, divisor, remaining, base, negative);

           std::vector<int> values;
           std::vector<int> contributions;
           int value = base;
           int contribution = -1;
           const int half_min = INT_MIN / 2;
           while (value >= remaining) {
               values.push_back(value);
               contributions.push_back(contribution);
               if (value < half_min || value + value < remaining) break;
               value += value;
               contribution += contribution;
           }

           int quotient = 0;
           for (int i = static_cast<int>(values.size()) - 1; i >= 0; --i) {
               if (values[i] >= remaining) {
                   remaining -= values[i];
                   quotient += contributions[i];
               }
           }
           return negative ? quotient : -quotient;
       }

   public:
       int divide(int dividend, int divisor) {
           return doublingTable(dividend, divisor);
       }
   };

题解
----

逐次减法为什么无法处理极端商
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

整数除法可以理解为不断从被除数绝对值中减去除数绝对值，并统计成功次数。``INT_MAX / 1`` 需要约二十亿次循环，
时间 ``O(|q|)``，必须一次消去多个除数。

为什么统一使用负数域
~~~~~~~~~~~~~~~~~~~~

32 位范围为 ``[-2147483648, 2147483647]``。``abs(INT_MIN)`` 无法存入正数域，而任意正数都能安全转成负数。因此
把两个输入都转为非正数，商也先用负数累计，整个过程无需构造 ``2147483648``。

加法倍增如何构造二进制商位
~~~~~~~~~~~~~~~~~~~~~~~~~~

从负数 ``base`` 和贡献 ``-1`` 开始，每次执行：

.. code-block:: text

   value += value
   contribution += contribution

得到 ``base`` 的 1、2、4、8 倍。对 ``43 / 5``，负数表为：

.. list-table::
   :header-rows: 1

   * - ``value``
     - 商贡献
     - 是否选入 -43
   * - -5
     - -1
     - 最后判断
   * - -10
     - -2
     - 未选
   * - -20
     - -4
     - 未选
   * - -40
     - -8
     - 选入，剩余 -3

从最大倍数向下扫描，相当于从商的最高二进制位到最低位确定是否为 1。

为什么倍增前需要 ``half_min`` 边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

计算 ``value + value`` 前必须保证 ``value >= INT_MIN / 2``，否则加法会低于 ``INT_MIN``。另一个停止条件
``value + value < remaining`` 表示下一倍数的绝对值已经超过当前被除数，不需要保存。

降序选择为什么得到最大合法商
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若某个倍增值 ``value`` 满足 ``value >= remaining``，它的绝对值不超过剩余量，可以安全减去并加入对应商贡献。
若不满足，该二进制位取 1 会使除数倍数超过被除数，必须为 0。降序贪心逐位得到最大不超过被除数绝对值的倍数。

为什么结果是向零截断
~~~~~~~~~~~~~~~~~~~~

算法在绝对值意义上得到 ``floor(|dividend| / |divisor|)``，余数不足再减一次。最后只根据输入符号决定正负，不因
余数继续远离零调整，因此异号结果也是向零方向截断。

唯一正向溢出为什么可提前处理
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最大绝对值商只会出现在 ``INT_MIN / -1``，数学结果为 ``2147483648``，超过 ``INT_MAX``。其他输入的商均在
32 位范围内。入口提前返回 ``INT_MAX`` 后，负数累计结果可安全取反。

复杂度来源
~~~~~~~~~~

逐次减法 ``O(|q|)``。每轮重新倍增最多 ``O(log^2 |q|)``。倍增表长度最多 32，构建与降序扫描均为
``O(log |q|)``，空间 ``O(log |q|)``；对固定 32 位整数也可视为常数上界。

九语言实现
----------

C
~

.. code-block:: c

   int divide(int dividend, int divisor) {
       if (dividend == INT_MIN && divisor == -1) return INT_MAX;
       int negative = (dividend < 0) != (divisor < 0);
       int remaining = dividend > 0 ? -dividend : dividend;
       int base = divisor > 0 ? -divisor : divisor;
       int values[32], parts[32], count=0, value=base, part=-1;
       while (value >= remaining) {
           values[count]=value;parts[count++]=part;
           if (value < INT_MIN/2 || value+value < remaining) break;
           value+=value;part+=part;
       }
       int quotient=0;
       for(int i=count-1;i>=0;--i) if(values[i]>=remaining){remaining-=values[i];quotient+=parts[i];}
       return negative ? quotient : -quotient;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def divide(self, dividend: int, divisor: int) -> int:
           int_min, int_max = -(1 << 31), (1 << 31) - 1
           if dividend == int_min and divisor == -1: return int_max
           negative = (dividend < 0) != (divisor < 0)
           remaining = -abs(dividend); base = -abs(divisor)
           values, parts, value, part = [], [], base, -1
           while value >= remaining:
               values.append(value); parts.append(part)
               if value + value < remaining: break
               value += value; part += part
           quotient = 0
           for value, part in zip(reversed(values), reversed(parts)):
               if value >= remaining: remaining -= value; quotient += part
           return quotient if negative else -quotient

Java
~~~~

.. code-block:: java

   class Solution {
       public int divide(int dividend,int divisor){
           if(dividend==Integer.MIN_VALUE&&divisor==-1)return Integer.MAX_VALUE;
           boolean negative=(dividend<0)!=(divisor<0);int remaining=dividend>0?-dividend:dividend;int base=divisor>0?-divisor:divisor;
           int[] values=new int[32],parts=new int[32];int count=0,value=base,part=-1;
           while(value>=remaining){values[count]=value;parts[count++]=part;if(value<Integer.MIN_VALUE/2||value+value<remaining)break;value+=value;part+=part;}
           int quotient=0;for(int i=count-1;i>=0;i--)if(values[i]>=remaining){remaining-=values[i];quotient+=parts[i];}
           return negative?quotient:-quotient;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn divide(dividend:i32,divisor:i32)->i32{
           if dividend==i32::MIN&&divisor==-1{return i32::MAX}
           let negative=(dividend<0)!=(divisor<0);let mut remaining=if dividend>0{-dividend}else{dividend};let base=if divisor>0{-divisor}else{divisor};
           let(mut values,mut parts)=(Vec::new(),Vec::new());let(mut value,mut part)=(base,-1);
           while value>=remaining{values.push(value);parts.push(part);if value<i32::MIN/2||value+value<remaining{break}value+=value;part+=part;}
           let mut quotient=0;for i in (0..values.len()).rev(){if values[i]>=remaining{remaining-=values[i];quotient+=parts[i];}}
           if negative{quotient}else{-quotient}
       }
   }

Go
~~

.. code-block:: go

   func divide(dividend,divisor int)int{
       const min=-1<<31;const max=1<<31-1;if dividend==min&&divisor==-1{return max}
       negative:=(dividend<0)!=(divisor<0);remaining:=dividend;if remaining>0{remaining=-remaining};base:=divisor;if base>0{base=-base}
       values,parts:=[]int{},[]int{};value,part:=base,-1
       for value>=remaining{values=append(values,value);parts=append(parts,part);if value<min/2||value+value<remaining{break};value+=value;part+=part}
       quotient:=0;for i:=len(values)-1;i>=0;i--{if values[i]>=remaining{remaining-=values[i];quotient+=parts[i]}}
       if negative{return quotient};return -quotient
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function divide(dividend:number,divisor:number):number{
       const min=-(2**31),max=2**31-1;if(dividend===min&&divisor===-1)return max;
       const negative=(dividend<0)!==(divisor<0);let remaining=dividend>0?-dividend:dividend;const base=divisor>0?-divisor:divisor;
       const values:number[]=[],parts:number[]=[];let value=base,part=-1;
       while(value>=remaining){values.push(value);parts.push(part);if(value<min/2||value+value<remaining)break;value+=value;part+=part;}
       let quotient=0;for(let i=values.length-1;i>=0;i--)if(values[i]>=remaining){remaining-=values[i];quotient+=parts[i];}
       return negative?quotient:-quotient;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Divide(int dividend,int divisor){
           if(dividend==int.MinValue&&divisor==-1)return int.MaxValue;
           bool negative=(dividend<0)!=(divisor<0);int remaining=dividend>0?-dividend:dividend;int baseValue=divisor>0?-divisor:divisor;
           var values=new List<int>();var parts=new List<int>();int value=baseValue,part=-1;
           while(value>=remaining){values.Add(value);parts.Add(part);if(value<int.MinValue/2||value+value<remaining)break;value+=value;part+=part;}
           int quotient=0;for(int i=values.Count-1;i>=0;i--)if(values[i]>=remaining){remaining-=values[i];quotient+=parts[i];}
           return negative?quotient:-quotient;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function divide_integers(dividend::Int32, divisor::Int32)::Int32
       dividend==typemin(Int32)&&divisor==-1 && return typemax(Int32)
       negative=(dividend<0)!=(divisor<0);remaining=dividend>0 ? -dividend : dividend;base=divisor>0 ? -divisor : divisor
       values=Int32[];parts=Int32[];value=base;part=Int32(-1)
       while value>=remaining;push!(values,value);push!(parts,part);if value<typemin(Int32)÷2||value+value<remaining;break;end;value+=value;part+=part;end
       quotient=Int32(0);for i in reverse(eachindex(values));if values[i]>=remaining;remaining-=values[i];quotient+=parts[i];end;end
       negative ? quotient : -quotient
   end

R
~

.. code-block:: r

   divide_integers <- function(dividend, divisor) {
       int_min <- -(2^31); int_max <- 2^31-1
       if (dividend == int_min && divisor == -1) return(int_max)
       negative <- xor(dividend < 0, divisor < 0)
       remaining <- if (dividend > 0) -dividend else dividend
       base <- if (divisor > 0) -divisor else divisor
       values <- numeric(); parts <- numeric(); value <- base; part <- -1
       while (value >= remaining) { values<-c(values,value);parts<-c(parts,part);if(value<int_min/2||value+value<remaining)break;value<-value+value;part<-part+part }
       quotient <- 0
       for (i in rev(seq_along(values))) if (values[[i]] >= remaining) { remaining<-remaining-values[[i]];quotient<-quotient+parts[[i]] }
       if (negative) quotient else -quotient
   }
