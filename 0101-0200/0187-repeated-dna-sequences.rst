0187. Repeated DNA Sequences
============================

题目信息
--------

:题号: 0187
:难度: Medium
:主题: 字符串、滑动窗口、位编码、去重状态
:原题: `LeetCode 0187 <https://leetcode.com/problems/repeated-dna-sequences/>`_
:访问状态: Available
:教学重点: 2 位字符编码、20 位滚动窗口、第二次出现提交、结果所有权

精确契约
--------

输入 DNA 字符串 ``s``，满足：

* ``1 <= s.length <= 10^5``；
* 每个字符只可能是 ``A``、``C``、``G``、``T``；
* 找出所有长度恰好为 10、在 ``s`` 中出现至少两次的连续片段；
* 每种重复片段只返回一次。

结果顺序不构成题目的核心要求。本章实现按扫描时“第二次出现”的顺序追加，
避免依赖哈希表迭代顺序。输入只读；每个结果是长度 10 的独立字符串值。
若 ``s.length < 10``，返回空结果。

示例与反例
----------

经典示例
~~~~~~~~

``s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"``。

扫描得到重复片段：

* ``"AAAAACCCCC"``；
* ``"CCCCCAAAAA"``。

两者都在第二次出现时加入结果，后续出现不会重复加入。

同一片段出现多次
~~~~~~~~~~~~~~~~

``s = "AAAAAAAAAAAAA"`` 含有四个长度 10 的窗口，它们全是 ``"AAAAAAAAAA"``。
结果只能包含一次该字符串。仅用布尔“见过”而不区分是否已经输出，会在第三次、第四次重复追加。

长度不足
~~~~~~~~

长度 9 的输入没有任何合法窗口，直接返回空结果。

恰好一个窗口
~~~~~~~~~~~~

长度 10 的输入只有一个窗口，不可能重复，结果为空。

无重复
~~~~~~

``s = "ACGTACGTAA"`` 长度正好 10，只产生一个编码；状态从未到达第二次出现。

问题抽象与解法选择
------------------

DNA 字符域只有四种，可以给每个字符分配 2 位：

.. code-block:: text

   A -> 00
   C -> 01
   G -> 10
   T -> 11

长度 10 的片段恰好需要 20 位。扫描字符时维护：

.. math::

   code \leftarrow ((code << 2) \mid value) \mathbin{\&} (2^{20}-1)

左移为新字符腾出最低 2 位，按位或加入当前字符；20 位掩码删除十字符窗口之前的旧位。

使用大小 ``2^20`` 的状态表：

* ``0``：该编码从未形成过完整窗口；
* ``1``：已经出现一次，但尚未输出；
* ``2``：已经出现至少两次，且已经输出。

每个窗口只做常数次位运算和一次状态访问。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 核心状态
     - 取舍
   * - 2 位滚动编码 + 三态表
     - ``O(L)``
     - 固定 ``2^20`` 字节
     - 主解法；无哈希碰撞
   * - 子串哈希集合
     - 期望 ``O(L)``
     - ``O(U)`` 个字符串或哈希键
     - 简洁，但字符复制与哈希成本更高
   * - 收集全部窗口后排序
     - ``O(L log L)``
     - ``O(L)`` 窗口
     - 产生大量重复子串
   * - 对每个窗口向后搜索
     - ``O(L^2)``
     - ``O(1)``
     - 重复扫描不可接受

这里 ``L=|s|``，``U`` 是不同长度 10 片段数量。``2^20`` 与输入长度无关，
在本题固定字符域和固定窗口长度下属于常数状态空间；实际仍需约 1 MiB 字节表。

状态、不变量与实现映射
----------------------

滚动编码不变量
~~~~~~~~~~~~~~

处理完下标 ``i`` 的字符后，``code`` 保存最近
``min(i+1,10)`` 个字符的 2 位编码，较早字符已经被掩码删除。

设字符值为 ``v_j in {0,1,2,3}``。当已经处理至少 10 个字符时：

.. math::

   code =
   \sum_{t=0}^{9} v_{i-9+t} 4^{9-t}

也就是窗口 ``s[i-9..i]`` 的固定长度四进制表示。

初始化 ``code=0``。每轮左移 2 位等价于乘 4，加入新值形成新最低位；
与 ``2^{20}-1`` 按位与，只保留最低 20 位，也就是最近 10 个四进制数位。

编码无碰撞
~~~~~~~~~~

每个长度 10 字符串对应 10 个固定位置的四进制数位。若两个字符串不同，
必在某个位置有不同数位；固定长度四进制表示的唯一性保证 20 位整数不同。
前导 ``A`` 对应数位 0 不会造成长度歧义，因为所有被比较对象长度都固定为 10。

三态去重不变量
~~~~~~~~~~~~~~

处理每个完整窗口前，状态表对其编码满足：

* 0 表示此前出现 0 次；
* 1 表示此前恰好出现 1 次；
* 2 表示此前出现至少 2 次，并且结果中恰好已有一个副本。

当前窗口到来时：

* 0 变 1，不输出；
* 1 变 2，输出当前长度 10 子串；
* 2 保持 2，不再输出。

因此结果顺序正是各重复片段第二次出现的扫描顺序。

字符与下标适配
~~~~~~~~~~~~~~

C++ 按 ``std::string`` 的 ASCII 字符下标读取输入；题目保证字符只来自 ``A/C/G/T``，
因此每个字符占一个字节。命中第二次时用 ``substr`` 复制十字符结果，使返回值不依赖输入字符串的存储。

正确性证明
----------

引理一：滚动更新后 ``code`` 等于最近至多 10 个字符的编码
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对已处理字符数做归纳。初始没有字符，编码为 0。假设旧 ``code`` 保存最近至多 10 个字符。
左移 2 位把这些数位整体提高一位，按位或加入当前字符值作为最低位。
若总数不超过 10，20 位掩码不删除有效位；若超过 10，唯一超出最低 20 位的是窗口之前的字符，
掩码恰好删除它们。因此不变量保持。

引理二：每个完整窗口的 20 位编码唯一
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度固定为 10，每个位置是 ``0..3`` 的四进制数位。四进制定长表示唯一，
所以两个不同窗口不会得到同一编码。反过来，相同编码逐位展开得到相同 DNA 字符。
因此状态表索引与窗口字符串一一对应，不存在哈希碰撞。

引理三：状态 0/1/2 始终准确描述出现与输出情况
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

首次遇到编码时从 0 改为 1，准确记录一次出现。第二次从 1 改为 2，
并追加一个结果。后续遇到 2 不改变结果。由扫描次数归纳，三种状态语义始终成立。

引理四：每个返回片段确实至少出现两次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法只在状态为 1 时输出。状态 1 表示同一无碰撞编码此前已经出现一次；
当前窗口是第二次。由引理二，两次编码对应完全相同的长度 10 字符串，
所以每个输出都满足重复条件。

引理五：每个重复片段恰好返回一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意至少出现两次的片段在第一次出现时状态变为 1，在第二次出现时必从 1 变为 2 并输出。
之后状态保持 2，不再输出。因此不会遗漏，也不会重复提交。

引理六：所有合法窗口都被扫描
~~~~~~~~~~~~~~~~~~~~~~~~

字符从左到右逐个处理。每个结束位置 ``i>=9`` 唯一对应窗口 ``s[i-9..i]``；
算法在该位置查询一次状态。所有长度 10 窗口各有唯一结束位置，因此恰好被处理一次。

定理：算法返回且仅返回所有重复长度 10 DNA 片段，每种一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理四保证结果没有假阳性，引理五保证所有重复片段无遗漏且只出现一次，
引理六保证扫描覆盖全部候选，因此定理成立。

复杂度与实现边界
----------------

设 ``L=|s|``，结果数量为 ``R``：

* 输入扫描时间 ``O(L)``；
* 2 位更新、掩码和状态访问均为 ``O(1)``；
* 状态表大小固定为 ``2^20`` 字节，按题目固定窗口可记为 ``O(1)``，
  实际内存约 1 MiB；
* 每个结果复制 10 个字符，结果载荷与复制时间为 ``Theta(10R)=Theta(R)``；
* 总时间 ``O(L+R)``，由于 ``R<=2^20`` 且窗口数不超过 ``L-9``，通常写作 ``O(L)``；
* C++ 状态表固定为 ``2^20`` 个字节，结果向量保存每个命中的十字符副本；
* C++ 输入字符串只读，结果载荷与状态表之外没有按窗口累积的中间副本。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   static unsigned int dna_value(char character) {
       switch (character) {
           case 'A': return 0U;
           case 'C': return 1U;
           case 'G': return 2U;
           default: return 3U;  // 合同保证其余只能是 T
       }
   }

   static void free_sequences(char **result, int count) {
       if (result == NULL) {
           return;
       }
       for (int index = 0; index < count; ++index) {
           free(result[index]);
       }
       free(result);
   }

   char **findRepeatedDnaSequences(char *s, int *returnSize) {
       *returnSize = 0;
       const size_t length = strlen(s);
       if (length < 10U) {
           return NULL;
       }

       unsigned char *states = calloc(1U << 20U, sizeof(*states));
       if (states == NULL) {
           return NULL;
       }

       char **result = NULL;
       size_t capacity = 0U;
       unsigned int code = 0U;
       const unsigned int mask = (1U << 20U) - 1U;

       for (size_t index = 0U; index < length; ++index) {
           code = ((code << 2U) | dna_value(s[index])) & mask;
           if (index < 9U) {
               continue;
           }

           if (states[code] == 0U) {
               states[code] = 1U;
               continue;
           }
           if (states[code] == 2U) {
               continue;
           }

           if ((size_t)*returnSize == capacity) {
               size_t next_capacity = capacity == 0U ? 8U : capacity * 2U;
               if (next_capacity < capacity ||
                   next_capacity > SIZE_MAX / sizeof(*result)) {
                   free(states);
                   free_sequences(result, *returnSize);
                   *returnSize = 0;
                   return NULL;
               }

               char **grown = realloc(
                   result,
                   next_capacity * sizeof(*grown)
               );
               if (grown == NULL) {
                   free(states);
                   free_sequences(result, *returnSize);
                   *returnSize = 0;
                   return NULL;
               }
               result = grown;
               capacity = next_capacity;
           }

           char *sequence = malloc(11U);
           if (sequence == NULL) {
               free(states);
               free_sequences(result, *returnSize);
               *returnSize = 0;
               return NULL;
           }
           memcpy(sequence, s + index - 9U, 10U);
           sequence[10] = '\0';

           result[*returnSize] = sequence;
           ++(*returnSize);
           states[code] = 2U;
       }

       free(states);
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
       static unsigned int encode(char character) {
           switch (character) {
               case 'A': return 0U;
               case 'C': return 1U;
               case 'G': return 2U;
               default: return 3U;
           }
       }

   public:
       std::vector<std::string> findRepeatedDnaSequences(
           const std::string& s
       ) {
           if (s.size() < 10U) {
               return {};
           }

           std::vector<unsigned char> states(1U << 20U, 0U);
           std::vector<std::string> result;
           unsigned int code = 0U;
           constexpr unsigned int mask = (1U << 20U) - 1U;

           for (std::size_t index = 0; index < s.size(); ++index) {
               code = ((code << 2U) | encode(s[index])) & mask;
               if (index < 9U) {
                   continue;
               }

               if (states[code] == 0U) {
                   states[code] = 1U;
               } else if (states[code] == 1U) {
                   result.push_back(s.substr(index - 9U, 10U));
                   states[code] = 2U;
               }
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findRepeatedDnaSequences(self, s: str) -> list[str]:
           if len(s) < 10:
               return []

           states = bytearray(1 << 20)
           values = {"A": 0, "C": 1, "G": 2, "T": 3}
           result: list[str] = []
           code = 0
           mask = (1 << 20) - 1

           for index, character in enumerate(s):
               code = ((code << 2) | values[character]) & mask
               if index < 9:
                   continue

               if states[code] == 0:
                   states[code] = 1
               elif states[code] == 1:
                   result.append(s[index - 9:index + 1])
                   states[code] = 2

           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       private static int encode(char character) {
           switch (character) {
               case 'A': return 0;
               case 'C': return 1;
               case 'G': return 2;
               default: return 3;
           }
       }

       public List<String> findRepeatedDnaSequences(String s) {
           List<String> result = new ArrayList<>();
           if (s.length() < 10) {
               return result;
           }

           byte[] states = new byte[1 << 20];
           int code = 0;
           int mask = (1 << 20) - 1;

           for (int index = 0; index < s.length(); ++index) {
               code = ((code << 2) | encode(s.charAt(index))) & mask;
               if (index < 9) {
                   continue;
               }

               if (states[code] == 0) {
                   states[code] = 1;
               } else if (states[code] == 1) {
                   result.add(s.substring(index - 9, index + 1));
                   states[code] = 2;
               }
           }
           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       fn encode(byte: u8) -> usize {
           match byte {
               b'A' => 0,
               b'C' => 1,
               b'G' => 2,
               _ => 3,
           }
       }

       pub fn find_repeated_dna_sequences(s: String) -> Vec<String> {
           let bytes = s.as_bytes();
           if bytes.len() < 10 {
               return Vec::new();
           }

           let mut states = vec![0_u8; 1 << 20];
           let mut result = Vec::new();
           let mut code = 0_usize;
           let mask = (1_usize << 20) - 1;

           for (index, &byte) in bytes.iter().enumerate() {
               code = ((code << 2) | Self::encode(byte)) & mask;
               if index < 9 {
                   continue;
               }

               if states[code] == 0 {
                   states[code] = 1;
               } else if states[code] == 1 {
                   result.push(s[index - 9..index + 1].to_string());
                   states[code] = 2;
               }
           }
           result
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func encodeDna(character byte) uint32 {
       switch character {
       case 'A':
           return 0
       case 'C':
           return 1
       case 'G':
           return 2
       default:
           return 3
       }
   }

   func findRepeatedDnaSequences(s string) []string {
       if len(s) < 10 {
           return []string{}
       }

       states := make([]byte, 1<<20)
       result := make([]string, 0)
       var code uint32
       const mask uint32 = (1 << 20) - 1

       for index := 0; index < len(s); index++ {
           code = ((code << 2) | encodeDna(s[index])) & mask
           if index < 9 {
               continue
           }

           if states[code] == 0 {
               states[code] = 1
           } else if states[code] == 1 {
               result = append(
                   result,
                   strings.Clone(s[index-9:index+1]),
               )
               states[code] = 2
           }
       }
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function encodeDna(character: string): number {
       switch (character) {
           case "A": return 0;
           case "C": return 1;
           case "G": return 2;
           default: return 3;
       }
   }

   function findRepeatedDnaSequences(s: string): string[] {
       if (s.length < 10) {
           return [];
       }

       const states = new Uint8Array(1 << 20);
       const result: string[] = [];
       let code = 0;
       const mask = (1 << 20) - 1;

       for (let index = 0; index < s.length; index++) {
           code = ((code << 2) | encodeDna(s[index])) & mask;
           if (index < 9) {
               continue;
           }

           if (states[code] === 0) {
               states[code] = 1;
           } else if (states[code] === 1) {
               result.push(s.slice(index - 9, index + 1));
               states[code] = 2;
           }
       }
       return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private static int EncodeDna(char character) {
           switch (character) {
               case 'A': return 0;
               case 'C': return 1;
               case 'G': return 2;
               default: return 3;
           }
       }

       public IList<string> FindRepeatedDnaSequences(string s) {
           var result = new List<string>();
           if (s.Length < 10) {
               return result;
           }

           var states = new byte[1 << 20];
           int code = 0;
           int mask = (1 << 20) - 1;

           for (int index = 0; index < s.Length; ++index) {
               code = ((code << 2) | EncodeDna(s[index])) & mask;
               if (index < 9) {
                   continue;
               }

               if (states[code] == 0) {
                   states[code] = 1;
               } else if (states[code] == 1) {
                   result.Add(s.Substring(index - 9, 10));
                   states[code] = 2;
               }
           }
           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function encode_dna(byte::UInt8)::Int
       if byte == UInt8('A')
           return 0
       elseif byte == UInt8('C')
           return 1
       elseif byte == UInt8('G')
           return 2
       end
       return 3
   end

   function find_repeated_dna_sequences(s::String)::Vector{String}
       bytes = codeunits(s)
       if length(bytes) < 10
           return String[]
       end

       states = zeros(UInt8, 1 << 20)
       result = String[]
       code = 0
       mask = (1 << 20) - 1

       for index in 1:length(bytes)
           code = ((code << 2) | encode_dna(bytes[index])) & mask
           if index < 10
               continue
           end

           state_index = code + 1
           if states[state_index] == 0
               states[state_index] = 1
           elseif states[state_index] == 1
               window = Vector{UInt8}(bytes[(index - 9):index])
               push!(result, String(window))
               states[state_index] = 2
           end
       end
       return result
   end

R
~

.. code-block:: r

   find_repeated_dna_sequences <- function(s) {
     bytes <- charToRaw(s)
     length_s <- length(bytes)
     if (length_s < 10L) {
       return(character())
     }

     value_map <- integer(256L)
     value_map[utf8ToInt("A") + 1L] <- 0L
     value_map[utf8ToInt("C") + 1L] <- 1L
     value_map[utf8ToInt("G") + 1L] <- 2L
     value_map[utf8ToInt("T") + 1L] <- 3L

     states <- raw(bitwShiftL(1L, 20L))
     window_count <- length_s - 9L
     capacity <- min(16L, window_count)
     result <- character(capacity)
     result_count <- 0L
     code <- 0L
     mask <- bitwShiftL(1L, 20L) - 1L

     for (index in seq_len(length_s)) {
       value <- value_map[as.integer(bytes[[index]]) + 1L]
       code <- bitwAnd(bitwOr(bitwShiftL(code, 2L), value), mask)
       if (index < 10L) {
         next
       }

       state_index <- code + 1L
       state <- as.integer(states[[state_index]])
       if (state == 0L) {
         states[[state_index]] <- as.raw(1L)
       } else if (state == 1L) {
         if (result_count == capacity) {
           capacity <- min(window_count, max(1L, capacity * 2L))
           length(result) <- capacity
         }

         result_count <- result_count + 1L
         result[[result_count]] <- rawToChar(
           bytes[(index - 9L):index]
         )
         states[[state_index]] <- as.raw(2L)
       }
     }

     if (result_count == 0L) {
       return(character())
     }
     result[seq_len(result_count)]
   }

静态审查记录
------------

本题题解代码未运行、未编译、未对拍。完成了以下人工与静态检查：

* 经典输入的两个重复片段都在各自第二次出现时提交；
* ``"AAAAAAAAAAAAA"`` 的同一编码从 0 到 1、再到 2，后续保持 2，只输出一次；
* 长度 9 直接返回空，长度 10 只形成一个窗口；
* 无重复输入的所有编码只从 0 变 1；
* 掩码为 ``2^20-1``，移位后不会保留第 11 个字符；
* 十语言映射均为 ``A=0,C=1,G=2,T=3``，没有交换字符码；
* TypeScript 的位运算虽然转换为 32 位有符号整数，但状态仅使用 20 位，始终非负安全；
* R 的 ``bitw`` 状态同样不超过 20 位，循环使用 ``seq_len``，没有空区间方向问题；
* Julia/R 状态索引在编码上加 1，其他语言使用零基索引；
* Rust、Go、Julia 按字节切片的安全性由 ASCII DNA 合同支撑；
* Go 结果通过 ``strings.Clone`` 获得独立存储；
* Java、TypeScript 与 C# 只承诺不可变结果值，不把运行时未公开的子串存储策略写成已确认复制；
* C 的外层数组、每个字符串和状态表在所有失败路径上完整释放。

剩余风险：未在各目标平台编译或执行；字符串切片、标准库容器和平台签名仅完成静态语义核对。

边界、失败路径与易错点
----------------------

* 窗口长度固定为 10；把 9 或 11 写进掩码与切片会破坏对应关系；
* 必须在处理到第 10 个字符后才查询状态；
* 只使用“是否见过”的布尔值无法阻止第三次出现再次输出；
* 固定长度使前导 ``A=00`` 不产生编码歧义；
* 掩码必须保留 20 位，而不是 10 位；
* 结果顺序按第二次出现扫描顺序确定，不依赖哈希迭代；
* C 空结果与分配失败都可能以 ``NULL``、``returnSize=0`` 表示，平台接口没有独立错误通道；
* 固定状态空间在渐进符号中是 ``O(1)``，实际 1 MiB 仍应明确报告；
* R 的输入物化和结果向量增长属于语言适配成本。

知识更新与关联题目
------------------

新增
~~~~

* **有限字母表位编码**：4 个字符用 2 位无碰撞表示；
* **滚动定长编码**：左移、加入新值、掩码保留最近窗口；
* **三态重复提交**：0/1/2 区分未见、见一次、已输出；
* **固定状态空间**：``2^20`` 直接索引替代通用哈希；
* **第二次出现顺序**：在线扫描自然给出确定结果顺序。

强化
~~~~

* 复用 0165–0179 的 ASCII 字节或代码单元扫描合同，并明确 R 的 ``charToRaw`` 输入物化；
* 延续从 0052 起的输出载荷口径，固定状态表、结果字符串和托管运行时存储风险分别报告；
* 复用 0093 的 C 多字符串事务：跟踪已成功数量，失败时释放各字符串、外层数组和附加状态表。

关联题目
~~~~~~~~

* 0076 Minimum Window Substring：同样按字符滑动，但维护的是可行性缺口；
* 0438 Find All Anagrams in a String：固定窗口与字符状态的另一种应用；
* 1044 Longest Duplicate Substring：窗口长度不固定，需要滚动哈希与碰撞处理。

自检问题
--------

#. 为什么长度 10 的 DNA 片段恰好能放入 20 位？
#. 掩码如何保证只保留最近 10 个字符？
#. 为什么 20 位编码不会发生碰撞？
#. 为什么状态表必须至少有三种状态？
#. 为什么 Go 版本显式克隆结果子串？

答案要点
~~~~~~~~

#. 四种字符需要 2 位，十个位置共 20 位。
#. 每轮左移 2 位加入新字符，按位与 ``2^20-1`` 删除更高的旧位。
#. 固定长度四进制表示唯一，每个字符映射也唯一。
#. 需要区分首次出现、第二次应输出、后续不再输出。
#. 普通切片可能共享完整输入的底层存储；克隆使每个返回结果拥有独立字符串。
