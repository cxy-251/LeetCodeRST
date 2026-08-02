0049. Group Anagrams
====================

题目信息
--------

:题号: 0049
:难度: Medium
:主题: 字符串、哈希表、规范签名、字符频次
:原题: `LeetCode 0049 <https://leetcode.com/problems/group-anagrams/>`_
:重点: 异位词等价关系、排序签名、频次签名、完整分组

题目重述
--------

给定小写英文字母字符串数组 ``strs``，把互为字母异位词的字符串放入同一组。两个字符串互为异位词，当且仅当它们包含完全相同的字符及出现次数。每个输入字符串都必须出现在恰好一个分组中；组间和组内顺序均不限，重复字符串不能丢失。

约束为 ``1 <= strs.length <= 10^4``、``0 <= strs[i].length <= 100``。

自建示例
--------

.. code-block:: text

   输入：strs = ["arc","car","rat","tar","elbow","below","arc"]
   输出：[["arc","car","arc"],["rat","tar"],["elbow","below"]]

``"arc"`` 出现两次，因此对应分组中也必须保留两次；输出分组与组内次序可以不同。

.. code-block:: text

   输入：strs = ["","b",""]
   输出：[["",""],["b"]]

两个空字符串具有相同字符频次，应进入同一组。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <string>
   #include <unordered_map>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       bool areAnagrams(const std::string& a, const std::string& b) {
           if (a.size() != b.size()) return false;
           std::array<int,26> count{};
           for (char ch : a) ++count[ch - 'a'];
           for (char ch : b) if (--count[ch - 'a'] < 0) return false;
           return true;
       }

       std::vector<std::vector<std::string>> pairwise(const std::vector<std::string>& words) {
           std::vector<std::vector<std::string>> groups;
           for (const auto& word : words) {
               bool placed = false;
               for (auto& group : groups) {
                   if (areAnagrams(word, group[0])) { group.push_back(word); placed = true; break; }
               }
               if (!placed) groups.push_back({word});
           }
           return groups;
       }

       std::vector<std::vector<std::string>> sortedKey(const std::vector<std::string>& words) {
           std::unordered_map<std::string,std::vector<std::string>> groups;
           for (const auto& word : words) {
               std::string key = word;
               std::sort(key.begin(), key.end());
               groups[key].push_back(word);
           }
           std::vector<std::vector<std::string>> result;
           for (auto& entry : groups) result.push_back(std::move(entry.second));
           return result;
       }

       std::string frequencyKey(const std::string& word) {
           std::array<int,26> count{};
           for (char ch : word) ++count[ch - 'a'];
           std::string key;
           for (int value : count) { key.push_back('#'); key += std::to_string(value); }
           return key;
       }

       std::vector<std::vector<std::string>> countKey(const std::vector<std::string>& words) {
           std::unordered_map<std::string,int> index;
           std::vector<std::vector<std::string>> result;
           for (const auto& word : words) {
               std::string key = frequencyKey(word);
               auto [it, inserted] = index.emplace(key, static_cast<int>(result.size()));
               if (inserted) result.push_back({});
               result[it->second].push_back(word);
           }
           return result;
       }

   public:
       std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
           return countKey(strs);
       }
   };

题解
----

为什么两两比较会重复统计
~~~~~~~~~~~~~~~~~~~~~~~~

把每个新字符串与已有组代表逐一比较，需要反复构造或检查字符频次；组数接近输入数时会退化到平方级。需要为每个字符串一次性计算与排列顺序无关的规范签名。

排序字符串为何是合法签名
~~~~~~~~~~~~~~~~~~~~~~~~

异位词排序后得到相同字符序列；非异位词至少有一个字符或次数不同，排序结果不同。因此排序后的字符串可直接作为哈希键。长度为 ``k`` 的字符串计算键需 ``O(k log k)``。

频次向量为何更直接
~~~~~~~~~~~~~~~~~~

题目字符域固定为 26 个小写字母。长度 26 的向量中，第 ``d`` 项记录对应字母次数。两个字符串互为异位词，当且仅当 26 项逐项相等；计算只需扫描字符串一次。

签名如何安全序列化
~~~~~~~~~~~~~~~~~~

直接拼接十进制次数会产生歧义，例如 ``[1,11]`` 与 ``[11,1]``。在每项前加入分隔符，形成 ``#1#11...``，即可保留维度边界。也可在支持结构哈希的语言中直接使用数组或元组键。

哈希表状态如何形成分组
~~~~~~~~~~~~~~~~~~~~~~

``index[key]`` 保存签名对应的结果组下标。首次出现签名时新建空组并登记编号；之后相同签名的字符串直接追加。字符串本身不被排序或修改，所以重复字符串和原始内容都完整保留。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 字符串
     - 签名关系
     - 动作
   * - ``eat``
     - 新签名
     - 建立组 0
   * - ``tea``
     - 与 ``eat`` 相同
     - 追加到组 0
   * - ``tan``
     - 新签名
     - 建立组 1
   * - ``ate``
     - 与 ``eat`` 相同
     - 追加到组 0

为什么分组不重不漏
~~~~~~~~~~~~~~~~~~

每个输入字符串恰好计算一次签名并追加一次，因此不会遗漏或复制。签名相等当且仅当异位词关系成立，所以同组内任意字符串互为异位词，不同组签名不同，不能互为异位词。

复杂度来源
~~~~~~~~~~

设字符串总字符数为 ``C``、字符串数量为 ``n``、最长长度为 ``k``。排序键时间 ``O(n*k log k)``；频次键时间 ``O(C)``，键和结果索引额外空间 ``O(n)``，不计返回字符串引用。

九语言实现
----------

C
~

.. code-block:: c

   static void key_of(const char*s,char*key){int count[26]={0};for(int i=0;s[i];i++)count[s[i]-'a']++;int pos=0;for(int i=0;i<26;i++)pos+=sprintf(key+pos,"#%d",count[i]);}
   char***groupAnagrams(char**strs,int n,int*returnSize,int**returnColumnSizes){char**keys=malloc((size_t)n*sizeof(char*));char***groups=malloc((size_t)n*sizeof(char**));int*sizes=calloc((size_t)n,sizeof(int)),groupCount=0;for(int i=0;i<n;i++){char key[300];key_of(strs[i],key);int g=-1;for(int j=0;j<groupCount;j++)if(strcmp(keys[j],key)==0){g=j;break;}if(g<0){g=groupCount++;keys[g]=strdup(key);groups[g]=malloc((size_t)n*sizeof(char*));}groups[g][sizes[g]++]=strs[i];}for(int i=0;i<groupCount;i++)free(keys[i]);free(keys);*returnSize=groupCount;*returnColumnSizes=sizes;return groups;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
           groups = {}
           for word in strs:
               count = [0] * 26
               for ch in word: count[ord(ch)-97] += 1
               groups.setdefault(tuple(count), []).append(word)
           return list(groups.values())

Java
~~~~

.. code-block:: java

   class Solution {public List<List<String>> groupAnagrams(String[]strs){Map<String,List<String>>groups=new HashMap<>();for(String word:strs){int[]count=new int[26];for(char ch:word.toCharArray())count[ch-'a']++;StringBuilder key=new StringBuilder();for(int v:count)key.append('#').append(v);groups.computeIfAbsent(key.toString(),k->new ArrayList<>()).add(word);}return new ArrayList<>(groups.values());}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn group_anagrams(strs:Vec<String>)->Vec<Vec<String>>{use std::collections::HashMap;let mut groups:HashMap<[u16;26],Vec<String>>=HashMap::new();for word in strs{let mut key=[0u16;26];for b in word.bytes(){key[(b-b'a')as usize]+=1}groups.entry(key).or_default().push(word)}groups.into_values().collect()}}

Go
~~

.. code-block:: go

   func groupAnagrams(strs []string)[][]string{groups:=map[[26]int][]string{};for _,word:=range strs{var key[26]int;for _,ch:=range []byte(word){key[ch-'a']++};groups[key]=append(groups[key],word)};result:=[][]string{};for _,group:=range groups{result=append(result,group)};return result}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function groupAnagrams(strs:string[]):string[][]{const groups=new Map<string,string[]>();for(const word of strs){const count=Array(26).fill(0);for(const ch of word)count[ch.charCodeAt(0)-97]++;const key=count.join("#");if(!groups.has(key))groups.set(key,[]);groups.get(key)!.push(word);}return [...groups.values()];}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<IList<string>> GroupAnagrams(string[]strs){var groups=new Dictionary<string,IList<string>>();foreach(string word in strs){int[]count=new int[26];foreach(char ch in word)count[ch-'a']++;string key=string.Join("#",count);if(!groups.ContainsKey(key))groups[key]=new List<string>();groups[key].Add(word);}return groups.Values.ToList();}}

Julia
~~~~~

.. code-block:: julia

   function group_anagrams(words::Vector{String})
       groups=Dict{NTuple{26,Int},Vector{String}}()
       for word in words;count=zeros(Int,26);for ch in word;count[Int(ch)-Int('a')+1]+=1;end;key=Tuple(count);push!(get!(groups,key,String[]),word);end
       collect(values(groups))
   end

R
~

.. code-block:: r

   group_anagrams <- function(words){groups<-list();indices<-new.env(hash=TRUE,parent=emptyenv());for(word in words){count<-integer(26);chars<-strsplit(word,"")[[1]];if(length(chars)>0L)for(ch in chars){i<-utf8ToInt(ch)-96L;count[[i]]<-count[[i]]+1L};key<-paste(count,collapse="#");if(!exists(key,indices,inherits=FALSE)){groups[[length(groups)+1L]]<-character();assign(key,length(groups),indices)};g<-get(key,indices);groups[[g]]<-c(groups[[g]],word)};groups}
