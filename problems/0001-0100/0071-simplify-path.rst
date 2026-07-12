0071. Simplify Path
===================

题目信息
--------

:题号: 0071
:难度: Medium
:主题: 字符串、栈、路径规范化
:原题: `LeetCode 0071 <https://leetcode.com/problems/simplify-path/>`_
:访问状态: Available
:教学重点: 组件扫描、精确特殊标记、根目录边界、栈式回退、规范输出

题目重述
--------

给定一个以 ``/`` 开头的 Unix 风格绝对路径，返回它的规范路径。连续斜杠视为一个分隔符；组件
``.`` 表示当前目录，应忽略；组件 ``..`` 表示返回父目录，但根目录之上仍停留在根目录。其他任何
非空组件都作为普通目录名保留，包括 ``...``、``.hidden`` 和 ``name..``。

题目保证路径长度在 ``1`` 至 ``3000`` 之间，字符来自英文字母、数字、``.``、``/`` 和 ``_``。
返回值必须以单个 ``/`` 开头，组件间只有一个 ``/``，末尾不带 ``/``，根目录本身除外。输入字符串
只读，输出为独立字符串。

自建示例
--------

.. code-block:: text

   输入："/team//docs/./draft/../final/"
   组件：team, docs, ., draft, .., final
   输出："/team/docs/final"

.. code-block:: text

   输入："/../../a/.../.hidden/.."
   根目录上的两个 .. 被忽略；... 是普通名称；最后一个 .. 弹出 .hidden。
   输出："/a/..."

问题抽象
--------

把路径按 ``/`` 划分为组件。维护一个栈表示已经规范化的目录前缀：

* 空组件与 ``.`` 不改变栈；
* ``..`` 在栈非空时弹出栈顶，在栈为空时保持不变；
* 其他组件压入栈顶。

最终答案是根斜杠加上栈内组件按顺序用单斜杠连接；空栈对应 ``/``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 组件扫描加栈
     - ``O(n)``
     - ``O(n)``
     - 主解法；直接表达路径层级与父目录回退
   * - 反复替换 ``//``、``/./`` 和 ``name/..``
     - 最坏 ``O(n²)``
     - ``O(n)``
     - 特殊组件边界容易误判，重复构造字符串

主解法：规范组件栈
------------------

核心不变量
~~~~~~~~~~

处理完输入的某个组件前缀后，栈从底到顶恰好等于该前缀规范化后的目录组件序列：不存在空组件、
``.`` 或 ``..``，并且序列不会尝试越过根目录。

正确性依据
~~~~~~~~~~

空组件只来自连续或边界斜杠，不表示目录；``.`` 不改变当前位置，因此忽略它们保持规范路径不变。
普通组件进入当前目录的子目录，压栈准确增加一级。``..`` 在非根目录删除最后一个组件，在根目录没有
父级，因此空栈时不操作。三类转移覆盖全部组件且互斥，所以不变量逐步保持。

扫描结束后，栈表示完整输入的规范目录序列。用单斜杠连接恰好消除重复斜杠与尾斜杠；空栈返回根目录。

C 的回滚缓冲区
~~~~~~~~~~~~~~

C 实现直接在结果缓冲区中追加 ``/组件``，并把追加前的写入长度压入 ``restore``。遇到 ``..`` 时恢复
该长度，相当于弹出最后组件，不需要为每个组件单独分配字符串。结果最长不超过输入长度，分配
``length + 2`` 字节足以容纳根目录和终止符。

复杂度
~~~~~~

每个输入字符在分隔和复制阶段被处理常数次，时间复杂度为 ``O(n)``。栈、组件切片或回滚位置最多保存
``O(n)`` 数据；返回字符串也需要 ``O(n)`` 空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char *simplifyPath(char *path) {
       const size_t length = strlen(path);
       char *result = malloc(length + 2);
       size_t *restore = malloc((length + 1) * sizeof(size_t));
       if (result == NULL || restore == NULL) {
           free(result);
           free(restore);
           return NULL;
       }

       size_t write = 0;
       size_t depth = 0;
       size_t index = 0;

       while (index < length) {
           while (index < length && path[index] == '/') {
               ++index;
           }
           const size_t start = index;
           while (index < length && path[index] != '/') {
               ++index;
           }
           const size_t segment_length = index - start;

           if (segment_length == 0 ||
               (segment_length == 1 && path[start] == '.')) {
               continue;
           }

           if (segment_length == 2 && path[start] == '.' &&
               path[start + 1] == '.') {
               if (depth > 0) {
                   write = restore[--depth];
               }
               continue;
           }

           // 保存追加本组件前的长度，遇到 .. 时可直接回滚。
           restore[depth++] = write;
           result[write++] = '/';
           memcpy(result + write, path + start, segment_length);
           write += segment_length;
       }

       if (write == 0) {
           result[write++] = '/';
       }
       result[write] = '\0';
       free(restore);
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::string simplifyPath(std::string path) {
           std::vector<std::string> stack;
           std::size_t index = 0;

           while (index < path.size()) {
               while (index < path.size() && path[index] == '/') {
                   ++index;
               }
               const std::size_t start = index;
               while (index < path.size() && path[index] != '/') {
                   ++index;
               }
               const std::string segment = path.substr(start, index - start);

               if (segment.empty() || segment == ".") {
                   continue;
               }
               if (segment == "..") {
                   if (!stack.empty()) {
                       stack.pop_back();
                   }
               } else {
                   stack.push_back(segment);
               }
           }

           std::string result;
           for (const std::string &segment : stack) {
               result.push_back('/');
               result += segment;
           }
           return result.empty() ? "/" : result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def simplifyPath(self, path: str) -> str:
           stack: list[str] = []

           for segment in path.split("/"):
               if segment == "" or segment == ".":
                   continue
               if segment == "..":
                   if stack:
                       stack.pop()
               else:
                   stack.append(segment)

           return "/" + "/".join(stack)

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Deque;

   class Solution {
       public String simplifyPath(String path) {
           Deque<String> stack = new ArrayDeque<>();

           for (String segment : path.split("/")) {
               if (segment.isEmpty() || segment.equals(".")) {
                   continue;
               }
               if (segment.equals("..")) {
                   if (!stack.isEmpty()) {
                       stack.removeLast();
                   }
               } else {
                   stack.addLast(segment);
               }
           }

           if (stack.isEmpty()) {
               return "/";
           }
           StringBuilder result = new StringBuilder();
           for (String segment : stack) {
               result.append('/').append(segment);
           }
           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn simplify_path(path: String) -> String {
           let mut stack: Vec<&str> = Vec::new();

           for segment in path.split('/') {
               match segment {
                   "" | "." => {}
                   ".." => {
                       stack.pop();
                   }
                   _ => stack.push(segment),
               }
           }

           if stack.is_empty() {
               "/".to_string()
           } else {
               format!("/{}", stack.join("/"))
           }
       }
   }

Go
~~

.. code-block:: go

   package main

   import "strings"

   func simplifyPath(path string) string {
       stack := make([]string, 0)

       for _, segment := range strings.Split(path, "/") {
           if segment == "" || segment == "." {
               continue
           }
           if segment == ".." {
               if len(stack) > 0 {
                   stack = stack[:len(stack)-1]
               }
           } else {
               stack = append(stack, segment)
           }
       }

       return "/" + strings.Join(stack, "/")
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function simplifyPath(path: string): string {
       const stack: string[] = [];

       for (const segment of path.split("/")) {
           if (segment === "" || segment === ".") {
               continue;
           }
           if (segment === "..") {
               stack.pop();
           } else {
               stack.push(segment);
           }
       }

       return `/${stack.join("/")}`;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;
   using System.Text;

   public class Solution {
       public string SimplifyPath(string path) {
           var stack = new List<string>();

           foreach (string segment in path.Split('/')) {
               if (segment.Length == 0 || segment == ".") {
                   continue;
               }
               if (segment == "..") {
                   if (stack.Count > 0) {
                       stack.RemoveAt(stack.Count - 1);
                   }
               } else {
                   stack.Add(segment);
               }
           }

           if (stack.Count == 0) {
               return "/";
           }
           var result = new StringBuilder();
           foreach (string segment in stack) {
               result.Append('/').Append(segment);
           }
           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function simplify_path(path::String)::String
       stack = String[]

       for segment in split(path, '/'; keepempty=true)
           if isempty(segment) || segment == "."
               continue
           elseif segment == ".."
               if !isempty(stack)
                   pop!(stack)
               end
           else
               push!(stack, segment)
           end
       end

       return "/" * join(stack, "/")
   end

R
~

.. code-block:: r

   simplify_path <- function(path) {
     stack <- character(0)
     segments <- strsplit(path, "/", fixed = TRUE)[[1]]

     for (segment in segments) {
       if (segment == "" || segment == ".") {
         next
       }
       if (segment == "..") {
         if (length(stack) > 0) {
           stack <- stack[-length(stack)]
         }
       } else {
         stack <- c(stack, segment)
       }
     }

     paste0("/", paste(stack, collapse = "/"))
   }

关联题目
--------

* `0020. Valid Parentheses <0020-valid-parentheses.rst>`_：同样用栈保存尚未被消解的结构前缀；
* `0058. Length of Last Word <0058-length-of-last-word.rst>`_：比较字符串边界扫描与精确字符域。

知识记录
--------

* 新增：按路径组件建立规范栈，``..`` 只删除栈顶且不能越过根目录；
* 新增：C 用结果写入长度栈实现无组件分配的回滚；
* 强化：ASCII 字符域允许按字节定位斜杠和句点，但特殊语义只适用于完整组件。

语言边界与实现说明
------------------

* C 的资源分配、失败返回和所有权在代码附近明确；
* C++、Java、C#、Go 与 TypeScript 使用目标语言的可变或动态容器表达同一状态；
* Rust 通过借用或拥有的标准容器保持边界清晰；
* Julia 与 R 使用一基下标，正文中的零基状态需要显式换算；
* TypeScript 的整数运算不使用会隐式转成 32 位有符号数的位运算；
* R 的函数返回修改后的值时，这是复制语义适配，不改变算法核心状态。

验证证据
--------

本题代码块从 RST 中抽取后执行质量门。可用环境中的 C、C++、Python、Java、Go 与 TypeScript
完成编译或运行；Rust、C#、Julia 与 R 完成静态语义检查。Python 另使用独立基准进行随机或穷举
对拍。验证范围与具体用例在本批提交报告中记录，不把未执行语言描述为运行通过。

关键边界
--------

* 空字符串、根目录、单行单列或零长度前缀必须由初始化直接覆盖；
* 第一行、第一列、栈为空和滚动数组第零项不能套用内部区域的普通更新；
* C 的资源失败值必须与合法输出区分，调用者按接口说明处理。

易错点
------

* 把特殊标记和普通数据混为一谈；
* 更新状态后丢失下一步仍需要的旧值；
* 忽略空输入、单元素或第一行、第一列等边界；
* 只说明代码过程，没有证明状态足以覆盖全部合法解；
* 隐藏容器复制、字符串拆分、结果快照或返回值的空间成本。

最小自检
--------

#. 状态变量分别表示什么？
#. 当前更新会不会覆盖后续仍需读取的旧状态？
#. 边界初始化为什么与一般转移一致？
#. 返回结果是否满足题目要求的规范形式或原地副作用？
#. 复杂度是否包含必要的输入规范化和输出构造？

答案要点
--------

* 先用一句话写出状态含义，再解释更新所需的旧值；
* 正确性证明围绕分类完备性、不变量保持和边界恢复展开；
* 代码只实现正文已经证明的主解法，语言差异不改变问题语义。
