0087. Scramble String
=====================

题目信息
--------

:题号: 0087
:难度: Hard
:主题: 字符串、区间动态规划、记忆化搜索
:原题: `LeetCode 0087 <https://leetcode.com/problems/scramble-string/>`_
:重点: 三维区间状态、交换与不交换转移、频次剪枝、失败状态缓存

题目重述
--------

给定两个等长非空小写字符串。允许递归地把字符串切成两个非空部分，并在每个节点选择保持左右顺序或交换左右部分，再对子串继续操作。判断第二个字符串能否由第一个字符串得到。

自建示例
--------

.. code-block:: text

   great -> rgeat：true
   先切 gr | eat，再交换 gr 的两个单字符。

   abcde -> caebd：false
   字符频次相同仍不足以保证存在一致的递归切分树。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string first, second;
       std::vector<std::vector<std::vector<int>>> memo;

       bool sameCharacters(int i, int j, int length) {
           std::array<int,26> count{};
           for (int offset = 0; offset < length; ++offset) {
               ++count[first[i + offset] - 'a'];
               --count[second[j + offset] - 'a'];
           }
           for (int value : count) if (value != 0) return false;
           return true;
       }

       bool equalRange(int i, int j, int length) {
           for (int offset = 0; offset < length; ++offset)
               if (first[i + offset] != second[j + offset]) return false;
           return true;
       }

       bool plainDfs(int i, int j, int length) {
           if (equalRange(i, j, length)) return true;
           if (!sameCharacters(i, j, length)) return false;
           for (int split = 1; split < length; ++split) {
               if (plainDfs(i, j, split) && plainDfs(i + split, j + split, length - split)) return true;
               if (plainDfs(i, j + length - split, split) &&
                   plainDfs(i + split, j, length - split)) return true;
           }
           return false;
       }

       bool memoDfs(int i, int j, int length) {
           int& cached = memo[i][j][length];
           if (cached != -1) return cached;
           if (equalRange(i, j, length)) return cached = 1;
           if (!sameCharacters(i, j, length)) return cached = 0;
           for (int split = 1; split < length; ++split) {
               bool keep = memoDfs(i, j, split) && memoDfs(i + split, j + split, length - split);
               bool swap = memoDfs(i, j + length - split, split) &&
                           memoDfs(i + split, j, length - split);
               if (keep || swap) return cached = 1;
           }
           return cached = 0;
       }

       bool bottomUp(const std::string& a, const std::string& b) {
           int n = a.size();
           std::vector dp(n, std::vector(n, std::vector<char>(n + 1)));
           for (int i = 0; i < n; ++i)
               for (int j = 0; j < n; ++j) dp[i][j][1] = a[i] == b[j];
           for (int length = 2; length <= n; ++length)
               for (int i = 0; i + length <= n; ++i)
                   for (int j = 0; j + length <= n; ++j)
                       for (int split = 1; split < length && !dp[i][j][length]; ++split)
                           dp[i][j][length] =
                               (dp[i][j][split] && dp[i + split][j + split][length - split]) ||
                               (dp[i][j + length - split][split] && dp[i + split][j][length - split]);
           return dp[0][0][n];
       }

   public:
       bool isScramble(std::string s1, std::string s2) {
           if (s1.size() != s2.size()) return false;
           first = std::move(s1); second = std::move(s2);
           int n = first.size();
           memo.assign(n, std::vector(n, std::vector<int>(n + 1, -1)));
           return memoDfs(0, 0, n);
       }
   };

题解
----

为什么不能只比较字符频次
~~~~~~~~~~~~~~~~~~~~~~

Scramble 操作不会改变字符多重集，所以频次相同是必要条件。但切分树还要求每个对应子区间能同时匹配；``abcde`` 与 ``caebd`` 频次相同，却找不到满足所有层级的切分。

三维状态保存什么
~~~~~~~~~~~~~~~~

``solve(i,j,length)`` 表示 ``s1[i:i+length]`` 能否变成 ``s2[j:j+length]``。两个区间长度始终相同，状态只需两个起点和一个长度；同一状态会从多个上层切分重复到达，因此需要缓存真假结果。

切分点为何只有两类对应
~~~~~~~~~~~~~~~~~~~~~~

在 ``split`` 处分割第一个区间后，根节点只允许保持或交换两个孩子：

.. code-block:: text

   不交换：A_left  -> B_left，  A_right -> B_right
   交换：  A_left  -> B_right， A_right -> B_left

不存在第三种对应。只要某个切分点的一类对应中两个子状态都为真，父状态就为真。

下标转移如何得到
~~~~~~~~~~~~~~~~

.. code-block:: text

   keep:
     solve(i,         j,         split)
     solve(i+split,   j+split,   length-split)

   swap:
     solve(i,         j+length-split, split)
     solve(i+split,   j,              length-split)

交换时，第一个左区间长度为 ``split``，因此对应第二个区间末尾同样长度的部分。

剪枝顺序为什么重要
~~~~~~~~~~~~~~~~

两个区间直接相等时立即成功，可省去所有切分。字符频次不同立即失败，因为任何后续交换都无法改变多重集。只有频次相同但内容不同的状态才枚举切分点。

.. list-table::
   :header-rows: 1

   * - 状态
     - 处理
   * - ``great`` 与 ``rgeat``
     - 频次相同，尝试切分
   * - ``gr`` 与 ``rg``
     - 在 1 处分割，交换两个单字符后成立
   * - ``eat`` 与 ``eat``
     - 直接相等，立即成功
   * - 父状态
     - 两个子状态都成功，返回真

失败状态为何也必须缓存
~~~~~~~~~~~~~~~~~~~~~~

大量区间组合最终为假，并会从不同切分路径反复访问。缓存若只记录成功状态，指数级重复仍然存在；三值语义必须区分未知、假、真。

自底向上遍历为何按长度递增
~~~~~~~~~~~~~~~~~~~~~~~~

长度为 1 的状态由字符相等决定。长度 ``length`` 的转移只读取更短的 ``split`` 与 ``length-split``，因此按长度从小到大填表满足全部依赖。

复杂度来源
~~~~~~~~~~

状态数 ``O(n³)``，每个状态最多枚举 ``O(n)`` 个切分点，时间 ``O(n⁴)``；频次检查常数为 26。缓存或 DP 使用 ``O(n³)`` 空间，递归深度 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   static char*memo;static char*a,*b;static int n;
   static int dfs(int i,int j,int len){int key=(i*n+j)*(n+1)+len;if(memo[key]!=-1)return memo[key];int count[26]={0},equal=1;for(int k=0;k<len;k++){count[a[i+k]-'a']++;count[b[j+k]-'a']--;if(a[i+k]!=b[j+k])equal=0;}if(equal)return memo[key]=1;for(int c=0;c<26;c++)if(count[c])return memo[key]=0;for(int s=1;s<len;s++)if((dfs(i,j,s)&&dfs(i+s,j+s,len-s))||(dfs(i,j+len-s,s)&&dfs(i+s,j,len-s)))return memo[key]=1;return memo[key]=0;}
   bool isScramble(char*s1,char*s2){if(strlen(s1)!=strlen(s2))return false;a=s1;b=s2;n=strlen(a);memo=malloc((size_t)n*n*(n+1));memset(memo,-1,(size_t)n*n*(n+1));int ans=dfs(0,0,n);free(memo);return ans;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isScramble(self, a: str, b: str) -> bool:
           from functools import lru_cache
           @lru_cache(None)
           def dfs(i,j,length):
               x,y=a[i:i+length],b[j:j+length]
               if x==y:return True
               if sorted(x)!=sorted(y):return False
               return any((dfs(i,j,s) and dfs(i+s,j+s,length-s)) or (dfs(i,j+length-s,s) and dfs(i+s,j,length-s)) for s in range(1,length))
           return len(a)==len(b) and dfs(0,0,len(a))

Java
~~~~

.. code-block:: java

   class Solution {String a,b;int[][][]memo;boolean dfs(int i,int j,int len){if(memo[i][j][len]!=-1)return memo[i][j][len]==1;int[]count=new int[26];boolean equal=true;for(int k=0;k<len;k++){count[a.charAt(i+k)-'a']++;count[b.charAt(j+k)-'a']--;if(a.charAt(i+k)!=b.charAt(j+k))equal=false;}if(equal){memo[i][j][len]=1;return true;}for(int x:count)if(x!=0){memo[i][j][len]=0;return false;}for(int s=1;s<len;s++)if((dfs(i,j,s)&&dfs(i+s,j+s,len-s))||(dfs(i,j+len-s,s)&&dfs(i+s,j,len-s))){memo[i][j][len]=1;return true;}memo[i][j][len]=0;return false;}public boolean isScramble(String s1,String s2){if(s1.length()!=s2.length())return false;a=s1;b=s2;int n=a.length();memo=new int[n][n][n+1];for(int[][]x:memo)for(int[]y:x)Arrays.fill(y,-1);return dfs(0,0,n);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_scramble(a:String,b:String)->bool{fn dfs(i:usize,j:usize,l:usize,a:&[u8],b:&[u8],memo:&mut Vec<Vec<Vec<i8>>>)->bool{if memo[i][j][l]!=-1{return memo[i][j][l]==1}if a[i..i+l]==b[j..j+l]{memo[i][j][l]=1;return true}let mut c=[0i32;26];for k in 0..l{c[(a[i+k]-b'a')as usize]+=1;c[(b[j+k]-b'a')as usize]-=1}if c.iter().any(|&x|x!=0){memo[i][j][l]=0;return false}for s in 1..l{if (dfs(i,j,s,a,b,memo)&&dfs(i+s,j+s,l-s,a,b,memo))||(dfs(i,j+l-s,s,a,b,memo)&&dfs(i+s,j,l-s,a,b,memo)){memo[i][j][l]=1;return true}}memo[i][j][l]=0;false}if a.len()!=b.len(){return false}let n=a.len();dfs(0,0,n,a.as_bytes(),b.as_bytes(),&mut vec![vec![vec![-1;n+1];n];n])}}

Go
~~

.. code-block:: go

   func isScramble(a,b string)bool{if len(a)!=len(b){return false};n:=len(a);memo:=make(map[[3]int]bool);seen:=make(map[[3]int]bool);var dfs func(int,int,int)bool;dfs=func(i,j,l int)bool{k:=[3]int{i,j,l};if seen[k]{return memo[k]};seen[k]=true;if a[i:i+l]==b[j:j+l]{memo[k]=true;return true};count:=[26]int{};for x:=0;x<l;x++{count[a[i+x]-'a']++;count[b[j+x]-'a']--};for _,v:=range count{if v!=0{return false}};for s:=1;s<l;s++{if dfs(i,j,s)&&dfs(i+s,j+s,l-s)||dfs(i,j+l-s,s)&&dfs(i+s,j,l-s){memo[k]=true;return true}};return false};return dfs(0,0,n)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isScramble(a:string,b:string):boolean{if(a.length!==b.length)return false;const memo=new Map<string,boolean>();const dfs=(i:number,j:number,l:number):boolean=>{const key=`${i},${j},${l}`;if(memo.has(key))return memo.get(key)!;if(a.slice(i,i+l)===b.slice(j,j+l)){memo.set(key,true);return true;}const c=Array(26).fill(0);for(let k=0;k<l;k++){c[a.charCodeAt(i+k)-97]++;c[b.charCodeAt(j+k)-97]--;}if(c.some(x=>x!==0)){memo.set(key,false);return false;}for(let s=1;s<l;s++)if((dfs(i,j,s)&&dfs(i+s,j+s,l-s))||(dfs(i,j+l-s,s)&&dfs(i+s,j,l-s))){memo.set(key,true);return true;}memo.set(key,false);return false;};return dfs(0,0,a.length);}

C#
~~

.. code-block:: csharp

   public class Solution {string a,b;Dictionary<(int,int,int),bool>memo=new();bool Dfs(int i,int j,int l){var k=(i,j,l);if(memo.TryGetValue(k,out bool v))return v;if(a.Substring(i,l)==b.Substring(j,l))return memo[k]=true;int[]c=new int[26];for(int x=0;x<l;x++){c[a[i+x]-'a']++;c[b[j+x]-'a']--;}if(c.Any(x=>x!=0))return memo[k]=false;for(int s=1;s<l;s++)if(Dfs(i,j,s)&&Dfs(i+s,j+s,l-s)||Dfs(i,j+l-s,s)&&Dfs(i+s,j,l-s))return memo[k]=true;return memo[k]=false;}public bool IsScramble(string s1,string s2){if(s1.Length!=s2.Length)return false;a=s1;b=s2;return Dfs(0,0,a.Length);}}

Julia
~~~~~

.. code-block:: julia

   function is_scramble(a::String,b::String)
       x=collect(a);y=collect(b);length(x)!=length(y)&&return false;memo=Dict{NTuple{3,Int},Bool}()
       function dfs(i,j,l)
           key=(i,j,l);haskey(memo,key)&&return memo[key]
           x[i:i+l-1]==y[j:j+l-1]&&return (memo[key]=true)
           count=zeros(Int,26);for k in 0:l-1;count[Int(x[i+k])-96]+=1;count[Int(y[j+k])-96]-=1;end
           any(!=(0),count)&&return (memo[key]=false)
           for s in 1:l-1;if (dfs(i,j,s)&&dfs(i+s,j+s,l-s))||(dfs(i,j+l-s,s)&&dfs(i+s,j,l-s));return (memo[key]=true);end;end
           memo[key]=false
       end;dfs(1,1,length(x))
   end

R
~

.. code-block:: r

   is_scramble <- function(a,b){x<-strsplit(a,"",fixed=TRUE)[[1]];y<-strsplit(b,"",fixed=TRUE)[[1]];if(length(x)!=length(y))return(FALSE);memo<-new.env(hash=TRUE,parent=emptyenv());dfs<-function(i,j,l){key<-paste(i,j,l,sep=",");if(exists(key,memo,inherits=FALSE))return(get(key,memo));if(identical(x[i:(i+l-1L)],y[j:(j+l-1L)])){assign(key,TRUE,memo);return(TRUE)};count<-integer(26);for(k in 0:(l-1L)){count[[utf8ToInt(x[[i+k]])-96L]]<-count[[utf8ToInt(x[[i+k]])-96L]]+1L;count[[utf8ToInt(y[[j+k]])-96L]]<-count[[utf8ToInt(y[[j+k]])-96L]]-1L};if(any(count!=0L)){assign(key,FALSE,memo);return(FALSE)};if(l>1L)for(s in 1:(l-1L))if((dfs(i,j,s)&&dfs(i+s,j+s,l-s))||(dfs(i,j+l-s,s)&&dfs(i+s,j,l-s))){assign(key,TRUE,memo);return(TRUE)};assign(key,FALSE,memo);FALSE};dfs(1L,1L,length(x))}
