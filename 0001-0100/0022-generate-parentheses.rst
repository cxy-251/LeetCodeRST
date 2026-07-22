0022. Generate Parentheses
==========================

题目信息
--------

:题号: 0022
:题名: Generate Parentheses
:难度: Medium
:类型: Algorithms
:主题: 字符串、回溯、动态规划
:原题: `LeetCode 0022 <https://leetcode.com/problems/generate-parentheses/>`_

题目重述
--------

给定正整数 ``n``，生成所有由 ``n`` 对圆括号组成的有效字符串。每个结果必须包含恰好 ``n`` 个左括号和 ``n`` 个右括号，任意前缀中的右括号数量都不能超过左括号数量；结果顺序不作要求。

自建示例
--------

.. code-block:: text

   输入：n = 2
   输出：["(())", "()()"]

.. code-block:: text

   输入：n = 1
   输出：["()"]

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool valid(const std::string& text) {
           int balance = 0;
           for (char c : text) {
               balance += c == '(' ? 1 : -1;
               if (balance < 0) return false;
           }
           return balance == 0;
       }

       void enumerateAll(int position, std::string& path,
                         std::vector<std::string>& result) {
           if (position == static_cast<int>(path.size())) {
               if (valid(path)) result.push_back(path);
               return;
           }
           path[position] = '(';
           enumerateAll(position + 1, path, result);
           path[position] = ')';
           enumerateAll(position + 1, path, result);
       }

       void backtrack(int n, int open, int close, std::string& path,
                      std::vector<std::string>& result) {
           if (open == n && close == n) {
               result.push_back(path);
               return;
           }
           if (open < n) {
               path.push_back('(');
               backtrack(n, open + 1, close, path, result);
               path.pop_back();
           }
           if (close < open) {
               path.push_back(')');
               backtrack(n, open, close + 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::string> dynamicProgramming(int n) {
           std::vector<std::vector<std::string>> dp(n + 1);
           dp[0] = {""};
           for (int pairs = 1; pairs <= n; ++pairs) {
               for (int left_pairs = 0; left_pairs < pairs; ++left_pairs) {
                   int right_pairs = pairs - 1 - left_pairs;
                   for (const auto& inside : dp[left_pairs]) {
                       for (const auto& after : dp[right_pairs]) {
                           dp[pairs].push_back("(" + inside + ")" + after);
                       }
                   }
               }
           }
           return dp[n];
       }

   public:
       std::vector<std::string> generateParenthesis(int n) {
           std::vector<std::string> result;
           std::string path;
           backtrack(n, 0, 0, path, result);
           return result;
       }
   };

题解
----

全量枚举为什么浪费在不可恢复前缀上
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度 ``2n`` 的每个位置都有两种选择，全量方法产生 ``2^(2n)=4^n`` 个字符串，再逐个验证。若某个前缀右括号
已经多于左括号，后续追加任何字符都无法让这个右括号获得左侧配对，整棵子树都可提前删除。

合法前缀状态如何限制两个选择
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``open``、``close`` 分别表示已使用的左右括号数。任何仍可完成的前缀必须满足：

.. math::

   0 \le close \le open \le n

因此 ``open < n`` 时才能追加左括号；``close < open`` 时才能追加右括号。达到 ``open=close=n`` 时，路径长度
必然为 ``2n``，可以直接记录。

选择与撤销如何复用一条路径
~~~~~~~~~~~~~~~~~~~~~~~~~~

每次追加一个字符后进入下一层，递归返回时删除该字符，使 ``path`` 恢复父状态。答案写入 ``result`` 时复制完整
字符串，因此撤销只影响工作缓冲区，不会修改已生成答案。

搜索树局部展开
~~~~~~~~~~~~~~

.. code-block:: text

   ""
   └─ "("
      ├─ "(("
      │  ├─ "(((" -> 只能补右括号
      │  └─ "(()"
      └─ "()"
         └─ "()("

空前缀不能选择右括号；``"()"`` 中左右数量相等，也不能立即再放右括号。

为什么所有合法序列恰好生成一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法序列的每个前缀都满足 ``close <= open``，总使用量也不超过 ``n``，所以它的逐字符选择不会被剪掉，必然
到达叶节点。不同完整序列至少有一个位置字符不同，对应搜索树中的不同分支，因此不会重复。

动态规划拼接如何对应最外层配对
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意非空合法序列都能唯一写为 ``(" + A + ")" + B``，其中 ``A`` 与 ``B`` 各自合法。枚举 ``A`` 使用的括号对数
即可得到 Catalan 递推。该方法便于理解结构分解，却需要保存并复制多个子问题字符串；回溯只维护一条工作路径。

复杂度来源
~~~~~~~~~~

合法结果数量是 Catalan 数 ``C_n``。每个答案长度 ``2n``，复制输出需要 ``O(n)``，因此主解法时间为
``O(C_n n)``，输出空间同阶。不计输出，路径与递归深度均为 ``O(n)``。全量枚举需要 ``O(4^n n)``。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(int n, int open, int close, int pos, char* path,
                   char** result, int* size) {
       if (open == n && close == n) {
           path[pos] = '\0';
           result[*size] = malloc((size_t)pos + 1);
           strcpy(result[(*size)++], path);
           return;
       }
       if (open < n) { path[pos] = '('; dfs(n, open+1, close, pos+1, path, result, size); }
       if (close < open) { path[pos] = ')'; dfs(n, open, close+1, pos+1, path, result, size); }
   }

   char** generateParenthesis(int n, int* returnSize) {
       int capacity = 1; for (int i=0;i<n;++i) capacity *= 4;
       char** result = malloc((size_t)capacity * sizeof(char*));
       char* path = malloc((size_t)(2*n+1));
       *returnSize = 0; dfs(n,0,0,0,path,result,returnSize); free(path); return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generateParenthesis(self, n: int) -> list[str]:
           result, path = [], []
           def dfs(opened: int, closed: int) -> None:
               if opened == closed == n:
                   result.append("".join(path)); return
               if opened < n:
                   path.append("("); dfs(opened + 1, closed); path.pop()
               if closed < opened:
                   path.append(")"); dfs(opened, closed + 1); path.pop()
           dfs(0, 0)
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       public List<String> generateParenthesis(int n) {
           List<String> result = new ArrayList<>();
           dfs(n,0,0,new StringBuilder(),result); return result;
       }
       private void dfs(int n,int open,int close,StringBuilder path,List<String> result) {
           if (open==n && close==n) { result.add(path.toString()); return; }
           if (open<n) { path.append('('); dfs(n,open+1,close,path,result); path.deleteCharAt(path.length()-1); }
           if (close<open) { path.append(')'); dfs(n,open,close+1,path,result); path.deleteCharAt(path.length()-1); }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn generate_parenthesis(n: i32) -> Vec<String> {
           fn dfs(n:i32,o:i32,c:i32,path:&mut String,out:&mut Vec<String>) {
               if o==n && c==n { out.push(path.clone()); return; }
               if o<n { path.push('('); dfs(n,o+1,c,path,out); path.pop(); }
               if c<o { path.push(')'); dfs(n,o,c+1,path,out); path.pop(); }
           }
           let mut out=Vec::new(); dfs(n,0,0,&mut String::new(),&mut out); out
       }
   }

Go
~~

.. code-block:: go

   func generateParenthesis(n int) []string {
       result := []string{}; path := make([]byte,0,2*n)
       var dfs func(int,int)
       dfs = func(open, close int) {
           if open==n && close==n { result=append(result,string(path)); return }
           if open<n { path=append(path,'('); dfs(open+1,close); path=path[:len(path)-1] }
           if close<open { path=append(path,')'); dfs(open,close+1); path=path[:len(path)-1] }
       }
       dfs(0,0); return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generateParenthesis(n: number): string[] {
       const result: string[] = [], path: string[] = [];
       const dfs = (open:number, close:number):void => {
           if (open===n && close===n) { result.push(path.join("")); return; }
           if (open<n) { path.push("("); dfs(open+1,close); path.pop(); }
           if (close<open) { path.push(")"); dfs(open,close+1); path.pop(); }
       };
       dfs(0,0); return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<string> GenerateParenthesis(int n) {
           var result=new List<string>(); Dfs(n,0,0,new StringBuilder(),result); return result;
       }
       private void Dfs(int n,int open,int close,StringBuilder path,List<string> result) {
           if (open==n && close==n) { result.Add(path.ToString()); return; }
           if (open<n) { path.Append('('); Dfs(n,open+1,close,path,result); path.Length--; }
           if (close<open) { path.Append(')'); Dfs(n,open,close+1,path,result); path.Length--; }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function generate_parenthesis(n::Int)
       result=String[]; path=Char[]
       function dfs(open, close)
           if open==n && close==n; push!(result,join(path)); return; end
           if open<n; push!(path,'('); dfs(open+1,close); pop!(path); end
           if close<open; push!(path,')'); dfs(open,close+1); pop!(path); end
       end
       dfs(0,0); result
   end

R
~

.. code-block:: r

   generate_parenthesis <- function(n) {
       result <- character(); path <- character()
       dfs <- function(open, close) {
           if (open == n && close == n) { result <<- c(result, paste(path, collapse="")); return() }
           if (open < n) { path <<- c(path,"("); dfs(open+1L,close); path <<- head(path,-1L) }
           if (close < open) { path <<- c(path,")"); dfs(open,close+1L); path <<- head(path,-1L) }
       }
       dfs(0L,0L); result
   }
