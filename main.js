import {addEdge,addVertex,indexOfName,update,mergesort} from './graph.js'

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
// list of Course objects containing all the courses needed (a course may only appear once)
var courses = []

function ready() {
    // adding listeners to a button
    let addCourseButton = document.getElementsByClassName('add_course')[0]
    addCourseButton.addEventListener('click',newCourse)
}

// removes the parent element of a button
function remove(event){
    let buttonClicked = event.target
    if (buttonClicked.parentElement.className == "row"){
        removeVertex(buttonClicked)
    } else if (buttonClicked.parentElement.className == "prereq"){
        removeEdge(buttonClicked)
    }
    buttonClicked.parentElement.remove()
    graph()
}
// removes a course if necessary from the list courses
function removeVertex(buttonClicked){
    let prereqs = buttonClicked.parentElement.getElementsByClassName('prereqs')[0]
    let prereq = prereqs.getElementsByClassName('prereq')
    //clicks the buttons that remove any existing prerequisites
    for (let i =0;i<prereq.length;i++){
        let button = prereq[i].getElementsByClassName('small_btn')[0]
        button.click()
    }
    let course = buttonClicked.parentElement.getElementsByClassName('course')[0]
    let name = course.innerText
    // loop checks if any other courses are dependent on the course being removed, if yes the method ends
    for (let i=0;i<courses.length;i++){
        let index = indexOfName(name,courses[i].outEdges)
        if (index != -1){
            return
        }    
    }
    // if there is no dependencies of the course being removed, it is also removed from the list courses
    let index = indexOfName(name,courses);
    courses.splice(index,1)
}
// removes prerequisite from the list of prerequisites of the dependent course
function removeEdge(buttonClicked){
    if (courses.length == 0) return
    let prereq = buttonClicked.parentElement.getElementsByClassName('prereqName')[0]
    let name = prereq.innerText
    let vertex = buttonClicked.parentElement.parentElement.parentElement
    vertex = vertex.getElementsByClassName('course')[0]
    let vertexName  = vertex.innerText
    let index1 = indexOfName(vertexName,courses)
    let vertexCourse = courses[index1]
    let index2 = indexOfName(name,vertexCourse.outEdges)
    vertexCourse.outEdges.splice(index2,1)
    checkRemoved(name)
    courses = update(courses)
}

function checkRemoved(name){
    if (courses.length == 0) return
    let rows = document.getElementsByClassName('row')
    // if other courses are dependent on the prerequisite removed, the method ends
    for (let i=0;i<rows.length;i++){
        let course =  rows[i].getElementsByClassName('course')[0]
        let courseName = course.innerText
        if (name == courseName){
            return
        }
    }
    // else if no other courses are dependent, the prerequisite removed is also removed from the list courses
    let index = indexOfName(name,courses)
    courses.splice(index,1)
}

//retrieves the name of the new prerequisite
function newPrereq(event){
    if (courses.length == 0) return
    let button = event.target
    let buttonParent = button.parentElement
    let newPrereq = buttonParent.getElementsByClassName('input')[0].value
    buttonParent.getElementsByClassName('input')[0].value = ''  // re-initializes the input space for future inputs
    newPrereq = formatStr(newPrereq)
    addPrereq(newPrereq,buttonParent)
}

// removes all white space from a string and makes it in Upper case
function formatStr(str){
    str = str.replace(/\s+/g, '');
    str = str.toUpperCase()
    return str
}
// if valid, adds a prerequisite to the list of Course and the list of prerequisites of the parent Course object
function addPrereq(newPrereq,buttonParent){
    if (newPrereq == ''){
        return
    }
    let prereq = document.createElement('span')
    prereq.classList.add('prereq')
    let row = buttonParent.parentElement
    let prereqs = row.getElementsByClassName('prereqs')[0]
    let otherPrereqs = prereqs.getElementsByClassName('prereq')
    // loop checks if the parent course already has this prerequisite, method ends if yes 
    for (var i =0;i<otherPrereqs.length;i++){
        let name = otherPrereqs[i].getElementsByClassName('prereqName')[0].innerText
        if (name == newPrereq){
            alert('This prerequisite has already been added')
            return
        }
    }
    // adds the prerequisites to the screen
    let prereqContent='<span class="prereqName">'+newPrereq+'</span><button class="small_btn" type="button">&#10060;</button>'
    prereq.innerHTML=prereqContent
    prereqs.append(prereq)
    // adds listener to the button of the prerequisite
    let removePrereqButton = prereq.getElementsByClassName('small_btn')[0]
    removePrereqButton.addEventListener('click',remove)
    let course = row.getElementsByClassName('course')[0]
    let name = course.innerText
    let index = indexOfName(name,courses)
    let edge = addVertex(newPrereq,courses)
    addEdge(courses[index1],edge)
    courses = update(courses)
    graph()
}
// retrieves the name of a desired new course
function newCourse(event){
    let button = event.target
    let buttonParent = button.parentElement
    let newCourse = buttonParent.getElementsByClassName('input')[0].value
    buttonParent.getElementsByClassName('input')[0].value = ''  // re-initializes the input space for future inputs
    newCourse = formatStr(newCourse)
    addCourse(newCourse)
}
// if valid, add a Course to the screen and the list of Course
function addCourse(newCourse){
    if (newCourse == ''){
        return
    }
    let row = document.createElement('div')
    row.classList.add('row')
    let rows = document.getElementsByClassName('rows')[0]
    let otherRows = rows.getElementsByClassName("row")
    // loop checks if the course is already on the screen, if yes then the method ends
    for (var i =0;i<otherRows.length;i++){
        let courseName = otherRows[i].getElementsByClassName('course')[0].innerText
        if (courseName == newCourse){
            alert('This course has already been added')
            return
        }
    }
    let rowContent =    `<span class="course">`+newCourse+`</span>
                        <span class="prereqs"></span>
                        <span class="add"><input class="input" type="text"> <button class="add_pre" type="button">ADD</button></span>                          
                        <button class="large_remove" type="button">REMOVE</button>`    
    row.innerHTML=rowContent
    rows.append(row)
    // adds listeners to the buttons of the new course
    let removeCourseButton = row.getElementsByClassName('large_remove')[0]
    removeCourseButton.addEventListener('click',remove)
    let addPrereqButton = row.getElementsByClassName('add_pre')[0]
    addPrereqButton.addEventListener('click', newPrereq)
    addVertex(newCourse,courses)
    courses = mergesort(courses)
    graph()   
}
// updates the graph displayed on screen
function graph(){
    replaceGraph()
    graphRow()
    let row = document.getElementsByClassName('row_graph')
    let depth = 0;
    for (let i =0;i<courses.length;i++){
        // if the depth is not the depth of the row of courses, create a new row
        if (depth != courses[i].depth){
            depth = courses[i].depth
            graphRow()
            row = document.getElementsByClassName('row_graph')
        }
        // append course to the last row on screen
        row[row.length-1].append(graphVertex(courses[i]))
    }
}
// removes the previous graph 
function replaceGraph(){
    let oldGraph = document.getElementsByClassName('graph')[0]
    oldGraph.remove()
    let graph = document.createElement('div')
    graph.classList.add('graph')
    let main = document.getElementsByClassName('main')[0]
    main.append(graph)
}
// appends a new row to the graph
function graphRow(){
    let row = document.createElement('div')
    row.classList.add('row_graph')
    let graph = document.getElementsByClassName('graph')[0]
    graph.append(row)
}
// returns a DOM element of a course
function graphVertex(course){
    let vertex = document.createElement('span')
    vertex.classList.add('vertex')
    vertex.innerText = course.vertex
    return vertex
}



