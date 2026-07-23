0093. Restore IP Addresses
==========================

题目信息
--------

:题号: 0093
:难度: Medium
:主题: 字符串、回溯、固定分段、长度剪枝
:原题: `LeetCode 0093 <https://leetcode.com/problems/restore-ip-addresses/>`_
:重点: 四段状态、剩余长度上下界、前导零、增量数值构造

题目重述
--------

给定只含数字的字符串，不改变字符顺序、不删除字符，只插入三个点，返回全部合法 IPv4 地址。地址恰好四段；每段长度 1 至 3，数值在 ``0..255``；除单独的 ``0`` 外，段不能有前导零。长度不在 ``4..12`` 时必然无解。

自建示例
--------

.. code-block:: text

   "25525511135" -> ["255.255.11.135", "255.255.111.35"]
   "010010"      -> ["0.10.0.10", "0.100.1.0"]

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool valid(const std::string& s, int start, int length) {
           if (length > 1 && s[start] == '0') return false;
           int value = 0;
           for (int i = 0; i < length; ++i) value = value * 10 + s[start + i] - '0';
           return value <= 255;
       }

       std::vector<std::string> enumerateDots(const std::string& s) {
           std::vector<std::string> result;
           int n = s.size();
           for (int a = 1; a <= 3; ++a)
               for (int b = 1; b <= 3; ++b)
                   for (int c = 1; c <= 3; ++c) {
                       int d = n - a - b - c;
                       if (d < 1 || d > 3) continue;
                       if (!valid(s,0,a) || !valid(s,a,b) || !valid(s,a+b,c) || !valid(s,a+b+c,d)) continue;
                       result.push_back(s.substr(0,a)+"."+s.substr(a,b)+"."+s.substr(a+b,c)+"."+s.substr(a+b+c,d));
                   }
           return result;
       }

       void substringDfs(const std::string& s, int index, std::vector<std::string>& parts,
                         std::vector<std::string>& result) {
           if (parts.size() == 4) {
               if (index == static_cast<int>(s.size()))
                   result.push_back(parts[0]+"."+parts[1]+"."+parts[2]+"."+parts[3]);
               return;
           }
           for (int length = 1; length <= 3 && index + length <= static_cast<int>(s.size()); ++length) {
               if (!valid(s,index,length)) continue;
               parts.push_back(s.substr(index,length));
               substringDfs(s,index+length,parts,result);
               parts.pop_back();
           }
       }

       void prunedDfs(const std::string& s, int index, int depth,
                      std::vector<std::string>& parts, std::vector<std::string>& result) {
           int parts_left = 4 - depth;
           int chars_left = s.size() - index;
           if (chars_left < parts_left || chars_left > 3 * parts_left) return;
           if (depth == 4) {
               result.push_back(parts[0]+"."+parts[1]+"."+parts[2]+"."+parts[3]);
               return;
           }
           int value = 0;
           for (int length = 1; length <= 3 && index + length <= static_cast<int>(s.size()); ++length) {
               if (length > 1 && s[index] == '0') break;
               value = value * 10 + s[index + length - 1] - '0';
               if (value > 255) break;
               parts.push_back(s.substr(index,length));
               prunedDfs(s,index+length,depth+1,parts,result);
               parts.pop_back();
           }
       }

   public:
       std::vector<std::string> restoreIpAddresses(std::string s) {
           std::vector<std::string> result, parts;
           prunedDfs(s,0,0,parts,result);
           return result;
       }
   };

题解
----

搜索空间为什么由段长决定
~~~~~~~~~~~~~~~~~~~~~~

合法地址不改变字符顺序，每个答案唯一对应四个段长。每段长度只能为 1、2、3，因此可以枚举前三段长度，第四段由总长度确定；回溯则把同一过程写成四层选择树。

状态保存什么
~~~~~~~~~~~~

``dfs(index,depth)`` 表示前 ``index`` 个字符已经形成 ``depth`` 个合法段。``parts`` 保存这些段的文本。下一层只需要选择当前段长度，字符覆盖范围由 ``index`` 唯一确定，不需要额外访问标记。

剩余长度如何剪枝
~~~~~~~~~~~~~~~~

设剩余段数 ``parts_left=4-depth``，剩余字符数 ``chars_left=n-index``。每段至少一位、最多三位，必要条件是：

.. code-block:: text

   parts_left <= chars_left <= 3 * parts_left

不满足时，无论后续如何选择都无法恰好消费全部字符，可以立即返回。

前导零为何直接停止更长段
~~~~~~~~~~~~~~~~~~~~~~

若当前首字符为 ``0``，长度 1 的段 ``0`` 合法；长度 2 或 3 都含前导零。枚举长度递增，因此处理完一位后可以 ``break``，无需继续检查。

增量数值为何可以在超过 255 后停止
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

段值按 ``value=value*10+digit`` 递增构造。数字字符非负，长度增加后值不会减小；一旦超过 255，更长段必然也超过 255，当前循环可以停止。

``010010`` 的局部状态
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 前缀
     - 选择
     - 结果
   * - ``0...``
     - 首段只能取 ``0``
     - 拒绝 ``01``、``010``
   * - ``10...``
     - 可取 ``10`` 或 ``100``
     - 形成两类分支
   * - ``0...``
     - 再次只能取一位
     - 得到 ``0.10.0.10``
   * - ``1...``
     - 最后取 ``1.0``
     - 得到 ``0.100.1.0``

为什么深度四时可以直接提交
~~~~~~~~~~~~~~~~~~~~~~~~

进入状态前已执行长度剪枝。``depth==4`` 时剩余段数为 0，剪枝只有在剩余字符数也为 0 时才允许继续，因此四段恰好覆盖全部字符串。各段在选择时已经通过前导零和值范围检查。

为什么结果不重不漏
~~~~~~~~~~~~~~~~~~

任意合法地址有唯一四段长度序列，算法会逐层枚举该序列，因此不会遗漏。两条不同递归路径首次不同的段长会产生不同点位置，所以不会生成相同地址。

复杂度来源
~~~~~~~~~~

有效输入长度最多 12，递归深度固定为 4，每层最多三个候选，搜索节点具有常数上界；更一般地可写为 ``O(3^4)``。路径和递归栈最多保存四段，除输出外为常数空间。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(char*s,int n,int index,int depth,int*starts,int*sizes,char***out,int*count){int left=4-depth,chars=n-index;if(chars<left||chars>3*left)return;if(depth==4){char*row=malloc(16);int w=0;for(int p=0;p<4;p++){if(p)row[w++]='.';memcpy(row+w,s+starts[p],sizes[p]);w+=sizes[p];}row[w]='\0';(*out)[(*count)++]=row;return;}int value=0;for(int len=1;len<=3&&index+len<=n;len++){if(len>1&&s[index]=='0')break;value=value*10+s[index+len-1]-'0';if(value>255)break;starts[depth]=index;sizes[depth]=len;dfs(s,n,index+len,depth+1,starts,sizes,out,count);}}
   char**restoreIpAddresses(char*s,int*returnSize){char**out=malloc(81*sizeof(char*));int starts[4],sizes[4],count=0;dfs(s,strlen(s),0,0,starts,sizes,&out,&count);*returnSize=count;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def restoreIpAddresses(self, s: str) -> list[str]:
           result, parts = [], []
           def dfs(index: int) -> None:
               left = 4 - len(parts); chars = len(s) - index
               if chars < left or chars > 3 * left: return
               if len(parts) == 4: result.append(".".join(parts)); return
               value = 0
               for length in range(1, 4):
                   if index + length > len(s): break
                   if length > 1 and s[index] == "0": break
                   value = value * 10 + int(s[index + length - 1])
                   if value > 255: break
                   parts.append(s[index:index+length]); dfs(index+length); parts.pop()
           dfs(0); return result

Java
~~~~

.. code-block:: java

   class Solution {List<String>out=new ArrayList<>(),parts=new ArrayList<>();String s;void dfs(int i){int left=4-parts.size(),chars=s.length()-i;if(chars<left||chars>3*left)return;if(parts.size()==4){out.add(String.join(".",parts));return;}int value=0;for(int len=1;len<=3&&i+len<=s.length();len++){if(len>1&&s.charAt(i)=='0')break;value=value*10+s.charAt(i+len-1)-'0';if(value>255)break;parts.add(s.substring(i,i+len));dfs(i+len);parts.remove(parts.size()-1);}}public List<String> restoreIpAddresses(String s){this.s=s;dfs(0);return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn restore_ip_addresses(s:String)->Vec<String>{fn dfs(s:&str,i:usize,p:&mut Vec<String>,o:&mut Vec<String>){let left=4-p.len();let chars=s.len()-i;if chars<left||chars>3*left{return}if p.len()==4{o.push(p.join("."));return}let b=s.as_bytes();let mut v=0;for len in 1..=3{if i+len>s.len(){break}if len>1&&b[i]==b'0'{break}v=v*10+(b[i+len-1]-b'0')as i32;if v>255{break}p.push(s[i..i+len].into());dfs(s,i+len,p,o);p.pop();}}let mut o=vec![];dfs(&s,0,&mut vec![],&mut o);o}}

Go
~~

.. code-block:: go

   func restoreIpAddresses(s string)[]string{o:=[]string{};parts:=[]string{};var dfs func(int);dfs=func(i int){left,chars:=4-len(parts),len(s)-i;if chars<left||chars>3*left{return};if len(parts)==4{o=append(o,strings.Join(parts,"."));return};v:=0;for l:=1;l<=3&&i+l<=len(s);l++{if l>1&&s[i]=='0'{break};v=v*10+int(s[i+l-1]-'0');if v>255{break};parts=append(parts,s[i:i+l]);dfs(i+l);parts=parts[:len(parts)-1]}};dfs(0);return o}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function restoreIpAddresses(s:string):string[]{const out:string[]=[],parts:string[]=[];const dfs=(i:number)=>{const left=4-parts.length,chars=s.length-i;if(chars<left||chars>3*left)return;if(parts.length===4){out.push(parts.join('.'));return;}let v=0;for(let len=1;len<=3&&i+len<=s.length;len++){if(len>1&&s[i]==='0')break;v=v*10+Number(s[i+len-1]);if(v>255)break;parts.push(s.slice(i,i+len));dfs(i+len);parts.pop();}};dfs(0);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {List<string>o=new(),p=new();string s;void Dfs(int i){int left=4-p.Count,chars=s.Length-i;if(chars<left||chars>3*left)return;if(p.Count==4){o.Add(string.Join(".",p));return;}int v=0;for(int len=1;len<=3&&i+len<=s.Length;len++){if(len>1&&s[i]=='0')break;v=v*10+s[i+len-1]-'0';if(v>255)break;p.Add(s.Substring(i,len));Dfs(i+len);p.RemoveAt(p.Count-1);}}public IList<string> RestoreIpAddresses(string s){this.s=s;Dfs(0);return o;}}

Julia
~~~~~

.. code-block:: julia

   function restore_ip_addresses(s::String)
       b=codeunits(s);out=String[];parts=String[]
       function dfs(i);left=4-length(parts);chars=length(b)-i+1;(chars<left||chars>3left)&&return;if length(parts)==4;push!(out,join(parts,"."));return;end;v=0;for len in 1:3;i+len-1>length(b)&&break;len>1&&b[i]==UInt8('0')&&break;v=10v+Int(b[i+len-1]-UInt8('0'));v>255&&break;push!(parts,String(b[i:i+len-1]));dfs(i+len);pop!(parts);end;end
       dfs(1);out
   end

R
~

.. code-block:: r

   restore_ip_addresses <- function(s){d<-strsplit(s,"",fixed=TRUE)[[1]];out<-character();parts<-character();dfs<-function(i){left<-4L-length(parts);chars<-length(d)-i+1L;if(chars<left||chars>3L*left)return();if(length(parts)==4L){out<<-c(out,paste(parts,collapse="."));return()};v<-0L;for(len in 1:3){if(i+len-1L>length(d))break;if(len>1L&&d[[i]]=="0")break;v<-10L*v+as.integer(d[[i+len-1L]]);if(v>255L)break;parts<<-c(parts,paste0(d[i:(i+len-1L)],collapse=""));dfs(i+len);parts<<-head(parts,-1L)}};dfs(1L);out}
