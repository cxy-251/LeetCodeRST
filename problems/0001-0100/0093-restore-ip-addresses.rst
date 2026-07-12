0093. Restore IP Addresses
==========================

题目信息
--------

:题号: 0093
:难度: Medium
:主题: 字符串、回溯、固定分段、长度剪枝
:原题: `LeetCode 0093 <https://leetcode.com/problems/restore-ip-addresses/>`_
:访问状态: Available
:教学重点: 四段状态、剩余长度上下界、前导零、增量构造

题目重述
--------

给定只包含 ASCII 数字的字符串 ``s``，不改变顺序、不删除字符，只插入三个点，返回所有合法 IPv4
地址。地址恰好四段；每段长 1 至 3，值在 ``0..255``，除单独的 ``0`` 外不得有前导零。
题目保证 ``1 <= len(s) <= 20``；长度不在 ``4..12`` 时必然无解。

自建示例
--------

.. code-block:: text

   "25525511135" -> ["255.255.11.135", "255.255.111.35"]
   "010010"      -> ["0.10.0.10", "0.100.1.0"]

问题抽象
--------

状态 ``dfs(index, depth)`` 表示前 ``index`` 个字符已经组成 ``depth`` 个合法段。下一段枚举长度
1、2、3。设剩余段数为 ``k = 4-depth``，剩余字符数为 ``r = n-index``，必要条件是：

.. code-block:: text

   k <= r <= 3 * k

首字符为 ``0`` 时只能取一位；段值按 ``value = value * 10 + digit`` 构造，首次超过 255 后更长段也
必然无效，可以停止当前循环。

主解法：固定四段回溯
--------------------

进入递归时，路径中的段合法、互不重叠并恰好覆盖前缀。长度剪枝只删除无法用剩余段填满的状态。
深度达到 4 时，剪枝保证只有全部字符已消费的路径能够提交。

任意合法地址唯一确定四个段长度，算法会枚举这组长度；不同路径首次不同的段长会产生不同点位置，
所以结果完整且无重复。每次递归至少消费一个字符并增加一段，深度最多为 4。

复杂度与资源
~~~~~~~~~~~~

有效长度最多 12，每层最多三选、深度固定为 4，搜索节点具有常数上界。构造结果的成本与输出字符
总量成正比，路径与递归栈均为 ``O(1)``。四段长度各有三种可能，因此单个输入最多对应 ``3^4=81``
条候选长度路径；C 据此预分配 81 个结果槽位，并在任一字符串分配失败时清理已完成结果。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       const char *s;
       int n;
       int starts[4];
       int sizes[4];
       char **rows;
       int count;
       bool failed;
   } Context;

   static void emit(Context *context) {
       char *address = malloc(16U);
       if (address == NULL) {
           context->failed = true;
           return;
       }

       int write = 0;
       for (int part = 0; part < 4; ++part) {
           if (part > 0) {
               address[write++] = '.';
           }
           memcpy(
               address + write,
               context->s + context->starts[part],
               (size_t)context->sizes[part]
           );
           write += context->sizes[part];
       }
       address[write] = '\0';
       context->rows[context->count++] = address;
   }

   static void dfs(Context *context, int index, int depth) {
       if (context->failed) {
           return;
       }
       const int parts_left = 4 - depth;
       const int chars_left = context->n - index;
       if (chars_left < parts_left || chars_left > parts_left * 3) {
           return;
       }
       if (depth == 4) {
           emit(context);
           return;
       }

       int value = 0;
       for (int size = 1; size <= 3 && index + size <= context->n; ++size) {
           if (size > 1 && context->s[index] == '0') {
               break;
           }
           value = value * 10 + context->s[index + size - 1] - '0';
           if (value > 255) {
               break;
           }
           context->starts[depth] = index;
           context->sizes[depth] = size;
           dfs(context, index + size, depth + 1);
       }
   }

   char **restoreIpAddresses(char *s, int *returnSize) {
       *returnSize = 0;
       const int n = (int)strlen(s);
       char **rows = malloc(81U * sizeof(*rows));
       if (rows == NULL) {
           return NULL;
       }
       if (n < 4 || n > 12) {
           return rows;
       }

       Context context = {s, n, {0}, {0}, rows, 0, false};
       dfs(&context, 0, 0);
       if (context.failed) {
           for (int index = 0; index < context.count; ++index) {
               free(rows[index]);
           }
           free(rows);
           return NULL;
       }
       *returnSize = context.count;
       return rows;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
       void dfs(const std::string& s, int index,
                std::vector<std::string>& path,
                std::vector<std::string>& result) {
           const int parts = 4 - static_cast<int>(path.size());
           const int chars = static_cast<int>(s.size()) - index;
           if (chars < parts || chars > parts * 3) {
               return;
           }
           if (path.size() == 4U) {
               result.push_back(path[0] + "." + path[1] + "." + path[2] + "." + path[3]);
               return;
           }

           int value = 0;
           for (int size = 1; size <= 3 && index + size <= static_cast<int>(s.size()); ++size) {
               if (size > 1 && s[index] == '0') {
                   break;
               }
               value = value * 10 + s[index + size - 1] - '0';
               if (value > 255) {
                   break;
               }
               path.push_back(s.substr(index, size));
               dfs(s, index + size, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::string> restoreIpAddresses(std::string s) {
           std::vector<std::string> result;
           if (s.size() < 4U || s.size() > 12U) {
               return result;
           }
           std::vector<std::string> path;
           dfs(s, 0, path, result);
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def restoreIpAddresses(self, s: str) -> list[str]:
           if not 4 <= len(s) <= 12:
               return []
           result: list[str] = []
           path: list[str] = []

           def dfs(index: int) -> None:
               parts = 4 - len(path)
               chars = len(s) - index
               if not parts <= chars <= parts * 3:
                   return
               if len(path) == 4:
                   result.append(".".join(path))
                   return

               value = 0
               for size in range(1, 4):
                   if index + size > len(s):
                       break
                   if size > 1 and s[index] == "0":
                       break
                   value = value * 10 + int(s[index + size - 1])
                   if value > 255:
                       break
                   path.append(s[index:index + size])
                   dfs(index + size)
                   path.pop()

           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<String> restoreIpAddresses(String s) {
           List<String> result = new ArrayList<>();
           if (s.length() < 4 || s.length() > 12) {
               return result;
           }
           dfs(s, 0, new ArrayList<>(4), result);
           return result;
       }

       private static void dfs(String s, int index,
                               List<String> path, List<String> result) {
           int parts = 4 - path.size();
           int chars = s.length() - index;
           if (chars < parts || chars > parts * 3) {
               return;
           }
           if (path.size() == 4) {
               result.add(String.join(".", path));
               return;
           }

           int value = 0;
           for (int size = 1; size <= 3 && index + size <= s.length(); ++size) {
               if (size > 1 && s.charAt(index) == '0') {
                   break;
               }
               value = value * 10 + s.charAt(index + size - 1) - '0';
               if (value > 255) {
                   break;
               }
               path.add(s.substring(index, index + size));
               dfs(s, index + size, path, result);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn restore_ip_addresses(s: String) -> Vec<String> {
           fn dfs(s: &[u8], index: usize,
                  path: &mut Vec<String>, result: &mut Vec<String>) {
               let parts = 4 - path.len();
               let chars = s.len() - index;
               if chars < parts || chars > parts * 3 {
                   return;
               }
               if path.len() == 4 {
                   result.push(path.join("."));
                   return;
               }

               let mut value = 0;
               for size in 1..=3 {
                   if index + size > s.len() {
                       break;
                   }
                   if size > 1 && s[index] == b'0' {
                       break;
                   }
                   value = value * 10 + i32::from(s[index + size - 1] - b'0');
                   if value > 255 {
                       break;
                   }
                   path.push(String::from_utf8(s[index..index + size].to_vec()).unwrap());
                   dfs(s, index + size, path, result);
                   path.pop();
               }
           }

           if s.len() < 4 || s.len() > 12 {
               return Vec::new();
           }
           let mut result = Vec::new();
           dfs(s.as_bytes(), 0, &mut Vec::with_capacity(4), &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func restoreIpAddresses(s string) []string {
       if len(s) < 4 || len(s) > 12 {
           return []string{}
       }
       result := make([]string, 0)
       path := make([]string, 0, 4)

       var dfs func(int)
       dfs = func(index int) {
           parts := 4 - len(path)
           chars := len(s) - index
           if chars < parts || chars > parts*3 {
               return
           }
           if len(path) == 4 {
               result = append(result, strings.Join(path, "."))
               return
           }

           value := 0
           for size := 1; size <= 3 && index+size <= len(s); size++ {
               if size > 1 && s[index] == '0' {
                   break
               }
               value = value*10 + int(s[index+size-1]-'0')
               if value > 255 {
                   break
               }
               path = append(path, s[index:index+size])
               dfs(index + size)
               path = path[:len(path)-1]
           }
       }
       dfs(0)
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function restoreIpAddresses(s: string): string[] {
       if (s.length < 4 || s.length > 12) {
           return [];
       }
       const result: string[] = [];
       const path: string[] = [];

       const dfs = (index: number): void => {
           const parts = 4 - path.length;
           const chars = s.length - index;
           if (chars < parts || chars > parts * 3) {
               return;
           }
           if (path.length === 4) {
               result.push(path.join("."));
               return;
           }

           let value = 0;
           for (let size = 1; size <= 3 && index + size <= s.length; size += 1) {
               if (size > 1 && s[index] === "0") {
                   break;
               }
               value = value * 10 + Number(s[index + size - 1]);
               if (value > 255) {
                   break;
               }
               path.push(s.slice(index, index + size));
               dfs(index + size);
               path.pop();
           }
       };
       dfs(0);
       return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<string> RestoreIpAddresses(string s) {
           var result = new List<string>();
           if (s.Length < 4 || s.Length > 12) {
               return result;
           }
           Dfs(s, 0, new List<string>(4), result);
           return result;
       }

       private static void Dfs(string s, int index,
                               List<string> path, List<string> result) {
           int parts = 4 - path.Count;
           int chars = s.Length - index;
           if (chars < parts || chars > parts * 3) {
               return;
           }
           if (path.Count == 4) {
               result.Add(string.Join(".", path));
               return;
           }

           int value = 0;
           for (int size = 1; size <= 3 && index + size <= s.Length; ++size) {
               if (size > 1 && s[index] == '0') {
                   break;
               }
               value = value * 10 + s[index + size - 1] - '0';
               if (value > 255) {
                   break;
               }
               path.Add(s.Substring(index, size));
               Dfs(s, index + size, path, result);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function restore_ip_addresses(s::String)::Vector{String}
       digits = codeunits(s)
       if !(4 <= length(digits) <= 12)
           return String[]
       end
       result = String[]
       path = String[]

       function dfs(index::Int)
           parts = 4 - length(path)
           chars = length(digits) - index + 1
           if chars < parts || chars > parts * 3
               return
           end
           if length(path) == 4
               push!(result, join(path, "."))
               return
           end

           value = 0
           for size in 1:3
               if index + size - 1 > length(digits)
                   break
               end
               if size > 1 && digits[index] == UInt8('0')
                   break
               end
               value = value * 10 + Int(digits[index + size - 1] - UInt8('0'))
               if value > 255
                   break
               end
               push!(path, String(digits[index:(index + size - 1)]))
               dfs(index + size)
               pop!(path)
           end
       end
       dfs(1)
       return result
   end

R
~

.. code-block:: r

   restore_ip_addresses <- function(s) {
     digits <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(digits)
     if (n < 4L || n > 12L) {
       return(character())
     }
     result <- character()

     dfs <- function(index, path) {
       parts <- 4L - length(path)
       chars <- n - index + 1L
       if (chars < parts || chars > parts * 3L) {
         return(invisible(NULL))
       }
       if (length(path) == 4L) {
         result <<- c(result, paste(path, collapse = "."))
         return(invisible(NULL))
       }

       value <- 0L
       for (size in seq_len(3L)) {
         if (index + size - 1L > n) {
           break
         }
         if (size > 1L && digits[index] == "0") {
           break
         }
         value <- value * 10L + as.integer(digits[index + size - 1L])
         if (value > 255L) {
           break
         }
         segment <- paste0(digits[index:(index + size - 1L)], collapse = "")
         dfs(index + size, c(path, segment))
       }
       invisible(NULL)
     }
     dfs(1L, character())
     result
   }

验证计划与证据
--------------

Python 对长度 ``1..12`` 的 60,000 个随机字符串与独立三点枚举基准对拍；C、C++、Java、Go、
TypeScript 各运行 10,000 组随机检查。固定覆盖 ``25525511135``、``0000``、``010010``、
``101023`` 与长度边界。C、C++ 通过严格警告、ASan 和 UBSan；其余四语言静态检查。

关键边界与易错点
----------------

* 长度小于 4 或大于 12 时立即返回空结果；
* ``0`` 合法，``00``、``01`` 非法；``255`` 合法，``256`` 非法；
* 四段完成时必须同时消费全部字符；
* 只检查数值而忽略前导零会错误接受 ``01``；
* C 的结果槽位上界来自四段各三种长度选择，分配失败必须清理已有字符串。

本题新增与强化知识
------------------

新增固定段数回溯的剩余长度双向剪枝，以及前导零和数值上界的单调停止规则；强化路径选择、撤销、
ASCII 切片和独立输出所有权。

关联题目
--------

* `0017. Letter Combinations of a Phone Number
  <0017-letter-combinations-of-a-phone-number.rst>`_：固定深度选择树；
* `0077. Combinations <0077-combinations.rst>`_：剩余容量剪枝；
* `0090. Subsets II <0090-subsets-ii.rst>`_：路径快照与回溯结果所有权。

最小自检
--------

#. 为什么剩余字符数必须位于剩余段数到其三倍之间？
#. 首字符为 ``0`` 时为什么尝试完长度 1 就能停止？
#. 数值首次超过 255 后为什么无需尝试更长片段？
#. 为什么不同递归路径不会生成同一地址？
