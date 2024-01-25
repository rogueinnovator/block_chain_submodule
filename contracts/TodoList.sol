// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
contract simpleStore{
    uint256 favoriteNumber;
 function Alternum(uint256 Dnumber) public{
    favoriteNumber = Dnumber;
 }
}
// contract TodoList {
//     uint taskCount = 0;
//     struct Task {
//         uint id;
//         string content;
//         bool completed;
//     }
//     mapping(uint => Task) public task; //this is used to map the each task with its count the unit take the count of the task and map it to the task which is a structue having ID ,CONTENT and a boolen tag which specify that weather the task is compleated or not ..
// //in simple maping is used to map two variable (key_value pairs)  
//     constructor() public {
//         createTask("this is huzaifa");
//     }

//     function createTask(string memory _content) public {
//         taskCount++;
//         task[taskCount] = Task(taskCount, _content, false);
//     }
// }
// // Storage: This is the most permanent storage location and is used for state variables. State variables are stored on the Ethereum blockchain and retain their values across function calls and transactions. They are used to represent the persistent state of a smart contract.

// // Memory: This storage location is temporary and used for function arguments and variables within function scope. Memory is used for data that should not persist beyond the execution of the function. It's often used for parameters and variables within the function.

// // Stack: The stack is used for small, local variables. It's the least used storage location and is primarily for very short-term data storage. It's not typically used in the context of data passed between external function calls.
