0150. Evaluate Reverse Polish Notation
======================================

题目信息
--------

:题号: 0150
:难度: Medium
:主题: 栈、表达式
:原题: `LeetCode 0150 <https://leetcode.com/problems/evaluate-reverse-polish-notation/>`_
:访问状态: Available
:教学重点: 操作数顺序与截断除法

题目重述
--------

计算逆波兰表达式。每个 token 是整数或 ``+ - * /``，除法向零截断，表达式保证有效。

自建示例
--------

.. code-block:: text

   输入：tokens = ["2","1","+","3","*"]
   输出：9

   输入：tokens = ["4","13","5","/","+"]
   输出：6

问题抽象
--------

数字入栈；遇运算符弹出右操作数 ``b`` 再弹左操作数 ``a``，计算 ``a op b`` 后压回。

主解法：操作数栈
----------

思路
~~~~

操作数栈。 操作数顺序与截断除法

核心状态与不变量
~~~~~~~~~~~~~~~~

数字入栈；遇运算符弹出右操作数 ``b`` 再弹左操作数 ``a``，计算 ``a op b`` 后压回。

正确性依据
~~~~~~~~~~

有效后缀表达式的每个运算符恰组合栈顶两个已完成子表达式。归纳保证栈元素始终是已扫描前缀中未被上层消费的子表达式值；结束时唯一元素是整式结果。

复杂度与语言边界
~~~~~~~~~~~~~~~~

令 token 数为 ``n``，时间 ``O(n)``；栈 ``O(n)``。各语言必须实现向零截断整数除法并防止错误使用向下取整。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>
   int evalRPN(char**t,int n) {
       long long*s=malloc((size_t)n*sizeof(*s));
       int top=0;
       for(int i=0;i<n;i++) {
           char*x=t[i];
           if(strlen(x)==1&&strchr("+-*/",x[0])) {
               long long b=s[--top],a=s[--top];
               switch(x[0]) {
                   case'+':s[top++]=a+b;
                   break;
                   case'-':s[top++]=a-b;
                   break;
                   case'*':s[top++]=a*b;
                   break;
                   default:s[top++]=a/b;
               }
           } else s[top++]=strtoll(x,NULL,10);
       }
       int a=(int)s[0];
       free(s);
       return a;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int evalRPN(vector<string>&t) {
           vector<long long>s;
           for(auto&x:t) {
               if(x.size()==1&&string("+-*/").find(x[0])!=string::npos) {
                   long long b=s.back();
                   s.pop_back();
                   long long a=s.back();
                   s.pop_back();
                   if(x=="+")s.push_back(a+b);
                   else if(x=="-")s.push_back(a-b);
                   else if(x=="*")s.push_back(a*b);
                   else s.push_back(a/b);
               } else s.push_back(stoll(x));
           }
           return s.back();
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:
       def evalRPN(self, tokens: list[str]) -> int:
           stack: list[int] = []
           for token in tokens:
               if token not in {"+", "-", "*", "/"}:
                   stack.append(int(token))
                   continue
               right = stack.pop()
               left = stack.pop()
               if token == "+":
                   stack.append(left + right)
               elif token == "-":
                   stack.append(left - right)
               elif token == "*":
                   stack.append(left * right)
               else:
                   stack.append(int(left / right))
           return stack[-1]

Java
~~~~

.. code-block:: java

   class Solution {
       public int evalRPN(String[]t) {
           ArrayDeque<Integer>s=new ArrayDeque<>();
           for(String x:t) {
               if(x.length()==1&&"+-*/".contains(x)) {
                   int b=s.pop(),a=s.pop();
                   s.push(x.equals("+")?a+b:x.equals("-")?a-b:x.equals("*")?a*b:a/b);
               } else s.push(Integer.parseInt(x));
           }
           return s.pop();
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn eval_rpn(t:Vec<String>)->i32 {
           let mut s=vec![];
           for x in t {
               match x.as_str() {
                   "+"|"-"|"*"|"/"=> {
                       let b=s.pop().unwrap();
                       let a=s.pop().unwrap();
                       s.push(match x.as_str(){"+"=>a+b,"-"=>a-b,"*"=>a*b,_=>a/b});
                   }
                   ,_=>s.push(x.parse().unwrap()),
               }
           }
           s[0]
       }
   }
Go
~~

.. code-block:: go

   func evalRPN(t []string) int {
   	s := []int{}
   	for _, x := range t {
   		if x == "+" || x == "-" || x == "*" || x == "/" {
   			b := s[len(s)-1]
   			a := s[len(s)-2]
   			s = s[:len(s)-2]
   			v := 0
   			if x == "+" {
   				v = a + b
   			} else if x == "-" {
   				v = a - b
   			} else if x == "*" {
   				v = a * b
   			} else {
   				v = a / b
   			}
   			s = append(s, v)
   		} else {
   			v, _ := strconv.Atoi(x)
   			s = append(s, v)
   		}
   	}
   	return s[0]
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function evalRPN(t: string[]): number {
       const s: number[] = [];
       for (const x of t) {
           if (['+', '-', '*', '/'].includes(x)) {
               const b = s.pop()!, a = s.pop()!;
               s.push(x === '+' ? a + b : x === '-' ? a - b : x === '*' ? a * b : Math.trunc(a /
                   b));
           }
           else
               s.push(Number(x));
       }
       return s[0];
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int EvalRPN(string[]t) {
           var s=new Stack<int>();
           foreach(string x in t) {
               if(x.Length==1&&"+-*/".Contains(x)) {
                   int b=s.Pop(),a=s.Pop();
                   s.Push(x=="+"?a+b:x=="-"?a-b:x=="*"?a*b:a/b);
               } else s.Push(int.Parse(x));
           }
           return s.Pop();
       }
   }
Julia
~~~~~

.. code-block:: julia

   function eval_rpn(t::Vector{String})::Int
       s=Int[]
       for x in t
           if x in ("+","-","*","/")
               b=pop!(s)
               a=pop!(s)
               push!(s,x=="+" ? a+b : x=="-" ? a-b : x=="*" ? a*b : div(a,b,RoundToZero))
           else
               push!(s,parse(Int,x))
           end
       end
       s[1]
   end
R
~

.. code-block:: r

   eval_rpn <- function(t) {
       s<-numeric()
       for(x in t) {
           if(x%in%c('+','-','*','/')) {
               b<-s[[length(s)]]
               a<-s[[length(s)-1L]]
               s<-s[-c(length(s)-1L,length(s))]
               v<-switch(x,'+'=a+b,'-'=a-b,'*'=a*b,'/'=trunc(a/b))
               s<-c(s,v)
           }
           else s<-c(s,as.numeric(x))
       }
       as.integer(s[[1L]])
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 负数 token 不是减号运算符。
* 减法和除法必须保持 ``a op b`` 顺序。

易错点
------

* 弹栈顺序反了。
* Python ``//`` 和 R ``%/%`` 对负数不是向零截断。

本题新增知识
------------

* 操作数顺序与截断除法
* 题号 0150 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0020. Valid Parentheses <../0001-0100/0020-valid-parentheses.rst>`_；

最小自检
--------

#. ``操作数栈`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

有效后缀表达式的每个运算符恰组合栈顶两个已完成子表达式。归纳保证栈元素始终是已扫描前缀中未被上层消费的子表达式值；结束时唯一元素是整式结果。
