0150. Evaluate Reverse Polish Notation
======================================

题目信息
--------

:题号: 0150
:难度: Medium
:主题: 栈、表达式求值、整数除法
:原题: `LeetCode 0150 <https://leetcode.com/problems/evaluate-reverse-polish-notation/>`_
:重点: 二元操作数次序、负数字面量、向零截断、有效表达式保证

题目重述
--------

给定字符串数组 ``tokens``，其中各元素按逆波兰表达式的顺序组成一个有效算术表达式，计算并返回其整数结果。每个 token 要么是一个整数，要么是二元运算符 ``+``、``-``、``*``、``/``。遇到运算符时，它作用于前面最近得到的两个子表达式结果；较早的结果是左操作数，较晚的结果是右操作数。

除法结果向零截断，输入保证不会除以零，并且最终结果及所有中间计算都能用 32 位有符号整数表示。``tokens`` 的长度在 ``1..10^4`` 范围内，数字 token 的值在 ``-200..200`` 范围内。

自建示例
--------

.. code-block:: text

   输入：tokens = ["18","5","-","4","/"]
   输出：3
   解释：先计算 18 - 5 = 13，再计算 13 / 4 = 3；整数除法向零截断。

.. code-block:: text

   输入：tokens = ["7","-3","*","2","+"]
   输出：-19
   解释：token "-3" 是负整数，不是减法运算符；先计算 7 * (-3) = -21，再加 2 得到 -19。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isOperator(const std::string& token) {
           return token.size()==1 &&
                  (token[0]=='+'||token[0]=='-'||token[0]=='*'||token[0]=='/');
       }

       int apply(int left,int right,char op) {
           if(op=='+')return left+right;
           if(op=='-')return left-right;
           if(op=='*')return left*right;
           return left/right;
       }

       int reverseRecursive(const std::vector<std::string>& tokens,int& index) {
           const std::string token=tokens[index--];
           if(!isOperator(token))return std::stoi(token);
           int right=reverseRecursive(tokens,index);
           int left=reverseRecursive(tokens,index);
           return apply(left,right,token[0]);
       }

       int operandStack(const std::vector<std::string>& tokens) {
           std::vector<int> stack;
           for(const std::string& token:tokens) {
               if(!isOperator(token))stack.push_back(std::stoi(token));
               else {
                   int right=stack.back();stack.pop_back();
                   int left=stack.back();stack.pop_back();
                   stack.push_back(apply(left,right,token[0]));
               }
           }
           return stack.back();
       }

   public:
       int evalRPN(std::vector<std::string>& tokens) {
           return operandStack(tokens);
       }
   };

题解
----

栈中保存什么
~~~~~~~~~~~~

扫描任意合法前缀后，栈从底到顶保存若干已经完整求值、但尚未被后续运算符组合的子表达式结果。数字新增一个结果；二元运算符合并栈顶两个结果。

为什么先弹右操作数
~~~~~~~~~~~~~~~~~~

在逆波兰表达式中，``left right operator`` 表示 ``left operator right``。右子表达式更晚完成，位于栈顶，因此第一次弹出得到 ``right``，第二次才是 ``left``。加法和乘法会掩盖写反问题，减法和除法不会。

如何识别负数
~~~~~~~~~~~~

只有完整 token 恰好是四个单字符之一时才是运算符。``"-3"``、``"+12"`` 都是数字，不能仅检查首字符。

反向递归为何先求右侧
~~~~~~~~~~~~~~~~~~~~

从 token 末尾读取时，先遇到当前根运算符；其前面紧邻的是右子表达式的末尾，所以递归顺序必须是先右、后左。

除法语义
~~~~~~~~

C/C++、Java、Rust、Go 和 C# 的整数除法对本题有符号输入向零截断。Python 与 R 不能直接使用向下取整运算，需要显式按绝对值求商或调用 ``trunc``。

复杂度来源
~~~~~~~~~~

每个 token 处理一次，时间 ``O(n)``。操作数栈最坏 ``O(n)``；反向递归的调用栈最坏也为 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   int evalRPN(char**tokens,int n){int*stack=malloc((size_t)n*sizeof(int)),top=0;for(int i=0;i<n;i++){char*t=tokens[i];int op=t[1]=='\0'&&strchr("+-*/",t[0])!=NULL;if(!op)stack[top++]=atoi(t);else{int right=stack[--top],left=stack[--top];stack[top++]=t[0]=='+'?left+right:t[0]=='-'?left-right:t[0]=='*'?left*right:left/right;}}int out=stack[0];free(stack);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def evalRPN(self, tokens):
           stack=[]
           for token in tokens:
               if token not in {"+","-","*","/"}: stack.append(int(token));continue
               right,left=stack.pop(),stack.pop()
               if token=="+": value=left+right
               elif token=="-": value=left-right
               elif token=="*": value=left*right
               else: value=(1 if left*right>=0 else -1)*(abs(left)//abs(right))
               stack.append(value)
           return stack[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int evalRPN(String[]tokens){Deque<Integer>s=new ArrayDeque<>();for(String t:tokens){if(!(t.length()==1&&"+-*/".contains(t)))s.push(Integer.parseInt(t));else{int r=s.pop(),l=s.pop();s.push(t.equals("+")?l+r:t.equals("-")?l-r:t.equals("*")?l*r:l/r);}}return s.pop();}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn eval_rpn(tokens:Vec<String>)->i32{let mut s=vec![];for t in tokens{if matches!(t.as_str(),"+"|"-"|"*"|"/"){let r=s.pop().unwrap();let l=s.pop().unwrap();s.push(match t.as_str(){"+"=>l+r,"-"=>l-r,"*"=>l*r,_=>l/r});}else{s.push(t.parse().unwrap())}}s[0]}}

Go
~~

.. code-block:: go

   func evalRPN(tokens []string)int{s:=[]int{};for _,t:=range tokens{if len(t)==1&&strings.Contains("+-*/",t){r,l:=s[len(s)-1],s[len(s)-2];s=s[:len(s)-2];v:=0;if t=="+"{v=l+r}else if t=="-"{v=l-r}else if t=="*"{v=l*r}else{v=l/r};s=append(s,v)}else{v,_:=strconv.Atoi(t);s=append(s,v)}};return s[0]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function evalRPN(tokens:string[]):number{const s:number[]=[];for(const t of tokens){if(!["+","-","*","/"].includes(t)){s.push(Number(t));continue;}const r=s.pop()!,l=s.pop()!;s.push(t==="+"?l+r:t==="-"?l-r:t==="*"?l*r:Math.trunc(l/r));}return s[0];}

C#
~~

.. code-block:: csharp

   public class Solution {public int EvalRPN(string[]tokens){var s=new Stack<int>();foreach(var t in tokens){if(t.Length!=1||!"+-*/".Contains(t)){s.Push(int.Parse(t));continue;}int r=s.Pop(),l=s.Pop();s.Push(t=="+"?l+r:t=="-"?l-r:t=="*"?l*r:l/r);}return s.Pop();}}

Julia
~~~~~

.. code-block:: julia

   function eval_rpn(tokens)
       s=Int[]
       for t in tokens
           if t in ("+","-","*","/");r=pop!(s);l=pop!(s);push!(s,t=="+" ? l+r : t=="-" ? l-r : t=="*" ? l*r : div(l,r))
           else;push!(s,parse(Int,t));end
       end
       s[1]
   end

R
~

.. code-block:: r

   eval_rpn <- function(tokens){s<-numeric();for(t in tokens){if(!(t%in%c("+","-","*","/"))){s<-c(s,as.numeric(t));next};r<-s[length(s)];l<-s[length(s)-1L];s<-head(s,-2L);v<-switch(t,"+"=l+r,"-"=l-r,"*"=l*r,"/"=trunc(l/r));s<-c(s,v)};as.integer(s[[1L]])}