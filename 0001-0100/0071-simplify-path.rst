0071. Simplify Path
===================

题目信息
--------

:题号: 0071
:题名: Simplify Path
:难度: Medium
:类型: Algorithms
:主题: 字符串、栈、路径规范化
:原题: `LeetCode 0071 <https://leetcode.com/problems/simplify-path/>`_
:教学重点: 组件精确分类、根目录边界、栈式回退、规范输出

题目重述
--------

给定以 ``/`` 开头的 Unix 风格绝对路径，返回规范路径。连续斜杠只表示分隔；``.`` 表示当前目录；``..`` 返回父目录，但不能越过根目录；其他非空组件全部按普通目录名保留，包括 ``...``、``.hidden`` 和 ``name..``。

自建示例
--------

.. code-block:: text

   /team//docs/./draft/../final/ -> /team/docs/final
   /../../a/.../.hidden/..      -> /a/...

C++ 实现
--------

.. code-block:: cpp

   #include <sstream>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string splitWithStream(const std::string& path) {
           std::stringstream stream(path);
           std::string part;
           std::vector<std::string> stack;
           while (std::getline(stream, part, '/')) {
               if (part.empty() || part == ".") continue;
               if (part == "..") { if (!stack.empty()) stack.pop_back(); }
               else stack.push_back(part);
           }
           std::string result;
           for (const auto& name : stack) result += "/" + name;
           return result.empty() ? "/" : result;
       }

       std::string manualComponentScan(const std::string& path) {
           std::vector<std::string> stack;
           int index = 0, n = path.size();
           while (index < n) {
               while (index < n && path[index] == '/') ++index;
               int start = index;
               while (index < n && path[index] != '/') ++index;
               if (start == index) continue;
               std::string part = path.substr(start, index - start);
               if (part == ".") continue;
               if (part == "..") { if (!stack.empty()) stack.pop_back(); }
               else stack.push_back(part);
           }
           std::string result;
           for (const auto& name : stack) result += "/" + name;
           return result.empty() ? "/" : result;
       }

       std::string rollbackBuffer(const std::string& path) {
           std::string result;
           std::vector<int> restore;
           int index = 0;
           while (index < static_cast<int>(path.size())) {
               while (index < static_cast<int>(path.size()) && path[index] == '/') ++index;
               int start = index;
               while (index < static_cast<int>(path.size()) && path[index] != '/') ++index;
               if (start == index) continue;
               std::string part = path.substr(start, index - start);
               if (part == ".") continue;
               if (part == "..") {
                   if (!restore.empty()) { result.resize(restore.back()); restore.pop_back(); }
               } else {
                   restore.push_back(result.size()); result.push_back('/'); result += part;
               }
           }
           return result.empty() ? "/" : result;
       }

   public:
       std::string simplifyPath(std::string path) {
           return manualComponentScan(path);
       }
   };

题解
----

为什么不能做模糊字符串替换
~~~~~~~~~~~~~~~~~~~~~~~~

反复删除 ``//``、``/./`` 或 ``name/..`` 会多次重建字符串，而且 ``...``、``.hidden`` 只是普通名称，不能因为包含点就被当作特殊组件。正确单位不是字符片段，而是两个斜杠之间的完整组件。

组件栈保存什么
~~~~~~~~~~~~~~

处理完任意输入前缀后，栈从底到顶恰好是该前缀规范化后的目录层级。空组件和 ``.`` 不改变位置；普通组件进入子目录并压栈；``..`` 在栈非空时弹出一级，在根目录时不操作。

.. list-table::
   :header-rows: 1

   * - 组件
     - 栈
     - 动作
   * - ``team``
     - ``[team]``
     - 压栈
   * - ``docs``
     - ``[team,docs]``
     - 压栈
   * - ``.``
     - ``[team,docs]``
     - 忽略
   * - ``draft``
     - ``[team,docs,draft]``
     - 压栈
   * - ``..``
     - ``[team,docs]``
     - 弹栈
   * - ``final``
     - ``[team,docs,final]``
     - 压栈

为什么根目录不会被越过
~~~~~~~~~~~~~~~~~~~~

空栈代表根目录。读取 ``..`` 时只有栈非空才弹出，因此任意多个前导 ``..`` 都保持空栈。这个规则直接表达“根目录没有父目录”。

为什么特殊组件必须精确相等
~~~~~~~~~~~~~~~~~~~~~~~~~~

只有长度为 1 的 ``.`` 和长度为 2 的 ``..`` 有特殊语义。``...``、``.git``、``name..`` 都不与它们完全相等，必须作为普通名称压栈。

手工扫描消除了什么
~~~~~~~~~~~~~~~~~~

``stringstream`` 方便但创建分词对象。手工扫描只维护两个下标，先跳过斜杠，再定位组件半开区间 ``[start,index)``。每个字符只参与常数次判断。

回滚缓冲区为何等价于栈
~~~~~~~~~~~~~~~~~~~~

追加普通组件前记录结果长度；遇到 ``..`` 时把字符串缩回该长度，相当于删除最后一个 ``/组件``。它把“目录栈”改成“写入位置栈”，适合 C 风格缓冲区。

为什么最终输出规范
~~~~~~~~~~~~~~~~~~

栈内没有空组件、``.`` 或 ``..``。重建时每个组件前只加入一个 ``/``，所以不存在重复斜杠和尾斜杠；空栈单独返回 ``/``。

复杂度来源
~~~~~~~~~~

扫描和重建共处理 ``O(n)`` 个字符，时间 ``O(n)``。栈和返回字符串最坏保存 ``O(n)`` 字符。

九语言实现
----------

C
~

.. code-block:: c

   char*simplifyPath(char*p){int n=strlen(p),i=0,len=0,top=0;char*out=malloc(n+2);int*restore=malloc((n+1)*sizeof(int));while(i<n){while(i<n&&p[i]=='/')i++;int s=i;while(i<n&&p[i]!='/')i++;int m=i-s;if(m==0||(m==1&&p[s]=='.'))continue;if(m==2&&p[s]=='.'&&p[s+1]=='.'){if(top>0)len=restore[--top];continue;}restore[top++]=len;out[len++]='/';memcpy(out+len,p+s,m);len+=m;}if(len==0)out[len++]='/';out[len]='\0';free(restore);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def simplifyPath(self, path: str) -> str:
           stack=[]
           for part in path.split('/'):
               if not part or part=='.': continue
               if part=='..':
                   if stack: stack.pop()
               else: stack.append(part)
           return '/'+'/'.join(stack)

Java
~~~~

.. code-block:: java

   class Solution {public String simplifyPath(String path){Deque<String>s=new ArrayDeque<>();for(String p:path.split("/")){if(p.isEmpty()||p.equals("."))continue;if(p.equals("..")){if(!s.isEmpty())s.removeLast();}else s.addLast(p);}return "/"+String.join("/",s);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn simplify_path(path:String)->String{let mut s:Vec<&str>=vec![];for p in path.split('/'){match p{""|"."=>{},".."=>{s.pop();},_=>s.push(p)}}format!("/{}",s.join("/"))}}

Go
~~

.. code-block:: go

   func simplifyPath(path string)string{s:=[]string{};for _,p:=range strings.Split(path,"/"){if p==""||p=="."{continue};if p==".."{if len(s)>0{s=s[:len(s)-1]}}else{s=append(s,p)}};return "/"+strings.Join(s,"/")}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function simplifyPath(path:string):string{const s:string[]=[];for(const p of path.split('/')){if(!p||p==='.')continue;if(p==='..')s.pop();else s.push(p);}return '/'+s.join('/');}

C#
~~

.. code-block:: csharp

   public class Solution {public string SimplifyPath(string path){var s=new List<string>();foreach(var p in path.Split('/')){if(p==""||p==".")continue;if(p==".."){if(s.Count>0)s.RemoveAt(s.Count-1);}else s.Add(p);}return "/"+string.Join("/",s);}}

Julia
~~~~~

.. code-block:: julia

   function simplify_path(path::String)
       stack=String[]
       for part in split(path,'/');(isempty(part)||part==".")&&continue;if part=="..";!isempty(stack)&&pop!(stack);else;push!(stack,part);end;end
       "/"*join(stack,"/")
   end

R
~

.. code-block:: r

   simplify_path <- function(path){stack<-character();for(part in strsplit(path,"/",fixed=TRUE)[[1]]){if(part==""||part==".")next;if(part==".."){if(length(stack)>0)stack<-head(stack,-1)}else stack<-c(stack,part)};paste0("/",paste(stack,collapse="/"))}
