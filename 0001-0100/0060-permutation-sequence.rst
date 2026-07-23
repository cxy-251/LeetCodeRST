0060. Permutation Sequence
==========================

题目信息
--------

:题号: 0060
:难度: Hard
:主题: 排列、字典序、阶乘分组、秩选择
:原题: `LeetCode 0060 <https://leetcode.com/problems/permutation-sequence/>`_
:重点: 一基序号、阶乘分块、候选数字删除、字典序定位

题目重述
--------

数字 ``1`` 到 ``n`` 各使用一次可以形成 ``n!`` 个排列。把这些排列按字典序从小到大排列，返回第 ``k`` 个排列对应的字符串。

约束为 ``1 <= n <= 9``、``1 <= k <= n!``。

自建示例
--------

.. code-block:: text

   输入：n = 5, k = 42
   输出："24531"

每个首位对应 ``4! = 24`` 个排列，因此第 42 个排列以 ``2`` 开头；继续按剩余阶乘分块可定位到 ``"24531"``。

.. code-block:: text

   输入：n = 4, k = 17
   输出："3412"

第 17 个排列位于以 ``3`` 开头的字典序分块中。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       void generateAll(std::string& current, int position, std::vector<std::string>& all) {
           if (position == static_cast<int>(current.size())) { all.push_back(current); return; }
           for (int i = position; i < static_cast<int>(current.size()); ++i) {
               std::swap(current[position], current[i]);
               generateAll(current, position + 1, all);
               std::swap(current[position], current[i]);
           }
       }

       std::string enumerateAndSort(int n, int k) {
           std::string current;
           for (int value = 1; value <= n; ++value) current.push_back('0' + value);
           std::vector<std::string> all;
           generateAll(current, 0, all);
           std::sort(all.begin(), all.end());
           return all[k - 1];
       }

       std::string repeatedNextPermutation(int n, int k) {
           std::string current;
           for (int value = 1; value <= n; ++value) current.push_back('0' + value);
           for (int step = 1; step < k; ++step)
               std::next_permutation(current.begin(), current.end());
           return current;
       }

       std::string factorialSelection(int n, int k) {
           std::vector<int> factorial(n + 1, 1);
           for (int i = 1; i <= n; ++i) factorial[i] = factorial[i - 1] * i;

           std::vector<int> available;
           for (int value = 1; value <= n; ++value) available.push_back(value);

           int rank = k - 1;
           std::string result;
           for (int remaining = n; remaining >= 1; --remaining) {
               int block = factorial[remaining - 1];
               int choice = rank / block;
               rank %= block;
               result.push_back('0' + available[choice]);
               available.erase(available.begin() + choice);
           }
           return result;
       }

   public:
       std::string getPermutation(int n, int k) {
           return factorialSelection(n, k);
       }
   };

题解
----

生成全部排列忽略了什么
~~~~~~~~~~~~~~~~~~~~

回溯生成并排序需要保存 ``n!`` 个长度为 ``n`` 的字符串。反复调用 next permutation 不保存全部结果，但仍要依次经过前 ``k-1`` 个排列。题目只要求一个秩对应的排列，应直接跳过整个字典序区块。

固定一位后为什么形成阶乘块
~~~~~~~~~~~~~~~~~~~~~~~~

当前有 ``remaining`` 个有序候选。固定下一位为某个候选后，其余数字有 ``(remaining-1)!`` 种排列。因此按下一位从小到大，全部排列被分成 ``remaining`` 个大小相等且连续的块。

为什么先把 k 减一
~~~~~~~~~~~~~~~~

题目使用一基序号 ``1..n!``，而块下标和数组下标从 0 开始。令 ``rank = k-1`` 后：

.. code-block:: text

   choice = rank / block_size
   rank   = rank % block_size

``choice`` 直接指出当前应选第几个可用数字；余数是进入该块后的零基秩。

n=4, k=9 的状态演化
~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 剩余候选
     - ``rank``
     - 块大小
     - 选择
   * - ``[1,2,3,4]``
     - 8
     - ``3! = 6``
     - ``8/6=1``，选择 2，块内秩 2
   * - ``[1,3,4]``
     - 2
     - ``2! = 2``
     - ``2/2=1``，选择 3，块内秩 0
   * - ``[1,4]``
     - 0
     - ``1! = 1``
     - 选择 1
   * - ``[4]``
     - 0
     - ``0! = 1``
     - 选择 4

得到 ``"2314"``。

为什么每次选择都不会越界
~~~~~~~~~~~~~~~~~~~~~~~~

进入一轮时 ``0 <= rank < remaining!``。除以 ``(remaining-1)!`` 得到 ``0 <= choice < remaining``，正好是候选数组合法下标；取余后得到的新秩小于下一轮块总数。

删除候选为何必要
~~~~~~~~~~~~~~~~

排列中每个数字只能使用一次。选中数字后从有序候选表删除，剩余候选仍保持升序，因此下一轮的块顺序仍与字典序一致。

为什么结果恰好是第 k 个排列
~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮通过整数除法排除 ``choice`` 个完整块，所有被排除排列都严格早于目标；随后用余数在目标块内部继续。归纳到最后一位，所选前缀始终是包含原始 ``rank`` 的唯一块，最终唯一排列就是第 ``k`` 个。

普通数组为何得到 O(n²)
~~~~~~~~~~~~~~~~~~~~~~

计算阶乘为 ``O(n)``，每轮选择为常数，但删除中间元素需要移动后缀，最多 ``O(n)``，共 ``n`` 轮，因此时间 ``O(n²)``。``n <= 9`` 时这是最清晰的实现；更大规模可用顺序统计树降为 ``O(n log n)``。

边界排列如何自然产生
~~~~~~~~~~~~~~~~~~~~

``k=1`` 时 ``rank=0``，每轮都选最小候选，得到升序排列；``k=n!`` 时 ``rank=n!-1``，每轮都选当前最大候选，得到降序排列，无需特殊分支。

复杂度来源
~~~~~~~~~~

阶乘分组方法时间 ``O(n²)``、额外空间 ``O(n)``。反复 next permutation 为 ``O(kn)``；生成全部排列需要 ``O(n·n!)`` 时间与空间。

九语言实现
----------

C
~

.. code-block:: c

   char*getPermutation(int n,int k){int fact[10];fact[0]=1;for(int i=1;i<=n;i++)fact[i]=fact[i-1]*i;int available[9];for(int i=0;i<n;i++)available[i]=i+1;char*out=malloc((size_t)n+1);int rank=k-1,count=n;for(int pos=0;pos<n;pos++){int block=fact[count-1],choice=rank/block;rank%=block;out[pos]=(char)('0'+available[choice]);for(int i=choice;i<count-1;i++)available[i]=available[i+1];count--;}out[n]='\0';return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def getPermutation(self, n: int, k: int) -> str:
           factorial = [1] * (n + 1)
           for i in range(1, n + 1): factorial[i] = factorial[i - 1] * i
           available, rank, result = list(range(1, n + 1)), k - 1, []
           for remaining in range(n, 0, -1):
               block = factorial[remaining - 1]
               choice, rank = divmod(rank, block)
               result.append(str(available.pop(choice)))
           return "".join(result)

Java
~~~~

.. code-block:: java

   class Solution {public String getPermutation(int n,int k){int[]fact=new int[n+1];fact[0]=1;List<Integer>a=new ArrayList<>();for(int i=1;i<=n;i++){fact[i]=fact[i-1]*i;a.add(i);}int rank=k-1;StringBuilder out=new StringBuilder();for(int remain=n;remain>=1;remain--){int block=fact[remain-1],choice=rank/block;rank%=block;out.append(a.remove(choice));}return out.toString();}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn get_permutation(n:i32,k:i32)->String{let n=n as usize;let mut fact=vec![1;n+1];for i in 1..=n{fact[i]=fact[i-1]*i}let mut a:(Vec<usize>)=(1..=n).collect();let mut rank=k as usize-1;let mut out=String::new();for remain in(1..=n).rev(){let block=fact[remain-1];let choice=rank/block;rank%=block;out.push(char::from(b'0'+a.remove(choice)as u8));}out}}

Go
~~

.. code-block:: go

   func getPermutation(n int,k int)string{fact:=make([]int,n+1);fact[0]=1;a:=make([]int,n);for i:=1;i<=n;i++{fact[i]=fact[i-1]*i;a[i-1]=i};rank:=k-1;out:=make([]byte,0,n);for remain:=n;remain>=1;remain--{block:=fact[remain-1];choice:=rank/block;rank%=block;out=append(out,byte('0'+a[choice]));a=append(a[:choice],a[choice+1:]...)};return string(out)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getPermutation(n:number,k:number):string{const fact=Array(n+1).fill(1),a=Array.from({length:n},(_,i)=>i+1);for(let i=1;i<=n;i++)fact[i]=fact[i-1]*i;let rank=k-1,out="";for(let remain=n;remain>=1;remain--){const block=fact[remain-1],choice=Math.floor(rank/block);rank%=block;out+=a.splice(choice,1)[0];}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public string GetPermutation(int n,int k){int[]fact=new int[n+1];fact[0]=1;var a=new List<int>();for(int i=1;i<=n;i++){fact[i]=fact[i-1]*i;a.Add(i);}int rank=k-1;var outp=new System.Text.StringBuilder();for(int remain=n;remain>=1;remain--){int block=fact[remain-1],choice=rank/block;rank%=block;outp.Append(a[choice]);a.RemoveAt(choice);}return outp.ToString();}}

Julia
~~~~~

.. code-block:: julia

   function get_permutation(n::Int,k::Int)
       fact=ones(Int,n+1);for i in 1:n;fact[i+1]=fact[i]*i;end
       available=collect(1:n);rank=k-1;out=IOBuffer()
       for remaining in n:-1:1;block=fact[remaining];choice=rank÷block+1;rank%=block;print(out,available[choice]);deleteat!(available,choice);end
       String(take!(out))
   end

R
~

.. code-block:: r

   get_permutation <- function(n,k){fact<-numeric(n+1L);fact[[1L]]<-1;for(i in seq_len(n))fact[[i+1L]]<-fact[[i]]*i;available<-seq_len(n);rank<-k-1;out<-character();for(remaining in n:1L){block<-fact[[remaining]];choice<-rank%/%block+1L;rank<-rank%%block;out<-c(out,as.character(available[[choice]]));available<-available[-choice]};paste0(out,collapse="")}
