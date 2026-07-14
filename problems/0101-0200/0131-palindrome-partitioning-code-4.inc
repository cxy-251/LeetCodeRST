Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<List<String>> partition(String s) {
           int n = s.length();
           boolean[][] palindrome = new boolean[n][n];
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   palindrome[start][end] =
                       s.charAt(start) == s.charAt(end) &&
                       (end - start < 2 || palindrome[start + 1][end - 1]);
               }
           }

           List<List<String>> answers = new ArrayList<>();
           backtrack(s, 0, palindrome, new ArrayList<>(), answers);
           return answers;
       }

       private void backtrack(
           String s,
           int start,
           boolean[][] palindrome,
           List<String> path,
           List<List<String>> answers
       ) {
           if (start == s.length()) {
               answers.add(new ArrayList<>(path));
               return;
           }
           for (int end = start; end < s.length(); ++end) {
               if (!palindrome[start][end]) continue;
               path.add(s.substring(start, end + 1));
               backtrack(s, end + 1, palindrome, path, answers);
               path.remove(path.size() - 1);
           }
       }
   }
