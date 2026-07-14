C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<std::string>> partition(std::string s) {
           int n = static_cast<int>(s.size());
           std::vector palindrome(n, std::vector<bool>(n, false));
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   palindrome[start][end] =
                       s[start] == s[end] &&
                       (end - start < 2 || palindrome[start + 1][end - 1]);
               }
           }

           std::vector<std::vector<std::string>> answers;
           std::vector<std::string> path;
           auto dfs = [&](auto&& self, int start) -> void {
               if (start == n) {
                   answers.push_back(path);
                   return;
               }
               for (int end = start; end < n; ++end) {
                   if (!palindrome[start][end]) continue;
                   path.push_back(s.substr(start, end - start + 1));
                   self(self, end + 1);
                   path.pop_back();
               }
           };
           dfs(dfs, 0);
           return answers;
       }
   };
