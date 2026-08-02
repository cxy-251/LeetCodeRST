0017. Letter Combinations of a Phone Number
============================================

题目信息
--------

:题号: 0017
:难度: Medium
:主题: 字符串、回溯、笛卡尔积
:原题: `LeetCode 0017 <https://leetcode.com/problems/letter-combinations-of-a-phone-number/>`_
:重点: 电话按键映射、每位选择一个字母、组合数量、结果顺序不限定

题目重述
--------

给定一个只包含数字 ``2`` 到 ``9`` 的字符串 ``digits``，按照电话键盘映射返回所有可能的字母组合：``2 -> abc``、``3 -> def``、``4 -> ghi``、``5 -> jkl``、``6 -> mno``、``7 -> pqrs``、``8 -> tuv``、``9 -> wxyz``。

每个数字必须从自己的字母集合中选择恰好一个字母，组合中的字符顺序与数字顺序一致。当前题面约束 ``digits`` 的长度位于 ``[1, 4]``，因此有效输入不会为空；答案顺序不限。实现仍保留空字符串保护，若在题目约束之外传入空串则返回空列表。

自建示例
--------

一个三字母按键和一个四字母按键：

.. code-block:: text

   输入：digits = "27"
   输出：["ap", "aq", "ar", "as", "bp", "bq", "br", "bs", "cp", "cq", "cr", "cs"]
   解释：第一位从 a、b、c 中选择，第二位从 p、q、r、s 中选择，共有 3 * 4 = 12 种组合。输出顺序可以不同。

单个数字：

.. code-block:: text

   输入：digits = "8"
   输出：["t", "u", "v"]
   解释：数字 8 对应三个字母，每个字母单独形成一个组合。

四字母按键：

.. code-block:: text

   输入：digits = "9"
   输出：['w', 'x', 'y', 'z']
   解释：数字 9 对应四个字母，每个字母单独形成一个组合。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       const std::array<std::string, 10> letters{
           "", "", "abc", "def", "ghi",
           "jkl", "mno", "pqrs", "tuv", "wxyz"
       };

       std::vector<std::string> iterativeProduct(const std::string& digits) {
           if (digits.empty()) return {};
           std::vector<std::string> result{""};
           for (char digit : digits) {
               std::vector<std::string> next;
               for (const std::string& prefix : result) {
                   for (char letter : letters[digit - '0']) {
                       next.push_back(prefix + letter);
                   }
               }
               result = std::move(next);
           }
           return result;
       }

       void backtrack(
           const std::string& digits,
           int index,
           std::string& path,
           std::vector<std::string>& result
       ) {
           if (index == static_cast<int>(digits.size())) {
               result.push_back(path);
               return;
           }
           for (char letter : letters[digits[index] - '0']) {
               path.push_back(letter);
               backtrack(digits, index + 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::string> recursiveProduct(const std::string& digits) {
           if (digits.empty()) return {};
           std::vector<std::string> result;
           std::string path;
           path.reserve(digits.size());
           backtrack(digits, 0, path, result);
           return result;
       }

   public:
       std::vector<std::string> letterCombinations(std::string digits) {
           return recursiveProduct(digits);
       }
   };

题解
----

组合集合为什么是多个字母集的笛卡尔积
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第 ``i`` 个数字只能从对应按键字母中选择一个字符。合法组合由每个位置各选一次组成，因此答案是这些字母集按
输入顺序形成的笛卡尔积。若有 ``k`` 个数字，每个数字提供 3 或 4 个字母，输出数量就是各分支数的乘积。

迭代方法如何逐层扩展已有前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

开始时只有空前缀。处理一个数字时，把每个旧前缀分别追加该按键的每个字母，形成下一层前缀集合。处理完前
``i`` 个数字后，``result`` 恰好包含这 ``i`` 个位置的全部组合。它直接保存每层全部中间字符串。

回溯状态为什么只需要位置和路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``index`` 表示下一个待处理数字，``path`` 保存前 ``index`` 个数字已经选择的字母。映射由当前数字唯一决定，
无需访问标记。每层枚举当前按键字母，追加一个字符后进入下一层。

选择与撤销如何复用同一缓冲区
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

追加字符后递归，返回时删除末位，路径就恢复到进入本层前的状态。下一个字母从相同父前缀出发，不会混入上一
分支。路径长度始终等于 ``index``；到达输入末尾时复制路径，得到一个独立答案。

递归树局部展开
~~~~~~~~~~~~~~

.. code-block:: text

   ""
   ├─ a
   │  ├─ ap
   │  ├─ aq
   │  ├─ ar
   │  └─ as
   ├─ b
   │  └─ bp ... bs
   └─ c
      └─ cp ... cs

为什么回溯覆盖全部组合且不重复
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个完整组合都有唯一的逐位选择序列。回溯在每层遍历该数字的全部字母，并对每个选择枚举所有后续位置，所以
任意选择序列都有对应根到叶路径。不同组合至少在一层选择不同字母，路径不同，因此不会重复。

实现为什么保留空输入保护
~~~~~~~~~~~~~~~~~~~~~~~~

当前题面要求输入至少包含一个数字，空串不是有效测试数据。实现仍在入口处返回空列表，避免在约束外调用时把空路径
误当成一个组合 ``[""]``；这属于防御性行为，不改变有效输入的答案。

复杂度来源
~~~~~~~~~~

设答案数量为 ``N``，数字长度为 ``k``。复制每个答案需要 ``O(k)``，总时间 ``O(Nk)``；返回结果占
``O(Nk)``。工作路径和递归栈均为 ``O(k)``。

九语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   static const char* MAP[] = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};

   static void dfs(const char* digits, int length, int index, char* path,
                   char** result, int* count) {
       if (index == length) {
           path[length] = '\0';
           result[*count] = malloc((size_t)length + 1);
           memcpy(result[*count], path, (size_t)length + 1);
           ++*count;
           return;
       }
       const char* choices = MAP[digits[index] - '0'];
       for (int i = 0; choices[i] != '\0'; ++i) {
           path[index] = choices[i];
           dfs(digits, length, index + 1, path, result, count);
       }
   }

   char** letterCombinations(char* digits, int* returnSize) {
       int length = (int)strlen(digits);
       if (length == 0) { *returnSize = 0; return NULL; }
       int capacity = 1;
       for (int i = 0; i < length; ++i) capacity *= (int)strlen(MAP[digits[i]-'0']);
       char** result = malloc((size_t)capacity * sizeof(char*));
       char* path = malloc((size_t)length + 1);
       *returnSize = 0;
       dfs(digits, length, 0, path, result, returnSize);
       free(path);
       return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def letterCombinations(self, digits: str) -> list[str]:
           if not digits:
               return []
           mapping = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
           result, path = [], []
           def dfs(index: int) -> None:
               if index == len(digits):
                   result.append("".join(path))
                   return
               for letter in mapping[int(digits[index])]:
                   path.append(letter)
                   dfs(index + 1)
                   path.pop()
           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       private static final String[] MAP = {
           "","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"
       };
       public List<String> letterCombinations(String digits) {
           List<String> result = new ArrayList<>();
           if (digits.isEmpty()) return result;
           dfs(digits, 0, new StringBuilder(), result);
           return result;
       }
       private void dfs(String digits, int index, StringBuilder path, List<String> result) {
           if (index == digits.length()) {
               result.add(path.toString());
               return;
           }
           for (char letter : MAP[digits.charAt(index)-'0'].toCharArray()) {
               path.append(letter);
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
           if digits.is_empty() { return vec![]; }
           let map = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
           fn dfs(d: &[u8], index: usize, map: &[&str;10], path: &mut String, out: &mut Vec<String>) {
               if index == d.len() { out.push(path.clone()); return; }
               for letter in map[(d[index]-b'0') as usize].chars() {
                   path.push(letter);
                   dfs(d, index + 1, map, path, out);
                   path.pop();
               }
           }
           let mut result = Vec::new();
           dfs(digits.as_bytes(), 0, &map, &mut String::new(), &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   func letterCombinations(digits string) []string {
       if len(digits) == 0 { return []string{} }
       mapping := []string{"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"}
       result := []string{}
       path := make([]byte, len(digits))
       var dfs func(int)
       dfs = func(index int) {
           if index == len(digits) { result = append(result, string(path)); return }
           for _, letter := range []byte(mapping[digits[index]-'0']) {
               path[index] = letter
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
       if (!digits.length) return [];
       const map = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
       const result: string[] = [], path: string[] = [];
       const dfs = (index: number): void => {
           if (index === digits.length) { result.push(path.join("")); return; }
           for (const letter of map[Number(digits[index])]) {
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
       private readonly string[] map = {
           "","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"
       };
       public IList<string> LetterCombinations(string digits) {
           var result = new List<string>();
           if (digits.Length == 0) return result;
           Dfs(digits, 0, new System.Text.StringBuilder(), result);
           return result;
       }
       private void Dfs(string digits, int index, System.Text.StringBuilder path, List<string> result) {
           if (index == digits.Length) { result.Add(path.ToString()); return; }
           foreach (char letter in map[digits[index]-'0']) {
               path.Append(letter);
               Dfs(digits, index + 1, path, result);
               path.Length -= 1;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function letter_combinations(digits::String)
       isempty(digits) && return String[]
       mapping = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"]
       digit_chars = collect(digits)
       path = Char[]
       result = String[]
       function dfs(index)
           if index > length(digit_chars)
               push!(result, join(path))
               return
           end
           digit = Int(digit_chars[index] - '0')
           for letter in mapping[digit + 1]
               push!(path, letter)
               dfs(index + 1)
               pop!(path)
           end
       end
       dfs(1)
       result
   end

R
~

.. code-block:: r

   letterCombinations <- function(digits) {
       if (nchar(digits) == 0L) return(character())
       mapping <- c("","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz")
       d <- strsplit(digits, "", fixed = TRUE)[[1]]
       result <- character()
       path <- character()
       dfs <- function(index) {
           if (index > length(d)) {
               result <<- c(result, paste(path, collapse = ""))
               return()
           }
           letters <- strsplit(mapping[[as.integer(d[[index]]) + 1L]], "", fixed = TRUE)[[1]]
           for (letter in letters) {
               path <<- c(path, letter)
               dfs(index + 1L)
               path <<- path[-length(path)]
           }
       }
       dfs(1L)
       result
   }
