const isSort = (arr) => {
  const length = arr.length;
  for(let index = 0; index< length - 1; index++)  {
    if (arr[index] > arr[index+1]) {
      return false
    }
  }
  return true
}

console.log(isSort([1,3,2,2]))
