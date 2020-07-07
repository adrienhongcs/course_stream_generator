# Course Stream Generator 
Created by Adrien Hong to help with planning classes.
The website is hosted at https://adrienhongcs.github.io/course_stream_generator/

The interactive website uses the courses and prerequisites inputted by the user and creates a graph showing a possible stream of the order the courses should be taken in. The least deep courses are the one with no dependencies (prerequisites) and the deepest courses are the one with the most dependencies on other courses.

key concepts: graph theory like depth search, recursion, sorting a list using mergesort algorithm 

possible future features: update the page and algorithms to implement co-requisites, create an arrow between a course dependent on another  

index.html: renders the web page the user will interact with 

style.css: styles the web page 

graph.js: contains class and methods related to graph theory 

main.js: contains all methods that make the web page interactive 