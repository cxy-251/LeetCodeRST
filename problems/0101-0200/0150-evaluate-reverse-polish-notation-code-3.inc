Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn eval_rpn(tokens: Vec<String>) -> i32 {
           let mut stack: Vec<i64> = Vec::with_capacity(tokens.len());

           for token in tokens {
               match token.as_str() {
                   "+" | "-" | "*" | "/" => {
                       let right = stack.pop().unwrap();
                       let left = stack.pop().unwrap();
                       let value = match token.as_str() {
                           "+" => left + right,
                           "-" => left - right,
                           "*" => left * right,
                           _ => left / right,
                       };
                       stack.push(value);
                   }
                   _ => stack.push(token.parse::<i64>().unwrap()),
               }
           }

           stack[0] as i32
       }
   }

Go
~~

.. code-block:: go

   import "strconv"

   func evalRPN(tokens []string) int {
       stack := make([]int64, 0, len(tokens))

       for _, token := range tokens {
           if token != "+" && token != "-" && token != "*" && token != "/" {
               value, _ := strconv.ParseInt(token, 10, 64)
               stack = append(stack, value)
               continue
           }

           right := stack[len(stack)-1]
           left := stack[len(stack)-2]
           stack = stack[:len(stack)-2]

           var value int64
           switch token {
           case "+":
               value = left + right
           case "-":
               value = left - right
           case "*":
               value = left * right
           default:
               value = left / right
           }
           stack = append(stack, value)
       }

       return int(stack[0])
   }
