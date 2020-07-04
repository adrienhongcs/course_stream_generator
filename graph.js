class Course {

    constructor(name){
        this.vertex = name
        this.outEdges = []
        this.inEdges = []
        this.depth = 0
        this.visited = "red"
    }
}

function addEdge(course, prereq){
    course.outEdges.push(prereq)
    prereq.inEdges.push(course)
}
function addDepth(course){   
    course.visited = alternate(course.visited)
    if (course.outEdges.length == 0) {
        course.depth = 0
        return
    }
    let maxDepth = 0
    for (let i = 0; i<course.outEdges.length;i++){
        let prereq = course.outEdges[i]
        if (prereq.visited != course.visited){
            addDepth(prereq)
        }
        if (maxDepth < prereq.depth){
            maxDepth = prereq.depth
        }
    }
    course.depth = maxDepth+1
}

function checkDepth(course){
    course.visited = alternate(course.visited)
    if (course.inEdges.length == 0) return
    let minDepth = course.inEdges[0].depth
    for (let i =0;i<course.inEdges.length;i++){
        let parent = course.inEdges[i]
        if (parent.visited != course.visited){
            checkDepth(parent)
        }
        if (minDepth>parent.depth){
            minDepth =parent.depth
        }
    }
    course.depth = minDepth-1
}

function addVertex(name,courses){
    for (let i =0;i<courses.length;i++){
        if (name==courses[i].vertex)
        return courses[i]
    }
    let course  = new Course(name)
    courses.push(course)
    return course
}
function alternate(color){
    if (color=="red"){
        return "blue"
    } 
    return "red"
}
function indexOfName(name,courses){
    for (let i = 0;i<courses.length;i++){
        if (name == courses[i].vertex){
            return i
        }
    }
    return -1 
}
function merge(list1,list2){
    let result = []
    let index1 =0;
    let index2 =0;
    while ((list1.length != index1) && (list2.length != index2)){
        if (list1[index1].depth < list2[index2].depth) {
            result.push(list1[index1])
            index1++
        } else {
            result.push(list2[index2])
            index2++
        }
        
    }
    while (list1.length != index1){
        result.push(list1[index1])
        index1++
    }
    while (list2.length != index2) {
        result.push(list2[index2])
        index2++
    }
    return result
}
function mergesort(list){
    if (list.length==1){
        return list
    }
    const mid = Math.floor(list.length /2)
    let list1 = list.slice(0,mid)
    let list2 = list.slice(mid)
    list1 = mergesort(list1)
    list2 = mergesort(list2)
    return merge(list1,list2)
}

function update(courses){
    if (courses.length ==0) return
    let visited = alternate(courses[0].visited)
    for (let i =0;i<courses.length;i++){
        if (courses[i].visited != visited){
            addDepth(courses[i])
        }
    }
    visited = alternate(visited)
    for (let i =0;i<courses.length;i++){
        if (courses[i].visited != visited){
            checkDepth(courses[i])
        }
    }
    return mergesort(courses)
}

export {Course, addEdge,addVertex,indexOfName,update,mergesort}
