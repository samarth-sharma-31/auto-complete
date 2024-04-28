1. What is the difference between Component and PureComponent?
Give an example where it might break my app.

Answer - In React, one of the optimizations can be to prevent unnecessary renders. React components re-render when
it's state or props changes or the parent component re-renders.
To prevent unnecessary re-renders, shouldComponentUpdate method can be implemented to perform a shallow comparison of old and new props
to decide whether to re render or not.
When we donn't want to implement this method ourselves, React PureComponent can be used as it has it's own implementation of this method. It provides performance gains when component needs to re-render only when props / state is changed

Scenario where PureComponent can be harmful - 

<PureChild>This is some text</PureChild>

PureComponent can break when using react children, on every render this.props.children will change as new react elements will get created. So the shallow comparison will fail.
Also It may return false positives for nested differences.


2. Context + ShouldComponentUpdate might be dangerous. Why is
that?

Answer - 

ShouldComponentUpdate - Helps in controlling re-rendering of a component based on change in props
context is used when a value needs to be available to all the nested children to avoid prop drilling (like styling themes)

Using both together can be dangerous in certain scenarios as ShouldComponentUpdate can block context propagation in the sense that component using it and it's corresponding children might not re-render causing latest context updates not propagated to child components.

To make this combination work - we'll need to ensure that the context is immutable - ie it does not change after the initial load.


3. Describe 3 ways to pass information from a component to its
PARENT.

Answer - 

Approach 1 - Pass a callback function from parent to child via props - then callback function can be called via child and relevant data can be passed to it to tranfer the data and control to the parent component.

Approach 2 - using ref - A ref can be passed to child component and then child component can update the ref.current property
This data will be available to parent component as well

Approach 3 - child can update a common context between parent and child. The updated data in the context will then be available to both
parent and child component


4. Give 2 ways to prevent components from re-rendering.

Answer - 

    1. Can use shouldComponentUpdate or Pure component or React.memo to shallow compare props and reduce re-renders
    2. Can use React useCallback and useMemo in the parent component to ensure the reference of values and callbacks passed from the parent doesn't change on every render - this can help in reducing the child re-renders


5. What is a fragment and why do we need it? Give an example where it
might break my app.

Answer - 
    A fragment (<></>) helps in returing multiple child elements without the need of wrapping them up in an unnecessary parent element as it doesn not add a dom node, acts just like a virtual container.
    It helps in reducing the number of dom nodes as the parent div is not required.

    <React.Fragment>
      <Child1 />
      <Child2 />
      <Child3 />
    </React.Fragment>


    It can sometimes break styling - For example  - 

    <div class="flex-container">
	    <ComponentReturningFragment />
	    <Button/>
    </div>

    In the example above, fragment will return multiple children which might not be expected by parent flex container.
    If it had been wrapped as a parent div - then it will work as expected - (consider the flex container using space-between kindof configuration)
    


6. Give 3 examples of the HOC pattern.

Answer - 
In simple words, HOCs in react are components which takes in other components as input - returns components with added updated functionality, capability or props.


For example - 
1. 

import { withTheme } from 'styled-components'


class ComponentConsumingTheme extends React.Component {
  render() {
    console.log('Current theme: ', this.props.theme)
    // ...
  }
}


export default withTheme(ComponentConsumingTheme)

withTheme is a HOC which provides support to read the theme prop in the provided component

2. Simiarly connect from react-redux is an HOC that connects a React component to the Redux store. It provides access to the state directly and notifies the component of any updates in the redux store.

3. withRouter from react router - This hoc provides access to props such as match, location, history for dealing with routes and navigation


7. What's the difference in handling exceptions in promises,
callbacks and async...await?

Answer - 
 Promises, callbacks & aync await help in dealing with async operations in JS
 The difference between error handling approach will be quite evident between the three in the scenario of nested async operations.

    const firstOperation = finalStep => {
        secondOperation(function (value) {
            thirdOperation(value, function (updatedValue) {
                fourthOperation(function (newValue) {
                    fifthOperation(newValue, value, function(finalValue) {
                        finalStep(finalValue)
                    })
                })
            })
        })
    }

    This leads to callback hell

    Also similar situation with nested promises - makes code complex and reduces scalability/readability

    promise1.then(() => {
        promise2.then(() => {
            promise3.then(() => {

            }).catch(() => {

            })
        }).catch(() => {

        })
    }).catch(() => {

    })

    Asyn/await provides a very clean and straight forward of dealing with multiple async operations
    It is a syntactic suger over built on top of promises.

    try{
        const response1 = await promise1()
        const response2 = await promise2()
        const response3 = await promise3()
    }catch(e){
        // handle error
    }


8. How many arguments does setState take and why is it async.

Answer - 



9. List the steps needed to migrate a Class to Function
Component.

Answer - 

The steps required to move a class component to functional component - 

For example - 

Consider this class component - 

class MyApp extends Component {
  state = {
    header: 'This is class component'
  }

  componentDidMount() {
    // fetch some data
  }

  handleInput = e => {
    this.setState({ header: e.target.value });
  };

  render() {
    return (
      <div>
        <h2 id="header">This is a Class Component</h2>
        <input
          type="text"
          onChange={this.handleInput}
          value={this.state.header}
        />
      </div>
    );
  }
}

export default MyApp;

The corresponding functional component should look something like this - 

function MyApp(){

    const [header, setHeader] = React.useState('This is functional component)

    useEffect(() => {
        // Handle data fetching logic here
    }, [])

    const handleInput = (e) => {
        setHeader(e.target.value)
    }

    return (
        <div>
            <h2 id="header">This is a Class Component</h2>
            <input
                type="text"
                onChange={handleInput}
                value={header}
            />
      </div>
    )
}

Steps are as follows - 

1. Move the state to useState hook
2. directly return the jsx from the functional component which was earlier getting returned from render()
3. Move all class methods to functions inside the functional component - remove this as the methods can be directly called now
4. All the logic from life cycle methods to be moved to useEffect hooks
5. If PureComponent was getting used - move to React.memo
6. Move create ref to useRef if used



10. List a few ways styles can be used with components.

Answer - 
    1. Inline css - <div style={styleObj}></div>
    2. From normal css file - targetting the selectors for example - classes, Ids, tags etc
    3. CSS in JS - styled-components
    4. CSS modules - Writing the css in module.css files and then importing the css from that file and applying as classnames -         className={style.details}
    5. Pre-processors such as Sass and SCSS - provides support such as variables, nested rules



11. How to render an HTML string coming from the server.

Answer - 
In order to achieve this, React's dangerouslySetInnerHTML can be used (similar to innerHtml) to set the value of __html as the string.
However one needs to be careful while using it as it might make the component vulnerable to Cross site scripting attack. To handle to some kind of sanitization can be used on the incoming string to ensure it is safe. (libs like DOMPurify can be used to sanitize)