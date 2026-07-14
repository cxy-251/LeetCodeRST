C
~

.. code-block:: c

   #include <stddef.h>
   #include <string.h>

   int compareVersion(char *version1, char *version2) {
       size_t length1 = strlen(version1);
       size_t length2 = strlen(version2);
       size_t position1 = 0;
       size_t position2 = 0;

       while (position1 < length1 || position2 < length2) {
           size_t end1 = position1;
           while (end1 < length1 && version1[end1] != '.') {
               ++end1;
           }
           size_t significant1 = position1;
           while (
               significant1 < end1 &&
               version1[significant1] == '0'
           ) {
               ++significant1;
           }

           size_t end2 = position2;
           while (end2 < length2 && version2[end2] != '.') {
               ++end2;
           }
           size_t significant2 = position2;
           while (
               significant2 < end2 &&
               version2[significant2] == '0'
           ) {
               ++significant2;
           }

           size_t digits1 = end1 - significant1;
           size_t digits2 = end2 - significant2;
           if (digits1 != digits2) {
               return digits1 < digits2 ? -1 : 1;
           }

           for (size_t offset = 0; offset < digits1; ++offset) {
               char left = version1[significant1 + offset];
               char right = version2[significant2 + offset];
               if (left != right) {
                   return left < right ? -1 : 1;
               }
           }

           position1 = end1 < length1 ? end1 + 1 : length1;
           position2 = end2 < length2 ? end2 + 1 : length2;
       }

       return 0;
   }

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <string>

   class Solution {
   public:
       int compareVersion(
           std::string version1,
           std::string version2
       ) {
           std::size_t position1 = 0;
           std::size_t position2 = 0;

           while (
               position1 < version1.size() ||
               position2 < version2.size()
           ) {
               const Segment left = readSegment(version1, position1);
               const Segment right = readSegment(version2, position2);

               if (left.length != right.length) {
                   return left.length < right.length ? -1 : 1;
               }
               for (
                   std::size_t offset = 0;
                   offset < left.length;
                   ++offset
               ) {
                   char first = version1[left.start + offset];
                   char second = version2[right.start + offset];
                   if (first != second) {
                       return first < second ? -1 : 1;
                   }
               }

               position1 = left.next;
               position2 = right.next;
           }

           return 0;
       }

   private:
       struct Segment {
           std::size_t start;
           std::size_t length;
           std::size_t next;
       };

       static Segment readSegment(
           const std::string& version,
           std::size_t position
       ) {
           std::size_t end = position;
           while (end < version.size() && version[end] != '.') {
               ++end;
           }

           std::size_t significant = position;
           while (
               significant < end &&
               version[significant] == '0'
           ) {
               ++significant;
           }

           return {
               significant,
               end - significant,
               end < version.size() ? end + 1 : version.size(),
           };
       }
   };
