0017. Letter Combinations of a Phone Number
============================================

题目信息
--------

:题号: 0017
:难度: Medium
:主题: 字符串、回溯、笛卡尔积
:原题: `LeetCode 0017 <https://leetcode.com/problems/letter-combinations-of-a-phone-number/>`_
:教学重点: 按键映射、递归层、路径状态、选择与撤销、输出规模

题目重述
--------

给定只包含数字 ``2`` 到 ``9`` 的字符串 ``digits``，按照电话键盘映射返回所有可能字母组合。每个输入数字必须
贡献一个字母，组合中的字母顺序与数字顺序一致。空输入返回空列表。

映射为 ``2:abc``、``3:def``、``4:ghi``、``5:jkl``、``6:mno``、``7:pqrs``、``8:tuv``、``9:wxyz``。

自建示例
--------

.. code-block:: text

   digits = "27"
   第一位选择 a、b、c；第二位分别选择 p、q、r、s。
   输出 12 个组合：ap, aq, ar, as, ..., cp, cq, cr, cs。

.. code-block:: text

   digits = ""
   没有数字，也不生成一个空字符串组合；输出 []。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>
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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第 ``i`` 个数字只能从对应按键字母中选择一个字符。一个合法组合由每个位置各选一次组成，因此答案是这些字母集
按输入顺序形成的笛卡尔积。若有 ``k`` 个数字，每个数字提供 3 或 4 个字母，输出数量就是各分支数的乘积。

迭代方法如何逐层扩展已有前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

开始时只有空前缀。处理一个数字时，把每个旧前缀分别追加该按键的每个字母，形成下一层完整前缀集合。处理完
前 ``i`` 个数字后，``result`` 恰好包含这 ``i`` 个位置的全部组合。它直接保存每一层全部中间字符串。

回溯状态为什么只需要位置和路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

回溯函数的 ``index`` 表示下一个待处理数字，``path`` 保存前 ``index`` 个数字已经选择的字母。映射由输入数字
唯一决定，因此无需额外集合或访问标记。每层遍历当前按键字母，追加一个字符后进入下一层。

选择与撤销如何复用同一缓冲区
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``push_back`` 把当前选择加入路径；递归返回后 ``pop_back`` 恢复进入本层前的路径。恢复后下一个字母从相同父
前缀出发，不会混入上一个分支。路径长度始终等于 ``index``，到达 ``index == digits.size()`` 时就是一个完整
组合的独立副本。

递归树局部展开
~~~~~~~~~~~~~~

对 ``digits = "27"``：

.. code-block:: text

   ""
   ├─ a
   │  ├─ ap
   │  ├─ aq
   │  ├─ ar
   │  └─ as
   ├─ b
   │  ├─ bp ... bs
   └─ c
      ├─ cp ... cs

为什么回溯覆盖全部组合且不重复
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个完整组合都有唯一的逐位选择序列。回溯在第 ``i`` 层枚举该数字的全部字母，并对每个选择递归枚举后续位置，
所以任意选择序列都有一条对应根到叶路径。不同组合至少在某一位置选择不同字母，对应不同分支，因此不会重复。

为什么空输入返回空列表
~~~~~~~~~~~~~~~~~~~~~~

题目语义是“输入数字产生的字母组合”。没有数字时没有需要返回的电话号码组合。若直接从空路径调用终止条件会
产生 ``[""]``，因此入口在递归前单独返回空列表。

复杂度来源
~~~~~~~~~~

设答案数量为 ``N``，数字长度为 ``k``。每个答案需要复制 ``k`` 个字符，时间复杂度 ``O(Nk)``；返回结果本身
占 ``O(Nk)``。回溯工作路径和递归栈均为 ``O(k)``。迭代方法还会保存一层中间前缀。

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
       const char* letters = MAP[digits[index] - '0'];
       for (int i = 0; letters[i] != '\0'; ++i) {
           path[index] = letters[i];
           dfs(digits, length, index + 1, path, result, count);
       }
   }

   char** letterCombinations(char* digits, int* returnSize) {
       int length = (int)strlen(digits);
       if (length == 0) { *returnSize = 0; return NULL; }
       int capacity = 1;
       for (int i = 0; i < length; ++i) capacity *= strlen(MAP[digits[i]-'0']);
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
           if not digits: return []
           mapping = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
           result, path = [], []
           def dfs(index: int) -> None:
               if index == len(digits):
                   result.append("".join(path)); return
               for letter in mapping[int(digits[index])]:
                   path.append(letter); dfs(index + 1); path.pop()
           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       private static final String[] MAP = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
       public List<String> letterCombinations(String digits) {
           List<String> result = new ArrayList<>();
           if (digits.isEmpty()) return result;
           dfs(digits, 0, new StringBuilder(), result);
           return result;
       }
       private void dfs(String digits, int index, StringBuilder path, List<String> result) {
           if (index == digits.length()) { result.add(path.toString()); return; }
           for (char c : MAP[digits.charAt(index)-'0'].toCharArray()) {
               path.append(c); dfs(digits, index+1, path, result); path.deleteCharAt(path.length()-1);
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
           fn dfs(d: &[u8], i: usize, map: &[&str;10], path: &mut String, out: &mut Vec<String>) {
               if i == d.len() { out.push(path.clone()); return; }
               for c in map[(d[i]-b'0') as usize].chars() {
                   path.push(c); dfs(d, i+1, map, path, out); path.pop();
               }
           }
           let mut out = Vec::new(); let mut path = String::new();
           dfs(digits.as_bytes(), 0, &map, &mut path, &mut out); out
       }
   }

Go
~~

.. code-block:: go

   func letterCombinations(digits string) []string {
       if len(digits) == 0 { return []string{} }
       mapping := []string{"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"}
       result := []string{}; path := make([]byte, len(digits))
       var dfs func(int)
       dfs = func(index int) {
           if index == len(digits) { result = append(result, string(path)); return }
           for _, c := range []byte(mapping[digits[index]-'0']) { path[index] = c; dfs(index+1) }
       }
       dfs(0); return result
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
           for (const c of map[Number(digits[index])]) { path.push(c); dfs(index+1); path.pop(); }
       };
       dfs(0); return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private readonly string[] map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
       public IList<string> LetterCombinations(string digits) {
           var result = new List<string>();
           if (digits.Length == 0) return result;
           Dfs(digits, 0, new System.Text.StringBuilder(), result); return result;
       }
       private void Dfs(string digits, int index, System.Text.StringBuilder path, List<string> result) {
           if (index == digits.Length) { result.Add(path.ToString()); return; }
           foreach (char c in map[digits[index]-'0']) { path.Append(c); Dfs(digits,index+1,path,result); path.Length--; }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function letter_combinations(digits::String)
       isempty(digits) && return String[]
       mapping = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"]
       d = collect(digits); path = Char[]; result = String[]
       function dfs(index)
           if index > length(d); push!(result, join(path)); return; end
           for c in mapping[parse(Int, d[index]) + 1]
               push!(path, c); dfs(index + 1); pop!(path)
           end
       end
       dfs(1); result
   end

R
~

.. code-block:: r

   letterCombinations <- function(digits) {
       if (nchar(digits) == 0L) return(character())
       mapping <- c("","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz")
       d <- strsplit(digits, "", fixed = TRUE)[[1]]; result <- character(); path <- character()
       dfs <- function(index) {
           if (index > length(d)) { result <<- c(result, paste(path, collapse="")); return() }
           letters <- strsplit(mapping[[as.integer(d[[index]]) + 1L]], "", fixed=TRUE)[[1]]
           for (letter in letters) {
               path <<- c(path, letter); dfs(index + 1L); path <<- path[-length(path)]
           }
       }
       dfs(1L); result
   }
