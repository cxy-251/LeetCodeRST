C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<string>> Partition(string s) {
           int n = s.Length;
           bool[,] pal = new bool[n, n];
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   pal[start, end] = s[start] == s[end] &&
                       (end - start < 2 || pal[start + 1, end - 1]);
               }
           }
           var answers = new List<IList<string>>();
           var path = new List<string>();
           void Dfs(int start) {
               if (start == n) {
                   answers.Add(new List<string>(path));
                   return;
               }
               for (int end = start; end < n; ++end) {
                   if (!pal[start, end]) continue;
                   path.Add(s.Substring(start, end - start + 1));
                   Dfs(end + 1);
                   path.RemoveAt(path.Count - 1);
               }
           }
           Dfs(0);
           return answers;
       }
   }
