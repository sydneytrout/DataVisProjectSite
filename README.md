# Animations in D3

In this exercise we will play with simple animations in D3. First of all, take a look at the code in script.js.
Here we are reusing our old barchart adding some feature to it. We are adding a counter to the svg element which will show the actual value of the bar and we are defining a couple of interactions
an the end (`onClick()`) for buttons that have not been defined yet. The intended behavior is to change the variable `nameSelected` dynamically when one of these two buttons is clicked so that also
the barchart will change. 

### STEP 1
Add two buttons in your html file to interact with the barchart. Each button will animate the graph showing the barchart of a different name. 
Assign the first button to the name Betty and the second button to the name Linda setting the correct id attribute so that they will work in combination with the existing code in the `js` file.

### STEP 2
At this point the animation is working, but the results is really not correct. First, the second graph is going out of the window. Second, the yscale does not really reflect the data shown in the graph. We can fix this by adding two new commands inside each function triggered by the button:

- when moving from one barchart to another we should adjust yScale first. In particular, we have to modify the domain. This can be done by calling the same functin on our yScale variable when the animation is triggered. 

- finally we can apply the transition to the yaxis as well. Luckly we can use transition for the axis in the same way we did for other objects. This can be done easily by picking the variable (`changing_axis`), calling the `transition()` function on it, and then use the function `.call(yAxis)` to update the scale.


- Disclaimer - What we are doing here is quite dangerous. Notice that by animating both the graph and axis, we make it difficult to recognize the relationships between the two graphs. For example, Linda's longest bar is almost three times taller than the longest bar for Betty. However, with the animation in place, this may go unnoticed. The objective of the assignment was to learn that we can animate axis. Keep in mind the risks, though.

### STEP 3
It is time to introduce some mouse interaction. We have already positioned some text in the graph which is supposed to show the exact number associated to each bar. You have to introduce two interactions:

- every time the mouse rolls over a bar, the border of the bar should change (make its border black).
- every time the mouse rolls out, the border should change to its previous appearence.
- Also, every time you roll over the bar, you should update the text in the upper right corner to show the count associated to the bar.

Remember that when you are setting the mouseover function, you can request inputs for said function. For example, you can write

 - `.on('mouseover', function(d, i){...})`

In this case, `d` will store information about the event triggered, `i` will store the row (in the dataset) you are working with.


Once you are done implementing all your interactions add a screenshot of your final result in your repo. Then, upload on gradescope your `.html` and `.js` files and the screenshot you have taken
