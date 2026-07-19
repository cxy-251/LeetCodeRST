0017. Letter Combinations of a Phone Number
===========================================

题目信息
--------

:题号: 0017
:难度: Medium
:主题: 字符串、回溯、笛卡尔积、递归
:原题: `LeetCode 0017 <https://leetcode.com/problems/letter-combinations-of-a-phone-number/>`_
:访问状态: Available
:教学重点: 递归层级、可变路径、选择与撤销、输出规模复杂度

题目重述
--------

给定一个只包含数字 ``2`` 到 ``9`` 的字符串 ``digits``，按照电话按键映射，返回每个数字
各选一个字母所形成的全部字符串。

映射如下：

.. code-block:: text

   2 -> abc    3 -> def
   4 -> ghi    5 -> jkl    6 -> mno
   7 -> pqrs   8 -> tuv    9 -> wxyz

结果中的字符串必须保持输入数字的顺序。输入为空字符串时返回空结果，而不是返回包含一个空串
的列表。

自建示例
--------

两个数字
~~~~~~~~

.. code-block:: text

   输入："23"
   第一个位置可选 a、b、c，第二个位置可选 d、e、f。
   输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]

包含四字母按键
~~~~~~~~~~~~~~

.. code-block:: text

   输入："79"
   组合数量：4 × 4 = 16
   开头若选择 p，后续依次得到 pw、px、py、pz。

单个数字
~~~~~~~~

.. code-block:: text

   输入："2"
   输出：["a", "b", "c"]

空输入
~~~~~~

.. code-block:: text

   输入：""
   输出：[]

问题抽象
--------

每个数字提供一个字母集合，答案是这些集合按位置组成的笛卡尔积。若输入长度为 ``d``，
第 ``index`` 层只负责选择 ``digits[index]`` 对应的一个字母：

.. code-block:: text

   path 长度 = index
   选择当前数字的一个字母
   递归处理 index + 1
   撤销当前选择

当 ``index == d`` 时，``path`` 已经包含每个数字的一次选择，应复制为一个完整答案。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 深度优先回溯
     - ``O(P × d)``
     - ``O(d)`` 辅助空间
     - 主解法；路径状态和递归层级直接对应输入位置
   * - 逐层扩展已有字符串
     - ``O(P × d)``
     - ``O(P × d)``
     - 迭代写法直观，但每层会创建大量中间字符串
   * - 预先枚举整数编号再解码
     - ``O(P × d)``
     - ``O(d)``
     - 可行但把自然的树形选择转成不直观的混合进制

其中 ``P`` 是最终组合数量，即各按键字母数的乘积。输出本身就包含 ``P`` 个长度为 ``d`` 的
字符串，因此 ``O(P × d)`` 是不可避免的输出成本。

主解法：逐层回溯
----------------

递归状态
~~~~~~~~

回溯函数维护：

* ``index``：下一步要处理的数字位置；
* ``path``：已经为位置 ``0`` 到 ``index - 1`` 选择的字母；
* ``result``：所有已经完成的组合；
* ``mapping``：数字到候选字母串的固定映射。

每层只遍历当前数字的候选字母：

.. code-block:: text

   for letter in mapping[digits[index]]:
       path.push(letter)
       dfs(index + 1)
       path.pop()

选择与撤销为什么必须成对
~~~~~~~~~~~~~~~~~~~~~~~~

``path`` 是所有递归分支共享的可变缓冲区。进入子层前追加一个字母，返回当前层后必须删除它，
才能恢复到进入本轮循环前的前缀。

若省略撤销，后一个兄弟分支会继承前一个分支留下的字母，路径长度和位置语义都会被破坏。
若每层都复制完整路径，正确性仍成立，但会增加大量中间分配。

终止条件
~~~~~~~~

当 ``index == len(digits)``：

* 每个输入位置都已经选择一个字母；
* ``path`` 长度等于输入长度；
* 当前路径是一个完整且唯一的组合。

此时必须复制 ``path`` 到结果中。不能保存同一个可变缓冲区的引用，否则后续撤销会修改已经
记录的答案。

核心不变量
~~~~~~~~~~

每次进入 ``dfs(index)`` 时：

* ``path`` 恰好有 ``index`` 个字母；
* ``path[k]`` 来自 ``digits[k]`` 的映射集合；
* ``path`` 表示递归树中从根到当前节点的唯一选择前缀；
* ``result`` 中保存的都是长度等于 ``digits`` 长度的完整组合；
* 当前子树会枚举所有以 ``path`` 为前缀的合法组合，且不会枚举其他前缀。

正确性依据
~~~~~~~~~~

空输入单独返回空列表。对于非空输入，初始调用 ``dfs(0)`` 时路径为空，不变量成立。

假设进入 ``dfs(index)`` 时不变量成立。循环依次选择当前数字映射中的每个字母，追加后路径的
第 ``index`` 位来源正确，递归调用 ``dfs(index + 1)`` 枚举所有以该新前缀开头的组合。
返回后撤销选择，恢复原前缀，再处理下一个字母，因此不同分支互不污染。

当到达深度 ``d`` 时，每个位置都恰好选择一次，得到合法组合。任意合法组合在每一层都有唯一
对应字母，因此它沿递归树有且只有一条路径；算法不会遗漏，也不会重复。由此结果正好是全部
电话按键组合。

复杂度
~~~~~~

设输入长度为 ``d``，最终组合数为 ``P``：

* 生成并复制每个长度为 ``d`` 的答案，时间复杂度为 ``O(P × d)``；
* 递归栈和可变路径最多包含 ``d`` 层，辅助空间复杂度为 ``O(d)``；
* 返回结果占用 ``O(P × d)``，属于输出空间；
* 当所有数字都是 ``7`` 或 ``9`` 时，``P = 4^d``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       const char* digits;
       const char** mapping;
       int length;
       char* path;
       char** result;
       int size;
   } BacktrackContext;

   static void build_combinations(
       BacktrackContext* context,
       int index
   ) {
       if (index == context->length) {
           char* combination = malloc(context->length + 1);
           memcpy(
               combination,
               context->path,
               context->length
           );
           combination[context->length] = '\0';
           context->result[context->size++] = combination;
           return;
       }

       const char* letters =
           context->mapping[context->digits[index] - '2'];

       for (int i = 0; letters[i] != '\0'; ++i) {
           context->path[index] = letters[i];
           build_combinations(context, index + 1);
       }
   }

   char** letterCombinations(char* digits, int* returnSize) {
       static const char* mapping[] = {
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz"
       };

       int length = (int)strlen(digits);
       *returnSize = 0;

       if (length == 0) {
           return NULL;
       }

       int total = 1;
       for (int i = 0; i < length; ++i) {
           total *= (int)strlen(mapping[digits[i] - '2']);
       }

       char** result = malloc(total * sizeof(char*));
       char* path = malloc(length * sizeof(char));

       BacktrackContext context = {
           digits,
           mapping,
           length,
           path,
           result,
           0
       };

       build_combinations(&context, 0);
       free(path);

       *returnSize = context.size;
       return result;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   private:
       const vector<string> mapping = {
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz"
       };

       void dfs(
           const string& digits,
           int index,
           string& path,
           vector<string>& result
       ) {
           if (index == static_cast<int>(digits.size())) {
               result.push_back(path);
               return;
           }

           const string& letters = mapping[digits[index] - '2'];
           for (char letter : letters) {
               path.push_back(letter);
               dfs(digits, index + 1, path, result);
               path.pop_back();
           }
       }

   public:
       vector<string> letterCombinations(string digits) {
           if (digits.empty()) {
               return {};
           }

           vector<string> result;
           string path;
           path.reserve(digits.size());
           dfs(digits, 0, path, result);
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def letterCombinations(self, digits: str) -> list[str]:
           if not digits:
               return []

           mapping = {
               "2": "abc",
               "3": "def",
               "4": "ghi",
               "5": "jkl",
               "6": "mno",
               "7": "pqrs",
               "8": "tuv",
               "9": "wxyz",
           }
           result: list[str] = []
           path: list[str] = []

           def dfs(index: int) -> None:
               if index == len(digits):
                   # join 在叶子处复制当前路径，后续 pop 不会修改结果。
                   result.append("".join(path))
                   return

               for letter in mapping[digits[index]]:
                   path.append(letter)
                   dfs(index + 1)
                   path.pop()

           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       private static final String[] MAPPING = {
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz"
       };

       public List<String> letterCombinations(String digits) {
           List<String> result = new ArrayList<>();
           if (digits.isEmpty()) {
               return result;
           }

           StringBuilder path = new StringBuilder();
           dfs(digits, 0, path, result);
           return result;
       }

       private void dfs(
           String digits,
           int index,
           StringBuilder path,
           List<String> result
       ) {
           if (index == digits.length()) {
               result.add(path.toString());
               return;
           }

           String letters = MAPPING[digits.charAt(index) - '2'];
           for (int i = 0; i < letters.length(); ++i) {
               path.append(letters.charAt(i));
               dfs(digits, index + 1, path, result);
               path.deleteCharAt(path.length() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn letter_combinations(digits: String) -> Vec<String> {
           if digits.is_empty() {
               return Vec::new();
           }

           const MAPPING: [&[u8]; 8] = [
               b"abc", b"def", b"ghi", b"jkl",
               b"mno", b"pqrs", b"tuv", b"wxyz",
           ];

           fn dfs(
               mapping: &[&[u8]; 8],
               digits: &[u8],
               index: usize,
               path: &mut Vec<u8>,
               result: &mut Vec<String>,
           ) {
               if index == digits.len() {
                   // 所有内容都是 ASCII 字母，当前字节路径一定是有效 UTF-8。
                   result.push(
                       String::from_utf8(path.clone()).unwrap()
                   );
                   return;
               }

               let letters = mapping[(digits[index] - b'2') as usize];
               for &letter in letters {
                   path.push(letter);
                   dfs(
                       mapping,
                       digits,
                       index + 1,
                       path,
                       result,
                   );
                   path.pop();
               }
           }

           let mut result = Vec::new();
           let mut path = Vec::with_capacity(digits.len());
           dfs(
               &MAPPING,
               digits.as_bytes(),
               0,
               &mut path,
               &mut result,
           );
           result
       }
   }

Go
~~

.. code-block:: go

   func letterCombinations(digits string) []string {
       if len(digits) == 0 {
           return []string{}
       }

       mapping := [...]string{
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz",
       }
       result := make([]string, 0)
       path := make([]byte, len(digits))

       var dfs func(index int)
       dfs = func(index int) {
           if index == len(digits) {
               // string(path) 会复制当前字节内容。
               result = append(result, string(path))
               return
           }

           letters := mapping[digits[index]-'2']
           for i := 0; i < len(letters); i++ {
               path[index] = letters[i]
               dfs(index + 1)
           }
       }

       dfs(0)
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function letterCombinations(digits: string): string[] {
       if (digits.length === 0) {
           return [];
       }

       const mapping = [
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz",
       ];
       const result: string[] = [];
       const path: string[] = [];

       const dfs = (index: number): void => {
           if (index === digits.length) {
               result.push(path.join(""));
               return;
           }

           const letters =
               mapping[digits.charCodeAt(index) - "2".charCodeAt(0)];

           for (const letter of letters) {
               path.push(letter);
               dfs(index + 1);
               path.pop();
           }
       };

       dfs(0);
       return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private static readonly string[] Mapping = {
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz"
       };

       public IList<string> LetterCombinations(string digits) {
           var result = new List<string>();
           if (digits.Length == 0) {
               return result;
           }

           var path = new char[digits.Length];
           Dfs(digits, 0, path, result);
           return result;
       }

       private static void Dfs(
           string digits,
           int index,
           char[] path,
           List<string> result
       ) {
           if (index == digits.Length) {
               result.Add(new string(path));
               return;
           }

           string letters = Mapping[digits[index] - '2'];
           foreach (char letter in letters) {
               path[index] = letter;
               Dfs(digits, index + 1, path, result);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function letter_combinations(digits::String)::Vector{String}
       if isempty(digits)
           return String[]
       end

       mapping = [
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz",
       ]
       digit_bytes = codeunits(digits)
       path = Vector{UInt8}(undef, length(digit_bytes))
       result = String[]

       function dfs(index::Int)
           if index > length(digit_bytes)
               # copy 防止后续分支覆盖共享路径缓冲区。
               push!(result, String(copy(path)))
               return
           end

           mapping_index = Int(digit_bytes[index] - UInt8('2')) + 1
           for letter in codeunits(mapping[mapping_index])
               path[index] = letter
               dfs(index + 1)
           end
       end

       dfs(1)
       return result
   end

R
~

.. code-block:: r

   letterCombinations <- function(digits) {
       if (nchar(digits) == 0) {
           return(character())
       }

       mapping <- c(
           "abc", "def", "ghi", "jkl",
           "mno", "pqrs", "tuv", "wxyz"
       )
       digit_values <- utf8ToInt(digits) - utf8ToInt("2") + 1
       path <- character(length(digit_values))
       result <- character()

       dfs <- function(index) {
           if (index > length(digit_values)) {
               result <<- c(result, paste0(path, collapse = ""))
               return(invisible(NULL))
           }

           letters <- strsplit(
               mapping[digit_values[index]],
               "",
               fixed = TRUE
           )[[1]]

           for (letter in letters) {
               path[index] <<- letter
               dfs(index + 1)
           }

           invisible(NULL)
       }

       dfs(1)
       result
   }

关键边界与易错点
----------------

* 空输入应返回空结果；只有在递归内部，深度到达输入长度时才记录一个组合；
* 共享可变路径时，``push`` 与 ``pop`` 必须成对，或使用按位置覆盖的固定长度缓冲区；
* 记录答案时要复制当前路径，不能保存之后还会被修改的同一对象引用；
* ``7`` 和 ``9`` 各有四个候选字母，不能把所有按键都假设为三个字母；
* 输入只包含 ASCII 数字 ``2`` 到 ``9``，按字节索引安全；一般 Unicode 字符串需要不同处理；
* 复杂度必须包含复制输出字符串的 ``d`` 因子，不能只写 ``O(P)``。

新增与强化知识
--------------

新增
~~~~

* **回溯前缀状态**：递归深度等于已经确定的输出位置数；
* **选择—递归—撤销**：共享路径缓冲区在兄弟分支之间恢复到同一前缀；
* **笛卡尔积递归树**：每层分支数由当前数字对应的字母数量决定；
* **输出规模复杂度**：组合题的运行时间至少与完整输出字符数成正比。

强化
~~~~

* 0010 已使用递归状态和记忆化；本题没有重叠子问题，因此只需回溯，不需要缓存；
* 0012 的增量字符串构造再次出现，但本题通过可变路径复用前缀；
* ASCII 输入约束继续允许 Rust、Go 和 Julia 按字节处理。

关联题目
--------

* `0010. Regular Expression Matching <0010-regular-expression-matching.rst>`_：同样使用递归状态，
  但该题存在重叠子问题，需要记忆化；
* `0014. Longest Common Prefix <0014-longest-common-prefix.rst>`_：同样依赖 ASCII 字符位置，
  该题是确定性纵向扫描，本题是分支枚举。

最小自检
--------

#. ``dfs(index)`` 中的 ``path`` 应满足什么长度与来源条件？
#. 为什么空输入返回 ``[]``，而递归到叶子时会记录一个字符串？
#. 使用共享 ``path`` 时为什么必须撤销选择或按位置覆盖？
#. 为什么时间复杂度写成 ``O(P × d)``？
#. 本题为什么不需要像 0010 那样使用记忆化？

答案要点
~~~~~~~~

#. 路径长度等于 ``index``，第 ``k`` 个字母来自第 ``k`` 个数字的映射；
#. 空输入按题意没有组合；非空输入的叶子表示所有位置都已完成选择；
#. 否则兄弟分支会继承错误前缀，记录答案时也可能被后续修改；
#. 一共有 ``P`` 个答案，每个答案复制或构造长度为 ``d`` 的字符串；
#. 不同递归前缀代表不同输出集合，不会反复求解同一个状态。
