- Delete a node in a linked list
	- https://www.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1
```js fold
function deleteNode(head, x) {
    const dummy = new ListNode(0, head); // Create a dummy node pointing to the head
    let current = dummy;
    let count = 0;

    // Traverse to the (x-1)th node (the node before the one we want to delete)
    while (current !== null && count < x - 1) {
        current = current.next;
        count++;
    }

    // If x is out of bounds or invalid, return original head
    if (current === null || current.next === null) {
        return dummy.next;
    }

    // Skip the xth node
    current.next = current.next.next;

    // Return the modified list, starting from the original head
    return dummy.next;
}
```
- Delete last node in a linked list
- Delete the kth node in a linked list
- Delete without head pointer
	- https://leetcode.com/problems/delete-node-in-a-linked-list
```js fold
var deleteNode = function(node) {
    node.val = node.next.val
    node.next = node.next.next
}
```
- Reverse a linked list	
	- https://leetcode.com/problems/reverse-linked-list/description/
```go fold
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head

    for curr != nil {
        nxt := curr.Next
        curr.Next = prev
        prev = curr
        curr = nxt
    }
    return prev
}
```
- Middle of a linked list
	- https://leetcode.com/problems/middle-of-the-linked-list/description/
```go fold
func middleNode(head *ListNode) *ListNode {
    var slow, fast = head, head
    for fast != nil && fast.Next != nil {
        fast = fast.Next.Next
        slow = slow.Next
    }
    return slow
}
````
- Remove Nth node from the end of the linked list 
	- https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/
```go fold
/// here extra node is given when length of the list will be one and n will be 1 -> [1] , n = 1 => []
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    dummy := &ListNode{Next: head}
    length := getLength(head) 
    mid := length - n

    count := 0
    start := dummy
    for count < mid {
        start = start.Next
        count++
    }

    // Remove the nth node from end
    start.Next = start.Next.Next
    return dummy.Next
}

func getLength(head *ListNode) int {
    count := 0
    for head != nil {
        head = head.Next
        count++
    }
    return count
}
```
- Remove every k'th node
	- https://www.geeksforgeeks.org/problems/remove-every-kth-node/1
```js fold
deleteK(head, k) {
        // code here
        if(k === 1){
            return null
        }
        const node = new Node(0)
        node.next = head
        let left = node
        let right = head
        let count = 1
        
        while(right){
            if(count === k){
                left.next = right.next
                right = right.next
                count = 1
            }else {
                right = right.next
                left = left.next
                count++
            }
        }
        return node.next
    }
```
- Rotate list
	- https://leetcode.com/problems/rotate-list/description/
```go fold
/// There are two ways first using an array without doing any extra thing in the linked list doing everything in the array itself and then just overwriting the values of the linked list with values inside the array ⚠︎ This may fail in some of the platforms. 
/// the second approach. 
func rotateRight(head *ListNode, k int) *ListNode {
    if head == nil || head.Next == nil || k == 0 {
        return head
    }

    // Calculate the length of the list
    length := getLength(head)
    k = k % length
    if k == 0 {
        return head
    }
    mid := length - k

    // Traverse to the (mid-1)th node
    start := head
    count := 1
    for count < mid {
        start = start.Next
        count++
    }

    // Split the list
    newHead := start.Next
    start.Next = nil

    // Traverse to the last node of the rotated part
    end := newHead
    for end.Next != nil {
        end = end.Next
    }

    // Attach end to the original head
    end.Next = head
    return newHead
}

func getLength(head *ListNode) int {
    count := 0
    for head != nil {
        head = head.Next
        count++
    }
    return count
}
````
- Palindrome Linked List
	- https://leetcode.com/problems/palindrome-linked-list/description/
```go fold
func isPalindrome(head *ListNode) bool {
    length := getLength(head) // a function which will return the length of the list
    mid := length / 2
    count := 0
    rightHalf := head
    for count < mid {
        rightHalf = rightHalf.Next
        count++
    }

    // Reverse the second half of the list
    leftHalf := reverseList(rightHalf) // a function which will return the list after reversing it

    // Compare the two halves
    for leftHalf != nil && head != nil {
        if leftHalf.Val != head.Val {
            return false
        }
        leftHalf = leftHalf.Next
        head = head.Next
    }
    return true
}
```
- Remove Duplicates from Sorted List
	- https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/
```go fold
func deleteDuplicates(head *ListNode) *ListNode {
    curr := head    
    for curr != nil && curr.Next != nil {
        if curr.Val == curr.Next.Val {
            curr.Next = curr.Next.Next
        }else {
            curr = curr.Next
        }
    }
    return head
}
```
- Merge Two Sorted Lists 
	- https://leetcode.com/problems/merge-two-sorted-lists/description/
```go fold
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    // Initialize a dummy node to act as the starting point for the merged list.
    dummy := &ListNode{}
    current := dummy

    // Traverse both lists and attach the smaller node to the result each time.
    for list1 != nil && list2 != nil {
        if list1.Val <= list2.Val {
            current.Next = list1
            list1 = list1.Next
        } else {
            current.Next = list2
            list2 = list2.Next
        }
        current = current.Next
    }

    // Attach the remaining nodes from list1 or list2, if any.
    if list1 != nil {
        current.Next = list1
    } 
    if list2 != nil {
        current.Next = list2
    }

    // Return the merged list, which starts from dummy.Next.
    return dummy.Next
}
```
- Sort a linked list of 0s, 1s and 2s
	- https://www.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1
- Detect Loop in linked list
	- https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1
- Find length of Loop
	- https://www.geeksforgeeks.org/problems/find-length-of-loop/1 
- Remove loop in Linked List
	- https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1
- Intersection Point in Y Shaped Linked Lists
	- https://www.geeksforgeeks.org/problems/intersection-point-in-y-shapped-linked-lists/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=bottom_sticky_on_article
- Reverse a Linked List in groups of given size
	- https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1
- Add two numbers represented by linked lists
	- https://www.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1
- Reverse a sublist of a linked list
	- https://www.geeksforgeeks.org/problems/reverse-a-sublist-of-a-linked-list/1
- Multiply two linked lists
	- https://www.geeksforgeeks.org/problems/multiply-two-linked-lists/1