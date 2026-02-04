# MCQ Test Answers

## Question 25
**Question:** In Java, which of the following is inherited by a subinterface from its superinterface?
1. Abstract methods
2. Default methods
3. Constant fields
4. Static methods

**Correct Answer:** 1, 2, and 3

**Explanation:** In Java, when a subinterface extends a superinterface, it inherits:
- Abstract methods ✓
- Default methods ✓
- Constant fields (all fields in interfaces are implicitly public static final) ✓
- Static methods are NOT inherited ✗

---

## Question 26
**Question:** Which of these OOP concepts is depicted in the following statements:
- `int max1 = MathUtil.max(10, 23);`
- `double max2 = MathUtil.max(10.34, 2.89);`

**Correct Answer:** Method Overloading

**Explanation:** This demonstrates method overloading where the same method name `max` is used with different parameter types (int vs double).

---

## Question 27
**Question:** Which of the following scheduling algorithm has the highest CPU overhead?

**Correct Answer:** Shortest job first

**Explanation:** Shortest Job First (SJF), especially in its preemptive form (Shortest Remaining Time First), has high CPU overhead because it requires:
- Constant monitoring of remaining burst times
- Frequent recalculation to determine which process has the shortest remaining time
- More context switches compared to simpler algorithms

Note: While Round-robin also has overhead from frequent context switches, SJF's overhead from continuous evaluation and decision-making is generally considered higher.

---

## Question 28
**Question:** Calculate the average waiting time using preemptive Shortest Job First (SJF) algorithm.

| Process | Service time | Arrival time |
|---------|--------------|--------------|
| P1      | 8            | 0            |
| P2      | 4            | 1            |
| P3      | 9            | 2            |
| P4      | 5            | 3            |

**Correct Answer:** 6.5

**Explanation:**
Execution timeline with preemptive SJF (Shortest Remaining Time First):
- Time 0-1: P1 runs (1 unit completed, 7 remaining)
- Time 1-5: P2 arrives and preempts P1 (P2 has 4 < P1's 7). P2 runs completely
- Time 5-10: P4 runs completely (P4 has 5 < P1's 7 < P3's 9)
- Time 10-17: P1 runs remaining 7 units
- Time 17-26: P3 runs completely (9 units)

Waiting times:
- P1: (10 - 1) = 9 (arrived at 0, waited from time 1 to time 10)
- P2: (1 - 1) = 0 (arrived at 1, started immediately)
- P3: (17 - 2) = 15 (arrived at 2, started at 17)
- P4: (5 - 3) = 2 (arrived at 3, started at 5)

Average waiting time = (9 + 0 + 15 + 2) / 4 = 26 / 4 = **6.5**

---

## Question 29
**Question:** What is the output of the following C++ code:
```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 16;
    for (; i; i >>= 1) {
        if (i = 5) {
            cout << "world ";
            break;
        }
        cout << i << " ";
    }
}
```

**Correct Answer:** world

**Explanation:** The code has a bug. In the if statement `if (i = 5)`, the single `=` is an assignment operator, not a comparison. So:
1. In the first iteration, `i` is assigned the value 5
2. Since 5 is a truthy value, the if condition evaluates to true
3. It prints "world " and breaks immediately

This is a common C++ pitfall where `=` (assignment) is confused with `==` (comparison).

---

## Question 30
**Question:** In Networking, which of the following is used to translate the Internet domain names and hostnames to an IP address?

**Correct Answer:** Domain name server

**Explanation:** DNS (Domain Name Server/System) is specifically designed to translate human-readable domain names (like www.example.com) into IP addresses (like 192.0.2.1) that computers use to identify each other on the network.

---

## Question 31
**Question:** In Data structures, what is the average case complexity analysis for the following code (bubble sort):

```java
public void sort(int[] arr) {
    boolean swapped = true;
    int j = 0;
    int tmp;
    
    while (swapped) {
        swapped = false;
        j++;
        for (int i = 0; i < arr.length - j; i++) {
            if (arr[i] > arr[i + 1]) {
                tmp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = tmp;
                swapped = true;
            }
        }
    }
}
```

**Correct Answer:** O(N^2)

**Explanation:** This is a bubble sort algorithm. The time complexity is:
- Worst case: O(N²)
- Average case: O(N²)
- Best case: O(N) when already sorted

The average case is O(N²) because the nested loops typically run approximately N times each.

---

## Question 32
**Question:** In C or C++, which of the following operations is not supported by pointers?

**Correct Answer:** Addition of two pointer variables

**Explanation:** 
Valid pointer operations:
- Increment/Decrement: `ptr++`, `ptr--` ✓
- Addition of integer to pointer: `ptr + 5` ✓
- Subtraction of two pointers: `ptr1 - ptr2` ✓ (gives distance between them)

Invalid operation:
- Addition of two pointers: `ptr1 + ptr2` ✗ (This operation doesn't have a meaningful interpretation)

---

## Question 33
**Question:** Based on the following tables, what is the output of these SQL queries:

Tables:
- PRODUCT: (PID, PNAME, CATEGORY)
  - 1, Mango, 50
  - 2, Banana, 50
  - 3, Orange, 50
  - 4, Apple, 50
  - 5, Rice, 75
  - 6, Dal, 25
  - 7, Oil, NULL

- SUMMARY: (PID, CURRENT)
  - 1, 10
  - 2, 10
  - 3, 10
  - 4, 10
  - 5, 10
  - 8, 10

SQL:
```sql
UPDATE SUMMARY SET CURRENT = (SELECT CATEGORY FROM PRODUCT WHERE PRODUCT.PID = SUMMARY.PID)
WHERE EXISTS (SELECT CATEGORY FROM PRODUCT WHERE PRODUCT.PID = SUMMARY.PID);

SELECT CURRENT FROM SUMMARY;
```

**Correct Answer:** 50 50 50 50 75 10

**Explanation:**
After the UPDATE:
- PID 1: CURRENT = 50 (Mango's category)
- PID 2: CURRENT = 50 (Banana's category)
- PID 3: CURRENT = 50 (Orange's category)
- PID 4: CURRENT = 50 (Apple's category)
- PID 5: CURRENT = 75 (Rice's category)
- PID 8: No match in PRODUCT, so remains 10

---

## Question 34
**Question:** In SQL, which of these allows null values?

**Correct Answer:** Foreign key

**Explanation:**
- **Primary key:** Cannot be NULL ✗
- **Unique key:** Generally cannot be NULL (though some databases allow one NULL) ✗
- **Foreign key:** Can be NULL ✓ (represents optional relationships)
- **Primary and Unique key:** Cannot be NULL ✗

---

## Question 35
**Question:** In SQL, which of the following is used to delete both the table data and structure?

**Correct Answer:** DROP

**Explanation:**
- **DELETE:** Removes data only, keeps table structure
- **TRUNCATE:** Removes all data quickly, keeps table structure
- **DROP:** Removes both data and table structure completely ✓
- **None of these:** Incorrect

---

## Question 36
**Question:** Which of the following SQL operators is used to test whether the value of a column is null or not?

**Correct Answer:** IS NULL

**Explanation:** 
The correct SQL syntax for checking NULL values is:
- `WHERE column IS NULL` (to check if null)
- `WHERE column IS NOT NULL` (to check if not null)

Note: `= NULL` does not work in SQL because NULL represents the absence of a value, so equality comparisons don't apply.

---

## Question 37
**Question:** Which of the following SQL queries is used to find all the cities with weather conditions whose humidity is in the range of 60 to 100?

**Correct Answer:** SELECT * FROM weather WHERE humidity BETWEEN 60 AND 100

**Explanation:**
The `BETWEEN` operator is used to check if a value falls within a range (inclusive of both endpoints).

Correct syntax: `WHERE humidity BETWEEN 60 AND 100`

Other options are incorrect:
- `NOT IN (60 AND 100)` - Wrong syntax
- `NOT BETWEEN 60 AND 100` - Would exclude the range
- `IN (60 to 100)` - Wrong syntax, IN is for discrete values
